package com.learningplatform.controller;

import com.learningplatform.model.dto.QuizGenerationRequest;
import com.learningplatform.model.dto.QuizGenerationResponse;
import com.learningplatform.service.CodeExplanationService;
import com.learningplatform.service.ai.AIProvider;
import com.learningplatform.service.ai.AIProviderReply;
import com.learningplatform.service.ContextService;
import com.learningplatform.service.QuizGenerationService;
import java.io.IOException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIProvider aiProvider;
    private final ContextService contextService;
    private final QuizGenerationService quizGenerationService;
    private final CodeExplanationService codeExplanationService;

    @Autowired
    public AIController(
            AIProvider aiProvider,
            ContextService contextService,
            QuizGenerationService quizGenerationService,
            CodeExplanationService codeExplanationService) {
        this.aiProvider = aiProvider;
        this.contextService = contextService;
        this.quizGenerationService = quizGenerationService;
        this.codeExplanationService = codeExplanationService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        // Get base context from user's progress and lessons
        Map<String, Object> baseContext = new HashMap<>();
        if (request.getUserId() != null) {
            baseContext = contextService.getContext(request.getUserId());
        }
        
        // Merge with context from request (request context takes precedence)
        if (request.getContext() != null) {
            baseContext.putAll(request.getContext());
        }

        AIProviderReply reply = aiProvider.chat(request.getMessage(), baseContext);
        Map<String, Object> response = new HashMap<>();
        response.put("reply", reply.getContent());
        response.put("provider", reply.getProvider());
        response.put("providerLabel", reply.getProviderLabel());
        response.put("source", reply.getSource());
        response.put("sourceLabel", reply.getSourceLabel());
        response.put("live", reply.isLive());
        response.put("statusMessage", reply.getStatusMessage());
        if (reply.getGeneratedImageUrl() != null && !reply.getGeneratedImageUrl().isBlank()) {
            response.put("generatedImageUrl", reply.getGeneratedImageUrl());
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> transcribe(
        @RequestPart("audio") MultipartFile audio,
        @RequestParam(required = false) String locale,
        @RequestParam(required = false) String language,
        @RequestParam(required = false) String courseTitle,
        @RequestParam(required = false) String topicTitle,
        @RequestParam(required = false) String lessonTitle
    ) throws IOException {
        if (audio == null || audio.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "An audio recording is required for transcription."
            ));
        }

        try {
            Map<String, Object> transcriptionContext = new HashMap<>();
            putIfNotBlank(transcriptionContext, "locale", locale);
            putIfNotBlank(transcriptionContext, "language", language);
            putIfNotBlank(transcriptionContext, "courseTitle", courseTitle);
            putIfNotBlank(transcriptionContext, "topicTitle", topicTitle);
            putIfNotBlank(transcriptionContext, "lessonTitle", lessonTitle);

            String transcript = aiProvider.transcribeAudio(
                audio.getBytes(),
                audio.getContentType(),
                audio.getOriginalFilename(),
                transcriptionContext
            );

            return ResponseEntity.ok(Map.of("transcript", transcript));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        var status = aiProvider.getStatus();
        Map<String, Object> response = Map.of(
            "enabled", status.isEnabled(),
            "configured", status.isConfigured(),
            "live", status.isLive(),
            "provider", status.getProvider(),
            "providerLabel", status.getProviderLabel(),
            "source", status.getSource(),
            "sourceLabel", status.getSourceLabel(),
            "message", status.getMessage()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate-quiz")
    public ResponseEntity<QuizGenerationResponse> generateQuiz(
            @Valid @RequestBody QuizGenerationRequest request) {
        return ResponseEntity.ok(quizGenerationService.generateQuiz(request));
    }

    @PostMapping("/explain-code")
    public ResponseEntity<Map<String, String>> explainCode(@RequestBody ExplainCodeRequest request) {
        String reply = codeExplanationService.explainCode(request.getCode(), request.getLanguage());
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    public static class ChatRequest {
        private String message;
        private Map<String, Object> context;
        private Long userId;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Map<String, Object> getContext() {
            return context;
        }

        public void setContext(Map<String, Object> context) {
            this.context = context;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }

    private void putIfNotBlank(Map<String, Object> target, String key, String value) {
        if (value != null && !value.isBlank()) {
            target.put(key, value.trim());
        }
    }

    public static class ExplainCodeRequest {
        private String code;
        private String language;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }
    }
}
