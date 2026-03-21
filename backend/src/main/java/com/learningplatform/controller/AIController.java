package com.learningplatform.controller;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import com.learningplatform.model.dto.AnswerEvaluationRequest;
import com.learningplatform.model.dto.AnswerEvaluationResponse;
import com.learningplatform.service.AnswerEvaluationService;
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
    private final AnswerEvaluationService answerEvaluationService;

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

    @PostMapping("/evaluate")
    public ResponseEntity<AnswerEvaluationResponse> evaluate(@Valid @RequestBody AnswerEvaluationRequest request) {
        log.info("Answer evaluation request: question='{}...', answerLength={}",
                request.getQuestion().substring(0, Math.min(30, request.getQuestion().length())),
                request.getStudentAnswer().length());
        
        AnswerEvaluationResponse response = answerEvaluationService.evaluate(request);
        
        if (response.isSuccess()) {
            log.info("Evaluation complete: score={}, correct={}", response.getScore(), response.isCorrect());
            return ResponseEntity.ok(response);
        } else {
            log.warn("Evaluation failed: {}", response.getError());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<AIStatusResponse> getStatus() {
        boolean chatEnabled = geminiService.isEnabled();
        boolean evaluationEnabled = answerEvaluationService.isEnabled();
        return ResponseEntity.ok(new AIStatusResponse(
                chatEnabled || evaluationEnabled,
                String.format("Chat: %s, Evaluation: %s",
                        chatEnabled ? "operational" : "disabled",
                        evaluationEnabled ? "operational" : "disabled")
        ));
    }

    public record AIStatusResponse(boolean enabled, String message) {}
}
