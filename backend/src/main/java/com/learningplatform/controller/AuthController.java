package com.learningplatform.controller;

import com.learningplatform.exception.UnauthorizedException;
import com.learningplatform.model.dto.*;
import com.learningplatform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new UnauthorizedException("Authentication required");
        }

        com.learningplatform.model.entity.User user = authService.getCurrentUser(userDetails.getUsername());
        authService.logout(user.getId());
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new UnauthorizedException("Authentication required");
        }

        com.learningplatform.model.entity.User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(mapToDTO(user));
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetInitiateResponse> forgotPassword(
            @RequestBody PasswordResetRequest request,
            @RequestHeader(value = "Origin", required = false) String origin
    ) {
        return ResponseEntity.ok(authService.sendPasswordResetEmail(request.getEmail(), origin));
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<PasswordResetVerifyResponse> verifyResetCode(@RequestBody PasswordResetVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyPasswordResetCode(request.getEmail(), request.getCode()));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordResetConfirmRequest request) {
        authService.resetPassword(request.getEmail(), request.getCode(), request.getNewPassword());
        return ResponseEntity.ok(Map.of(
            "message", "Password reset successfully",
            "success", "true"
        ));
    }
    
    @GetMapping("/oauth/google")
    public ResponseEntity<Map<String, String>> googleAuth() {
        return ResponseEntity.ok(Map.of(
            "url", "/api/auth/oauth/google/authorize",
            "message", "Redirecting to Google OAuth"
        ));
    }
    
    @GetMapping("/oauth/google/authorize")
    public ResponseEntity<AuthResponse> googleCallback(@RequestParam String code) {
        AuthResponse response = authService.handleGoogleOAuth(code);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/oauth/github")
    public ResponseEntity<Map<String, String>> githubAuth() {
        return ResponseEntity.ok(Map.of(
            "url", "/api/auth/oauth/github/authorize",
            "message", "Redirecting to GitHub OAuth"
        ));
    }
    
    @GetMapping("/oauth/github/authorize")
    public ResponseEntity<AuthResponse> githubCallback(@RequestParam String code) {
        AuthResponse response = authService.handleGitHubOAuth(code);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/biometric")
    public ResponseEntity<AuthResponse> biometricLogin(@RequestBody Map<String, String> request) {
        String deviceId = request.get("deviceId");
        String biometricSignature = request.get("signature");
        String email = request.get("email");
        AuthResponse response = authService.biometricAuth(deviceId, biometricSignature, email);
        return ResponseEntity.ok(response);
    }
    
    private UserDTO mapToDTO(com.learningplatform.model.entity.User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
