# Secure Code Execution Service Architecture

## Overview

The code execution service runs user-submitted code in isolated Docker containers to safely execute code without affecting the main server.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React Frontend)                           │
│                        Code Editor + Output Display                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API Gateway (Nginx)                                │
│                    /api/execute → Load Balancing                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
┌──────────────────────────────────┐     ┌──────────────────────────────────┐
│     Spring Boot Backend          │     │     Code Execution Service       │
│     - Auth                       │     │     - Job Queue (Redis)          │
│     - Business Logic            │     │     - Worker Pool                │
│     - Request Validation        │     │     - Container Manager          │
└──────────────────────────────────┘     └──────────────────────────────────┘
                                                         │
                                                         ▼
                                        ┌───────────────────────────────────┐
                                        │      Docker Swarm/Kubernetes     │
                                        │                                   │
                                        │  ┌─────────┐ ┌─────────┐       │
                                        │  │Worker 1 │ │Worker 2 │       │
                                        │  │(Node.js)│ │(Python) │       │
                                        │  └─────────┘ └─────────┘       │
                                        │  ┌─────────┐ ┌─────────┐       │
                                        │  │Worker 3 │ │Worker 4 │       │
                                        │  │ (Java)  │ │ (SQL)   │       │
                                        │  └─────────┘ └─────────┘       │
                                        │                                   │
                                        └───────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY LAYERS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │ 1. Input        │  - Size limits (max 100KB code)                      │
│  │    Validation   │  - Language whitelist                                  │
│  │                 │  - Character filtering                                 │
│  └─────────────────┘                                                       │
│           │                                                                │
│           ▼                                                                │
│  ┌─────────────────┐                                                       │
│  │ 2. Queue        │  - Job validation                                     │
│  │    Management   │  - Rate limiting (10 req/min/user)                   │
│  │                 │  - Priority queue                                     │
│  └─────────────────┘                                                       │
│           │                                                                │
│           ▼                                                                │
│  ┌─────────────────┐                                                       │
│  │ 3. Container    │  - Ephemeral containers (one-time use)               │
│  │    Isolation    │  - No network access                                  │
│  │                 │  - Read-only root filesystem                          │
│  └─────────────────┘                                                       │
│           │                                                                │
│           ▼                                                                │
│  ┌─────────────────┐                                                       │
│  │ 4. Resource    │  - CPU: 1 core max                                    │
│  │    Limits      │  - Memory: 256MB max                                  │
│  │                 │  - Time: 10 seconds max                              │
│  └─────────────────┘                                                       │
│           │                                                                │
│           ▼                                                                │
│  ┌─────────────────┐                                                       │
│  │ 5. Output       │  - Output truncation (max 64KB)                     │
│  │    Sanitization │  - Error message filtering                           │
│  │                 │  - No system information leakage                      │
│  └─────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Docker Configuration

### Base Execution Image

```dockerfile
# Base image with language runtimes
FROM ubuntu:22.04 AS base

# Install runtimes
RUN apt-get update && apt-get install -y \
    python3.11 \
    nodejs \
    default-jdk \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash executor
USER executor

WORKDIR /workspace

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

### Entrypoint Script (Sandboxed Execution)

```bash
#!/bin/bash
# Secure entrypoint for code execution

set -euo pipefail

# Security: Disable core dumps
ulimit -c 0

# Security: Set resource limits
ulimit -v 262144  # 256MB max virtual memory
ulimit -t 10     # 10 seconds max CPU time
ulimit -u 50     # Max 50 processes

# Security: Clear environment
unset LD_PRELOAD
unset LD_LIBRARY_PATH

# Get language and code from arguments
LANGUAGE="$1"
CODE="$2"
INPUT="$3"

# Execute based on language
case "$LANGUAGE" in
    python3)
        echo "$CODE" | python3 - ;;
    node)
        echo "$CODE" | node - ;;
    java)
        # Compile and run
        echo "$CODE" > Main.java
        javac Main.java
        java Main ;;
    sqlite3)
        echo "$CODE" | sqlite3 ;;
    *)
        echo "Unsupported language: $LANGUAGE" >&2
        exit 1 ;;
esac
```

### Docker Compose (Development)

```yaml
version: '3.8'

