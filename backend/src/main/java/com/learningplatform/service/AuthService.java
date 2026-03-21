package com.learningplatform.service;

import com.learningplatform.model.dto.AuthResponse;
import com.learningplatform.model.dto.LoginRequest;
import com.learningplatform.model.dto.RegisterRequest;
import com.learningplatform.model.dto.UserDTO;
import com.learningplatform.model.entity.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(Long userId);
    User getCurrentUser(String email);
}
