package com.learningplatform.model.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningLessonDTO {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String notes;
    private Integer orderIndex;
    private Integer durationMinutes;
    private String difficulty;
    private Boolean isPremium;
    private Boolean isCompleted;
    private Integer progressPercent;
    
    // Navigation
    private Long topicId;
    private String topicName;
    private String topicSlug;
    private Long languageId;
    private String languageName;
    private String languageSlug;
    
    // Related content
    private List<CodeExampleDTO> codeExamples;
    private List<YouTubeVideoDTO> youtubeVideos;
    
    // Navigation links
    private LessonSummaryDTO previousLesson;
    private LessonSummaryDTO nextLesson;
}
