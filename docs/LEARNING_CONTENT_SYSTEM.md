# Learning Content System Architecture

A W3Schools-style learning platform with structured content for multiple programming languages.

## Overview

This system provides a scalable way to deliver programming education content with:
- Multiple programming languages support
- Hierarchical content structure (Language → Topic → Lesson)
- Code examples with copy functionality
- YouTube video integration
- User progress tracking

## Database Schema

### Tables

```
programming_languages
├── id (PK)
├── name (e.g., "Python")
├── slug (e.g., "python")
├── description
├── icon_url
├── color (hex for UI)
├── difficulty_level
├── order_index
└── is_active

topics
├── id (PK)
├── language_id (FK → programming_languages)
├── name (e.g., "Variables & Data Types")
├── slug (e.g., "variables-data-types")
├── description
├── icon
├── order_index
└── is_premium

lessons
├── id (PK)
├── topic_id (FK → topics)
├── title (e.g., "What are Variables?")
├── slug (e.g., "what-are-variables")
├── content (Markdown)
├── notes (Key takeaways)
├── duration_minutes
├── difficulty
├── order_index
└── is_premium

code_examples
├── id (PK)
├── lesson_id (FK → lessons)
├── title
├── description
├── code
├── language (python, javascript, etc.)
├── code_type (example, exercise, comparison)
├── output
└── order_index

youtube_videos
├── id (PK)
├── lesson_id (FK → lessons)
├── title
├── description
├── youtube_video_id
├── duration_seconds
├── thumbnail_url
└── order_index

user_lesson_progress
├── id (PK)
├── user_id
├── lesson_id (FK → lessons)
├── completed (boolean)
├── completed_at (timestamp)
└── progress_percent
```

## API Endpoints

### Languages
```
GET  /api/learning/languages          - List all languages
GET  /api/learning/languages/{slug}   - Get language by slug
```

### Topics
```
GET  /api/learning/languages/{langSlug}/topics          - List topics
GET  /api/learning/languages/{langSlug}/topics/{slug}     - Get topic with lessons
```

### Lessons
```
GET  /api/learning/languages/{lang}/topics/{topic}/lessons              - List lessons
GET  /api/learning/languages/{lang}/topics/{topic}/lessons/{lesson}     - Get full lesson
```

### Progress
```
POST /api/learning/progress                              - Update lesson progress
GET  /api/learning/progress                              - Get all user progress
GET  /api/learning/progress/languages/{languageId}      - Get progress by language
```

## File Structure

### Backend (Spring Boot)
```
backend/src/main/java/com/learningplatform/
├── controller/
│   └── LearningContentController.java     # REST endpoints
├── model/
│   ├── dto/
│   │   ├── LanguageDTO.java
│   │   ├── TopicDTO.java
│   │   ├── LessonDTO.java
│   │   ├── CodeExampleDTO.java
│   │   ├── YouTubeVideoDTO.java
│   │   ├── UserProgressDTO.java
│   │   └── ProgressUpdateRequest.java
│   └── entity/
│       ├── ProgrammingLanguage.java
│       ├── LearningTopic.java
│       ├── LearningLesson.java
│       ├── CodeExample.java
│       ├── YouTubeVideo.java
│       └── UserLessonProgress.java
├── repository/
│   ├── ProgrammingLanguageRepository.java
│   ├── LearningTopicRepository.java
│   ├── LearningLessonRepository.java
│   ├── CodeExampleRepository.java
│   ├── YouTubeVideoRepository.java
│   └── UserLessonProgressRepository.java
└── service/
    ├── LearningContentService.java
    └── impl/
        └── LearningContentServiceImpl.java
```

### Frontend (React)
```
frontend/src/
├── services/
│   └── learningService.ts        # API client
├── components/
│   └── learning/
│       ├── index.ts
│       ├── LanguageCard.tsx     # Language selector card
│       ├── TopicCard.tsx        # Topic list item
│       ├── LessonList.tsx       # Lesson list for a topic
│       ├── CodeBlock.tsx        # Code display with copy
│       └── YouTubePlayer.tsx   # Video player
├── pages/
│   ├── LearningDashboard.tsx    # Language selection
│   ├── TopicPage.tsx           # Topics and lessons
│   └── LearningLessonPage.tsx  # Full lesson view
└── App.tsx                    # Routes
```

## Frontend Routes

```
/learn                          # Language selection dashboard
/learn/{languageSlug}           # Topics for a language
/learn/{languageSlug}/{topicSlug}      # Lessons in a topic
/learn/{languageSlug}/{topicSlug}/{lessonSlug}  # Full lesson
```

## Content Format

### Markdown Content
Lessons use Markdown for content with custom formatting:

```markdown
# Main Heading
## Subheading
### Sub-subheading

- Bullet points
- **Bold text**

| Column 1 | Column 2 |
|----------|----------|
| Data     | Data     |
```

### Code Examples
Stored with language identifier for syntax highlighting:
```json
{
  "title": "Hello World",
  "description": "Your first program",
  "code": "print('Hello, World!')",
  "language": "python",
  "codeType": "example",
  "output": "Hello, World!"
}
```

## Adding New Languages

1. Add language to database:
```sql
INSERT INTO programming_languages (name, slug, description, color)
VALUES ('JavaScript', 'javascript', '...', '#f7df1e');
```

2. Add topics:
```sql
INSERT INTO topics (language_id, name, slug, description, order_index)
VALUES (2, 'Variables', 'variables', '...', 1);
```

3. Add lessons with content:
```sql
INSERT INTO lessons (topic_id, title, slug, content, notes, order_index)
VALUES (1, 'What are Variables?', 'what-are-variables', '# What are Variables?...', '## Key Points...', 1);
```

4. Add code examples:
```sql
INSERT INTO code_examples (lesson_id, title, code, language, code_type, output)
VALUES (1, 'Example', 'let x = 5;', 'javascript', 'example', '5');
```

5. Add videos:
```sql
INSERT INTO youtube_videos (lesson_id, title, youtube_video_id)
VALUES (1, 'JavaScript Variables', 'xyz123');
```

## Key Features

### Scalability
- Languages are independent - add unlimited languages
- Topics belong to languages - easy to organize
- Lessons belong to topics - clear hierarchy
- All entities have order_index for manual ordering

### Content Management
- Markdown content supports rich formatting
- Code examples support multiple languages
- YouTube videos link to external content
- Notes field for key takeaways

### User Experience
- Progress tracking per lesson
- Completion status display
- Navigation between lessons
- Code copy functionality
- Embedded video player

### Performance
- Lazy loading of topics and lessons
- Efficient queries with proper indexes
- Pagination ready (not implemented yet)
- Caching ready (not implemented yet)

## Future Enhancements

1. **Search** - Full-text search across lessons
2. **Pagination** - For topics with many lessons
3. **Quiz Integration** - Link lessons to quizzes
4. **Bookmarks** - Save favorite lessons
5. **Certificates** - Award certificates on completion
6. **Caching** - Redis for frequently accessed content
7. **CDN** - Serve static assets faster
8. **Comments** - Discussion on lessons
9. **Ratings** - User feedback on lessons
10. **Translations** - Multi-language content
