package com.learningplatform.service;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;

public interface GeminiService {
    
    AIChatResponse chat(AIChatRequest request);
    
    boolean isEnabled();
}
