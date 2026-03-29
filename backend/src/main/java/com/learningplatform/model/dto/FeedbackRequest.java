package com.learningplatform.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {
    private String category;
    private String summary;
    private String blockers;
    private String improvements;
    private String pageUrl;
    private String browserInfo;
}
