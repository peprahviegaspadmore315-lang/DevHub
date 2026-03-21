package com.learningplatform.repository;

import com.learningplatform.model.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    List<QuizAttempt> findByUserId(Long userId);
    
    List<QuizAttempt> findByQuizId(Long quizId);
    
    List<QuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);
    
    Optional<QuizAttempt> findTopByUserIdAndQuizIdOrderByCreatedAtDesc(Long userId, Long quizId);
    
    @Query("SELECT COUNT(q) FROM QuizAttempt q WHERE q.user.id = :userId AND q.passed = true")
    Long countPassedByUserId(Long userId);
    
    @Query("SELECT COUNT(q) FROM QuizAttempt q WHERE q.user.id = :userId AND q.passed = true")
    int countByUserIdAndPassedTrue(@Param("userId") Long userId);
    
    @Query("SELECT AVG(q.score) FROM QuizAttempt q WHERE q.user.id = :userId")
    Double getAverageScoreByUserId(Long userId);
}
