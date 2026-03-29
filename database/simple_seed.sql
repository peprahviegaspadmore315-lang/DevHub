-- ============================================
-- Simple Python and CSS Topics Seed
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, is_premium)
VALUES
-- Python topics
('python','Python HOME','python-home','Start your Python learning journey.','Python is one of the most popular programming languages in the world.','Python is a programming language that is easy to read and write.','Python is beginner-friendly, Python is very readable and easy to learn.','beginner',1,false),
('python','Python Intro','python-intro','What Python is and how it works.','Understanding Python basics is the first step.','Python is a programming language for web development, data science, AI.','Easy to learn, versatile, powerful.','beginner',2,false),

-- CSS topics
('css','CSS HOME','css-home','Entry point for CSS learning journey.','CSS is essential for styling websites.','CSS allows you to add colors, fonts, spacing, and layout.','CSS adds style to HTML, uses selectors and properties.','beginner',1,false),
('css','CSS Introduction','css-introduction','What CSS is and how it works.','Understanding CSS basics is essential.','CSS stands for Cascading Style Sheets.','Selector syntax, cascading and inheritance.','beginner',2,false);