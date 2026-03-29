package com.learningplatform.service.impl;

import com.learningplatform.exception.BadRequestException;
import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.exception.UnauthorizedException;
import com.learningplatform.model.dto.UpdateProfileRequest;
import com.learningplatform.model.dto.UserProfileDTO;
import com.learningplatform.model.entity.User;
import com.learningplatform.model.entity.UserProgress;
import com.learningplatform.repository.*;
import com.learningplatform.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserProgressRepository progressRepository;
    private final ExerciseAttemptRepository exerciseAttemptRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return mapToUserProfileDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfileByUsername(String username) {
        String normalizedUsername = normalizeOptional(username);
        if (normalizedUsername == null) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = userRepository.findByNormalizedUsername(normalizedUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return mapToUserProfileDTO(user);
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        normalizeExistingUsername(user);

        String normalizedUsername = normalizeOptional(request.getUsername());

        // Validate username uniqueness if being changed
        if (normalizedUsername != null && !normalizedUsername.equals(user.getUsername())) {
            var existingUser = userRepository.findByNormalizedUsername(normalizedUsername);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                throw new BadRequestException("Username already exists");
            }
            user.setUsername(normalizedUsername);
        }

        // Update fields if provided
        if (request.getFirstName() != null) {
            user.setFirstName(normalizeOptional(request.getFirstName()));
        }
        if (request.getLastName() != null) {
            user.setLastName(normalizeOptional(request.getLastName()));
        }
        if (request.getBio() != null) {
            user.setBio(normalizeOptional(request.getBio()));
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(normalizeOptional(request.getAvatarUrl()));
        }
        if (request.getPhone() != null) {
            user.setPhone(normalizeOptional(request.getPhone()));
        }
        if (request.getLocation() != null) {
            user.setLocation(normalizeOptional(request.getLocation()));
        }
        if (request.getWebsite() != null) {
            user.setWebsite(normalizeWebsite(request.getWebsite()));
        }
        if (request.getProfession() != null) {
            user.setProfession(normalizeOptional(request.getProfession()));
        }
        if (request.getCompany() != null) {
            user.setCompany(normalizeOptional(request.getCompany()));
        }

        user = userRepository.save(user);
        log.info("User profile updated: {}", userId);

        return mapToUserProfileDTO(user);
    }

    @Override
    @Transactional
    public UserProfileDTO updateAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setAvatarUrl(avatarUrl);
        user = userRepository.save(user);
        
        log.info("User avatar updated: {}", userId);
        return mapToUserProfileDTO(user);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        // Validate new password strength
        if (newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("Password changed for user: {}", userId);
    }

    /**
     * Maps User entity to UserProfileDTO with statistics
     */
    private UserProfileDTO mapToUserProfileDTO(User user) {
        // Calculate statistics
        Long coursesEnrolled = enrollmentRepository.countByUserId(user.getId());
        int coursesCompleted = enrollmentRepository.countByUserIdAndCompletionPercentage(user.getId(), 100.0);
        
        // Get completed lessons count
        List<UserProgress> completedLessons = progressRepository
                .findByUserIdAndStatus(user.getId(), com.learningplatform.model.enums.ProgressStatus.COMPLETED);
        int exercisesCompleted = exerciseAttemptRepository.countByUserIdAndIsCorrectTrue(user.getId());
        int quizzesCompleted = quizAttemptRepository.countByUserIdAndPassedTrue(user.getId());
        
        // Calculate total points (from completed exercises and quizzes)
        int totalPoints = exerciseAttemptRepository.sumPointsEarnedByUserId(user.getId());

        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(normalizeOptional(user.getUsername()))
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
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
                .coursesEnrolled(coursesEnrolled.intValue())
                .coursesCompleted(coursesCompleted)
                .exercisesCompleted(exercisesCompleted)
                .quizzesCompleted(quizzesCompleted)
                .totalPointsEarned(totalPoints)
                .build();
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeWebsite(String value) {
        String normalized = normalizeOptional(value);
        if (normalized == null) {
            return null;
        }

        if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
            return "https://" + normalized;
        }

        return normalized;
    }

    private void normalizeExistingUsername(User user) {
        String normalizedUsername = normalizeOptional(user.getUsername());
        if (normalizedUsername == null || normalizedUsername.equals(user.getUsername())) {
            return;
        }

        var existingUser = userRepository.findByNormalizedUsername(normalizedUsername);
        if (existingUser.isEmpty() || existingUser.get().getId().equals(user.getId())) {
            user.setUsername(normalizedUsername);
        }
    }
}
