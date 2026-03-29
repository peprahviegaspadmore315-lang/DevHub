package com.learningplatform.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.access-token-expiration}")
    private Long accessTokenExpiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = resolveSecretKeyBytes(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] resolveSecretKeyBytes(String rawSecret) {
        String normalizedSecret = rawSecret != null ? rawSecret.trim() : "";

        if (normalizedSecret.isEmpty()) {
            throw new IllegalStateException("JWT secret cannot be blank");
        }

        try {
            byte[] decodedSecret = Decoders.BASE64.decode(normalizedSecret);
            if (decodedSecret.length >= 32) {
                return decodedSecret;
            }
        } catch (RuntimeException ignored) {
            // Fall back to treating the configured secret as plain text.
        }

        byte[] plainTextSecret = normalizedSecret.getBytes(StandardCharsets.UTF_8);
        if (plainTextSecret.length >= 32) {
            return plainTextSecret;
        }

        try {
            return MessageDigest.getInstance("SHA-256").digest(plainTextSecret);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to derive a secure JWT signing key", ex);
        }
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
