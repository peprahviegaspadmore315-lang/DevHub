package com.learningplatform.model.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LanguageDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String iconUrl;
    private String color;
    private String difficultyLevel;
    private Integer topicCount;
    private Integer lessonCount;
    private Boolean isActive;
}
