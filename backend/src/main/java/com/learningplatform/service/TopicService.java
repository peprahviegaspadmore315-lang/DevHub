package com.learningplatform.service;

import com.learningplatform.model.dto.TopicDTO;
import java.util.List;

public interface TopicService {
    
    List<String> getAllLanguages();
    
    List<TopicDTO> getTopicsByLanguage(String language);
    
    TopicDTO getTopicByLanguageAndSlug(String language, String slug);
    
    TopicDTO getTopicById(Long id);
}
