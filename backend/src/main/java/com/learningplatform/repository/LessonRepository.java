package com.learningplatform.repository;

import com.learningplatform.model.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    List<Lesson> findByCourseIdOrderByOrderIndexAsc(Long courseId);
    
    List<Lesson> findByCourseIdAndIsPublishedTrueOrderByOrderIndexAsc(Long courseId);
    
    Optional<Lesson> findByCourseIdAndSlug(Long courseId, String slug);
    
    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.orderIndex > :currentOrderIndex ORDER BY l.orderIndex ASC LIMIT 1")
    Optional<Lesson> findNextLesson(Long courseId, Integer currentOrderIndex);
    
    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.orderIndex < :currentOrderIndex ORDER BY l.orderIndex DESC LIMIT 1")
    Optional<Lesson> findPreviousLesson(Long courseId, Integer currentOrderIndex);
    
    Long countByCourseId(Long courseId);
}
