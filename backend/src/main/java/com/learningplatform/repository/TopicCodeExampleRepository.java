package com.learningplatform.repository;

import com.learningplatform.model.entity.TopicCodeExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TopicCodeExampleRepository extends JpaRepository<TopicCodeExample, Long> {

    @Query("SELECT c FROM TopicCodeExample c WHERE c.topic.id = :topicId ORDER BY c.orderIndex ASC")
    List<TopicCodeExample> findByTopicId(@Param("topicId") Long topicId);

    @Query("SELECT c FROM TopicCodeExample c WHERE c.topic.language = :language AND c.topic.slug = :slug ORDER BY c.orderIndex ASC")
    List<TopicCodeExample> findByLanguageAndSlug(
        @Param("language") String language,
        @Param("slug") String slug
    );
}
