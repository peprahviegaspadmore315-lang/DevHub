package com.learningplatform.controller;

import com.learningplatform.model.dto.UpdateProfileRequest;
import com.learningplatform.model.dto.UserProfileDTO;
import com.learningplatform.service.AuthService;
import com.learningplatform.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final AuthService authService;

    /**
     * Get current user's profile
     */
    @GetMapping
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(userProfileService.getUserProfile(user.getId()));
    }

    /**
     * Get any user's profile by username (public)
     */
    @GetMapping("/u/{username}")
    public ResponseEntity<UserProfileDTO> getUserProfileByUsername(
            @PathVariable String username) {
        
        return ResponseEntity.ok(userProfileService.getUserProfileByUsername(username));
    }

    /**
     * Update current user's profile
     */
    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(userProfileService.updateProfile(user.getId(), request));
    }

    /**
     * Update user's avatar
     */
    @PatchMapping("/avatar")
    public ResponseEntity<UserProfileDTO> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AvatarUpdateRequest request) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(userProfileService.updateAvatar(user.getId(), request.avatarUrl()));
    }

    /**
     * Change password
     */
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        userProfileService.changePassword(user.getId(), request.currentPassword(), request.newPassword());
        return ResponseEntity.ok().build();
    }

    /**
     * Request DTO for avatar update
     */
    public record AvatarUpdateRequest(String avatarUrl) {}

    /**
     * Request DTO for password change
     */
    public record ChangePasswordRequest(String currentPassword, String newPassword) {}
}
