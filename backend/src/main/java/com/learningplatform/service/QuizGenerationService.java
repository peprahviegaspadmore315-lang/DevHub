package com.learningplatform.service;

import com.learningplatform.model.dto.QuizGenerationRequest;
import com.learningplatform.model.dto.QuizGenerationResponse;

public interface QuizGenerationService {
    QuizGenerationResponse generateQuiz(QuizGenerationRequest request);
}
