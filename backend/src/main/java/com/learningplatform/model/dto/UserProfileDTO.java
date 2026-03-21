package com.learningplatform.model.dto;

import com.learningplatform.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String bio;
    private UserRole role;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    
    // Statistics
    private Integer coursesEnrolled;
    private Integer coursesCompleted;
    private Integer exercisesCompleted;
    private Integer quizzesCompleted;
    private Integer totalPointsEarned;
    
    // Computed full name
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return firstName != null ? firstName : (lastName != null ? lastName : username);
    }
}
