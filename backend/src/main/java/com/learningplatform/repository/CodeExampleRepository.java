package com.learningplatform.repository;

import com.learningplatform.model.entity.CodeExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CodeExampleRepository extends JpaRepository<CodeExample, Long> {

    @Query("SELECT c FROM CodeExample c WHERE c.lesson.id = :lessonId ORDER BY c.orderIndex ASC")
    List<CodeExample> findByLessonId(@Param("lessonId") Long lessonId);
    
    @Query("SELECT c FROM CodeExample c WHERE c.lesson.id = :lessonId AND c.codeType = :codeType ORDER BY c.orderIndex ASC")
    List<CodeExample> findByLessonIdAndCodeType(
        @Param("lessonId") Long lessonId,
        @Param("codeType") String codeType
    );
    
    @Query("SELECT c FROM CodeExample c WHERE c.lesson.slug = :lessonSlug ORDER BY c.orderIndex ASC")
    List<CodeExample> findByLessonSlug(@Param("lessonSlug") String lessonSlug);
}
