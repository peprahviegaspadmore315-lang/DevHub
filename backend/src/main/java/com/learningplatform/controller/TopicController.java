package com.learningplatform.controller;

import com.learningplatform.model.dto.TopicDTO;
import com.learningplatform.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TopicController {

    private final TopicService topicService;

    /**
     * Get all available languages
     * GET /api/topics/languages
     */
    @GetMapping("/languages")
    public ResponseEntity<List<String>> getAllLanguages() {
        return ResponseEntity.ok(topicService.getAllLanguages());
    }

    /**
     * Get all topics for a language
     * GET /api/topics/{language}
     * Example: GET /api/topics/html
     */
    @GetMapping("/{language}")
    public ResponseEntity<List<TopicDTO>> getTopicsByLanguage(@PathVariable String language) {
        return ResponseEntity.ok(topicService.getTopicsByLanguage(language.toLowerCase()));
    }

    /**
     * Get a specific topic with full content
     * GET /api/topics/{language}/{slug}
     * Example: GET /api/topics/html/introduction-to-html
     */
    @GetMapping("/{language}/{slug}")
    public ResponseEntity<TopicDTO> getTopicByLanguageAndSlug(
            @PathVariable String language,
            @PathVariable String slug) {
        return ResponseEntity.ok(
            topicService.getTopicByLanguageAndSlug(language.toLowerCase(), slug)
        );
    }
}
