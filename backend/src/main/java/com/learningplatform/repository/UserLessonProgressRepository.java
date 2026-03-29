package com.learningplatform.repository;

import com.learningplatform.model.entity.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {

    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    
    @Query("SELECT p FROM UserLessonProgress p WHERE p.userId = :userId")
    List<UserLessonProgress> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM UserLessonProgress p WHERE p.userId = :userId AND p.completed = true")
    List<UserLessonProgress> findCompletedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM UserLessonProgress p WHERE p.userId = :userId AND p.completed = true")
    Long countCompletedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM UserLessonProgress p WHERE p.userId = :userId AND p.lesson.topic.id = :topicId")
    List<UserLessonProgress> findByUserIdAndTopicId(
        @Param("userId") Long userId,
        @Param("topicId") Long topicId
    );
    
    @Query("SELECT p FROM UserLessonProgress p WHERE p.userId = :userId AND p.lesson.topic.language.id = :languageId")
    List<UserLessonProgress> findByUserIdAndLanguageId(
        @Param("userId") Long userId,
        @Param("languageId") Long languageId
    );
    
    boolean existsByUserIdAndLessonId(Long userId, Long lessonId);
}
