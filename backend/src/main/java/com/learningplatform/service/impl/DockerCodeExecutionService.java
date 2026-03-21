package com.learningplatform.service.impl;

import com.learningplatform.config.CodeExecutionProperties;
import com.learningplatform.model.dto.CodeRunRequest;
import com.learningplatform.model.dto.CodeRunResponse;
import com.learningplatform.service.CodeExecutionService;
import com.learningplatform.service.CodeSecurityScanner;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.concurrent.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class DockerCodeExecutionService implements CodeExecutionService {

    private final CodeExecutionProperties config;
    private final CodeSecurityScanner securityScanner;
    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    @PostConstruct
    public void init() {
        try {
            Path workspace = Path.of(config.getWorkspacePath());
            if (!Files.exists(workspace)) {
                Files.createDirectories(workspace);
            }
            log.info("Code execution workspace initialized at: {}", config.getWorkspacePath());
        } catch (IOException e) {
            log.error("Failed to create workspace directory", e);
        }
    }

    @Override
    public CodeRunResponse execute(CodeRunRequest request) {
        long startTime = System.currentTimeMillis();
        String executionId = UUID.randomUUID().toString().substring(0, 8);
        
        log.debug("[{}] Executing {} code", executionId, request.getLanguage());
        
        // Security scan
        var threats = securityScanner.scan(request.getCode());
        if (securityScanner.isBlocked(threats)) {
            String reason = securityScanner.getBlockReason(threats);
            log.warn("[{}] Code blocked: {}", executionId, reason);
            return CodeRunResponse.blocked(reason);
        }
        
        // Handle languages that don't need execution
        if (!request.getLanguage().requiresExecution()) {
            return CodeRunResponse.success(
                request.getCode(),
                System.currentTimeMillis() - startTime,
                0,
                request.getLanguage().getName()
            );
        }
        
        // Check if Docker is available
        if (!isAvailable()) {
            log.warn("[{}] Docker not available, using fallback", executionId);
            return executeFallback(request, startTime);
        }
        
        return executeInDocker(request, executionId, startTime);
    }

    private CodeRunResponse executeInDocker(CodeRunRequest request, String executionId, long startTime) {
        String containerName = "learncode-" + executionId;
        Path workDir = Path.of(config.getWorkspacePath(), executionId);
        
        try {
            Files.createDirectories(workDir);
            
            String fileName = "main." + request.getLanguage().getExtension();
            Path codeFile = workDir.resolve(fileName);
            Files.writeString(codeFile, request.getCode());
            
            String dockerCommand = buildDockerCommand(request, containerName, workDir, fileName);
            
            ProcessBuilder builder = new ProcessBuilder("/bin/sh", "-c", dockerCommand);
            builder.redirectErrorStream(true);
            builder.environment().clear();
            
            Process process = builder.start();
            
            long timeoutMs = request.getTimeoutSeconds() != null 
                ? request.getTimeoutSeconds() * 1000 
                : config.getLimits().getTimeoutSeconds() * 1000L;
            
            Future<String> outputFuture = executor.submit(() -> readStream(process.getInputStream()));
            
            try {
                boolean finished = process.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
                
                if (!finished) {
                    process.destroyForcibly();
                    cleanup(containerName, workDir);
                    log.warn("[{}] Execution timed out after {}ms", executionId, timeoutMs);
                    return CodeRunResponse.timeout(request.getLanguage().getName());
                }
                
                String output = outputFuture.get(1, TimeUnit.SECONDS);
                int exitCode = process.exitValue();
                
                cleanup(containerName, workDir);
                
                long executionTime = System.currentTimeMillis() - startTime;
                
                if (exitCode != 0 && !output.isEmpty()) {
                    return CodeRunResponse.builder()
                            .success(false)
                            .output(truncateOutput(output))
                            .error("Execution failed with exit code: " + exitCode)
                            .executionTimeMs(executionTime)
                            .exitCode(exitCode)
                            .language(request.getLanguage().getName())
                            .timestamp(java.time.LocalDateTime.now())
                            .build();
                }
                
                return CodeRunResponse.success(
                    truncateOutput(output),
                    executionTime,
                    exitCode,
                    request.getLanguage().getName()
                );
                
            } catch (TimeoutException e) {
                process.destroyForcibly();
                cleanup(containerName, workDir);
                log.warn("[{}] Execution timed out", executionId);
                return CodeRunResponse.timeout(request.getLanguage().getName());
            }
            
        } catch (Exception e) {
            log.error("[{}] Execution error: {}", executionId, e.getMessage());
            cleanup(containerName, workDir);
            return CodeRunResponse.error(e.getMessage(), request.getLanguage().getName());
        }
    }

    private CodeRunResponse executeFallback(CodeRunRequest request, long startTime) {
        // Fallback for when Docker isn't available
        // Returns mock output for demonstration
        String mockOutput = switch (request.getLanguage()) {
            case JAVASCRIPT -> "// Code execution requires Docker\n// Please ensure Docker is running";
            case PYTHON -> "# Code execution requires Docker\n# Please ensure Docker is running";
            case JAVA -> "// Code execution requires Docker\n// Please ensure Docker is running";
            default -> request.getCode();
        };
        
        return CodeRunResponse.builder()
                .success(false)
                .output(mockOutput)
                .error("Docker is not available. Please start Docker to enable code execution.")
                .executionTimeMs(System.currentTimeMillis() - startTime)
                .language(request.getLanguage().getName())
                .timestamp(java.time.LocalDateTime.now())
                .build();
    }

    private String buildDockerCommand(CodeRunRequest request, String containerName, Path workDir, String fileName) {
        StringBuilder cmd = new StringBuilder();
        cmd.append("docker run --rm ");
        cmd.append("--name ").append(containerName).append(" ");
        
        // Security: Network isolation
        if (config.getSecurity().isBlockNetwork()) {
            cmd.append("--network none ");
        }
        
        // Security: Memory limit
        cmd.append("--memory=").append(config.getLimits().getMaxMemoryMb()).append("m ");
        
        // Security: Process limit
        cmd.append("--pids-limit 64 ");
        
        // Security: Read-only filesystem
        cmd.append("--read-only ");
        
        // Security: Writable /tmp only
        cmd.append("--tmpfs /tmp:rw,noexec,nosuid,size=64m ");
        
        // Security: Drop all capabilities
        cmd.append("--cap-drop=ALL ");
        
        // Security: No new privileges
        cmd.append("--security-opt=no-new-privileges ");
        
        // Non-root user
        cmd.append("--user 1000:1000 ");
        
        // Mount code as read-only
        cmd.append("-v ").append(workDir).append(":/code:ro ");
        cmd.append("-w /code ");
        
        // Add image
        String image = request.getLanguage().getDockerImage();
        cmd.append(image).append(" ");
        
        // Add execution command based on language
        cmd.append(getExecutionCommand(request.getLanguage(), fileName));
        
        return cmd.toString();
    }

    private String getExecutionCommand(CodeRunRequest.Language language, String fileName) {
        return switch (language) {
            case JAVASCRIPT -> "node /code/" + fileName;
            case PYTHON -> "python /code/" + fileName;
            case JAVA -> "sh -c 'javac /code/" + fileName + " && java -cp /code Main'";
            case SQL -> "psql -f /code/" + fileName + " -t 2>&1 || echo 'SQL execution requires database'";
            default -> "cat /code/" + fileName;
        };
    }

    private String readStream(InputStream stream) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            return sb.toString().trim();
        }
    }

    private String truncateOutput(String output) {
        int maxSize = config.getLimits().getMaxOutputBytes();
        if (output.length() > maxSize) {
            return output.substring(0, maxSize) + "\n... [Output truncated]";
        }
        return output;
    }

    private void cleanup(String containerName, Path workDir) {
        try {
            // Stop container if still running
            new ProcessBuilder("docker", "stop", containerName)
                    .redirectErrorStream(true)
                    .start()
                    .waitFor(2, TimeUnit.SECONDS);
        } catch (Exception ignored) {}
        
        // Delete work directory
        try {
            Files.walk(workDir)
                .sorted((a, b) -> b.compareTo(a))
                .forEach(p -> {
                    try { Files.deleteIfExists(p); } 
                    catch (IOException ignored) {}
                });
        } catch (IOException ignored) {}
    }

    @Override
    public boolean isAvailable() {
        if (!config.getDocker().isEnabled()) {
            return false;
        }
        try {
            Process process = new ProcessBuilder("docker", "info")
                    .redirectErrorStream(true)
                    .start();
            boolean available = process.waitFor(3, TimeUnit.SECONDS) && process.exitValue() == 0;
            log.debug("Docker availability: {}", available);
            return available;
        } catch (Exception e) {
            log.debug("Docker not available: {}", e.getMessage());
            return false;
        }
    }
}
