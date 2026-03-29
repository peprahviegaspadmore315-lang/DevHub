package com.learningplatform.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgrammingNewsStatusBar {
    private String id;
    private String category;
    private String subcategory;
    private int length;
    private double opacity;
}
