-- ============================================
-- Simple Seed: Languages and Topics
-- ============================================

-- Insert programming languages
INSERT INTO programming_languages (name, slug, color, description, difficulty_level, icon_url, is_active, order_index)
VALUES
('Python', 'python', '#3776AB', 'A versatile programming language known for its simplicity and readability.', 'Beginner', 'python-icon.png', true, 1),
('CSS', 'css', '#1572B6', 'Cascading Style Sheets for styling web pages.', 'Beginner', 'css-icon.png', true, 2);

-- Insert topics
INSERT INTO topics (language, name, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, is_premium, language_id)
VALUES
('python','Python HOME','Python HOME','python-home','Start your Python learning journey.','Python is one of the most popular programming languages in the world.','Python is a programming language that is easy to read and write.','Python is beginner-friendly, Python is very readable and easy to learn.','beginner',1,false, (SELECT id FROM programming_languages WHERE slug = 'python')),
('python','Python Intro','Python Intro','python-intro','What Python is and how it works.','Understanding Python basics is the first step.','Python is a programming language for web development, data science, AI.','Easy to learn, versatile, powerful.','beginner',2,false, (SELECT id FROM programming_languages WHERE slug = 'python')),
('css','CSS HOME','CSS HOME','css-home','Entry point for CSS learning journey.','CSS is essential for styling websites.','CSS allows you to add colors, fonts, spacing, and layout.','CSS adds style to HTML, uses selectors and properties.','beginner',1,false, (SELECT id FROM programming_languages WHERE slug = 'css')),
('css','CSS Introduction','CSS Introduction','css-introduction','What CSS is and how it works.','Understanding CSS basics is essential.','CSS stands for Cascading Style Sheets.','Selector syntax, cascading and inheritance.','beginner',2,false, (SELECT id FROM programming_languages WHERE slug = 'css'));