package com.learningplatform.service;

import com.learningplatform.model.dto.CodeRunRequest;
import com.learningplatform.model.dto.CodeRunResponse;

public interface CodeExecutionService {
    
    CodeRunResponse execute(CodeRunRequest request);
    
    boolean isAvailable();
}
