package com.learningplatform.service;

import com.learningplatform.model.dto.CodeExecutionRequest;
import com.learningplatform.model.dto.CodeExecutionResponse;

public interface CodeExecutor {
    
    /**
     * Execute code in a sandboxed environment
     * @param request The execution request
     * @return Execution result
     */
    CodeExecutionResponse execute(CodeExecutionRequest request);
    
    /**
     * Check if this executor supports the given language
     * @param language The language to check
     * @return true if supported
     */
    boolean supports(CodeExecutionRequest.SupportedLanguage language);
    
    /**
     * Validate code before execution
     * @param code The code to validate
     * @return true if valid
     */
    boolean validate(String code);
}
