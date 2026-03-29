package com.learningplatform.service.impl;

import com.learningplatform.model.dto.*;
import com.learningplatform.model.entity.*;
import com.learningplatform.repository.*;
import com.learningplatform.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final TopicCodeExampleRepository codeExampleRepository;

    @Override
    public List<String> getAllLanguages() {
        return topicRepository.findAllLanguages();
    }

    @Override
    public List<TopicDTO> getTopicsByLanguage(String language) {
        return topicRepository.findByLanguageOrderByOrderIndexAsc(language)
            .stream()
            .map(this::toTopicDTO)
            .collect(Collectors.toList());
    }

    @Override
    public TopicDTO getTopicByLanguageAndSlug(String language, String slug) {
        Topic topic = topicRepository.findByLanguageAndSlug(language, slug)
            .orElseThrow(() -> new RuntimeException("Topic not found"));
        
        return buildTopicDTO(topic);
    }

    @Override
    public TopicDTO getTopicById(Long id) {
        Topic topic = topicRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
        
        return buildTopicDTO(topic);
    }

    private TopicDTO buildTopicDTO(Topic topic) {
        TopicDTO dto = toTopicDTO(topic);
        
        // Load code examples
        List<TopicCodeExample> examples = codeExampleRepository.findByTopicId(topic.getId());
        dto.setCodeExamples(
            examples.stream()
                .map(this::toCodeExampleDTO)
                .collect(Collectors.toList())
        );
        
        return dto;
    }

    private TopicDTO toTopicDTO(Topic topic) {
        return TopicDTO.builder()
            .id(topic.getId())
            .language(topic.getLanguage())
            .title(topic.getTitle())
            .slug(topic.getSlug())
            .description(topic.getDescription())
            .whyLearn(topic.getWhyLearn())
            .simpleExplanation(topic.getSimpleExplanation())
            .keyPoints(parseKeyPoints(topic.getKeyPoints()))
            .difficulty(topic.getDifficulty())
            .orderIndex(topic.getOrderIndex())
            .isPremium(topic.getIsPremium())
            .video(topic.getVideoUrl() != null ? TopicDTO.VideoInfo.builder()
                .url(topic.getVideoUrl())
                .embedUrl(topic.getEmbedUrl())
                .thumbnailUrl(topic.getThumbnailUrl())
                .duration(topic.getVideoDuration())
                .build() : null)
            .build();
    }

    private CodeExampleDTO toCodeExampleDTO(TopicCodeExample example) {
        return CodeExampleDTO.builder()
            .id(example.getId())
            .title(example.getTitle())
            .description(example.getDescription())
            .code(example.getCode())
            .codeLanguage(example.getCodeLanguage())
            .output(example.getOutput())
            .orderIndex(example.getOrderIndex())
            .build();
    }

    private List<String> parseKeyPoints(String keyPoints) {
        if (keyPoints == null || keyPoints.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(keyPoints.split("\\n"))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
    }
}
