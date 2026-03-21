package com.learningplatform.service;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;

public interface MockAIResponseService {
    AIChatResponse generateResponse(AIChatRequest request);
}
