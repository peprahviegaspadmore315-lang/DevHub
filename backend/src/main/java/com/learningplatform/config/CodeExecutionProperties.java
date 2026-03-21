package com.learningplatform.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.code-execution")
@Validated
public class CodeExecutionProperties {
    
    @Data
    public static class Docker {
        private boolean enabled = true;
        private String socketPath = "unix:///var/run/docker.sock";
        private long containerTimeoutMs = 15000;
    }
    
    @Data
    public static class Limits {
        private int timeoutSeconds = 10;
        private int maxMemoryMb = 256;
        private int maxOutputBytes = 65536;
        private int maxCodeBytes = 102400;
    }
    
    @Data
    public static class Security {
        private boolean enabled = true;
        private boolean blockNetwork = true;
        private boolean blockFileSystem = true;
        private boolean blockSystemCommands = true;
    }
    
    private Docker docker = new Docker();
    private Limits limits = new Limits();
    private Security security = new Security();
    private String workspacePath = "/tmp/code-execution";
}
