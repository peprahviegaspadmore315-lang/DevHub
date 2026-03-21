package com.learningplatform.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CodeRunResponse {
    
    private boolean success;
    private String output;
    private String error;
    private Long executionTimeMs;
    private Integer exitCode;
    private String language;
    private LocalDateTime timestamp;
    
    public static CodeRunResponse success(String output, long executionTimeMs, int exitCode, String language) {
        return CodeRunResponse.builder()
                .success(true)
                .output(output)
                .executionTimeMs(executionTimeMs)
                .exitCode(exitCode)
                .language(language)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static CodeRunResponse error(String errorMessage, String language) {
        return CodeRunResponse.builder()
                .success(false)
                .error(errorMessage)
                .language(language)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static CodeRunResponse timeout(String language) {
        return CodeRunResponse.builder()
                .success(false)
                .error("Execution timed out. Your code took too long to execute.")
                .exitCode(-1)
                .language(language)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static CodeRunResponse blocked(String reason) {
        return CodeRunResponse.builder()
                .success(false)
                .error("Code blocked: " + reason)
                .exitCode(-2)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
