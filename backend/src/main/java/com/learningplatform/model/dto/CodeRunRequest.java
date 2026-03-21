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
public class CodeRunRequest {
    
    @NotBlank(message = "Code is required")
    @Size(max = 100000, message = "Code exceeds maximum size of 100KB")
    private String code;
    
    @NotNull(message = "Language is required")
    private Language language;
    
    @Builder.Default
    private Long timeoutSeconds = 10L;
    
    public enum Language {
        HTML("html", "html"),
        CSS("css", "css"),
        JAVASCRIPT("javascript", "js"),
        PYTHON("python", "py"),
        JAVA("java", "java"),
        SQL("sql", "sql");
        
        private final String name;
        private final String extension;
        
        Language(String name, String extension) {
            this.name = name;
            this.extension = extension;
        }
        
        public String getName() { return name; }
        public String getExtension() { return extension; }
        
        public boolean requiresExecution() {
            return this != HTML && this != CSS;
        }
        
        public String getDockerImage() {
            return switch (this) {
                case JAVASCRIPT -> "node:20-alpine";
                case PYTHON -> "python:3.11-slim";
                case JAVA -> "openjdk:17-slim";
                case SQL -> "postgres:15-alpine";
                default -> null;
            };
        }
    }
}
