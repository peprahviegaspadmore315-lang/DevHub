package com.learningplatform.service.ai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AIProviderReply {
    private String content;
    private String generatedImageUrl;
    private String provider;
    private String providerLabel;
    private String source;
    private String sourceLabel;
    private boolean live;
    private String statusMessage;
}
