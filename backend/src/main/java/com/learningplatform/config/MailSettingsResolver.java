package com.learningplatform.config;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class MailSettingsResolver {

    private static final Path SECRETS_DIRECTORY = Path.of("/etc/secrets");

    private final Environment environment;

    public MailSettingsResolver(Environment environment) {
        this.environment = environment;
    }

    public String resolveHost() {
        return firstNonBlank(
                environment.getProperty("MAIL_HOST"),
                environment.getProperty("spring.mail.host"),
                readSecret("MAIL_HOST"),
                "smtp.gmail.com"
        );
    }

    public int resolvePort() {
        String rawPort = firstNonBlank(
                environment.getProperty("MAIL_PORT"),
                environment.getProperty("spring.mail.port"),
                readSecret("MAIL_PORT"),
                "587"
        );

        try {
            return Integer.parseInt(rawPort);
        } catch (NumberFormatException ignored) {
            return 587;
        }
    }

    public String resolveUsername() {
        return firstNonBlank(
                environment.getProperty("MAIL_USERNAME"),
                environment.getProperty("spring.mail.username"),
                readSecret("MAIL_USERNAME")
        );
    }

    public String resolvePassword() {
        return firstNonBlank(
                environment.getProperty("MAIL_PASSWORD"),
                environment.getProperty("spring.mail.password"),
                readSecret("MAIL_PASSWORD")
        );
    }

    public String resolveFromAddress() {
        return firstNonBlank(
                environment.getProperty("MAIL_FROM"),
                environment.getProperty("app.mail.from"),
                readSecret("MAIL_FROM"),
                resolveUsername()
        );
    }

    public String resolveFeedbackRecipient() {
        return firstNonBlank(
                environment.getProperty("FEEDBACK_RECIPIENT"),
                environment.getProperty("app.feedback.recipient"),
                readSecret("FEEDBACK_RECIPIENT"),
                resolveFromAddress()
        );
    }

    public int resolveConnectionTimeoutMs() {
        return resolveInteger(
                "MAIL_CONNECTION_TIMEOUT",
                "spring.mail.properties.mail.smtp.connectiontimeout",
                10000
        );
    }

    public int resolveReadTimeoutMs() {
        return resolveInteger(
                "MAIL_TIMEOUT",
                "spring.mail.properties.mail.smtp.timeout",
                10000
        );
    }

    public int resolveWriteTimeoutMs() {
        return resolveInteger(
                "MAIL_WRITE_TIMEOUT",
                "spring.mail.properties.mail.smtp.writetimeout",
                10000
        );
    }

    public boolean isMailConfigured() {
        return !isBlank(resolveUsername()) && !isBlank(resolvePassword()) && !isBlank(resolveFromAddress());
    }

    private int resolveInteger(String envKey, String propertyKey, int fallback) {
        String rawValue = firstNonBlank(
                environment.getProperty(envKey),
                environment.getProperty(propertyKey),
                readSecret(envKey)
        );

        if (isBlank(rawValue)) {
            return fallback;
        }

        try {
            return Integer.parseInt(rawValue.trim());
        } catch (NumberFormatException ignored) {
            return fallback;
        }
    }

    private String readSecret(String filename) {
        try {
            Path file = SECRETS_DIRECTORY.resolve(filename);
            if (!Files.exists(file)) {
                return null;
            }

            String value = Files.readString(file, StandardCharsets.UTF_8);
            return normalize(value);
        } catch (IOException ignored) {
            return null;
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            String normalized = normalize(value);
            if (normalized != null) {
                return normalized;
            }
        }

        return null;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
