-- ============================================
-- Complete CSS Topics Seed Data
-- ============================================

-- Insert CSS topics with all provided content
INSERT INTO topics (language, title, slug, description, simple_explanation, key_points, difficulty, order_index)
VALUES

-- CSS HOME & BASICS (1-10)
('CSS', 'CSS HOME', 'css-home', 'Entry point for CSS learning journey', 'CSS HOME section introduces the CSS learning path', 'Getting started with CSS', 'beginner', 1),
('CSS', 'CSS Introduction', 'css-introduction', 'Introduction to CSS and how it works', 'CSS stands for Cascading Style Sheets', 'What CSS is, why we need it, how it works', 'beginner', 2),
('CSS', 'CSS Syntax', 'css-syntax', 'Learn the proper CSS syntax and structure', 'CSS uses selectors, properties, and values', 'selector { property: value; }', 'beginner', 3),
('CSS', 'CSS Selectors', 'css-selectors', 'Learn how to select HTML elements to style', 'Selectors are used to find and style HTML elements', 'Element, class, ID, attribute, pseudo-class, pseudo-element selectors', 'beginner', 4),
('CSS', 'CSS How To', 'css-how-to', 'Practical usage examples and quick tasks', 'CSS how-to guides for common styling tasks', 'Inline, internal, and external CSS', 'beginner', 5),
('CSS', 'CSS Comments', 'css-comments', 'How to write comments in CSS', 'CSS comments explain your code', '/* comment */ syntax, single-line comments', 'beginner', 6),
('CSS', 'CSS Errors', 'css-errors', 'Finding and fixing CSS errors', 'Common CSS mistakes and how to fix them', 'Missing semicolons, typos, invalid values', 'beginner', 7),
('CSS', 'CSS Colors', 'css-colors', 'Work with colors in CSS', 'Color values: names, hex, rgb(), rgba(), hsl()', 'Color keywords, hex codes, RGB, HSL formats', 'beginner', 8),
('CSS', 'CSS Backgrounds', 'css-backgrounds', 'Style element backgrounds', 'Background properties for visual design', 'background-color, background-image, background-size, background-repeat', 'beginner', 9),
('CSS', 'CSS Borders', 'css-borders', 'Add and customize borders on elements', 'Borders define elements and add visual structure', 'border-width, border-color, border-style, border-radius', 'beginner', 10),

-- SPACING (11-13)
('CSS', 'CSS Margins', 'css-margins', 'Control spacing outside elements', 'Margins create space between elements', 'margin-top, margin-right, margin-bottom, margin-left', 'beginner', 11),
('CSS', 'CSS Padding', 'css-padding', 'Control spacing inside elements', 'Padding creates space inside element borders', 'padding-top, padding-right, padding-bottom, padding-left', 'beginner', 12),
('CSS', 'CSS Height / Width', 'css-height-width', 'Set element dimensions precisely', 'Control how wide and tall elements are', 'height, width, min-height, max-height properties', 'beginner', 13),

-- BOX MODEL (14-15)
('CSS', 'CSS Box Model', 'css-box-model', 'Understand the CSS box model', 'Box model: content, padding, border, margin', 'Box sizing, border-box, content-box', 'beginner', 14),
('CSS', 'CSS Outline', 'css-outline', 'Add outlines around elements', 'Outlines are similar to borders but outside', 'outline, outline-offset, outline-color, outline-style', 'beginner', 15),

-- TEXT & FONTS (16-18)
('CSS', 'CSS Text', 'css-text', 'Style text appearance and flow', 'Text properties for readability and styling', 'text-align, text-decoration, text-transform, line-height', 'beginner', 16),
('CSS', 'CSS Fonts', 'css-fonts', 'Use and style fonts in CSS', 'Font properties for typography', 'font-family, font-size, font-weight, font-style', 'beginner', 17),
('CSS', 'CSS Icons', 'css-icons', 'Style icons with CSS', 'Add and style icons in your designs', 'Icon fonts, SVG icons, icon sizing and coloring', 'beginner', 18),

