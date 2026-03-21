package com.learningplatform.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResponse {
    
    private boolean success;
    private String output;
    private String error;
    private long executionTimeMs;
    private int exitCode;
    private String language;
    private LocalDateTime timestamp;
    private SecurityWarning[] securityWarnings;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SecurityWarning {
        private String type;
        private String message;
        private String code;
    }
    
    public static CodeExecutionResponse error(String errorMessage) {
        return CodeExecutionResponse.builder()
                .success(false)
                .error(errorMessage)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static CodeExecutionResponse success(String output, long executionTimeMs, int exitCode, String language) {
        return CodeExecutionResponse.builder()
                .success(exitCode == 0)
                .output(output)
                .executionTimeMs(executionTimeMs)
                .exitCode(exitCode)
                .language(language)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
