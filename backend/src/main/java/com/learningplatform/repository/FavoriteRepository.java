package com.learningplatform.repository;

import com.learningplatform.model.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    List<Favorite> findByUserId(Long userId);
    
    Optional<Favorite> findByUserIdAndCourseId(Long userId, Long courseId);
    
    Optional<Favorite> findByUserIdAndLessonId(Long userId, Long lessonId);
    
    Optional<Favorite> findByUserIdAndExerciseId(Long userId, Long exerciseId);
    
    Optional<Favorite> findByUserIdAndProjectId(Long userId, Long projectId);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    
    boolean existsByUserIdAndLessonId(Long userId, Long lessonId);
    
    void deleteByUserIdAndCourseId(Long userId, Long courseId);
    
    void deleteByUserIdAndLessonId(Long userId, Long lessonId);
}