-- LINKS & LISTS (19-20)
('CSS', 'CSS Links', 'css-links', 'Style HTML links and anchor tags', 'Link styling for better user experience', 'a:link, a:visited, a:hover, a:active pseudo-classes', 'beginner', 19),
('CSS', 'CSS Lists', 'css-lists', 'Style ordered and unordered lists', 'List styling for navigation and content', 'list-style-type, list-style-image, list-style-position', 'beginner', 20),

-- TABLES (21)
('CSS', 'CSS Tables', 'css-tables', 'Style HTML tables', 'Table styling for data display', 'border-collapse, border-spacing, table layouts', 'beginner', 21),

-- DISPLAY & LAYOUT (22-30)
('CSS', 'CSS Display', 'css-display', 'Control element display and layout', 'Display property changes how elements flow', 'block, inline, inline-block, none, flex, grid', 'beginner', 22),
('CSS', 'CSS Max-width', 'css-max-width', 'Responsive width constraints', 'Max-width for responsive design', 'max-width, responsive layouts, container queries', 'beginner', 23),
('CSS', 'CSS Position', 'css-position', 'Element positioning methods', 'Positioning strategies for layout', 'static, relative, absolute, fixed, sticky', 'beginner', 24),
('CSS', 'CSS Position Offsets', 'css-position-offsets', 'Offset positioned elements', 'Fine-tune element placement with offsets', 'top, right, bottom, left properties', 'beginner', 25),
('CSS', 'CSS Z-index', 'css-z-index', 'Control element stacking order', 'Z-index for layering elements', 'z-index stacking contexts and order', 'beginner', 26),
('CSS', 'CSS Overflow', 'css-overflow', 'Handle content overflow', 'Overflow handling options', 'overflow, overflow-x, overflow-y: visible, hidden, scroll, auto', 'beginner', 27),
('CSS', 'CSS Float', 'css-float', 'Float elements for text wrapping', 'Float for image and text layouts', 'float: left, right, none; clear property', 'beginner', 28),
('CSS', 'CSS Inline-block', 'css-inline-block', 'Inline-block display behavior', 'Combine inline and block properties', 'display: inline-block; properties', 'beginner', 29),
('CSS', 'CSS Align', 'css-align', 'Alignment in CSS', 'Align content horizontally and vertically', 'text-align, vertical-align, justify-content, align-items', 'beginner', 30),

-- SELECTORS & SPECIFICITY (31-44)
('CSS', 'CSS Combinators', 'css-combinators', 'Combine selectors for targeting', 'Select elements based on relationships', 'Descendant, child, adjacent, general sibling combinators', 'beginner', 31),
('CSS', 'CSS Pseudo-classes', 'css-pseudo-classes', 'Style based on element state', 'State-based selectors for interactivity', 'hover, focus, active, nth-child, first-child', 'beginner', 32),
('CSS', 'CSS Pseudo-elements', 'css-pseudo-elements', 'Style parts of elements', 'Access element parts without extra HTML', 'before, after, first-letter, first-line', 'beginner', 33),
('CSS', 'CSS Opacity', 'css-opacity', 'Control element transparency', 'Opacity for layered designs', 'opacity property values 0-1', 'beginner', 34),
('CSS', 'CSS Navigation Bars', 'css-navigation-bars', 'Build styled navigation bars', 'Create header navigations', 'Horizontal and vertical navbars, dropdowns', 'beginner', 35),
('CSS', 'CSS Dropdowns', 'css-dropdowns', 'Create dropdown menus', 'Menu dropdown components', 'Hover dropdowns, position absolute', 'intermediate', 36),
('CSS', 'CSS Image Gallery', 'css-image-gallery', 'Create responsive galleries', 'Gallery layout styles', 'Grid/flex galleries, lightbox effects', 'intermediate', 37),
('CSS', 'CSS Image Sprites', 'css-image-sprites', 'Optimize with image sprites', 'Combine multiple images', 'Sprite sheets, background-position', 'intermediate', 38),
('CSS', 'CSS Attribute Selectors', 'css-attribute-selectors', 'Select by HTML attributes', 'Attribute-based targeting', '[attr], [attr=value], [attr^=value]', 'intermediate', 39),
('CSS', 'CSS Forms', 'css-forms', 'Style form elements', 'Form input and control styling', 'input, textarea, button, select styling', 'intermediate', 40),
('CSS', 'CSS Counters', 'css-counters', 'Auto-increment counters', 'Numbered lists without numbers', 'counter-reset, counter-increment', 'intermediate', 41),
('CSS', 'CSS Units', 'css-units', 'CSS measurement units', 'Various length and size units', 'px, em, rem, %, vw, vh, ch', 'intermediate', 42),
('CSS', 'CSS Inheritance', 'css-inheritance', 'Inherited CSS properties', 'Properties that cascade to children', 'inherit keyword, inheritable properties', 'intermediate', 43),
('CSS', 'CSS Specificity', 'css-specificity', 'CSS cascading and specificity', 'Calculate CSS rule precedence', 'Inline > ID > Class > Element specificity', 'intermediate', 44),

