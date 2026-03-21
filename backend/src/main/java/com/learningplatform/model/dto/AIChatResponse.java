package com.learningplatform.model.dto;

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
public class AIChatResponse {
    
    private String message;
    private String aiName;
    private boolean success;
    private String error;
    private LocalDateTime timestamp;
    private UsageInfo usage;
    private String model;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageInfo {
        private int promptTokens;
        private int completionTokens;
        private int totalTokens;
    }
    
    public static AIChatResponse error(String errorMessage) {
        return AIChatResponse.builder()
                .success(false)
                .error(errorMessage)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static AIChatResponse success(String message, String model) {
        return AIChatResponse.builder()
                .success(true)
                .message(message)
                .aiName("LearnBot")
                .model(model)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
