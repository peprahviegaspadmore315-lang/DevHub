package com.learningplatform.repository;

import com.learningplatform.model.entity.LearningTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningTopicRepository extends JpaRepository<LearningTopic, Long> {

    Optional<LearningTopic> findBySlug(String slug);
    
    @Query("SELECT t FROM LearningTopic t WHERE t.language.id = :languageId ORDER BY t.orderIndex ASC")
    List<LearningTopic> findByLanguageId(@Param("languageId") Long languageId);
    
    @Query("SELECT t FROM LearningTopic t WHERE t.language.slug = :slug ORDER BY t.orderIndex ASC")
    List<LearningTopic> findByLanguageSlug(@Param("slug") String slug);
    
    Optional<LearningTopic> findByLanguageIdAndSlug(Long languageId, String slug);
    
    @Query("SELECT t FROM LearningTopic t WHERE t.language.slug = :languageSlug AND t.slug = :topicSlug")
    Optional<LearningTopic> findByLanguageSlugAndTopicSlug(
        @Param("languageSlug") String languageSlug,
        @Param("topicSlug") String topicSlug
    );
    
    @Query("SELECT COUNT(t) FROM LearningTopic t WHERE t.language.id = :languageId")
    Long countByLanguageId(@Param("languageId") Long languageId);
    
    boolean existsByLanguageIdAndSlug(Long languageId, String slug);
}
