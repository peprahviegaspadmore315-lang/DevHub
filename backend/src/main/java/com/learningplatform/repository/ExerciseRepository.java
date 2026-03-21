package com.learningplatform.repository;

import com.learningplatform.model.entity.Exercise;
import com.learningplatform.model.enums.Difficulty;
import com.learningplatform.model.enums.ExerciseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    
    List<Exercise> findByCourseIdOrderByOrderIndexAsc(Long courseId);
    
    List<Exercise> findByCourseIdAndIsPublishedTrueOrderByOrderIndexAsc(Long courseId);
    
    List<Exercise> findByLessonId(Long lessonId);
    
    List<Exercise> findByCourseIdAndDifficulty(Long courseId, Difficulty difficulty);
    
    Page<Exercise> findByIsPublishedTrue(Pageable pageable);
    
    @Query("SELECT e FROM Exercise e WHERE e.course.id = :courseId AND e.lesson.id = :lessonId ORDER BY e.orderIndex ASC")
    List<Exercise> findByCourseAndLesson(Long courseId, Long lessonId);
    
    Long countByCourseId(Long courseId);
}
