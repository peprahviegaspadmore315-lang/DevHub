package com.learningplatform.repository;

import com.learningplatform.model.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByQuizIdOrderByOrderIndexAsc(Long quizId);
    
    Long countByQuizId(Long quizId);
}
