package com.learningplatform.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetInitiateResponse {
    private String message;
    private boolean success;
    private boolean codeSent;
    private String resetUrl;
    private boolean preview;
    private String previewCode;
    private LocalDateTime expiresAt;
}
