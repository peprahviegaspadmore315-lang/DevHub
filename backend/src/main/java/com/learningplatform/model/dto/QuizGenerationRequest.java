package com.learningplatform.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizGenerationRequest {
    
    @NotBlank(message = "Topic is required")
    @Size(max = 200, message = "Topic cannot exceed 200 characters")
    private String topic;
    
    @Size(max = 10000, message = "Content cannot exceed 10000 characters")
    private String content;
    
    private String language;

    private List<String> excludeQuestions;
    
    @Builder.Default
    private int questionCount = 5;

    private String generationNonce;

    private Integer preferredTimeLimitSeconds;
}
