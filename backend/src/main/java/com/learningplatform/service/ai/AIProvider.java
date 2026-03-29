package com.learningplatform.service.ai;

import java.util.Map;

public interface AIProvider {
    AIProviderReply chat(String message, Map<String, Object> context);
    String transcribeAudio(byte[] audioData, String mimeType, String fileName, Map<String, Object> context);
    AIProviderStatus getStatus();
}
