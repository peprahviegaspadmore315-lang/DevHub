package com.learningplatform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@Slf4j
public class CodeSecurityScanner {
    
    private static final List<Threat> THREATS = List.of(
        new Threat("SHELL_INJECTION", "Shell command injection", 
            Pattern.compile("(?i)(`[^`]*`|\\$\\([^)]*\\))")),
        new Threat("SYSTEM_EXEC", "System command execution",
            Pattern.compile("(?i)(Runtime\\.getRuntime|ProcessBuilder|system\\(|exec\\(|child_process)")),
        new Threat("FILE_ACCESS", "File system access",
            Pattern.compile("(?i)(FileInputStream|FileOutputStream|FileReader|FileWriter|fopen|fwrite|fs\\.(readFile|writeFile|unlink))")),
        new Threat("NETWORK_ACCESS", "Network access attempt",
            Pattern.compile("(?i)(http\\.request|socket|URLConnection|InetAddress|requests\\.|urllib|http\\.client)")),
        new Threat("EVAL_USAGE", "Dangerous eval usage",
            Pattern.compile("(?i)\\beval\\s*\\(")),
        new Threat("CRYPTO_MINING", "Potential crypto mining",
            Pattern.compile("(?i)(miner|mining|cryptonight|stratum|coinhive)")),
        new Threat("ENV_ACCESS", "Environment variable access",
            Pattern.compile("(?i)(process\\.env|getenv|System\\.getenv|os\\.environ)")),
        new Threat("PROCESS_KILL", "Process manipulation",
            Pattern.compile("(?i)(process\\.kill|process\\.exit|exit\\(|sys\\.exit|os\\._exit)"))
    );
    
    private static final List<Threat> BLOCKED_THREATS = List.of(
        new Threat("COMMAND_EXEC", "Direct system command execution", null),
        new Threat("CRYPTO_MINING", "Cryptocurrency mining", null)
    );
    
    public record ThreatResult(String type, String description, String matchedText) {}
    
    public List<ThreatResult> scan(String code) {
        List<ThreatResult> results = new ArrayList<>();
        
        for (Threat threat : THREATS) {
            var matcher = threat.pattern.matcher(code);
            while (matcher.find()) {
                String match = matcher.group();
                if (match.length() >= 3) {
                    results.add(new ThreatResult(threat.type, threat.description, truncate(match)));
                }
            }
        }
        
        return results;
    }
    
    public boolean isBlocked(List<ThreatResult> threats) {
        return threats.stream()
                .anyMatch(t -> BLOCKED_THREATS.stream()
                        .anyMatch(b -> b.type().equals(t.type())));
    }
    
    public String getBlockReason(List<ThreatResult> threats) {
        return threats.stream()
                .filter(t -> BLOCKED_THREATS.stream()
                        .anyMatch(b -> b.type().equals(t.type())))
                .map(ThreatResult::description)
                .findFirst()
                .orElse(null);
    }
    
    private String truncate(String text) {
        return text.length() > 50 ? text.substring(0, 50) + "..." : text;
    }
    
    private record Threat(String type, String description, Pattern pattern) {}
}
