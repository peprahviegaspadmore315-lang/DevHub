-- ============================================
-- Learning Content System Database Schema
-- Scalable design for multiple programming languages
-- ============================================

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS lesson_code_examples CASCADE;
DROP TABLE IF EXISTS lesson_videos CASCADE;
DROP TABLE IF EXISTS code_examples CASCADE;
DROP TABLE IF EXISTS youtube_videos CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS programming_languages CASCADE;

-- ============================================
-- 1. Programming Languages Table
-- ============================================
CREATE TABLE programming_languages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Topics Table (Categories within each language)
-- ============================================
CREATE TABLE topics (
    id BIGSERIAL PRIMARY KEY,
    language_id BIGINT NOT NULL REFERENCES programming_languages(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'book',
    order_index INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(language_id, slug)
);

-- ============================================
-- 3. Lessons Table (Individual learning content)
-- ============================================
CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 5,
    difficulty VARCHAR(20) DEFAULT 'beginner',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(topic_id, slug)
);

-- ============================================
-- 4. Code Examples Table
-- ============================================
CREATE TABLE code_examples (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(100),
    description TEXT,
    code TEXT NOT NULL,
    language VARCHAR(20) NOT NULL,
    code_type VARCHAR(20) DEFAULT 'example',
    output TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. YouTube Videos Table
-- ============================================
CREATE TABLE youtube_videos (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(200),
    description TEXT,
    youtube_video_id VARCHAR(20) NOT NULL,
    duration_seconds INTEGER,
    thumbnail_url VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. User Lesson Progress Table
-- ============================================
CREATE TABLE user_lesson_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    progress_percent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- ============================================
-- Indexes for better query performance
-- ============================================
CREATE INDEX idx_topics_language ON topics(language_id);
CREATE INDEX idx_lessons_topic ON lessons(topic_id);
CREATE INDEX idx_code_examples_lesson ON code_examples(lesson_id);
CREATE INDEX idx_youtube_videos_lesson ON youtube_videos(lesson_id);
CREATE INDEX idx_user_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_lesson_progress(lesson_id);

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON TABLE programming_languages IS 'Supported programming languages (Python, JavaScript, Java, etc.)';
COMMENT ON TABLE topics IS 'Categories/topics within each language (Variables, Loops, Functions, etc.)';
COMMENT ON TABLE lessons IS 'Individual lessons with explanations and notes';
COMMENT ON TABLE code_examples IS 'Code snippets with explanations for each lesson';
COMMENT ON TABLE youtube_videos IS 'YouTube video references for supplementary learning';
COMMENT ON TABLE user_lesson_progress IS 'Tracks user progress through lessons';