-- ADVANCED (45+)
('CSS', 'CSS !important', 'css-important', 'Override with !important', 'Force rule priority', '!important flag, use sparingly', 'intermediate', 45),
('CSS', 'CSS Math Functions', 'css-math-functions', 'Dynamic calculations in CSS', 'Calculate values dynamically', 'calc(), min(), max(), clamp() functions', 'intermediate', 46),
('CSS', 'CSS Optimization', 'css-optimization', 'Optimize CSS performance', 'Performance best practices', 'Minify, critical CSS, avoiding redundancy', 'intermediate', 47),
('CSS', 'CSS Accessibility', 'css-accessibility', 'Accessible CSS styling', 'Inclusive design and accessibility', 'Color contrast, focus styles, screen reader support', 'intermediate', 48),
('CSS', 'CSS Website Layout', 'css-website-layout', 'Common website layouts', 'Full-page layout patterns', 'Header, footer, sidebar, main content', 'intermediate', 49),
('CSS', 'CSS Advanced', 'css-advanced', 'Advanced CSS concepts', 'Complex CSS capabilities', 'Advanced selectors, techniques, patterns', 'advanced', 50),
('CSS', 'CSS Rounded Corners', 'css-rounded-corners', 'Border radius styling', 'Create rounded corners', 'border-radius, circular shapes, pills', 'advanced', 51),
('CSS', 'CSS Border Images', 'css-border-images', 'Image borders', 'Use images as borders', 'border-image property and slicing', 'advanced', 52),
('CSS', 'CSS Backgrounds', 'css-backgrounds-advanced', 'Advanced background effects', 'Multiple backgrounds, blend modes', 'background-size, background-attachment, blend modes', 'advanced', 53),
('CSS', 'CSS Colors', 'css-colors-advanced', 'Advanced color techniques', 'Color functions and custom properties', 'HSLA, CSS custom properties, color mixing', 'advanced', 54),
('CSS', 'CSS Gradients', 'css-gradients', 'Gradient backgrounds', 'Linear and radial gradients', 'linear-gradient, radial-gradient, conic-gradient', 'advanced', 55),
('CSS', 'CSS Shadows', 'css-shadows', 'Box and text shadows', 'Create shadow effects', 'box-shadow, text-shadow properties', 'advanced', 56),
('CSS', 'CSS Text Effects', 'css-text-effects', 'Creative text styling', 'Advanced text effects', 'text-shadow, text-stroke, fancy typography', 'advanced', 57),
('CSS', 'CSS Custom Fonts', 'css-custom-fonts', 'Embed custom fonts', 'Web font loading', '@font-face, Google Fonts, font loading', 'advanced', 58),
('CSS', 'CSS 2D Transforms', 'css-2d-transforms', '2D transformations', 'Rotate, scale, skew elements', 'translate, rotate, scale, skew, transform-origin', 'advanced', 59),
('CSS', 'CSS 3D Transforms', 'css-3d-transforms', '3D transformations', '3D element transformations', 'rotateX, rotateY, perspective, 3D space', 'advanced', 60),
('CSS', 'CSS Transitions', 'css-transitions', 'Smooth state changes', 'Animated transitions between states', 'transition-property, duration, easing, delay', 'advanced', 61),
('CSS', 'CSS Animations', 'css-animations', 'Keyframe animations', 'Complex animations', '@keyframes, animation properties', 'advanced', 62),
('CSS', 'CSS Tooltips', 'css-tooltips', 'Tooltip components', 'Hover tooltip styling', 'CSS tooltips, positioning, content property', 'advanced', 63),
('CSS', 'CSS Image Styling', 'css-image-styling', 'Style images', 'Image effects and styling', 'Image filters, hover effects', 'advanced', 64),
('CSS', 'CSS Image Modal', 'css-image-modal', 'Modal image viewer', 'Image modal overlay', 'Accessible modals, overlay patterns', 'advanced', 65),
('CSS', 'CSS Image Centering', 'css-image-centering', 'Center images', 'Horizontal and vertical centering', 'Flexbox centering, position centering', 'advanced', 66),
('CSS', 'CSS Image Filters', 'css-image-filters', 'Visual image filters', 'Filter effects on images', 'filter: blur, grayscale, brightness, contrast', 'advanced', 67),
('CSS', 'CSS Image Shapes', 'css-image-shapes', 'Create shapes from images', 'Shape masking and clipping', 'clip-path, shape-outside, masking', 'advanced', 68),
('CSS', 'CSS object-fit', 'css-object-fit', 'Fit media in containers', 'Contain, cover, fill options', 'object-fit: contain, cover, fill, scale-down', 'advanced', 69),
('CSS', 'CSS object-position', 'css-object-position', 'Position object content', 'Move image crop area', 'object-position: x y values', 'advanced', 70),
('CSS', 'CSS Masking', 'css-masking', 'Masking effects', 'Complex shape masks', 'mask-image, mask-mode, mask-repeat', 'advanced', 71),
('CSS', 'CSS Buttons', 'css-buttons', 'Button styling', 'styled buttons and interactions', 'Button states, hover, focus, active', 'advanced', 72),
('CSS', 'CSS Pagination', 'css-pagination', 'Pagination styles', 'Previous/next navigation', 'Pagination styling, active states', 'advanced', 73),
('CSS', 'CSS Multiple Columns', 'css-multiple-columns', 'Multi-column layouts', 'Text flowing across columns', 'column-count, column-gap, column-rule', 'advanced', 74),
('CSS', 'CSS User Interface', 'css-user-interface', 'UI component styling', 'Design UI components', 'Cards, modals, dropdowns, forms', 'advanced', 75),
('CSS', 'CSS Variables', 'css-variables', 'CSS custom properties', 'Reusable CSS values', '--variable: value; syntax, var() function', 'advanced', 76),
('CSS', 'CSS @property', 'css-at-property', 'Define custom property types', '@property rule syntax', '@property registration, inherit, initial', 'advanced', 77),
('CSS', 'CSS Box Sizing', 'css-box-sizing', 'Box sizing modes', 'content-box vs border-box', 'box-sizing property and effects', 'advanced', 78),
('CSS', 'CSS Media Queries', 'css-media-queries', 'Responsive media queries', '@media conditional styling', '@media screen, print, and conditions', 'advanced', 79),

