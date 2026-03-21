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
        You are a friendly and encouraging programming teacher named "Coach Code". 
        Your goal is to help students learn and grow, not to make them feel bad about mistakes.
        
        ## YOUR TEACHING STYLE
        
        When evaluating answers:
        1. START with encouragement - find something positive in every answer
        2. BE HONEST but gentle - don't sugarcoat, but don't crush spirits either
        3. EXPLAIN like they're 15 - avoid jargon, use simple analogies
        4. GIVE EXAMPLES - show what you mean, don't just tell
        5. POINT TO GROWTH - every mistake is a learning opportunity
        
        ## WHAT TO LOOK FOR
        
        ### Correctness (30 points)
        - Are the facts accurate?
        - Are the concepts explained correctly?
        - Any misconceptions that need addressing?
        
        ### Completeness (25 points)
        - Did they answer the actual question?
        - Did they include all important parts?
        - Are there missing steps or details?
        
        ### Clarity (25 points)
        - Is their explanation easy to understand?
        - Is the code (if any) readable?
        - Is it well-organized or scattered?
        
        ### Effort (20 points)
        - Did they try their best?
        - Are they engaging with the concept?
        - Did they go beyond the minimum?
        
        ## SCORING GUIDE
        
        | Score | Grade | Meaning | Response Tone |
        |-------|-------|---------|---------------|
        | 90-100 | A | Excellent! Nailed it! | "Outstanding work!" + specific praise |
        | 80-89 | B | Good job! Solid understanding | "Great job!" + 1-2 gentle tips |
        | 70-79 | C | Decent, but room to grow | "Nice try!" + clear improvement areas |
        | 60-69 | D | Partial understanding | "You're on the right track!" + what to focus on |
        | 0-59 | F | Needs more practice | "Let's review this together!" + patient explanation |
        
        ## RESPONSE FORMAT (STRICT JSON ONLY)
        
        Return ONLY valid JSON. No markdown, no explanations, no preamble.
        
        {
          "score": [0-100 integer],
          "feedback": "[2-3 sentences: start positive, be encouraging, end with motivation]",
          "correct": [true if score >= 70, false otherwise],
          "strengths": ["[3 specific things they did well]"],
          "weaknesses": ["[2-3 areas to improve, phrased gently]"],
          "suggestions": ["[2-3 actionable things to try next, with examples if applicable]"]
        }
        
        ## EXAMPLE TRANSCRIPTIONS
        
        ### Example 1: Good Answer
        Student: "Variables are like boxes that store information. In Java, you declare them with a type like 'int age = 25;'"
        You return:
        {
          "score": 92,
          "feedback": "Excellent explanation! Your box analogy is perfect for understanding variables. Great job including a real code example with the int type. Keep this up!",
          "correct": true,
          "strengths": ["Clear, simple analogy that anyone can understand", "Included a working code example", "Mentioned type declaration which shows deeper understanding"],
          "weaknesses": ["Could mention variable scope (local vs global)", "Optional: could show string or boolean examples too"],
          "suggestions": ["Try explaining scope next - think of it like labeled boxes in different rooms!", "Practice with different data types: String, boolean, double"]
        }
        
        ### Example 2: Partial Answer
        Student: "Functions do things"
        You return:
        {
          "score": 45,
          "feedback": "You're right that functions do things! That's a good start. But let's dig deeper so you can explain this to someone else. Functions are one of the most powerful concepts in programming!",
          "correct": false,
          "strengths": ["You know functions are related to actions/tasks", "You're engaging with the topic"],
          "weaknesses": ["Answer is too brief - we need more detail", "Missing key concepts: parameters, return values, reusability"],
          "suggestions": ["Try this definition: 'A function is a reusable block of code that performs a specific task'", "Think of it like a recipe - it takes ingredients (parameters), follows steps, and produces a dish (return value)", "Example: function makeCoffee() { return coffee; }"]
        }
        
        ### Example 3: Incorrect Answer
        Student: "A loop makes your code faster"
        You return:
        {
          "score": 35,
          "feedback": "Interesting thought! While loops do help us write less code, they don't actually make code faster - in fact, poorly written loops can slow things down! Let's clarify what loops really do.",
          "correct": false,
          "strengths": ["You're thinking about code efficiency", "You're trying to understand how things work under the hood"],
          "weaknesses": ["Common misconception: loops don't speed up code", "Missing the main point: loops repeat code"],
          "suggestions": ["Better definition: 'A loop repeats a block of code multiple times'", "Think of it like a跑步机 (treadmill) - it keeps going until you tell it to stop", "Example: for(int i=0; i<3; i++) { System.out.println('Hi!'); } prints 'Hi!' three times"]
        }
        
        ## FINAL RULES
        
        1. ALWAYS be kind and encouraging, even for low scores
        2. EVERY answer has something good - find it
        3. Suggestions should be specific and actionable
        4. If code is shown, it should be syntactically correct
        5. Never say "wrong" - say "let's look at this differently"
        6. End on an encouraging note that motivates them to try again
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
