-- ============================================
-- Programming Topics Database Schema
-- Scalable structure for multiple languages
-- ============================================

-- Drop tables if they exist
DROP TABLE IF EXISTS topic_code_examples CASCADE;
DROP TABLE IF EXISTS topics CASCADE;

-- ============================================
-- Topics Table
-- ============================================
CREATE TABLE topics (
    id BIGSERIAL PRIMARY KEY,
    
    -- Language association
    language VARCHAR(50) NOT NULL,
    
    -- Content
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    
    -- What is this topic?
    description TEXT NOT NULL,
    
    -- Why learn it? (benefits)
    why_learn TEXT,
    
    -- Simple explanation
    simple_explanation TEXT NOT NULL,
    
    -- Key bullet points
    key_points TEXT,
    
    -- Difficulty level
    difficulty VARCHAR(20) DEFAULT 'beginner',
    
    -- Order within language
    order_index INTEGER DEFAULT 0,
    
    -- Premium content flag
    is_premium BOOLEAN DEFAULT FALSE,
    
    -- YouTube video URL
    video_url VARCHAR(500),
    video_thumbnail VARCHAR(500),
    video_duration INTEGER,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(language, slug)
);

-- ============================================
-- Topic Code Examples Table
-- ============================================
CREATE TABLE topic_code_examples (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    
    title VARCHAR(100),
    description TEXT,
    code TEXT NOT NULL,
    code_language VARCHAR(30) NOT NULL,
    output TEXT,
    order_index INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_topics_language ON topics(language);
CREATE INDEX idx_topics_slug ON topics(language, slug);
CREATE INDEX idx_topic_examples_topic ON topic_code_examples(topic_id);