-- FLEXBOX (80-84)
('CSS', 'CSS Flexbox', 'css-flexbox', 'Flexbox layout system', 'One-dimensional flexible layout', 'display: flex, flex-wrap, flex-direction', 'advanced', 80),
('CSS', 'Flexbox Intro', 'flexbox-intro', 'Introduction to flexbox', 'Flexbox fundamentals', 'Container and item concepts', 'advanced', 81),
('CSS', 'Flex Container', 'flex-container', 'Flex container properties', 'Container configuration', 'justify-content, align-items, gap', 'advanced', 82),
('CSS', 'Flex Items', 'flex-items', 'Flex item behavior', 'Item sizing and ordering', 'flex: grow, shrink, basis', 'advanced', 83),
('CSS', 'Flex Responsive', 'flex-responsive', 'Responsive flexbox layouts', 'Adapt flex layouts', 'Media queries, flex-wrap behavior', 'advanced', 84),

-- GRID (85-88)
('CSS', 'CSS Grid', 'css-grid', 'CSS Grid layout system', 'Two-dimensional grid layout', 'display: grid, grid-template', 'advanced', 85),
('CSS', 'Grid Intro', 'grid-intro', 'Introduction to CSS Grid', 'Grid fundamentals', 'Grid container, items, cells', 'advanced', 86),
('CSS', 'Grid Container', 'grid-container', 'Grid container properties', 'Grid setup and layout', 'grid-template-columns, grid-gap, grid-auto', 'advanced', 87),
('CSS', 'Grid Items', 'grid-items', 'Grid item placement', 'Item positioning on grid', 'grid-column, grid-row, grid-area', 'advanced', 88),

