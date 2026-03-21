package com.learningplatform.repository;

import com.learningplatform.model.entity.Course;
import com.learningplatform.model.enums.Difficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findBySlug(String slug);
    
    List<Course> findByIsPublishedTrue();
    
    List<Course> findByIsFeaturedTrueAndIsPublishedTrue();
    
    List<Course> findByCategory(String category);
    
    List<Course> findByDifficulty(Difficulty difficulty);
    
    Page<Course> findByIsPublishedTrue(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.isPublished = true AND " +
           "(c.title LIKE %:search% OR c.description LIKE %:search%)")
    List<Course> searchCourses(String search);
    
    @Query("SELECT DISTINCT c.category FROM Course c WHERE c.category IS NOT NULL")
    List<String> findAllCategories();
    
    List<Course> findByOrderByOrderIndexAsc();
}
