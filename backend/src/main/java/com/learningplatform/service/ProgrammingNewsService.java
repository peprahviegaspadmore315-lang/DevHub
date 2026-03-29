package com.learningplatform.service;

import com.learningplatform.model.dto.ProgrammingNewsResponse;

public interface ProgrammingNewsService {
    ProgrammingNewsResponse getProgrammingNews(int limit);
}
