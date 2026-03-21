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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return mapToUserProfileDTO(user);
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate username uniqueness if being changed
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username already exists");
            }
            user.setUsername(request.getUsername());
        }

        // Update fields if provided
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
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
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
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
}
