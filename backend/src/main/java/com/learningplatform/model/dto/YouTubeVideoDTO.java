package com.learningplatform.model.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouTubeVideoDTO {
    private Long id;
    private String title;
    private String description;
    private String youtubeVideoId;
    private String embedUrl;
    private String thumbnailUrl;
    private Integer durationSeconds;
    private Integer orderIndex;
}
