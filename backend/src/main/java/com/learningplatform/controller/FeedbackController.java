package com.learningplatform.controller;

import com.learningplatform.model.dto.FeedbackRequest;
import com.learningplatform.model.dto.FeedbackResponse;
import com.learningplatform.model.entity.User;
import com.learningplatform.service.AuthService;
import com.learningplatform.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(
            @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        FeedbackResponse response = feedbackService.sendFeedback(user, request);
        return ResponseEntity.ok(response);
    }
}