services:
  # Code Execution Workers
  executor-python:
    image: learning-platform/executor:python
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 64M
    environment:
      - MAX_EXECUTION_TIME=10
      - MAX_MEMORY_KB=262144
      - MAX_OUTPUT_SIZE=65536
    volumes:
      - executor-workspace:/workspace
    networks:
      - execution-network
    cap_drop:
      - ALL
    read_only: true
    tmpfs:
      - /tmp:size=10M,mode=1777
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python3", "--version"]
      interval: 30s
      timeout: 10s
      retries: 3

  executor-node:
    image: learning-platform/executor:node
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 256M
    environment:
      - MAX_EXECUTION_TIME=10
    networks:
      - execution-network
    cap_drop:
      - ALL
    read_only: true
    tmpfs:
      - /tmp:size=10M
    restart: unless-stopped

  executor-java:
    image: learning-platform/executor:java
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 512M
    environment:
      - MAX_EXECUTION_TIME=15
    networks:
      - execution-network
    cap_drop:
      - ALL
    read_only: true
    tmpfs:
      - /tmp:size=10M
    restart: unless-stopped

  # Redis for job queue
  redis:
    image: redis:7-alpine
    networks:
      - execution-network
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

networks:
  execution-network:
    driver: bridge
    internal: true  # No external access

volumes:
  executor-workspace:
  redis-data:
```

## Java Implementation

### ExecutionRequest DTO

```java
package com.learningplatform.model.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionRequest {
    
    @NotBlank(message = "Language is required")
    @Pattern(regexp = "^(python3|node|java|sqlite3)$", 
             message = "Invalid language")
    private String language;
    
    @NotBlank(message = "Code is required")
    @Size(max = 102400, message = "Code must be less than 100KB")
    private String code;
    
    @Size(max = 10240, message = "Input must be less than 10KB")
    private String input;
    
    @Min(value = 1, message = "Time limit must be at least 1 second")
    @Max(value = 30, message = "Time limit cannot exceed 30 seconds")
    private Long timeLimit = 10L;
}
```

### Execution Response DTO

```java
package com.learningplatform.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionResponse {
    
    private String output;
    
    @Builder.Default
    private Double executionTime = 0.0;
    
    @Builder.Default
    private Integer memoryUsed = 0;
    
    @Builder.Default
    private ExecutionStatus status = ExecutionStatus.SUCCESS;
    
    private String error;
    
    public enum ExecutionStatus {
        SUCCESS,
        COMPILE_ERROR,
        RUNTIME_ERROR,
        TIMEOUT,
        MEMORY_LIMIT_EXCEEDED,
        SECURITY_VIOLATION,
        INVALID_INPUT
    }
}
```

### Secure Code Execution Service

```java
package com.learningplatform.service.impl;

