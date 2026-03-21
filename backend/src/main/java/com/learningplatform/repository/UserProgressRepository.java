package com.learningplatform.repository;

import com.learningplatform.model.entity.UserProgress;
import com.learningplatform.model.enums.ProgressStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    
    List<UserProgress> findByUserId(Long userId);
    
    List<UserProgress> findByUserIdAndCourseId(Long userId, Long courseId);
    
    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    
    List<UserProgress> findByUserIdAndStatus(Long userId, ProgressStatus status);
    
    @Query("SELECT COUNT(u) FROM UserProgress u WHERE u.user.id = :userId AND u.status = :status")
    Long countByUserIdAndStatus(Long userId, ProgressStatus status);
    
    @Query("SELECT AVG(u.completionPercentage) FROM UserProgress u WHERE u.user.id = :userId AND u.course.id = :courseId")
    Double getAverageProgress(Long userId, Long courseId);
}
