package com.learningplatform.repository;

import com.learningplatform.model.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByCourseIdOrderByOrderIndexAsc(Long courseId);
    
    List<Quiz> findByCourseIdAndIsPublishedTrueOrderByOrderIndexAsc(Long courseId);
    
    Optional<Quiz> findByCourseIdAndLessonId(Long courseId, Long lessonId);
    
    @Query("SELECT q FROM Quiz q WHERE q.isPublished = true")
    List<Quiz> findAllPublished();
}
