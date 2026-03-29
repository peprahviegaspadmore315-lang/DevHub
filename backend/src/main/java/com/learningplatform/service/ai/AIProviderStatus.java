package com.learningplatform.service.ai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AIProviderStatus {
    private boolean enabled;
    private boolean configured;
    private boolean live;
    private String provider;
    private String providerLabel;
    private String source;
    private String sourceLabel;
    private String message;
}
