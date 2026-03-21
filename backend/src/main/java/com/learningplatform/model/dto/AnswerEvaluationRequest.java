package com.learningplatform.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerEvaluationRequest {
    
    @NotBlank(message = "Question is required")
    private String question;
    
    @NotBlank(message = "Student answer is required")
    @Size(min = 10, message = "Answer is too short to evaluate")
    private String studentAnswer;
    
    private String expectedAnswer;
    
    private String context;
    
    private String language;
    
    @Builder.Default
    private boolean includeSuggestions = true;
}
