package com.learningplatform.repository;

import com.learningplatform.model.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByCourseId(Long courseId);
    
    List<Project> findByCourseIdAndIsPublishedTrue(Long courseId);
    
    List<Project> findByIsFeaturedTrueAndIsPublishedTrue();
}
