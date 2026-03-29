-- ============================================
-- Seed Data for Learning Content System
-- W3Schools-like Structure
-- ============================================

-- 1. INSERT TOPICS (Programming Languages/Technologies)
INSERT INTO topics (slug, name, description, color_code, icon_emoji, order_index, active)
VALUES
    ('html', 'HTML', 'Learn HTML - The building blocks of web pages', '#e34f26', '🔧', 1, true),
    ('css', 'CSS', 'Learn CSS - Style and layout your web pages', '#1572b6', '🎨', 2, true),
    ('javascript', 'JavaScript', 'Learn JavaScript - Make web pages interactive', '#f7df1e', '⚡', 3, true),
    ('python', 'Python', 'Learn Python - Beginner-friendly programming language', '#3776ab', '🐍', 4, true),
    ('react', 'React', 'Learn React - Build modern user interfaces', '#61dafb', '⚛️', 5, true)
ON CONFLICT DO NOTHING;

-- 2. INSERT CHAPTERS FOR HTML
INSERT INTO chapters (topic_id, slug, title, description, order_index, active)
SELECT id, 'basics', 'HTML Basics', 'Start with the fundamentals of HTML', 1, true FROM topics WHERE slug = 'html'
UNION ALL
SELECT id, 'elements', 'HTML Elements', 'Learn about HTML elements and tags', 2, true FROM topics WHERE slug = 'html'
UNION ALL
SELECT id, 'forms', 'HTML Forms', 'Create interactive forms with HTML', 3, true FROM topics WHERE slug = 'html'
ON CONFLICT DO NOTHING;

-- 3. INSERT LESSONS FOR HTML BASICS
INSERT INTO lessons (chapter_id, topic_id, slug, title, content_html, explanation, difficulty_level, order_index, estimated_time_minutes, active)
SELECT 
    c.id,
    t.id,
    'what-is-html',
    'What is HTML?',
    '<h2>What is HTML?</h2><p>HTML stands for HyperText Markup Language. It is used to create web pages.</p>',
    'HTML is the standard markup language for creating web pages. It uses a system of tags and elements to structure content.',
    'BEGINNER',
    1,
    5,
    true
FROM chapters c
JOIN topics t ON c.topic_id = t.id
WHERE c.slug = 'basics' AND t.slug = 'html'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, topic_id, slug, title, content_html, explanation, difficulty_level, order_index, estimated_time_minutes, active)
SELECT 
    c.id,
    t.id,
    'html-structure',
    'HTML Document Structure',
    '<h2>Basic HTML Structure</h2><p>Every HTML document should follow a basic structure.</p>',
    'A proper HTML document starts with a DOCTYPE declaration, followed by the html, head, and body tags.',
    'BEGINNER',
    2,
    8,
    true
FROM chapters c
JOIN topics t ON c.topic_id = t.id
WHERE c.slug = 'basics' AND t.slug = 'html'
ON CONFLICT DO NOTHING;

-- 4. INSERT CODE EXAMPLES FOR "What is HTML?"
INSERT INTO code_examples (lesson_id, title, description, code_content, language, order_index, is_executable, output_expected)
SELECT 
    l.id,
    'Hello World HTML',
    'Your first HTML page',
    '<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>',
    'html',
    1,
    true,
    'Displays "Hello World!" as heading'
FROM lessons l
WHERE l.slug = 'what-is-html'
ON CONFLICT DO NOTHING;

-- 5. INSERT CODE EXAMPLES FOR "HTML Structure"
INSERT INTO code_examples (lesson_id, title, description, code_content, language, order_index, is_executable, output_expected)
SELECT 
    l.id,
    'Complete HTML Structure',
    'The proper structure of an HTML document',
    '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <h1>Welcome to my page</h1>
    <p>This is the main content.</p>
</body>
</html>',
    'html',
    1,
    true,
    'Properly formatted HTML document'
FROM lessons l
WHERE l.slug = 'html-structure'
ON CONFLICT DO NOTHING;

-- 6. INSERT VIDEO REFERENCES
INSERT INTO video_references (lesson_id, title, description, video_url, thumbnail_url, duration_minutes, order_index, active)
SELECT 
    l.id,
    'HTML in 100 Seconds',
    'Quick introduction to HTML',
    'https://www.youtube.com/embed/OK_JCtrrv-c',
    'https://img.youtube.com/vi/OK_JCtrrv-c/maxresdefault.jpg',
    2,
    1,
    true
FROM lessons l
WHERE l.slug = 'what-is-html'
ON CONFLICT DO NOTHING;

