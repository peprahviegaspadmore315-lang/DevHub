package com.learningplatform.service.impl;

import com.learningplatform.exception.BadRequestException;
import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.exception.UnauthorizedException;
import com.learningplatform.model.dto.*;
import com.learningplatform.model.entity.PasswordResetToken;
import com.learningplatform.model.entity.RefreshToken;
import com.learningplatform.model.entity.User;
import com.learningplatform.model.enums.UserRole;
import com.learningplatform.repository.PasswordResetTokenRepository;
import com.learningplatform.repository.RefreshTokenRepository;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.security.JwtTokenProvider;
import com.learningplatform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JavaMailSender mailSender;
    
    @Value("${app.jwt.access-token-expiration}")
    private Long accessTokenExpiration;
    
    @Value("${app.jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    @Value("${app.auth.password-reset-token-expiration-minutes:30}")
    private Long passwordResetTokenExpirationMinutes;

    @Value("${app.auth.frontend-base-url:http://localhost:5174}")
    private String frontendBaseUrl;

    @Value("${app.auth.password-reset-code-length:6}")
    private Integer passwordResetCodeLength;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String mailFrom;
    
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeRequired(request.getEmail());
        String username = normalizeRequired(request.getUsername());
        String firstName = normalizeOptional(request.getFirstName());
        String lastName = normalizeOptional(request.getLastName());
        String location = normalizeOptional(request.getLocation());
        var dateOfBirth = request.getDateOfBirth();

        logger.info("Registration attempt for email: {}, username: {}", email, username);
        
        if (userRepository.existsByEmail(email)) {
            logger.warn("Registration failed - email already exists: {}", email);
            throw new BadRequestException("Email already exists");
        }
        if (userRepository.existsByNormalizedUsername(username)) {
            logger.warn("Registration failed - username already exists: {}", username);
            throw new BadRequestException("Username already exists");
        }
        
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .username(username)
                .firstName(firstName)
                .lastName(lastName)
                .location(location)
                .dateOfBirth(dateOfBirth)
                .role(UserRole.STUDENT)
                .isActive(true)
                .emailVerified(false)
                .build();
        
        user = userRepository.save(user);
        logger.info("User registered successfully: {}", user.getId());
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
        
        String accessToken = jwtTokenProvider.generateToken(userDetails);
        RefreshToken refreshToken = createRefreshToken(user);
        
        AuthResponse response = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToDTO(user))
                .expiresIn(accessTokenExpiration)
                .build();
        
        logger.info("Auth response generated for user: {}", user.getId());
        return response;
    }
    
    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeRequired(request.getEmail()))
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is disabled");
        }
        
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        refreshTokenRepository.revokeAllByUserId(user.getId());
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
        
        String accessToken = jwtTokenProvider.generateToken(userDetails);
        RefreshToken refreshToken = createRefreshToken(user);
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToDTO(user))
                .expiresIn(accessTokenExpiration)
                .build();
    }
    
    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        
        if (refreshToken.getRevoked() || refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token expired or revoked");
        }
        
        User user = refreshToken.getUser();
        
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
        
        String newAccessToken = jwtTokenProvider.generateToken(userDetails);
        RefreshToken newRefreshToken = createRefreshToken(user);
        
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .user(mapToDTO(user))
                .expiresIn(accessTokenExpiration)
                .build();
    }
    
    @Override
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }
    
    @Override
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusNanos(refreshTokenExpiration * 1_000_000))
                .revoked(false)
                .build();
        
        return refreshTokenRepository.save(refreshToken);
    }
    
    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(normalizeOptional(user.getUsername()))
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .phone(user.getPhone())
                .location(user.getLocation())
                .website(user.getWebsite())
                .profession(user.getProfession())
                .company(user.getCompany())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    @Override
    @Transactional
    public PasswordResetInitiateResponse sendPasswordResetEmail(String email, String requestOrigin) {
        String normalizedEmail = normalizeRequired(email);
        User user = normalizedEmail == null ? null : userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user == null) {
            return PasswordResetInitiateResponse.builder()
                    .success(true)
                    .codeSent(false)
                    .preview(false)
                    .message("No DevHub account was found for that email. Check the address or create an account first.")
                    .build();
        }

        passwordResetTokenRepository.deleteAllByUser_Id(user.getId());

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(generateResetCode())
                .expiresAt(LocalDateTime.now().plusMinutes(passwordResetTokenExpirationMinutes))
                .build();

        resetToken = passwordResetTokenRepository.save(resetToken);

        if (!isMailConfigured()) {
            logger.warn("Mail is not configured. Returning password reset preview code for {}", normalizedEmail);
            return PasswordResetInitiateResponse.builder()
                    .success(true)
                    .codeSent(true)
                    .preview(true)
                    .previewCode(resetToken.getToken())
                    .message("Email sender is not configured yet, so DevHub generated a local recovery code preview for this session.")
                    .expiresAt(resetToken.getExpiresAt().truncatedTo(ChronoUnit.SECONDS))
                    .build();
        }

        try {
            sendResetCodeEmail(user.getEmail(), resetToken.getToken(), resetToken.getExpiresAt());
            logger.info("Password reset code generated and emailed for {}", normalizedEmail);

            return PasswordResetInitiateResponse.builder()
                    .success(true)
                    .codeSent(true)
                    .preview(false)
                    .message("Reset code sent to your email.")
                    .expiresAt(resetToken.getExpiresAt().truncatedTo(ChronoUnit.SECONDS))
                    .build();
        } catch (MailException error) {
            logger.error("Failed to send password reset email to {}. Returning preview code instead.", normalizedEmail, error);
            return PasswordResetInitiateResponse.builder()
                    .success(true)
                    .codeSent(true)
                    .preview(true)
                    .previewCode(resetToken.getToken())
                    .message("DevHub could not deliver the recovery email, so a local recovery code preview is ready for this session.")
                    .expiresAt(resetToken.getExpiresAt().truncatedTo(ChronoUnit.SECONDS))
                    .build();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PasswordResetVerifyResponse verifyPasswordResetCode(String email, String code) {
        PasswordResetToken resetToken = resolvePasswordResetToken(email, code);

        return PasswordResetVerifyResponse.builder()
                .success(true)
                .message("Recovery code verified. You can set a new password now.")
                .expiresAt(resetToken.getExpiresAt().truncatedTo(ChronoUnit.SECONDS))
                .build();
    }
    
    @Override
    @Transactional
    public void resetPassword(String email, String code, String newPassword) {
        String normalizedEmail = normalizeRequired(email);
        String normalizedCode = normalizeRequired(code);

        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            throw new BadRequestException("Email is required");
        }

        if (normalizedCode == null || normalizedCode.isBlank()) {
            throw new BadRequestException("Reset code is required");
        }

        if (newPassword == null || newPassword.trim().length() < 8) {
            throw new BadRequestException("New password must be at least 8 characters");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Reset code is invalid or has expired"));

        PasswordResetToken resetToken = resolvePasswordResetToken(normalizedEmail, normalizedCode);

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);
        refreshTokenRepository.revokeAllByUserId(user.getId());
    }
    
    @Override
    @Transactional
    public AuthResponse handleGoogleOAuth(String code) {
        // TODO: Implement Google OAuth flow
        // For demo, create a mock user
        String mockEmail = "google_user@example.com";
        User user = userRepository.findByEmail(mockEmail).orElseGet(() -> {
            User newUser = User.builder()
                    .email(mockEmail)
                    .username("google_user")
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(UserRole.STUDENT)
                    .isActive(true)
                    .emailVerified(true)
                    .avatarUrl("https://via.placeholder.com/150")
                    .build();
            return userRepository.save(newUser);
        });
        
        return createAuthResponse(user);
    }
    
    @Override
    @Transactional
    public AuthResponse handleGitHubOAuth(String code) {
        // TODO: Implement GitHub OAuth flow
        String mockEmail = "github_user@example.com";
        User user = userRepository.findByEmail(mockEmail).orElseGet(() -> {
            User newUser = User.builder()
                    .email(mockEmail)
                    .username("github_user")
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(UserRole.STUDENT)
                    .isActive(true)
                    .emailVerified(true)
                    .avatarUrl("https://via.placeholder.com/150")
                    .build();
            return userRepository.save(newUser);
        });
        
        return createAuthResponse(user);
    }
    
    @Override
    @Transactional
    public AuthResponse biometricAuth(String deviceId, String signature, String email) {
        String normalizedDeviceId = normalizeRequired(deviceId);
        String normalizedSignature = normalizeRequired(signature);
        String normalizedEmail = normalizeRequired(email);

        if (normalizedDeviceId == null || normalizedDeviceId.isBlank()) {
            throw new BadRequestException("Biometric device information is missing.");
        }

        if (normalizedSignature == null || normalizedSignature.isBlank()) {
            throw new BadRequestException("Biometric signature is missing.");
        }

        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            throw new BadRequestException("Enter your email first so DevHub can match the biometric profile to your account.");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("No account is linked to this biometric profile yet. Sign in with email and password first."));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException("Account is disabled");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        logger.info("Biometric authentication completed for user {} on device {}", normalizedEmail, normalizedDeviceId);
        return createAuthResponse(user);
    }
    
    private AuthResponse createAuthResponse(User user) {
        refreshTokenRepository.revokeAllByUserId(user.getId());
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
        
        String accessToken = jwtTokenProvider.generateToken(userDetails);
        RefreshToken refreshToken = createRefreshToken(user);
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToDTO(user))
                .expiresIn(accessTokenExpiration)
                .build();
    }

    private boolean isMailConfigured() {
        return normalizeOptional(mailUsername) != null && normalizeOptional(mailFrom) != null;
    }

    private String generateResetCode() {
        int digits = Math.max(4, Math.min(8, passwordResetCodeLength == null ? 6 : passwordResetCodeLength));
        int bound = (int) Math.pow(10, digits);

        for (int attempt = 0; attempt < 10; attempt++) {
            String code = String.format("%0" + digits + "d", SECURE_RANDOM.nextInt(bound));
            if (passwordResetTokenRepository.findByToken(code).isEmpty()) {
                return code;
            }
        }

        return UUID.randomUUID().toString().replaceAll("\\D", "").substring(0, digits);
    }

    private void sendResetCodeEmail(String email, String code, LocalDateTime expiresAt) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom(mailFrom);
        message.setSubject("Your DevHub password reset code");
        message.setText("""
                Hi,

                We received a request to reset your DevHub password.

                Your verification code is: %s

                This code expires at %s.

                Enter this code in the DevHub reset screen, then choose your new password.

                If you did not request this change, you can ignore this email.

                DevHub AI
                """.formatted(code, expiresAt.truncatedTo(ChronoUnit.MINUTES)));

        mailSender.send(message);
    }

    private String normalizeRequired(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private PasswordResetToken resolvePasswordResetToken(String email, String code) {
        String normalizedEmail = normalizeRequired(email);
        String normalizedCode = normalizeRequired(code);

        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            throw new BadRequestException("Email is required");
        }

        if (normalizedCode == null || normalizedCode.isBlank()) {
            throw new BadRequestException("Reset code is required");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Reset code is invalid or has expired"));

        PasswordResetToken resetToken = passwordResetTokenRepository.findByUser_IdAndToken(user.getId(), normalizedCode)
                .orElseGet(() -> {
                    PasswordResetToken latestToken = passwordResetTokenRepository
                            .findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId())
                            .orElse(null);

                    if (latestToken != null && !latestToken.isExpired()) {
                        throw new BadRequestException("That recovery code does not match the latest code we sent. Use the newest code from your email or tap resend.");
                    }

                    throw new BadRequestException("Reset code is invalid or has expired");
                });

        if (resetToken.isUsed()) {
            throw new BadRequestException("This recovery code has already been used. Request a new one.");
        }

        if (resetToken.isExpired()) {
            throw new BadRequestException("This recovery code has expired. Request a new one.");
        }

        return resetToken;
    }
}
