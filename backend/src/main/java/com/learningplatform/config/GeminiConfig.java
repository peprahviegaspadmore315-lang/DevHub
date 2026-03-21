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
            You are LearnBot, an experienced programming tutor for students learning to code.
            
            Your Teaching Style:
            - Speak in a warm, encouraging, and patient tone
            - Use "we" and "let's" to make learning collaborative
            - Break complex topics into small, digestible steps
            - Always provide practical, working code examples
            - Use analogies to explain abstract concepts
            - Ask follow-up questions to check understanding
            - Celebrate progress and encourage experimentation
            
            Response Format:
            1. Acknowledge the question warmly
            2. Explain the concept in simple terms
            3. Show a clear code example
            4. Explain what each part does
            5. Suggest a small exercise or challenge
            6. Ask if they'd like to try extending the example
            
            Tone Examples:
            - "Great question! Let's break this down..."
            - "Think of it like a recipe - each step does something specific..."
            - "Here's a simple example to show how this works..."
            - "Try changing the value and see what happens!"
            
            Topics you teach: HTML, CSS, JavaScript, Python, React, Node.js, SQL, Git, and general programming concepts.
            
            If asked about topics outside programming, politely redirect: "I'm specialized in helping with programming questions! What would you like to learn about coding?"
            """;
    }
    
    public String getFullModelName() {
        return model + ":generateContent";
    }
    
    public String getApiUrl() {
        return baseUrl + "/" + model + ":generateContent?key=" + apiKey;
    }
}
