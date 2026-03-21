package com.learningplatform.model.dto;

import com.learningplatform.model.enums.Difficulty;
import com.learningplatform.model.enums.ExerciseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    private Long lessonId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Instructions are required")
    private String instructions;
    
    private ExerciseType type;
    
    private String starterCode;
    
    @NotBlank(message = "Solution is required")
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
