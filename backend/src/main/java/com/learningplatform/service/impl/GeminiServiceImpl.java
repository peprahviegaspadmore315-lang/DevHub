package com.learningplatform.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningplatform.config.GeminiConfig;
import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import com.learningplatform.model.dto.GeminiRequest;
import com.learningplatform.model.dto.GeminiResponse;
import com.learningplatform.service.GeminiService;
import com.learningplatform.service.MockAIResponseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private final GeminiConfig geminiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final MockAIResponseService mockAIResponseService;

    @Override
    public AIChatResponse chat(AIChatRequest request) {
        // Use mock response when API key is not configured
        if (!isEnabled()) {
            log.info("Gemini API not configured, using mock responses");
            return mockAIResponseService.generateResponse(request);
        }

        try {
            GeminiRequest geminiRequest = buildRequest(request);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<GeminiRequest> entity = new HttpEntity<>(geminiRequest, headers);
            
            log.debug("Calling Gemini API with model: {}", geminiConfig.getModel());
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                    geminiConfig.getApiUrl(),
                    entity,
                    String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseResponse(response.getBody());
            } else {
                log.error("Gemini API returned error: {}", response.getStatusCode());
                return mockAIResponseService.generateResponse(request);
            }
            
        } catch (RestClientException e) {
            log.error("Error calling Gemini API, falling back to mock: {}", e.getMessage());
            return mockAIResponseService.generateResponse(request);
        } catch (Exception e) {
            log.error("Unexpected error in Gemini service, falling back to mock: {}", e.getMessage());
            return mockAIResponseService.generateResponse(request);
        }
    }

    @Override
    public boolean isEnabled() {
        return geminiConfig.isEnabled() && 
               geminiConfig.getApiKey() != null && 
               !geminiConfig.getApiKey().isBlank();
    }

    private GeminiRequest buildRequest(AIChatRequest request) {
        List<GeminiRequest.Content> contents = new ArrayList<>();
        List<AIChatRequest.ChatMessage> history = request.getConversationHistory() != null
                ? request.getConversationHistory()
                : List.of();

        for (AIChatRequest.ChatMessage chatMessage : history) {
            if (chatMessage.getRole() != null && chatMessage.getContent() != null) {
                String role = mapRole(chatMessage.getRole());
                GeminiRequest.Part part = GeminiRequest.Part.builder()
                        .text(chatMessage.getContent())
                        .build();
                GeminiRequest.Content content = GeminiRequest.Content.builder()
                        .role(role)
                        .parts(List.of(part))
                        .build();
                contents.add(content);
            }
        }
        
        GeminiRequest.Part userPart = GeminiRequest.Part.builder()
                .text(request.getMessage())
                .build();
        GeminiRequest.Content userContent = GeminiRequest.Content.builder()
                .role("user")
                .parts(List.of(userPart))
                .build();
        contents.add(userContent);
        
        GeminiRequest.GenerationConfig generationConfig = GeminiRequest.GenerationConfig.builder()
                .maxOutputTokens(geminiConfig.getMaxTokens())
                .temperature(geminiConfig.getTemperature())
                .topP(geminiConfig.getTopP())
                .topK(geminiConfig.getTopK())
                .build();
        
        GeminiRequest.SystemInstruction systemInstruction = null;
        if (geminiConfig.getSystemPrompt() != null && 
            geminiConfig.getSystemPrompt().getContent() != null) {
            GeminiRequest.Part systemPart = GeminiRequest.Part.builder()
                    .text(geminiConfig.getSystemPrompt().getContent())
                    .build();
            systemInstruction = GeminiRequest.SystemInstruction.builder()
                    .parts(List.of(systemPart))
                    .build();
        }
        
        return GeminiRequest.builder()
                .contents(contents)
                .generationConfig(generationConfig)
                .systemInstruction(systemInstruction)
                .build();
    }

    private String mapRole(String role) {
        return switch (role.toLowerCase()) {
            case "system" -> "system";
            case "assistant", "ai" -> "model";
            default -> "user";
        };
    }

    private AIChatResponse parseResponse(String responseBody) {
        try {
            GeminiResponse geminiResponse = objectMapper.readValue(responseBody, GeminiResponse.class);
            
            String text = geminiResponse.extractText();
            
            if (text != null && !text.isBlank()) {
                return AIChatResponse.builder()
                        .success(true)
                        .message(text.trim())
                        .aiName("LearnBot")
                        .model(geminiConfig.getModel())
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
            }
            
            String finishReason = null;
            if (geminiResponse.getCandidates() != null && !geminiResponse.getCandidates().isEmpty()) {
                finishReason = geminiResponse.getCandidates().get(0).getFinishReason();
            }
            
            if ("MAX_TOKENS".equals(finishReason)) {
                return AIChatResponse.builder()
                        .success(true)
                        .message("Response was truncated due to length limits.")
                        .aiName("LearnBot")
                        .model(geminiConfig.getModel())
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
            }
            
            return AIChatResponse.error("No response content from AI service");
            
        } catch (Exception e) {
            log.error("Error parsing Gemini response: {}", e.getMessage());
            return AIChatResponse.error("Error processing AI response");
        }
    }
}
