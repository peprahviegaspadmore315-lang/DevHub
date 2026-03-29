package com.learningplatform.repository;

import com.learningplatform.model.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser_IdAndToken(Long userId, String token);
    Optional<PasswordResetToken> findFirstByUser_IdAndUsedAtIsNullOrderByCreatedAtDesc(Long userId);
    void deleteAllByUser_Id(Long userId);
}
