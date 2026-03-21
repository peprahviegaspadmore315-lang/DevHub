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
public class GeminiResponse {
    
    private List<Candidate> candidates;
    
    private PromptFeedback promptFeedback;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Candidate {
        private Content content;
        private String finishReason;
        private int index;
        private List<SafetyRating> safetyRatings;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
        private String role;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SafetyRating {
        private String category;
        private String probability;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PromptFeedback {
        private List<SafetyRating> safetyRatings;
    }
    
    public String extractText() {
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }
        
        Candidate firstCandidate = candidates.get(0);
        if (firstCandidate.getContent() == null || 
            firstCandidate.getContent().getParts() == null || 
            firstCandidate.getContent().getParts().isEmpty()) {
            return null;
        }
        
        return firstCandidate.getContent().getParts().get(0).getText();
    }
}
