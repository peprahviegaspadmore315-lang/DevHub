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
public class LessonDTO {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String title;
    private String slug;
    private String content;
    private String contentHtml;
    private String codeExample;
    private String videoUrl;
    private Integer orderIndex;
    private Integer estimatedMinutes;
    private Boolean isPublished;
    private Boolean isPremium;
    private Boolean hasNext;
    private Boolean hasPrevious;
    private Long nextLessonId;
    private Long previousLessonId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
