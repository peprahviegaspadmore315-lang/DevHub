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
public class QuizDTO {
    private Long id;
    private Long courseId;
    private Long lessonId;
    private String title;
    private String description;
    private Integer passingScore;
    private Integer timeLimitMinutes;
    private Boolean shuffleQuestions;
    private Boolean showCorrectAnswers;
    private Integer questionsCount;
    private LocalDateTime createdAt;
}