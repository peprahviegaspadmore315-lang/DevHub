package com.learningplatform.service;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CodeEvaluationService {

    private final GeminiService geminiService;
    
    public record CodeEvaluation(
        boolean correct,
        String feedback,
        int score,
        String[] suggestions,
        String[] hints
    ) {}
    
    public CodeEvaluation evaluateCode(String code, String language, String question, String expectedOutput, String actualOutput) {
        // If actual output matches expected output, likely correct
        if (expectedOutput != null && actualOutput != null) {
            boolean outputMatches = normalizeOutput(actualOutput).equals(normalizeOutput(expectedOutput));
            if (outputMatches) {
                return new CodeEvaluation(
                    true,
                    "Great job! Your output matches the expected result.",
                    100,
                    new String[0],
                    new String[0]
                );
            }
        }
        
        // Use AI to evaluate the code
        String prompt = buildEvaluationPrompt(code, language, question, expectedOutput, actualOutput);
        
        try {
            AIChatRequest request = AIChatRequest.builder()
                    .message(prompt)
                    .build();
            
            AIChatResponse response = geminiService.chat(request);
            
            if (response.isSuccess()) {
                return parseEvaluationResponse(response.getMessage());
            }
        } catch (Exception e) {
            log.error("AI evaluation failed: {}", e.getMessage());
        }
        
        // Fallback evaluation
        return fallbackEvaluation(code, expectedOutput, actualOutput);
    }
    
    private String buildEvaluationPrompt(String code, String language, String question, 
            String expectedOutput, String actualOutput) {
        return String.format("""
            As a coding tutor, evaluate this %s code solution:
            
            QUESTION:
            %s
            
            STUDENT'S CODE:
            ```%s
            %s
            ```
            
            EXPECTED OUTPUT:
            %s
            
            ACTUAL OUTPUT:
            %s
            
            Provide your evaluation in this format:
            CORRECT: yes/no
            FEEDBACK: [Your encouraging feedback about the code]
            SCORE: [0-100]
            SUGGESTIONS: [Specific improvements, comma separated]
            HINTS: [Helpful hints if wrong, comma separated]
            
            Be encouraging but honest. Focus on helping the student learn.
            """, language, question, language, code, 
               expectedOutput != null ? expectedOutput : "Not specified",
               actualOutput != null ? actualOutput : "No output");
    }
    
    private CodeEvaluation parseEvaluationResponse(String response) {
        try {
            boolean correct = response.toLowerCase().contains("correct: yes") || 
                             response.toLowerCase().contains("correct: true");
            
            int score = extractScore(response);
            
            String feedback = extractSection(response, "FEEDBACK");
            String[] suggestions = extractArray(response, "SUGGESTIONS");
            String[] hints = extractArray(response, "HINTS");
            
            return new CodeEvaluation(correct, feedback, score, suggestions, hints);
        } catch (Exception e) {
            log.warn("Failed to parse evaluation response: {}", e.getMessage());
            return fallbackEvaluation(null, null, null);
        }
    }
    
    private int extractScore(String response) {
        var matcher = java.util.regex.Pattern.compile("SCORE:\\s*(\\d+)").matcher(response);
        if (matcher.find()) {
            return Math.min(100, Math.max(0, Integer.parseInt(matcher.group(1))));
        }
        return 50;
    }
    
    private String extractSection(String response, String section) {
        var matcher = java.util.regex.Pattern.compile(
            section + ":\\s*([\\s\\S]*?)(?=SUGGESTIONS:|HINTS:|$)", 
            java.util.regex.Pattern.CASE_INSENSITIVE
        ).matcher(response);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "Good attempt!";
    }
    
    private String[] extractArray(String response, String section) {
        var matcher = java.util.regex.Pattern.compile(
            section + ":\\s*\\[?([\\s\\S]*?)\\]?(?=HINTS:|$)", 
            java.util.regex.Pattern.CASE_INSENSITIVE
        ).matcher(response);
        if (matcher.find()) {
            String content = matcher.group(1);
            return java.util.Arrays.stream(content.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toArray(String[]::new);
        }
        return new String[0];
    }
    
    private CodeEvaluation fallbackEvaluation(String code, String expectedOutput, String actualOutput) {
        if (expectedOutput != null && actualOutput != null) {
            boolean matches = normalizeOutput(actualOutput).equals(normalizeOutput(expectedOutput));
            if (matches) {
                return new CodeEvaluation(
                    true,
                    "Your output looks correct!",
                    100,
                    new String[0],
                    new String[0]
                );
            }
        }
        
        return new CodeEvaluation(
            false,
            "Your code ran but the output doesn't match. Check your logic and try again!",
            30,
            new String[]{"Review the expected output", "Check your print statements", "Verify your logic"},
            new String[]{"Make sure to print exactly what's expected", "Check for extra spaces or newlines"}
        );
    }
    
    private String normalizeOutput(String output) {
        return output.trim()
                .replaceAll("\\r\\n", "\n")
                .replaceAll("\\s+", " ")
                .toLowerCase();
    }
}
