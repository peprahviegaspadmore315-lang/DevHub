package com.learningplatform.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.execution")
@Validated
public class CodeExecutionConfig {
    
    private int timeoutSeconds = 10;
    
    private int maxMemoryMb = 256;
    
    private int maxOutputSizeBytes = 65536;
    
    private String workspacePath = "/tmp/execution";
    
    private DockerConfig docker = new DockerConfig();
    
    private SecurityConfig security = new SecurityConfig();
    
    @Data
    public static class DockerConfig {
        private boolean enabled = true;
        private String host = "unix:///var/run/docker.sock";
        private String network = "none";
        private long containerTimeoutMs = 15000;
    }
    
    @Data
    public static class SecurityConfig {
        private boolean scanForMaliciousCode = true;
        private int maxFileSizeBytes = 102400;
        private boolean blockSystemCalls = true;
        private boolean blockNetworkAccess = true;
        private boolean blockFileSystemAccess = true;
        private boolean blockProcessSpawning = true;
    }
}
