package com.learningplatform.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionRequest {
    
    @NotBlank(message = "Code cannot be empty")
    @Size(max = 50000, message = "Code cannot exceed 50000 characters")
    private String code;
    
    @NotNull(message = "Language is required")
    private SupportedLanguage language;
    
    private String expectedOutput;
    
    private String testCases;
    
    private boolean runTests = false;
    
    public enum SupportedLanguage {
        JAVASCRIPT("javascript", "node:20-alpine", ".js"),
        PYTHON("python", "python:3.11-slim", ".py"),
        JAVA("java", "java:17-slim", ".java"),
        HTML("html", null, ".html"),
        CSS("css", null, ".css");
        
        private final String displayName;
        private final String dockerImage;
        private final String fileExtension;
        
        SupportedLanguage(String displayName, String dockerImage, String fileExtension) {
            this.displayName = displayName;
            this.dockerImage = dockerImage;
            this.fileExtension = fileExtension;
        }
        
        public String getDisplayName() { return displayName; }
        public String getDockerImage() { return dockerImage; }
        public String getFileExtension() { return fileExtension; }
    }
}
