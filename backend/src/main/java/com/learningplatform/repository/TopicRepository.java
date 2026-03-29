package com.learningplatform.repository;

import com.learningplatform.model.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findByLanguageOrderByOrderIndexAsc(String language);

    Optional<Topic> findByLanguageAndSlug(String language, String slug);

    @Query("SELECT DISTINCT t.language FROM Topic t ORDER BY t.language")
    List<String> findAllLanguages();

    @Query("SELECT COUNT(t) FROM Topic t WHERE t.language = :language")
    Long countByLanguage(@Param("language") String language);

    boolean existsByLanguageAndSlug(String language, String slug);
}
