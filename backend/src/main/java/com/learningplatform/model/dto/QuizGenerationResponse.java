package com.learningplatform.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizGenerationResponse {
    
    private List<QuizQuestion> questions;
    private String topic;
    private String language;
    private Integer timeLimitSeconds;
    private Boolean live;
    private String sourceLabel;
    private String statusMessage;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizQuestion {
        private String question;
        private List<String> options;
        private int correctIndex;
        private String explanation;
    }
}
