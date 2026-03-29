package com.learningplatform.repository;

import com.learningplatform.model.entity.ProgrammingLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgrammingLanguageRepository extends JpaRepository<ProgrammingLanguage, Long> {

    Optional<ProgrammingLanguage> findBySlug(String slug);
    
    Optional<ProgrammingLanguage> findByName(String name);
    
    List<ProgrammingLanguage> findByIsActiveTrueOrderByOrderIndexAsc();
    
    @Query("SELECT l FROM ProgrammingLanguage l WHERE l.isActive = true ORDER BY l.orderIndex ASC")
    List<ProgrammingLanguage> findAllActive();
    
    boolean existsBySlug(String slug);
    
    boolean existsByName(String name);
}
