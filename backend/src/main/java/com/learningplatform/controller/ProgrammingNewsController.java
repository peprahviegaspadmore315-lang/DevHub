package com.learningplatform.controller;

import com.learningplatform.model.dto.ProgrammingNewsResponse;
import com.learningplatform.service.ProgrammingNewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class ProgrammingNewsController {

    private final ProgrammingNewsService programmingNewsService;

    @GetMapping("/programming")
    public ResponseEntity<ProgrammingNewsResponse> getProgrammingNews(
            @RequestParam(defaultValue = "9") int limit
    ) {
        return ResponseEntity.ok(programmingNewsService.getProgrammingNews(limit));
    }
}
