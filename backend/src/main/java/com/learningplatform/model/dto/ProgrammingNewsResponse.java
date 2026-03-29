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
public class ProgrammingNewsResponse {
    private String title;
    private String subtitle;
    private String fetchedAt;
    private List<ProgrammingNewsStatusBar> sources;
    private List<ProgrammingNewsArticleResponse> articles;
}
