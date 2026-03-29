package com.learningplatform.repository;

import com.learningplatform.model.entity.User;
import com.learningplatform.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE TRIM(u.username) = :username")
    Optional<User> findByNormalizedUsername(@Param("username") String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE TRIM(u.username) = :username")
    boolean existsByNormalizedUsername(@Param("username") String username);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByIsActiveTrue();

    long countByIsActiveTrue();
}
