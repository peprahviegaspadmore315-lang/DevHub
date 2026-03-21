package com.learningplatform.controller;

import com.learningplatform.model.dto.CodeRunRequest;
import com.learningplatform.model.dto.CodeRunResponse;
import com.learningplatform.service.CodeExecutionService;
import com.learningplatform.service.CodeSecurityScanner;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/code")
@RequiredArgsConstructor
@Slf4j
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;
    private final CodeSecurityScanner securityScanner;

    @PostMapping("/run")
    public ResponseEntity<CodeRunResponse> runCode(@Valid @RequestBody CodeRunRequest request) {
        log.info("Code execution request: language={}, codeLength={}", 
                request.getLanguage(), request.getCode().length());
        
        CodeRunResponse response = codeExecutionService.execute(request);
        
        if (response.isSuccess()) {
            log.info("Code executed successfully in {}ms", response.getExecutionTimeMs());
        } else {
            log.warn("Code execution failed: {}", response.getError());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/languages")
    public ResponseEntity<List<Map<String, Object>>> getLanguages() {
        List<Map<String, Object>> languages = Arrays.stream(CodeRunRequest.Language.values())
                .map(lang -> Map.<String, Object>of(
                        "id", lang.name(),
                        "name", lang.getName(),
                        "extension", lang.getExtension(),
                        "requiresExecution", lang.requiresExecution(),
                        "available", codeExecutionService.isAvailable() || !lang.requiresExecution()
                ))
                .toList();
        
        return ResponseEntity.ok(languages);
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCode(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "error", "Code is required"
            ));
        }
        
        var threats = securityScanner.scan(code);
        boolean isBlocked = securityScanner.isBlocked(threats);
        
        return ResponseEntity.ok(Map.of(
                "valid", !isBlocked,
                "blocked", isBlocked,
                "threats", threats.stream()
                        .map(t -> Map.of(
                                "type", t.type(),
                                "description", t.description()
                        ))
                        .toList()
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        boolean dockerAvailable = codeExecutionService.isAvailable();
        
        return ResponseEntity.ok(Map.of(
                "dockerAvailable", dockerAvailable,
                "executionEnabled", dockerAvailable,
                "supportedLanguages", CodeRunRequest.Language.values().length,
                "maxCodeSize", "100KB",
                "timeout", "10 seconds",
                "memoryLimit", "256MB"
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CodeRunResponse> handleException(Exception e) {
        log.error("Code execution error", e);
        return ResponseEntity.internalServerError()
                .body(CodeRunResponse.error("Internal server error: " + e.getMessage(), null));
    }
}