-- GRID ADVANCED (89-91)
('CSS', 'Grid 12-column Layout', 'grid-12-column-layout', '12-column grid system', 'Responsive 12-column grid', 'Bootstrap-like grid layout', 'advanced', 89),
('CSS', 'CSS @supports', 'css-at-supports', 'Feature detection', '@supports rule for capabilities', 'Feature queries, fallbacks', 'advanced', 90),

-- RESPONSIVE DESIGN (91-96)
('CSS', 'RWD Intro', 'rwd-intro', 'Responsive web design intro', 'Responsive design fundamentals', 'Mobile-first, viewports, breakpoints', 'advanced', 91),
('CSS', 'RWD Viewport', 'rwd-viewport', 'Viewport meta tag', 'Configure viewport', 'Viewport settings for mobile', 'advanced', 92),
('CSS', 'RWD Grid View', 'rwd-grid-view', 'Responsive grid views', 'Fluid grid systems', 'Percentage widths, responsive grids', 'advanced', 93),
('CSS', 'RWD Media Queries', 'rwd-media-queries', 'Responsive media queries', 'Breakpoint-based styling', '@media queries, responsive breakpoints', 'advanced', 94),
('CSS', 'RWD Images', 'rwd-images', 'Responsive images', 'Adaptive image sizing', 'max-width: 100%, responsive images', 'advanced', 95),
('CSS', 'RWD Videos', 'rwd-videos', 'Responsive videos', 'Video responsiveness', 'aspect-ratio, video sizing', 'advanced', 96),
('CSS', 'RWD Frameworks', 'rwd-frameworks', 'Responsive frameworks', 'Bootstrap, Tailwind CSS', 'Popular CSS frameworks', 'advanced', 97),
('CSS', 'RWD Templates', 'rwd-templates', 'Responsive templates', 'Template examples', 'Pre-built responsive layouts', 'advanced', 98),

-- SASS (99)
('CSS', 'SASS Tutorial', 'sass-tutorial', 'SASS/SCSS tutorial', 'Preprocessor for CSS', 'Variables, nesting, mixins, functions', 'advanced', 99),

