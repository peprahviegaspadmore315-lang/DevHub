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
public class CodeExplanationRequest {
    
    @NotBlank(message = "Code cannot be empty")
    @Size(max = 5000, message = "Code cannot exceed 5000 characters")
    private String code;
    
    private String language;
}
