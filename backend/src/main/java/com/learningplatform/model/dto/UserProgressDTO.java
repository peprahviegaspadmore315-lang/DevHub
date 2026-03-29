package com.learningplatform.model.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgressDTO {
    private Long lessonId;
    private Boolean completed;
    private Integer progressPercent;
    private String completedAt;
}
