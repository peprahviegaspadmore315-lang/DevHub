package com.learningplatform.model.dto;

import com.learningplatform.model.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String longDescription;
    private String category;
    private Difficulty difficulty;
    private String iconUrl;
    private String bannerUrl;
    private Boolean isPremium;
    private BigDecimal price;
    private BigDecimal estimatedHours;
    private Integer orderIndex;
    private Boolean isPublished;
    private Boolean isFeatured;
    private Long createdBy;
    private String createdByName;
    private Integer lessonsCount;
    private Integer exercisesCount;
    private Integer quizzesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
