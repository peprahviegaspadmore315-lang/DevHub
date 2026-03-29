package com.learningplatform.repository;

import com.learningplatform.model.entity.YouTubeVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface YouTubeVideoRepository extends JpaRepository<YouTubeVideo, Long> {

    @Query("SELECT v FROM YouTubeVideo v WHERE v.lesson.id = :lessonId ORDER BY v.orderIndex ASC")
    List<YouTubeVideo> findByLessonId(@Param("lessonId") Long lessonId);
    
    @Query("SELECT v FROM YouTubeVideo v WHERE v.lesson.slug = :lessonSlug ORDER BY v.orderIndex ASC")
    List<YouTubeVideo> findByLessonSlug(@Param("lessonSlug") String lessonSlug);
}
