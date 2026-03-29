package com.learningplatform.model.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExampleDTO {
    private Long id;
    private String title;
    private String description;
    private String code;
    private String codeLanguage;
    private String output;
    private Integer orderIndex;
}
