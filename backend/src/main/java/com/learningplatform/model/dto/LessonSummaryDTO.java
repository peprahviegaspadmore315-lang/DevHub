package com.learningplatform.model.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSummaryDTO {
    private Long id;
    private String title;
    private String slug;
    private Integer orderIndex;
    private Integer durationMinutes;
    private String difficulty;
    private Boolean isPremium;
    private Boolean isCompleted;
    private Integer progressPercent;
}
