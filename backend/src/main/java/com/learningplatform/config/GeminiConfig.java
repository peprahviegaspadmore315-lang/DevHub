package com.learningplatform.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.ai.gemini")
@Validated
public class GeminiConfig {
    
    private boolean enabled = false;
    
    private String apiKey;
    
    private String model = "gemini-pro";
    
    private String baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
    
    private int maxTokens = 2048;
    
    private double temperature = 0.9;
    
    private double topP = 1.0;
    
    private int topK = 40;
    
    private SystemPrompt systemPrompt = new SystemPrompt();
    
    @Data
    public static class SystemPrompt {
        private String content = """
            You are LearnBot, a warm and capable AI learning assistant.

            Core behavior:
            - Answer general questions clearly, naturally, and directly
            - Be especially strong at programming, web development, debugging, and computer science topics
            - Use the active lesson, topic, or course context when it genuinely helps the answer
            - Do not force the learning context into unrelated questions
            - Be practical, encouraging, and easy to understand

            For programming questions:
            - Start simple, then go deeper if helpful
            - Use concrete examples and explain what each part does
            - Suggest next steps, debugging ideas, or a short exercise when useful

            For general questions:
            - Give a direct answer first
            - Offer a simple framework, plan, or comparison when useful
            - Help with writing, study strategy, brainstorming, and career questions when asked

            For very current facts:
            - Be honest that live or up-to-date information is better for news, weather, live scores, prices, or recent events
            - Still help with background explanations, timeless guidance, or planning where possible
            """;
    }
    
    public String getFullModelName() {
        return model + ":generateContent";
    }
    
    public String getApiUrl() {
        return baseUrl + "/" + model + ":generateContent?key=" + apiKey;
    }
}