-- EXAMPLES & RESOURCES (100-113)
('CSS', 'CSS Templates', 'css-templates', 'CSS template designs', 'Starter templates', 'Common template patterns', 'advanced', 100),
('CSS', 'CSS Examples', 'css-examples', 'CSS examples and demos', 'Practical CSS samples', 'Code examples, snippets', 'advanced', 101),
('CSS', 'CSS Editor', 'css-editor', 'CSS code editor', 'Online CSS editor', 'Practice CSS coding', 'advanced', 102),
('CSS', 'CSS Snippets', 'css-snippets', 'CSS code snippets', 'Reusable code pieces', 'Quick CSS solutions', 'advanced', 103),
('CSS', 'CSS Quiz', 'css-quiz', 'CSS knowledge quiz', 'Test your CSS knowledge', 'Interactive quiz', 'advanced', 104),
('CSS', 'CSS Exercises', 'css-exercises', 'CSS practice exercises', 'Hands-on practice', 'Coding challenges', 'advanced', 105),
('CSS', 'CSS Code Challenges', 'css-code-challenges', 'CSS challenges', 'Advanced challenges', 'Build projects', 'advanced', 106),
('CSS', 'CSS Website', 'css-website', 'CSS website guide', 'Building websites with CSS', 'Project guide', 'advanced', 107),
('CSS', 'CSS Syllabus', 'css-syllabus', 'Complete CSS syllabus', 'Full learning path', 'Learning roadmap', 'advanced', 108),
('CSS', 'CSS Study Plan', 'css-study-plan', 'CSS study plan', 'Structured learning plan', 'Weekly plan, schedule', 'advanced', 109),
('CSS', 'CSS Interview Prep', 'css-interview-prep', 'CSS interview preparation', 'Job interview readiness', 'Common questions', 'advanced', 110),
('CSS', 'CSS Bootcamp', 'css-bootcamp', 'CSS bootcamp course', 'Intensive CSS course', 'Full curriculum', 'advanced', 111),
('CSS', 'CSS Certificate', 'css-certificate', 'CSS certification program', 'Earn CSS certificate', 'Certificate path', 'advanced', 112),

-- REFERENCES (113-121)
('CSS', 'CSS Reference', 'css-reference', 'Complete CSS reference', 'All CSS properties', 'Property documentation', 'advanced', 113),
('CSS', 'CSS Selectors', 'css-selectors-reference', 'CSS selectors reference', 'All selector types', 'Selector documentation', 'advanced', 114),
('CSS', 'CSS Combinators', 'css-combinators-reference', 'CSS combinators reference', 'All combinator types', 'Combinator documentation', 'advanced', 115),
('CSS', 'CSS Pseudo-classes', 'css-pseudo-classes-reference', 'Pseudo-classes reference', 'All pseudo-classes', 'Pseudo-class documentation', 'advanced', 116),
('CSS', 'CSS Pseudo-elements', 'css-pseudo-elements-reference', 'Pseudo-elements reference', 'All pseudo-elements', 'Pseudo-element documentation', 'advanced', 117),
('CSS', 'CSS At-rules', 'css-at-rules', '@-rules reference', 'All at-rules', '@media, @font-face, etc', 'advanced', 118),
('CSS', 'CSS Functions', 'css-functions', 'CSS functions reference', 'All CSS functions', 'url(), calc(), var(), etc', 'advanced', 119),
('CSS', 'CSS Web Safe Fonts', 'css-web-safe-fonts', 'Web safe fonts list', 'Browser-safe fonts', 'Font recommendations', 'advanced', 120),
('CSS', 'CSS Animatable', 'css-animatable', 'Animatable properties', 'Properties that can animate', 'Animation targets', 'advanced', 121),
('CSS', 'CSS Units', 'css-units-reference', 'CSS units reference', 'All unit types', 'Unit documentation', 'advanced', 122),
('CSS', 'CSS PX-EM Converter', 'css-px-em-converter', 'PX to EM converter', 'Unit conversion tool', 'Conversion utilities', 'advanced', 123),
('CSS', 'CSS Colors', 'css-colors-reference', 'CSS color reference', 'All color formats', 'Color documentation', 'advanced', 124),
('CSS', 'CSS Color Values', 'css-color-values', 'CSS color values', 'Color value formats', 'Hex, RGB, HSL, named colors', 'advanced', 125),
('CSS', 'CSS Default Values', 'css-default-values', 'CSS default values', 'Default property values', 'Browser defaults', 'advanced', 126),
('CSS', 'CSS Browser Support', 'css-browser-support', 'CSS browser support', 'Feature support matrix', 'Browser compatibility', 'advanced', 127)

ON CONFLICT (language, slug) DO NOTHING;
