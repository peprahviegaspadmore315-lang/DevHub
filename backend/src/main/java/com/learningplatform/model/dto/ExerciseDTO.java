package com.learningplatform.model.dto;

import com.learningplatform.model.enums.Difficulty;
import com.learningplatform.model.enums.ExerciseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDTO {
    private Long id;
    private Long courseId;
    private Long lessonId;
    private String title;
    private String description;
    private String instructions;
    private ExerciseType type;
    private String starterCode;
    private String solution;
    private Map<String, Object> testCases;
    private Difficulty difficulty;
    private Integer points;
    private String[] hints;
    private String constraints;
    private Integer orderIndex;
    private Integer timeLimitSeconds;
    private Boolean isPublished;
}
