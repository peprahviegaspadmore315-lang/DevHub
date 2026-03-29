package com.learningplatform.service.impl;

import com.learningplatform.exception.BadRequestException;
import com.learningplatform.model.dto.FeedbackRequest;
import com.learningplatform.model.dto.FeedbackResponse;
import com.learningplatform.model.entity.User;
import com.learningplatform.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String mailFrom;

    @Value("${app.feedback.recipient:}")
    private String feedbackRecipient;

    @Override
    public FeedbackResponse sendFeedback(User user, FeedbackRequest request) {
        String summary = normalize(request.getSummary());
        String blockers = normalize(request.getBlockers());
        String improvements = normalize(request.getImprovements());
        String category = normalize(request.getCategory());
        String pageUrl = normalize(request.getPageUrl());
        String browserInfo = normalize(request.getBrowserInfo());

        if (summary == null || summary.isBlank()) {
            throw new BadRequestException("Add a short summary so DevHub knows what this feedback is about.");
        }

        if ((blockers == null || blockers.isBlank()) && (improvements == null || improvements.isBlank())) {
            throw new BadRequestException("Describe what is blocking you or what DevHub should improve before sending feedback.");
        }

        String recipient = resolveRecipient();

        if (!isMailConfigured()) {
            throw new BadRequestException("Feedback email is not configured yet. Add the DevHub mail sender credentials first.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient);
        message.setFrom(resolveSenderAddress());
        message.setReplyTo(user.getEmail());
        message.setSubject(buildSubject(user, category, summary));
        message.setText(buildBody(user, category, summary, blockers, improvements, pageUrl, browserInfo));

        try {
            mailSender.send(message);
            logger.info("Feedback email sent for user {}", user.getEmail());
            return FeedbackResponse.builder()
                    .success(true)
                    .message("Feedback sent to the DevHub inbox. Thank you for helping improve the app.")
                    .build();
        } catch (MailException error) {
            logger.error("Failed to send feedback email for user {}", user.getEmail(), error);
            throw new BadRequestException("DevHub could not send your feedback email right now. Please try again.");
        }
    }

    private String buildSubject(User user, String category, String summary) {
        String normalizedCategory = category == null || category.isBlank() ? "General Feedback" : category;
        return "[DevHub Feedback] " + normalizedCategory + " - " + user.getEmail() + " - " + summary;
    }

    private String buildBody(
            User user,
            String category,
            String summary,
            String blockers,
            String improvements,
            String pageUrl,
            String browserInfo
    ) {
        StringBuilder builder = new StringBuilder();
        builder.append("DevHub feedback received").append("\n\n");
        builder.append("Submitted at: ").append(LocalDateTime.now()).append("\n");
        builder.append("User ID: ").append(user.getId()).append("\n");
        builder.append("Username: ").append(valueOrFallback(user.getUsername(), "Not set")).append("\n");
        builder.append("Name: ")
                .append(valueOrFallback(
                        (valueOrFallback(user.getFirstName(), "") + " " + valueOrFallback(user.getLastName(), "")).trim(),
                        "Not set"
                ))
                .append("\n");
        builder.append("Email: ").append(user.getEmail()).append("\n");
        builder.append("Role: ").append(user.getRole()).append("\n");
        builder.append("Category: ").append(valueOrFallback(category, "General Feedback")).append("\n");
        builder.append("Summary: ").append(summary).append("\n");
        builder.append("Page / Area: ").append(valueOrFallback(pageUrl, "Not provided")).append("\n");
        builder.append("\nWhat hindered the user?").append("\n");
        builder.append(valueOrFallback(blockers, "No blocker details provided")).append("\n");
        builder.append("\nWhat needs improvement?").append("\n");
        builder.append(valueOrFallback(improvements, "No improvement details provided")).append("\n");
        builder.append("\nBrowser / device info").append("\n");
        builder.append(valueOrFallback(browserInfo, "Not provided")).append("\n");
        return builder.toString();
    }

    private boolean isMailConfigured() {
        return !isBlank(mailUsername) && !isBlank(mailPassword) && !isBlank(resolveSenderAddress());
    }

    private String resolveRecipient() {
        String recipient = normalize(feedbackRecipient);

        if (!isBlank(recipient)) {
            return recipient;
        }

        recipient = resolveSenderAddress();

        if (!isBlank(recipient)) {
            return recipient;
        }

        throw new BadRequestException("DevHub feedback inbox is not configured yet.");
    }

    private String resolveSenderAddress() {
        String sender = normalize(mailFrom);
        if (!isBlank(sender)) {
            return sender;
        }
        return normalize(mailUsername);
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String valueOrFallback(String value, String fallback) {
        return isBlank(value) ? fallback : value;
    }
}
