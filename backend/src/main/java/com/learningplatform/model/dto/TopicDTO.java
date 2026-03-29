package com.learningplatform.model.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicDTO {
    private Long id;
    private String language;
    private String title;
    private String slug;
    private String description;
    private String whyLearn;
    private String simpleExplanation;
    private List<String> keyPoints;
    private String difficulty;
    private Integer orderIndex;
    private Boolean isPremium;
    private VideoInfo video;
    private List<CodeExampleDTO> codeExamples;
    private List<LessonSummaryDTO> lessons;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VideoInfo {
        private String url;
        private String embedUrl;
        private String thumbnailUrl;
        private Integer duration;
    }
}
