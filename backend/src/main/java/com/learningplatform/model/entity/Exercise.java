package com.learningplatform.model.entity;

import com.learningplatform.model.enums.Difficulty;
import com.learningplatform.model.enums.ExerciseType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "exercises")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String instructions;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private ExerciseType type = ExerciseType.WRITE_CODE;
    
    @Column(name = "starter_code", columnDefinition = "TEXT")
    private String starterCode;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String solution;
    
    @Column(name = "test_cases", columnDefinition = "jsonb", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> testCases;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Difficulty difficulty = Difficulty.BEGINNER;
    
    @Builder.Default
    private Integer points = 10;
    
    @Column(columnDefinition = "TEXT[]")
    private String[] hints;
    
    @Column(columnDefinition = "TEXT")
    private String constraints;
    
    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;
    
    @Column(name = "time_limit_seconds")
    @Builder.Default
    private Integer timeLimitSeconds = 30;
    
    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