import com.learningplatform.exception.BadRequestException;
import com.learningplatform.model.dto.ExecutionRequest;
import com.learningplatform.model.dto.ExecutionResponse;
import com.learningplatform.service.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecureCodeExecutionService implements CodeExecutionService {

    @Value("${app.execution.timeout-seconds:10}")
    private Long defaultTimeout;

    @Value("${app.execution.max-memory-kb:262144}")
    private Integer maxMemoryKb;

    @Value("${app.execution.max-output-size:65536}")
    private Integer maxOutputSize;

    @Value("${app.execution.workspace-path:/tmp/execution}")
    private String workspacePath;

    private final StringRedisTemplate redisTemplate;

    private static final String EXECUTION_QUEUE = "execution:queue";
    private static final String WORKER_PREFIX = "execution:worker:";

    // Dangerous patterns to block
    private static final String[] FORBIDDEN_PATTERNS = {
        "import os",
        "import sys",
        "import subprocess",
        "import socket",
        "import requests",
        "import urllib",
        "import java.io.File",
        "import java.nio.file.Files",
        "Runtime.getRuntime()",
        "ProcessBuilder",
        "exec(",
        "eval(",
        "__import__",
        "process.exit",
        "system(",
        "fork()",
        "child_process",
        "require('child_process')",
        "java.lang.Runtime",
        "java.lang.Process",
    };

    @Override
    public ExecutionResponse execute(ExecutionRequest request) {
        long startTime = System.nanoTime();

        // Step 1: Validate input
        validateInput(request);

        // Step 2: Check rate limit
        checkRateLimit(request);

        // Step 3: Security scan
        securityScan(request.getCode());

        try {
            // Step 4: Create execution environment
            Path workDir = createExecutionEnvironment();

            try {
                // Step 5: Execute code
                ExecutionResult result = executeInContainer(
                        request.getLanguage(),
                        request.getCode(),
                        request.getInput(),
                        workDir,
                        request.getTimeLimit() != null ? request.getTimeLimit() : defaultTimeout
                );

                // Step 6: Sanitize output
                String sanitizedOutput = sanitizeOutput(result.getOutput());

                double executionTime = (System.nanoTime() - startTime) / 1_000_000_000.0;

                return ExecutionResponse.builder()
                        .output(sanitizedOutput)
                        .executionTime(executionTime)
                        .memoryUsed(result.getMemoryUsed())
                        .status(mapToStatus(result.getExitCode(), result.isTimeout()))
                        .error(result.getError())
                        .build();

            } finally {
                // Step 7: Cleanup
                cleanup(workDir);
            }

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Execution failed", e);
            return ExecutionResponse.builder()
                    .status(ExecutionResponse.ExecutionStatus.RUNTIME_ERROR)
                    .error(e.getMessage())
                    .build();
        }
    }

    private void validateInput(ExecutionRequest request) {
        if (request.getCode() == null || request.getCode().isEmpty()) {
            throw new BadRequestException("Code cannot be empty");
        }

        if (request.getCode().length() > 102400) {
            throw new BadRequestException("Code exceeds maximum size of 100KB");
        }

        if (!isValidLanguage(request.getLanguage())) {
            throw new BadRequestException("Unsupported language: " + request.getLanguage());
        }
    }

    private void checkRateLimit(String userId) {
        String rateLimitKey = "ratelimit:" + userId;
        Long count = redisTemplate.opsForValue().increment(rateLimitKey);
        
        if (count != null && count == 1) {
            redisTemplate.expire(rateLimitKey, 60, TimeUnit.SECONDS);
        }
        
        if (count != null && count > 10) {
            throw new BadRequestException("Rate limit exceeded. Please wait before submitting more code.");
        }
    }

    private void securityScan(String code) {
        String lowerCode = code.toLowerCase();
        
        for (String pattern : FORBIDDEN_PATTERNS) {
            if (lowerCode.contains(pattern.toLowerCase())) {
                log.warn("Security violation: blocked forbidden pattern - {}", pattern);
                throw new BadRequestException(
                        "Code contains forbidden patterns. " +
                        "System calls, file operations, and network access are not allowed."
                );
            }
        }

        // Check for potential infinite loops (basic detection)
        if (code.contains("while true") || code.contains("while(true)")) {
            if (!code.contains("break") && !code.contains("return")) {
                throw new BadRequestException("Potential infinite loop detected");
            }
        }
    }

    private boolean isValidLanguage(String language) {
        return language != null && 
               language.matches("^(python3|node|java|sqlite3)$");
    }

    private Path createExecutionEnvironment() throws IOException {
        Path dir = Files.createTempDirectory(Path.of(workspacePath), "exec-");
        dir.toFile().setReadable(true, false);
        dir.toFile().setWritable(true, false);
        return dir;
    }

    private ExecutionResult executeInContainer(
            String language,
            String code,
            String input,
            Path workDir,
            Long timeout) throws Exception {

        ProcessBuilder pb = buildProcessCommand(language, code, input, workDir);
        pb.directory(workDir.toFile());
        
        // Security: Clear environment
        pb.environment().clear();
        pb.environment().put("HOME", workDir.toString());
        pb.environment().put("PATH", "/usr/local/bin:/usr/bin:/bin");
        
        pb.redirectErrorStream(true);

        Process process = pb.start();

        // Write input if provided
        if (input != null && !input.isEmpty()) {
            try (OutputStream os = process.getOutputStream()) {
                os.write(input.getBytes());
                os.flush();
            }
        }

        // Read output with size limit
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(maxOutputSize);
        byte[] buffer = new byte[8192];
        
        Future<Integer> readerFuture = Executors.newSingleThreadExecutor().submit(
                () -> {
                    try (InputStream is = process.getInputStream()) {
                        int bytesRead;
                        while ((bytesRead = is.read(buffer)) != -1) {
                            if (outputStream.size() >= maxOutputSize) {
                                break;
                            }
                            outputStream.write(buffer, 0, 
                                    Math.min(bytesRead, maxOutputSize - outputStream.size()));
                        }
                    }
                    return outputStream.size();
                }
        );

        // Wait for completion with timeout
        boolean finished = process.waitFor(timeout, TimeUnit.SECONDS);
        
        int exitCode = process.exitValue();
        
        if (!finished) {
            process.destroyForcibly();
            return ExecutionResult.builder()
                    .exitCode(-1)
                    .timeout(true)
                    .output("Execution timed out after " + timeout + " seconds")
                    .build();
        }

        return ExecutionResult.builder()
                .exitCode(exitCode)
                .timeout(false)
                .output(outputStream.toString())
                .memoryUsed(estimateMemoryUsage(workDir))
                .build();
    }

    private ProcessBuilder buildProcessCommand(String language, String code, 
                                               String input, Path workDir) throws IOException {
        Path sourceFile = workDir.resolve(getFileName(language));
        Files.writeString(sourceFile, code);

        return switch (language) {
            case "python3" -> new ProcessBuilder("python3", sourceFile.toString());
            case "node" -> new ProcessBuilder("node", sourceFile.toString());
            case "java" -> {
                // Compile first
                ProcessBuilder compile = new ProcessBuilder("javac", sourceFile.toString());
                compile.directory(workDir.toFile());
                Process compileProcess = compile.start();
                compileProcess.waitFor();
                
                yield new ProcessBuilder("java", "-cp", workDir.toString(), "Main");
            }
            case "sqlite3" -> new ProcessBuilder("sqlite3", ":memory:");
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private String getFileName(String language) {
        return switch (language) {
            case "python3" -> "script.py";
            case "node" -> "script.js";
            case "java" -> "Main.java";
            case "sqlite3" -> "query.sql";
            default -> "script";
        };
    }

    private String sanitizeOutput(String output) {
        if (output == null) return "";
        
        // Truncate if too long
        if (output.length() > maxOutputSize) {
            output = output.substring(0, maxOutputSize) + 
                    "\n... (output truncated)";
        }
        
        // Remove any system paths that might have leaked
        output = output.replaceAll("/[^\\s]+/[^\\s]+/", "[path removed]");
        
        return output;
    }

    private int estimateMemoryUsage(Path workDir) {
        // Rough estimate based on temp directory size
        try {
            return (int) Files.walk(workDir)
                    .mapToLong(p -> {
                        try { return Files.size(p); } 
                        catch (Exception e) { return 0L; }
                    })
                    .sum() / 1024; // Convert to KB
        } catch (Exception e) {
            return 0;
        }
    }

    private void cleanup(Path workDir) {
        try {
            Files.walk(workDir)
                    .sorted(java.util.Comparator.reverseOrder())
                    .forEach(p -> p.toFile().delete());
        } catch (Exception e) {
            log.warn("Cleanup failed for {}", workDir, e);
        }
    }

    private ExecutionResponse.ExecutionStatus mapToStatus(int exitCode, boolean timeout) {
        if (timeout) return ExecutionResponse.ExecutionStatus.TIMEOUT;
        if (exitCode != 0) return ExecutionResponse.ExecutionStatus.RUNTIME_ERROR;
        return ExecutionResponse.ExecutionStatus.SUCCESS;
    }

    @lombok.Data
    @lombok.Builder
    private static class ExecutionResult {
        private int exitCode;
        private boolean timeout;
        private String output;
        private int memoryUsed;
        private String error;
    }
}
```

### Controller with Rate Limiting

```java
package com.learningplatform.controller;

import com.learningplatform.model.dto.ExecutionRequest;
import com.learningplatform.model.dto.ExecutionResponse;
import com.learningplatform.service.CodeExecutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping
    public ResponseEntity<ExecutionResponse> execute(
            @Valid @RequestBody ExecutionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Add user context for rate limiting
        String userId = userDetails != null ? userDetails.getUsername() : "anonymous";
        
        ExecutionResponse response = codeExecutionService.execute(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/languages")
    public ResponseEntity<?> getSupportedLanguages() {
        return ResponseEntity.ok(java.util.List.of(
                java.util.Map.of(
                        "id", "python3",
                        "name", "Python",
                        "version", "3.11"
                ),
                java.util.Map.of(
                        "id", "node",
                        "name", "JavaScript", 
                        "version", "20"
                ),
                java.util.Map.of(
                        "id", "java",
                        "name", "Java",
                        "version", "17"
                ),
                java.util.Map.of(
                        "id", "sqlite3",
                        "name", "SQL",
                        "version", "3"
                )
        ));
    }
}
```

## Security Summary

| Layer | Protection |
|-------|------------|
| **Input Validation** | Size limits, language whitelist, pattern matching |
| **Rate Limiting** | Redis-based, 10 requests/minute per user |
| **Process Isolation** | Ephemeral containers, no network access |
| **Resource Limits** | CPU (1 core), Memory (256MB), Time (10s) |
| **Output Sanitization** | Truncation, path removal, error filtering |
| **Filesystem** | Read-only root, tmpfs only, automatic cleanup |

## Deployment

```bash
# Build images
docker build -t learning-platform/executor:python -f Dockerfile.python .
docker build -t learning-platform/executor:node -f Dockerfile.node .
docker build -t learning-platform/executor:java -f Dockerfile.java .

# Deploy to swarm
docker stack deploy -c docker-compose.execution.yml learning-exec

# Scale workers
docker service scale learning-exec_executor-python=5
docker service scale learning-exec_executor-node=5
```
