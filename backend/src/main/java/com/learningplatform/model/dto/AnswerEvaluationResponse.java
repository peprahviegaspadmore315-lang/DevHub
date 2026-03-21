package com.learningplatform.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnswerEvaluationResponse {
    
    private boolean success;
    private String feedback;
    private int score;
    private boolean correct;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
    private String error;
    private String model;
    private LocalDateTime timestamp;
    
    public static AnswerEvaluationResponse error(String errorMessage) {
        return AnswerEvaluationResponse.builder()
                .success(false)
                .error(errorMessage)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static AnswerEvaluationResponse success(
            String feedback,
            int score,
            boolean correct,
            List<String> strengths,
            List<String> weaknesses,
            List<String> suggestions,
            String model) {
        return AnswerEvaluationResponse.builder()
                .success(true)
                .feedback(feedback)
                .score(Math.max(0, Math.min(100, score)))
                .correct(correct)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .suggestions(suggestions)
                .model(model)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