INSERT INTO video_references (lesson_id, title, description, video_url, thumbnail_url, duration_minutes, order_index, active)
SELECT 
    l.id,
    'HTML Full Course - Beginner',
    'Complete HTML course for beginners',
    'https://www.youtube.com/embed/kDyJN7Y5DyU',
    'https://img.youtube.com/vi/kDyJN7Y5DyU/maxresdefault.jpg',
    47,
    2,
    true
FROM lessons l
WHERE l.slug = 'html-structure'
ON CONFLICT DO NOTHING;

-- 7. INSERT KEY CONCEPTS
INSERT INTO concepts (lesson_id, term, definition, example, order_index)
SELECT 
    l.id,
    'HTML Tag',
    'A markup label used to define an element',
    '<p> is a tag that defines a paragraph',
    1
FROM lessons l
WHERE l.slug = 'what-is-html'
ON CONFLICT DO NOTHING;

INSERT INTO concepts (lesson_id, term, definition, example, order_index)
SELECT 
    l.id,
    'DOCTYPE',
    'Declaration that defines the document type and HTML version',
    '<!DOCTYPE html> for HTML5',
    1
FROM lessons l
WHERE l.slug = 'html-structure'
ON CONFLICT DO NOTHING;

INSERT INTO concepts (lesson_id, term, definition, example, order_index)
SELECT 
    l.id,
    'Meta Tag',
    'Provides metadata about the HTML document',
    '<meta charset="UTF-8">',
    2
FROM lessons l
WHERE l.slug = 'html-structure'
ON CONFLICT DO NOTHING;

-- 8. INSERT EXERCISES
INSERT INTO exercises (lesson_id, title, description, starter_code, solution_code, language, difficulty, order_index)
SELECT 
    l.id,
    'Create Your First Heading',
    'Create an h1 heading that says "My First Heading"',
    '<!-- Write your HTML here -->',
    '<h1>My First Heading</h1>',
    'html',
    'BEGINNER',
    1
FROM lessons l
WHERE l.slug = 'what-is-html'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (lesson_id, title, description, starter_code, solution_code, language, difficulty, order_index)
SELECT 
    l.id,
    'Complete HTML Page Structure',
    'Create a complete HTML page with proper structure',
    '<!DOCTYPE html>
<!-- Complete this structure -->
<html>
<head>

</head>
<body>

</body>
</html>',
    '<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is my page.</p>
</body>
</html>',
    'html',
    'BEGINNER',
    1
FROM lessons l
WHERE l.slug = 'html-structure'
ON CONFLICT DO NOTHING;

-- 9. ADD CSS CHAPTER AND LESSONS
INSERT INTO chapters (topic_id, slug, title, description, order_index, active)
SELECT id, 'css-basics', 'CSS Basics', 'Learn how to style HTML elements', 1, true FROM topics WHERE slug = 'css'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (chapter_id, topic_id, slug, title, content_html, explanation, difficulty_level, order_index, estimated_time_minutes, active)
SELECT 
    c.id,
    t.id,
    'what-is-css',
    'What is CSS?',
    '<h2>What is CSS?</h2><p>CSS stands for Cascading Style Sheets. It is used to style and layout the web pages.</p>',
    'CSS is used to control the style and layout of multiple web pages at once. It can be applied inline, internally, or externally.',
    'BEGINNER',
    1,
    5,
    true
FROM chapters c
JOIN topics t ON c.topic_id = t.id
WHERE c.slug = 'css-basics' AND t.slug = 'css'
ON CONFLICT DO NOTHING;

INSERT INTO code_examples (lesson_id, title, description, code_content, language, order_index, is_executable, output_expected)
SELECT 
    l.id,
    'CSS Styling Example',
    'Basic CSS styling of HTML elements',
    'body {
    background-color: lightblue;
}

h1 {
    color: navy;
    margin-left: 20px;
}

p {
    font-family: Arial, sans-serif;
    font-size: 14px;
}',
    'css',
    1,
    true,
    'Light blue background with styled headings'
FROM lessons l
WHERE l.slug = 'what-is-css'
ON CONFLICT DO NOTHING;

-- Add video for CSS
INSERT INTO video_references (lesson_id, title, description, video_url, thumbnail_url, duration_minutes, order_index, active)
SELECT 
    l.id,
    'CSS Crash Course',
    'Learn CSS in 30 minutes',
    'https://www.youtube.com/embed/yfoY53QXEnc',
    'https://img.youtube.com/vi/yfoY53QXEnc/maxresdefault.jpg',
    30,
    1,
    true
FROM lessons l
WHERE l.slug = 'what-is-css'
ON CONFLICT DO NOTHING;
