package com.learningplatform.repository;

import com.learningplatform.model.entity.LearningLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningLessonRepository extends JpaRepository<LearningLesson, Long> {

    Optional<LearningLesson> findBySlug(String slug);
    
    @Query("SELECT l FROM LearningLesson l WHERE l.topic.id = :topicId ORDER BY l.orderIndex ASC")
    List<LearningLesson> findByTopicId(@Param("topicId") Long topicId);
    
    @Query("SELECT l FROM LearningLesson l WHERE l.topic.slug = :topicSlug ORDER BY l.orderIndex ASC")
    List<LearningLesson> findByTopicSlug(@Param("topicSlug") String topicSlug);
    
    Optional<LearningLesson> findByTopicIdAndSlug(Long topicId, String slug);
    
    @Query("SELECT l FROM LearningLesson l WHERE l.topic.language.slug = :languageSlug AND l.topic.slug = :topicSlug ORDER BY l.orderIndex ASC")
    List<LearningLesson> findByLanguageAndTopic(
        @Param("languageSlug") String languageSlug,
        @Param("topicSlug") String topicSlug
    );
    
    @Query("SELECT l FROM LearningLesson l WHERE l.topic.language.slug = :languageSlug AND l.topic.slug = :topicSlug AND l.slug = :lessonSlug")
    Optional<LearningLesson> findByFullSlug(
        @Param("languageSlug") String languageSlug,
        @Param("topicSlug") String topicSlug,
        @Param("lessonSlug") String lessonSlug
    );
    
    @Query("SELECT l FROM LearningLesson l WHERE l.topic.language.id = :languageId ORDER BY l.topic.orderIndex ASC, l.orderIndex ASC")
    List<LearningLesson> findByLanguageId(@Param("languageId") Long languageId);
    
    @Query("SELECT l FROM LearningLesson l JOIN FETCH l.topic t JOIN FETCH t.language lang WHERE l.id = :id")
    Optional<LearningLesson> findByIdWithDetails(@Param("id") Long id);
    
    Long countByTopicId(Long topicId);
}
