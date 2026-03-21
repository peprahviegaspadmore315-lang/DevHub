package com.learningplatform.service;

import com.learningplatform.model.dto.QuizDTO;
import com.learningplatform.model.entity.QuizAttempt;

import java.util.List;

public interface QuizService {
    List<QuizDTO> getAllQuizzes();
    QuizDTO getQuizById(Long id);
    List<Object> getQuizQuestions(Long quizId);
    QuizAttempt submitQuiz(Long quizId, Long userId, java.util.Map<Long, Long> answers);
    QuizAttempt getQuizResult(Long attemptId);
    List<QuizAttempt> getUserQuizAttempts(Long userId, Long quizId);
}