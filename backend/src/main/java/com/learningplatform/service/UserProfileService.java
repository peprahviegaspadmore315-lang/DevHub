package com.learningplatform.service;

import com.learningplatform.model.dto.UpdateProfileRequest;
import com.learningplatform.model.dto.UserProfileDTO;

public interface UserProfileService {
    
    /**
     * Get user profile by ID
     * @param userId The user's ID
     * @return UserProfileDTO with user data and statistics
     */
    UserProfileDTO getUserProfile(Long userId);
    
    /**
     * Get user profile by username
     * @param username The user's username
     * @return UserProfileDTO with user data and statistics
     */
    UserProfileDTO getUserProfileByUsername(String username);
    
    /**
     * Update user profile
     * @param userId The user's ID
     * @param request The update request containing new profile data
     * @return Updated UserProfileDTO
     */
    UserProfileDTO updateProfile(Long userId, UpdateProfileRequest request);
    
    /**
     * Update user's avatar URL
     * @param userId The user's ID
     * @param avatarUrl The new avatar URL
     * @return Updated UserProfileDTO
     */
    UserProfileDTO updateAvatar(Long userId, String avatarUrl);
    
    /**
     * Change user password
     * @param userId The user's ID
     * @param currentPassword The current password
     * @param newPassword The new password
     */
    void changePassword(Long userId, String currentPassword, String newPassword);
}
