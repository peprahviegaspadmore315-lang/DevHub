package com.learningplatform.service;

import com.learningplatform.model.dto.FeedbackRequest;
import com.learningplatform.model.dto.FeedbackResponse;
import com.learningplatform.model.entity.User;

public interface FeedbackService {
    FeedbackResponse sendFeedback(User user, FeedbackRequest request);
}
