package com.learningplatform.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "topics", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"language", "slug"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "why_learn", columnDefinition = "TEXT")
    private String whyLearn;

    @Column(name = "simple_explanation", nullable = false, columnDefinition = "TEXT")
    private String simpleExplanation;

    @Column(name = "key_points", columnDefinition = "TEXT")
    private String keyPoints;

    @Column(length = 20)
    @Builder.Default
    private String difficulty = "beginner";

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;

    @Column(name = "is_premium")
    @Builder.Default
    private Boolean isPremium = false;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "video_thumbnail", length = 500)
    private String videoThumbnail;

    @Column(name = "video_duration")
    private Integer videoDuration;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<TopicCodeExample> codeExamples = new ArrayList<>();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getYouTubeVideoId() {
        if (videoUrl == null) return null;
        if (videoUrl.contains("youtube.com/watch?v=")) {
            return videoUrl.split("v=")[1].split("&")[0];
        }
        if (videoUrl.contains("youtu.be/")) {
            return videoUrl.split("youtu.be/")[1].split("\\?")[0];
        }
        return null;
    }

    public String getEmbedUrl() {
        String videoId = getYouTubeVideoId();
        return videoId != null ? "https://www.youtube.com/embed/" + videoId : null;
    }

    public String getThumbnailUrl() {
        if (videoThumbnail != null) return videoThumbnail;
        String videoId = getYouTubeVideoId();
        return videoId != null ? "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg" : null;
    }
}
