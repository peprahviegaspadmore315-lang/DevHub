package com.learningplatform.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgrammingNewsArticleResponse {
    private String id;
    private String title;
    private String category;
    private String subcategory;
    private String mediaType;
    private String actionLabel;
    private String timeAgo;
    private String location;
    private String image;
    private List<String> gradientColors;
    private List<String> content;
    private String articleUrl;
    private String sourceName;
    private String publishedAt;
}
