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
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class DockerCodeExecutionService implements CodeExecutionService {

    private final CodeExecutionProperties config;
    private final CodeSecurityScanner securityScanner;
    private final ExecutorService executor = Executors.newFixedThreadPool(4);
    private static final Pattern JAVA_CLASS_PATTERN = Pattern.compile("public\\s+class\\s+(\\w+)");

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
            CodeRunResponse localExecution = executeLocally(request, startTime);
            if (localExecution != null) {
                return localExecution;
            }

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
            
            ProcessBuilder builder = buildShellProcessBuilder(dockerCommand);
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
            case SQL -> "-- SQL execution requires Docker or the local SQL fallback";
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

    private CodeRunResponse executeLocally(CodeRunRequest request, long startTime) {
        return switch (request.getLanguage()) {
            case JAVASCRIPT -> executeLocalScript(request, startTime, "main.js", new String[]{"node", "main.js"});
            case PYTHON -> executeLocalScript(request, startTime, "main.py", new String[]{"python", "main.py"});
            case JAVA -> executeLocalJava(request, startTime);
            case SQL -> executeLocalSql(request, startTime);
            default -> null;
        };
    }

    private CodeRunResponse executeLocalScript(
            CodeRunRequest request,
            long startTime,
            String fileName,
            String[] command
    ) {
        if (!isCommandAvailable(command[0])) {
            return null;
        }

        Path workDir = Path.of(config.getWorkspacePath(), "local-" + UUID.randomUUID().toString().substring(0, 8));

        try {
            Files.createDirectories(workDir);
            Files.writeString(workDir.resolve(fileName), request.getCode());

            LocalCommandResult result = runLocalCommand(command, workDir, request.getTimeoutSeconds());
            cleanupWorkDir(workDir);

            if (!result.finished()) {
                return CodeRunResponse.timeout(request.getLanguage().getName());
            }

            if (result.exitCode() != 0) {
                return CodeRunResponse.builder()
                        .success(false)
                        .output(truncateOutput(result.output()))
                        .error("Execution failed with exit code: " + result.exitCode())
                        .executionTimeMs(System.currentTimeMillis() - startTime)
                        .exitCode(result.exitCode())
                        .language(request.getLanguage().getName())
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
            }

            return CodeRunResponse.success(
                    truncateOutput(result.output()),
                    System.currentTimeMillis() - startTime,
                    result.exitCode(),
                    request.getLanguage().getName()
            );
        } catch (Exception e) {
            cleanupWorkDir(workDir);
            return CodeRunResponse.error(e.getMessage(), request.getLanguage().getName());
        }
    }

    private CodeRunResponse executeLocalJava(CodeRunRequest request, long startTime) {
        if (!isCommandAvailable("javac") || !isCommandAvailable("java")) {
            return null;
        }

        String className = extractJavaClassName(request.getCode());
        String fileName = className + ".java";
        Path workDir = Path.of(config.getWorkspacePath(), "local-" + UUID.randomUUID().toString().substring(0, 8));

        try {
            Files.createDirectories(workDir);
            Files.writeString(workDir.resolve(fileName), request.getCode());

            LocalCommandResult compileResult = runLocalCommand(
                    new String[]{"javac", fileName},
                    workDir,
                    request.getTimeoutSeconds()
            );

            if (!compileResult.finished()) {
                cleanupWorkDir(workDir);
                return CodeRunResponse.timeout(request.getLanguage().getName());
            }

            if (compileResult.exitCode() != 0) {
                cleanupWorkDir(workDir);
                return CodeRunResponse.builder()
                        .success(false)
                        .output(truncateOutput(compileResult.output()))
                        .error("Java compilation failed.")
                        .executionTimeMs(System.currentTimeMillis() - startTime)
                        .exitCode(compileResult.exitCode())
                        .language(request.getLanguage().getName())
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
            }

            LocalCommandResult runResult = runLocalCommand(
                    new String[]{"java", "-cp", workDir.toString(), className},
                    workDir,
                    request.getTimeoutSeconds()
            );
            cleanupWorkDir(workDir);

            if (!runResult.finished()) {
                return CodeRunResponse.timeout(request.getLanguage().getName());
            }

            if (runResult.exitCode() != 0) {
                return CodeRunResponse.builder()
                        .success(false)
                        .output(truncateOutput(runResult.output()))
                        .error("Java execution failed.")
                        .executionTimeMs(System.currentTimeMillis() - startTime)
                        .exitCode(runResult.exitCode())
                        .language(request.getLanguage().getName())
                        .timestamp(java.time.LocalDateTime.now())
                        .build();
            }

            return CodeRunResponse.success(
                    truncateOutput(runResult.output()),
                    System.currentTimeMillis() - startTime,
                    runResult.exitCode(),
                    request.getLanguage().getName()
            );
        } catch (Exception e) {
            cleanupWorkDir(workDir);
            return CodeRunResponse.error(e.getMessage(), request.getLanguage().getName());
        }
    }

    private CodeRunResponse executeLocalSql(CodeRunRequest request, long startTime) {
        String databaseName = "devhub_" + UUID.randomUUID().toString().replace("-", "");

        try (Connection connection = DriverManager.getConnection("jdbc:h2:mem:" + databaseName + ";DB_CLOSE_DELAY=-1")) {
            StringBuilder output = new StringBuilder();

            for (String statementText : splitSqlStatements(request.getCode())) {
                if (statementText.isBlank()) {
                    continue;
                }

                try (var statement = connection.createStatement()) {
                    boolean hasResults = statement.execute(statementText);
                    output.append("SQL> ").append(statementText.trim()).append("\n");

                    if (hasResults) {
                        try (ResultSet resultSet = statement.getResultSet()) {
                            appendResultSet(output, resultSet);
                        }
                    } else {
                        output.append("Updated rows: ").append(Math.max(statement.getUpdateCount(), 0)).append("\n");
                    }

                    output.append("\n");
                }
            }

            String finalOutput = output.toString().trim();
            return CodeRunResponse.success(
                    truncateOutput(finalOutput.isEmpty() ? "SQL executed successfully." : finalOutput),
                    System.currentTimeMillis() - startTime,
                    0,
                    request.getLanguage().getName()
            );
        } catch (SQLException e) {
            return CodeRunResponse.error(e.getMessage(), request.getLanguage().getName());
        }
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

    private ProcessBuilder buildShellProcessBuilder(String command) {
        if (isWindows()) {
            return new ProcessBuilder("cmd.exe", "/c", command);
        }

        return new ProcessBuilder("/bin/sh", "-c", command);
    }

    private LocalCommandResult runLocalCommand(String[] command, Path workDir, Long timeoutSeconds) throws Exception {
        ProcessBuilder builder = new ProcessBuilder(command);
        builder.directory(workDir.toFile());
        builder.redirectErrorStream(true);

        Process process = builder.start();
        long timeoutMs = timeoutSeconds != null
                ? timeoutSeconds * 1000
                : config.getLimits().getTimeoutSeconds() * 1000L;

        Future<String> outputFuture = executor.submit(() -> readStream(process.getInputStream()));
        boolean finished = process.waitFor(timeoutMs, TimeUnit.MILLISECONDS);

        if (!finished) {
            process.destroyForcibly();
            return new LocalCommandResult(false, -1, "Execution timed out.");
        }

        String output = outputFuture.get(1, TimeUnit.SECONDS);
        return new LocalCommandResult(true, process.exitValue(), output);
    }

    private boolean isCommandAvailable(String command) {
        try {
            Process process = isWindows()
                    ? new ProcessBuilder("where", command).redirectErrorStream(true).start()
                    : new ProcessBuilder("which", command).redirectErrorStream(true).start();

            return process.waitFor(3, TimeUnit.SECONDS) && process.exitValue() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isWindows() {
        return System.getProperty("os.name", "").toLowerCase().contains("win");
    }

    private String extractJavaClassName(String code) {
        Matcher matcher = JAVA_CLASS_PATTERN.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }

        return "Main";
    }

    private String[] splitSqlStatements(String sql) {
        return sql.split(";\\s*(?:\\r?\\n|$)");
    }

    private void appendResultSet(StringBuilder output, ResultSet resultSet) throws SQLException {
        ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();

        for (int index = 1; index <= columnCount; index++) {
            output.append(metaData.getColumnLabel(index));
            if (index < columnCount) {
                output.append(" | ");
            }
        }
        output.append("\n");

        while (resultSet.next()) {
            for (int index = 1; index <= columnCount; index++) {
                output.append(resultSet.getString(index));
                if (index < columnCount) {
                    output.append(" | ");
                }
            }
            output.append("\n");
        }
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

    private void cleanupWorkDir(Path workDir) {
        try {
            Files.walk(workDir)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                        }
                    });
        } catch (IOException ignored) {
        }
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

    private record LocalCommandResult(boolean finished, int exitCode, String output) {}
}
