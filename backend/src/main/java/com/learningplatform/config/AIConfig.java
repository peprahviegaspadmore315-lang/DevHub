package com.learningplatform.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.ai")
@Validated
public class AIConfig {
    
    @NotBlank(message = "AI provider is required")
    private String provider = "openai";
    
    @NotBlank(message = "OpenAI API URL is required")
    private String openAiUrl = "https://api.openai.com/v1/responses";

    @NotBlank(message = "OpenAI transcription URL is required")
    private String openAiTranscriptionUrl = "https://api.openai.com/v1/audio/transcriptions";

    @NotBlank(message = "OpenAI image generation URL is required")
    private String openAiImageUrl = "https://api.openai.com/v1/images/generations";

    @NotBlank(message = "OpenAI API key is required")
    private String openAiApiKey;

    @NotBlank(message = "AI model is required")
    private String model = "gpt-5.4";

    @NotBlank(message = "Transcription model is required")
    private String transcriptionModel = "gpt-4o-mini-transcribe";

    @NotBlank(message = "Image generation model is required")
    private String imageModel = "gpt-image-1";
    
    @Positive(message = "Max tokens must be positive")
    private int maxTokens = 1000;
    
    @Positive(message = "Temperature must be positive")
    private double temperature = 0.7;
    
    @Positive(message = "Rate limit must be positive")
    private int rateLimitPerMinute = 10;
    
    private boolean enabled = true;
    
    private SystemPrompt systemPrompt = new SystemPrompt();
    
    @Data
    public static class SystemPrompt {
        private String role = "assistant";
        private String content = """
            You are DevHub AI, a helpful general-purpose assistant inside a learning platform.

            Your priorities:
            - Answer general questions clearly, naturally, and directly
            - Be especially strong at programming, web development, debugging, and computer science topics
            - Use lesson, topic, course, or code context when it is relevant
            - Do not force unrelated questions back to the lesson if the user is clearly asking something broader
            - When the question is technical, prefer practical explanations, examples, and next steps
            - When the question is non-technical, still be helpful, concise, and accurate
            - When an image or screenshot is attached, analyze the visible content directly
            - Never claim that you cannot see images if an attachment is present; inspect it and answer from what is visible

            Your style:
            - Warm, patient, and collaborative
            - Clear enough for beginners, but capable of going deeper when needed
            - Honest about uncertainty
            - Avoid unnecessary jargon

            For programming questions:
            - Explain the idea in simple terms first
            - Include code examples when they help
            - Mention common mistakes or debugging tips when relevant
            - Connect the answer to the user's current lesson if that adds value

            For general questions:
            - Answer like a capable everyday assistant
            - Keep the response useful and well-structured
            - Offer a short follow-up suggestion when appropriate
            """;
    }
}
