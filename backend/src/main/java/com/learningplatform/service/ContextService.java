package com.learningplatform.service;

import java.util.Map;

public interface ContextService {
    /**
     * Gets context information for a user to enhance AI responses.
     * 
     * @param userId the user ID
     * @return a map containing context information such as topic, skill level, recent exercises, etc.
     */
    Map<String, Object> getContext(Long userId);
}