package com.learningplatform.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningplatform.config.GeminiConfig;
import com.learningplatform.model.dto.AnswerEvaluationRequest;
import com.learningplatform.model.dto.AnswerEvaluationResponse;
import com.learningplatform.service.AnswerEvaluationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnswerEvaluationServiceImpl implements AnswerEvaluationService {

    private final GeminiConfig geminiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
        You are an expert programming instructor evaluating student answers.
        
        Evaluate the student's answer based on:
        1. Correctness - Is the answer factually accurate?
        2. Completeness - Does it fully address the question?
        3. Clarity - Is it well-explained?
        4. Technical accuracy - Are programming concepts correct?
        
        Respond ONLY with valid JSON in this exact format:
        {
          "score": 0-100,
          "feedback": "General feedback for the student (2-3 sentences)",
          "correct": true/false,
          "strengths": ["Strength 1", "Strength 2"],
          "weaknesses": ["Weakness 1", "Weakness 2"],
          "suggestions": ["Suggestion 1", "Suggestion 2"]
        }
        
        Rules:
        - Score 80-100 = correct (student demonstrated understanding)
        - Score 50-79 = partial (some gaps but good attempt)
        - Score 0-49 = needs improvement (significant errors or missing content)
        - Be encouraging but honest
        - Focus on learning, not criticism
        - Provide specific, actionable suggestions
        """;

    @Override
    public AnswerEvaluationResponse evaluate(AnswerEvaluationRequest request) {
        if (!isEnabled()) {
            log.info("Gemini API not configured, using fallback evaluation");
            return evaluateFallback(request);
        }

        try {
            String prompt = buildPrompt(request);
            String response = callGeminiApi(prompt);
            return parseResponse(response, geminiConfig.getModel());
        } catch (RestClientException e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
            return evaluateFallback(request);
        } catch (Exception e) {
            log.error("Error evaluating answer: {}", e.getMessage());
            return AnswerEvaluationResponse.error("Failed to evaluate answer: " + e.getMessage());
        }
    }

    @Override
    public boolean isEnabled() {
        return geminiConfig.isEnabled() &&
               geminiConfig.getApiKey() != null &&
               !geminiConfig.getApiKey().isBlank();
    }

    private String buildPrompt(AnswerEvaluationRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Question: ").append(request.getQuestion()).append("\n\n");
        prompt.append("Student's Answer: ").append(request.getStudentAnswer()).append("\n\n");

        if (request.getContext() != null && !request.getContext().isBlank()) {
            prompt.append("Context: ").append(request.getContext()).append("\n\n");
        }

        if (request.getExpectedAnswer() != null && !request.getExpectedAnswer().isBlank()) {
            prompt.append("Expected Answer: ").append(request.getExpectedAnswer()).append("\n\n");
        }

        if (request.getLanguage() != null && !request.getLanguage().isBlank()) {
            prompt.append("Programming Language: ").append(request.getLanguage()).append("\n\n");
        }

        prompt.append("Please evaluate this answer and respond with only the JSON object.");

        return prompt.toString();
    }

    private String callGeminiApi(String prompt) {
        String url = String.format("%s/%s:generateContent?key=%s",
                geminiConfig.getApiUrl(),
                geminiConfig.getModel(),
                geminiConfig.getApiKey());

        String requestBody = String.format("""
            {
              "contents": [{"parts": [{"text": "%s"}]}],
              "systemInstruction": {"parts": [{"text": "%s"}]},
              "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 1024,
                "topP": 0.8,
                "topK": 40
              }
            }
            """,
                escapeJson(prompt),
                escapeJson(SYSTEM_PROMPT));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getBody() == null) {
            throw new RuntimeException("Empty response from Gemini API");
        }

        JsonNode root;
        try {
            root = objectMapper.readTree(response.getBody());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini API response: " + e.getMessage());
        }
        JsonNode candidates = root.path("candidates");

        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode content = candidates.get(0).path("content");
            JsonNode parts = content.path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.get(0).path("text").asText();
            }
        }

        throw new RuntimeException("Failed to extract response from Gemini API");
    }

    private AnswerEvaluationResponse parseResponse(String responseText, String model) {
        try {
            String jsonText = extractJson(responseText);
            JsonNode json = objectMapper.readTree(jsonText);

            int score = json.path("score").asInt(0);
            String feedback = json.path("feedback").asText("Please review your answer.");
            boolean correct = json.path("correct").asBoolean(score >= 80);

            List<String> strengths = new ArrayList<>();
            JsonNode strengthsNode = json.path("strengths");
            if (strengthsNode.isArray()) {
                strengthsNode.forEach(n -> strengths.add(n.asText()));
            }

            List<String> weaknesses = new ArrayList<>();
            JsonNode weaknessesNode = json.path("weaknesses");
            if (weaknessesNode.isArray()) {
                weaknessesNode.forEach(n -> weaknesses.add(n.asText()));
            }

            List<String> suggestions = new ArrayList<>();
            JsonNode suggestionsNode = json.path("suggestions");
            if (suggestionsNode.isArray()) {
                suggestionsNode.forEach(n -> suggestions.add(n.asText()));
            }

            return AnswerEvaluationResponse.success(
                    feedback, score, correct,
                    strengths, weaknesses, suggestions, model);

        } catch (Exception e) {
            log.error("Error parsing evaluation response: {}", e.getMessage());
            return parseSimpleResponse(responseText);
        }
    }

    private AnswerEvaluationResponse parseSimpleResponse(String text) {
        int score = 50;
        boolean correct = false;
        String feedback = "Your answer has been submitted for review.";
        List<String> suggestions = List.of("Review the related concepts and try again.");

        if (text.toLowerCase().contains("good") || text.toLowerCase().contains("correct")) {
            score = 85;
            correct = true;
            feedback = "Good answer! You demonstrated understanding of the concept.";
            suggestions = List.of("Keep practicing to reinforce your knowledge.");
        } else if (text.toLowerCase().contains("incomplete") || text.toLowerCase().contains("partial")) {
            score = 60;
            feedback = "Your answer covers some points but needs more detail.";
            suggestions = List.of("Add more specific examples and explanations.");
        } else if (text.toLowerCase().contains("incorrect") || text.toLowerCase().contains("wrong")) {
            score = 30;
            feedback = "Your answer needs improvement. Let's review the concept.";
            suggestions = List.of("Review the tutorial content and try again.");
        }

        return AnswerEvaluationResponse.success(
                feedback, score, correct,
                List.of(), List.of(), suggestions, geminiConfig.getModel());
    }

    private AnswerEvaluationResponse evaluateFallback(AnswerEvaluationRequest request) {
        String answer = request.getStudentAnswer().toLowerCase();
        String question = request.getQuestion().toLowerCase();

        int score = 50;
        boolean correct = false;
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        if (answer.length() < 20) {
            weaknesses.add("Answer is too short");
            suggestions.add("Provide a more detailed explanation");
            score -= 20;
        }

        if (question.contains("variable")) {
            if (answer.contains("store") && answer.contains("data")) {
                strengths.add("Correctly identifies variables store data");
                score += 20;
            }
            if (answer.contains("type") || answer.contains("int") || answer.contains("string")) {
                strengths.add("Mentions data types");
                score += 10;
            }
        }

        if (question.contains("function") || question.contains("method")) {
            if (answer.contains("reus") || answer.contains("block")) {
                strengths.add("Understands code reusability");
                score += 15;
            }
        }

        score = Math.max(0, Math.min(100, score));
        correct = score >= 70;

        String feedback = correct
                ? "Good answer! You demonstrated understanding of the concept."
                : "Your answer covers some points. Review the suggestions to improve.";

        return AnswerEvaluationResponse.success(
                feedback, score, correct,
                strengths.isEmpty() ? List.of("Attempted to answer") : strengths,
                weaknesses,
                suggestions.isEmpty() ? List.of("Review the tutorial for more details") : suggestions,
                "rule-based-fallback");
    }

    private String extractJson(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        throw new RuntimeException("No valid JSON found in response");
    }

    private String escapeJson(String text) {
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
