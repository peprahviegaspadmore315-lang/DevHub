package com.learningplatform.controller;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import com.learningplatform.service.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AIController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<AIChatResponse> chat(@Valid @RequestBody AIChatRequest request) {
        log.info("AI chat request received: {}", 
                request.getMessage().substring(0, Math.min(50, request.getMessage().length())));
        
        AIChatResponse response = geminiService.chat(request);
        
        if (response.isSuccess()) {
            log.info("AI chat response successful");
            return ResponseEntity.ok(response);
        } else {
            log.warn("AI chat failed: {}", response.getError());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<AIStatusResponse> getStatus() {
        boolean enabled = geminiService.isEnabled();
        return ResponseEntity.ok(new AIStatusResponse(
                enabled, 
                enabled ? "Gemini AI service is operational" : "Gemini AI service is disabled or not configured"
        ));
    }

    public record AIStatusResponse(boolean enabled, String message) {}
}
