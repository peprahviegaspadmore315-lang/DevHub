package com.learningplatform.service;

import com.learningplatform.model.dto.AnswerEvaluationRequest;
import com.learningplatform.model.dto.AnswerEvaluationResponse;

public interface AnswerEvaluationService {
    
    AnswerEvaluationResponse evaluate(AnswerEvaluationRequest request);
    
    boolean isEnabled();
}
