package com.learningplatform.repository;

import com.learningplatform.model.entity.ExerciseAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseAttemptRepository extends JpaRepository<ExerciseAttempt, Long> {
    
    List<ExerciseAttempt> findByUserId(Long userId);
    
    List<ExerciseAttempt> findByExerciseId(Long exerciseId);
    
    List<ExerciseAttempt> findByUserIdAndExerciseId(Long userId, Long exerciseId);
    
    Optional<ExerciseAttempt> findTopByUserIdAndExerciseIdOrderBySubmittedAtDesc(Long userId, Long exerciseId);
    
    @Query("SELECT COUNT(e) FROM ExerciseAttempt e WHERE e.user.id = :userId AND e.isCorrect = true")
    Long countCorrectByUserId(Long userId);
    
    @Query("SELECT COUNT(e) FROM ExerciseAttempt e WHERE e.user.id = :userId AND e.isCorrect = true")
    int countByUserIdAndIsCorrectTrue(@Param("userId") Long userId);
    
    @Query("SELECT COALESCE(SUM(e.pointsEarned), 0) FROM ExerciseAttempt e WHERE e.user.id = :userId")
    int sumPointsEarnedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(e.pointsEarned) FROM ExerciseAttempt e WHERE e.user.id = :userId")
    Long sumPointsByUserId(Long userId);
    
    @Query("SELECT MAX(e.attemptNumber) FROM ExerciseAttempt e WHERE e.user.id = :userId AND e.exercise.id = :exerciseId")
    Integer findMaxAttemptNumber(Long userId, Long exerciseId);
}
