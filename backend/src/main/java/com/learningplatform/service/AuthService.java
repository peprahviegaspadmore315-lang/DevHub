package com.learningplatform.service;

import com.learningplatform.model.dto.AuthResponse;
import com.learningplatform.model.dto.LoginRequest;
import com.learningplatform.model.dto.PasswordResetInitiateResponse;
import com.learningplatform.model.dto.PasswordResetVerifyResponse;
import com.learningplatform.model.dto.RegisterRequest;
import com.learningplatform.model.dto.UserDTO;
import com.learningplatform.model.entity.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(Long userId);
    User getCurrentUser(String email);
    PasswordResetInitiateResponse sendPasswordResetEmail(String email, String requestOrigin);
    PasswordResetVerifyResponse verifyPasswordResetCode(String email, String code);
    void resetPassword(String email, String code, String newPassword);
    AuthResponse handleGoogleOAuth(String code);
    AuthResponse handleGitHubOAuth(String code);
    AuthResponse biometricAuth(String deviceId, String signature, String email);
}
