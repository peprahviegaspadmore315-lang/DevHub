-- H2 Database - Seed Data for Topics

-- Insert CSS Topics (use MERGE for H2 compatibility)
MERGE INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, is_premium, video_url, video_thumbnail, video_duration, created_at, updated_at)
KEY (language, slug)
VALUES
-- CSS HOME & BASICS
('CSS', 'CSS HOME', 'css-home', 'Entry point for CSS learning journey', 'CSS HOME section introduces the learning path', 'Start your CSS education here', 'Getting started with CSS, fundamentals', 'beginner', 1, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Introduction', 'css-introduction', 'Introduction to CSS and how it works', 'Understanding CSS basics is essential', 'CSS stands for Cascading Style Sheets', 'What CSS is, how it works with HTML, why we need it', 'beginner', 2, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Syntax', 'css-syntax', 'Learn the proper CSS syntax and structure', 'Correct syntax prevents styling errors', 'CSS uses selectors, properties, and values', 'Selectors, properties, values, syntax', 'beginner', 3, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Selectors', 'css-selectors', 'Learn how to select HTML elements to style', 'Selectors are the foundation of CSS', 'Select elements by type, class, ID, attribute', 'Element, class, ID, attribute, pseudo-class selectors', 'beginner', 4, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS How To', 'css-how-to', 'Practical usage examples and quick tasks', 'Practical guides speed up learning', 'How to use CSS in your HTML documents', 'Inline, internal, external CSS, best practices', 'beginner', 5, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Comments', 'css-comments', 'How to write comments in CSS', 'Comments document your code', 'Write comments in CSS with proper syntax', 'Comment syntax, documentation', 'beginner', 6, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Errors', 'css-errors', 'Finding and fixing CSS errors', 'Common mistakes and how to fix them', 'Common errors and debugging tips', 'Syntax errors, typos, invalid values', 'beginner', 7, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Colors', 'css-colors', 'Work with colors in CSS', 'Colors are fundamental to design', 'Color values: names, hex, rgb(), hsl()', 'Color formats, color names, hex codes, RGB, HSL', 'beginner', 8, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Backgrounds', 'css-backgrounds', 'Style element backgrounds', 'Backgrounds create visual hierarchy', 'Set background colors and images', 'background-color, background-image, background-size, repeat', 'beginner', 9, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Borders', 'css-borders', 'Add and customize borders on elements', 'Borders define elements visually', 'Style borders with width, color, style', 'border-width, border-color, border-style, border-radius', 'beginner', 10, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- SPACING
('CSS', 'CSS Margins', 'css-margins', 'Control spacing outside elements', 'Margins create space between elements', 'Control outer spacing with margin', 'margin-top, margin-right, margin-bottom, margin-left', 'beginner', 11, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Padding', 'css-padding', 'Control spacing inside elements', 'Padding creates inner space', 'Control inner spacing with padding', 'padding-top, padding-right, padding-bottom, padding-left', 'beginner', 12, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Height / Width', 'css-height-width', 'Set element dimensions precisely', 'Dimensions are key to layout', 'Set width and height of elements', 'height, width, min-height, max-height, min-width, max-width', 'beginner', 13, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- BOX MODEL
('CSS', 'CSS Box Model', 'css-box-model', 'Understand the CSS box model', 'Box model is core to CSS layout', 'Content, padding, border, margin layout', 'box model diagram, content, padding, border, margin', 'beginner', 14, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Outline', 'css-outline', 'Add outlines around elements', 'Outlines are outside borders', 'Create outlined effects', 'outline, outline-offset, outline-color, outline-style', 'beginner', 15, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- TEXT & FONTS
('CSS', 'CSS Text', 'css-text', 'Style text appearance and flow', 'Text styling improves readability', 'Align and style text', 'text-align, text-decoration, text-transform, line-height', 'beginner', 16, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Fonts', 'css-fonts', 'Use and style fonts in CSS', 'Fonts define typography', 'Apply and customize fonts', 'font-family, font-size, font-weight, font-style', 'beginner', 17, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Icons', 'css-icons', 'Style icons with CSS', 'Icons enhance UI design', 'Add and style icons', 'Icon fonts, SVG icons, icon sizing', 'beginner', 18, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- LINKS & LISTS
('CSS', 'CSS Links', 'css-links', 'Style HTML links and anchor tags', 'Link styling improves UX', 'Style different link states', 'a:link, a:visited, a:hover, a:active', 'beginner', 19, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Lists', 'css-lists', 'Style ordered and unordered lists', 'List styling improves navigation', 'Style list markers and layout', 'list-style-type, list-style-image, list-style-position', 'beginner', 20, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- TABLES
('CSS', 'CSS Tables', 'css-tables', 'Style HTML tables', 'Table styling for data display', 'Make tables look good', 'border-collapse, border-spacing, table layouts', 'beginner', 21, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- DISPLAY & LAYOUT
('CSS', 'CSS Display', 'css-display', 'Control element display and layout', 'Display property is fundamental', 'Control how elements flow', 'block, inline, inline-block, none, flex, grid', 'beginner', 22, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Max-width', 'css-max-width', 'Responsive width constraints', 'Max-width for responsive design', 'Limit element maximum width', 'max-width, responsive layouts, container sizing', 'beginner', 23, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Position', 'css-position', 'Element positioning methods', 'Positioning enables advanced layouts', 'Position elements absolutely or relatively', 'static, relative, absolute, fixed, sticky', 'beginner', 24, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Position Offsets', 'css-position-offsets', 'Offset positioned elements', 'Fine-tune element placement', 'Move positioned elements with offsets', 'top, right, bottom, left properties', 'beginner', 25, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Z-index', 'css-z-index', 'Control element stacking order', 'Z-index controls layering', 'Layer elements on z-plane', 'z-index stacking, stacking contexts', 'beginner', 26, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Overflow', 'css-overflow', 'Handle content overflow', 'Overflow handling is important', 'Control scrolling and clipping', 'overflow: visible|hidden|scroll|auto', 'beginner', 27, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Float', 'css-float', 'Float elements for text wrapping', 'Float for image and text layouts', 'Wrap text around images', 'float: left|right|none, clear property', 'beginner', 28, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Inline-block', 'css-inline-block', 'Inline-block display behavior', 'Blend inline and block properties', 'Combine inline and block traits', 'display: inline-block behavior', 'beginner', 29, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Align', 'css-align', 'Alignment in CSS', 'Alignment improves layout', 'Align content precisely', 'text-align, vertical-align, justify-content, align-items', 'beginner', 30, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- SELECTORS & SPECIFICITY
('CSS', 'CSS Combinators', 'css-combinators', 'Combine selectors for targeting', 'Combinators create complex selectors', 'Select elements by relationships', 'Descendant, child, adjacent, sibling combinators', 'beginner', 31, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Pseudo-classes', 'css-pseudo-classes', 'Style based on element state', 'Pseudo-classes for interactivity', 'Style elements in different states', 'hover, focus, active, nth-child, first-child', 'beginner', 32, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Pseudo-elements', 'css-pseudo-elements', 'Style parts of elements', 'Access element parts without HTML', 'Style element contents creatively', 'before, after, first-letter, first-line', 'beginner', 33, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Opacity', 'css-opacity', 'Control element transparency', 'Opacity for visual effects', 'Make elements transparent', 'opacity property, transparency levels', 'beginner', 34, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Navigation Bars', 'css-navigation-bars', 'Build styled navigation bars', 'Navigation is essential to design', 'Create menus and navbars', 'Horizontal and vertical navbars, styling', 'beginner', 35, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Dropdowns', 'css-dropdowns', 'Create dropdown menus', 'Dropdowns for navigation', 'Build menu dropdowns', 'Hover dropdowns, positioning, visibility', 'intermediate', 36, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Image Gallery', 'css-image-gallery', 'Create responsive galleries', 'Galleries showcase images', 'Build image galleries', 'Grid/flex galleries, responsive design', 'intermediate', 37, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Image Sprites', 'css-image-sprites', 'Optimize with image sprites', 'Sprites improve performance', 'Combine images into one file', 'Sprite sheets, background-position', 'intermediate', 38, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Attribute Selectors', 'css-attribute-selectors', 'Select by HTML attributes', 'Attribute selectors are powerful', 'Target elements by attributes', '[attr], [attr=value], [attr^=value]', 'intermediate', 39, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Forms', 'css-forms', 'Style form elements', 'Forms need good styling', 'Make forms look great', 'input, textarea, button, select styling', 'intermediate', 40, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Counters', 'css-counters', 'Auto-increment counters', 'Advanced numbering technique', 'Auto-number lists without HTML', 'counter-reset, counter-increment', 'intermediate', 41, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Units', 'css-units', 'CSS measurement units', 'Units are fundamental to sizing', 'Understand various units', 'px, em, rem, %, vw, vh, ch, cm, mm', 'intermediate', 42, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Inheritance', 'css-inheritance', 'Inherited CSS properties', 'Properties cascade to children', 'Understand inheritance rules', 'inherit keyword, inheritable properties', 'intermediate', 43, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Specificity', 'css-specificity', 'CSS cascading and specificity', 'Specificity determines rule order', 'Calculate rule precedence', 'Inline > ID > Class > Element specificity', 'intermediate', 44, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- ADVANCED BASICS
('CSS', 'CSS !important', 'css-important', 'Override with !important', 'Force rule priority', '!important flag usage', '!important usage and caution', 'intermediate', 45, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Math Functions', 'css-math-functions', 'Dynamic calculations in CSS', 'Calculate values dynamically', 'Use CSS math functions', 'calc(), min(), max(), clamp() functions', 'intermediate', 46, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Optimization', 'css-optimization', 'Optimize CSS performance', 'Performance best practices', 'Minimize and optimize CSS', 'Minify, critical CSS, avoiding redundancy', 'intermediate', 47, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Accessibility', 'css-accessibility', 'Accessible CSS styling', 'Inclusive design practices', 'Accessible styling techniques', 'Color contrast, focus styles, screen reader support', 'intermediate', 48, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Website Layout', 'css-website-layout', 'Common website layouts', 'Full-page layout patterns', 'Build complete layouts', 'Header, footer, sidebar, main content, responsive', 'intermediate', 49, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- ADVANCED
('CSS', 'CSS Advanced', 'css-advanced', 'Advanced CSS concepts', 'Complex CSS capabilities', 'Master advanced techniques', 'Advanced selectors, techniques, patterns', 'advanced', 50, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Rounded Corners', 'css-rounded-corners', 'Border radius styling', 'Create rounded corners', 'Smooth corners with border-radius', 'border-radius, circular shapes, pills', 'advanced', 51, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Border Images', 'css-border-images', 'Image borders', 'Use images as borders', 'Advanced border techniques', 'border-image property and slicing', 'advanced', 52, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Backgrounds', 'css-backgrounds-advanced', 'Advanced background effects', 'Multiple backgrounds and blend modes', 'Complex background styles', 'background-size, background-attachment, blend modes', 'advanced', 53, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Colors', 'css-colors-advanced', 'Advanced color techniques', 'Color functions and variables', 'Master color manipulation', 'HSLA, CSS custom properties, color mixing', 'advanced', 54, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Gradients', 'css-gradients', 'Gradient backgrounds', 'Linear and radial gradients', 'Create gradient effects', 'linear-gradient, radial-gradient, conic-gradient', 'advanced', 55, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Shadows', 'css-shadows', 'Box and text shadows', 'Shadow effects for design', 'Add shadows to elements', 'box-shadow, text-shadow, shadow effects', 'advanced', 56, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Text Effects', 'css-text-effects', 'Creative text styling', 'Advanced text effects', 'Special text effects', 'text-shadow, text-stroke, fancy typography', 'advanced', 57, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Custom Fonts', 'css-custom-fonts', 'Embed custom fonts', 'Web font loading', 'Use custom fonts in designs', '@font-face, Google Fonts, font loading strategies', 'advanced', 58, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS 2D Transforms', 'css-2d-transforms', '2D transformations', 'Rotate, scale, skew elements', 'Apply 2D transforms', 'translate, rotate, scale, skew, transform-origin', 'advanced', 59, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS 3D Transforms', 'css-3d-transforms', '3D transformations', '3D element transformations', 'Create 3D effects', 'rotateX, rotateY, perspective, 3D space', 'advanced', 60, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Transitions', 'css-transitions', 'Smooth state changes', 'Animated transitions', 'Smooth animation between states', 'transition-property, duration, easing, delay', 'advanced', 61, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Animations', 'css-animations', 'Keyframe animations', 'Complex animations', 'Create keyframe-based animations', '@keyframes, animation properties, timing', 'advanced', 62, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Tooltips', 'css-tooltips', 'Tooltip components', 'Hover tooltip styling', 'Create styled tooltips', 'CSS tooltips, positioning, content property', 'advanced', 63, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Image Styling', 'css-image-styling', 'Style images', 'Image effects and styling', 'Enhance images with CSS', 'Image filters, hover effects, overlays', 'advanced', 64, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Image Modal', 'css-image-modal', 'Modal image viewer', 'Image modal overlay', 'Accessible modal patterns', 'Modal styling, overlay effects, close buttons', 'advanced', 65, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Image Centering', 'css-image-centering', 'Center images', 'Image alignment techniques', 'Center images perfectly', 'Flexbox centering, position centering, margin auto', 'advanced', 66, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Image Filters', 'css-image-filters', 'Visual image filters', 'Filter effects on images', 'Apply visual filters', 'filter: blur, grayscale, brightness, contrast, sepia', 'advanced', 67, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Image Shapes', 'css-image-shapes', 'Create shapes from images', 'Shape masking and clipping', 'Non-rectangular image shapes', 'clip-path, shape-outside, masking', 'advanced', 68, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS object-fit', 'css-object-fit', 'Fit media in containers', 'Contain, cover, fill options', 'Responsive media sizing', 'object-fit: contain, cover, fill, scale-down', 'advanced', 69, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS object-position', 'css-object-position', 'Position object content', 'Move image crop area', 'Focus on specific image areas', 'object-position: x y values, keyword combinations', 'advanced', 70, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Masking', 'css-masking', 'Masking effects', 'Complex shape masks', 'Create masked effects', 'mask-image, mask-mode, mask-repeat, mask-size', 'advanced', 71, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Buttons', 'css-buttons', 'Button styling', 'Styled buttons and interactions', 'Design great buttons', 'Button states, hover, focus, active effects', 'advanced', 72, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Pagination', 'css-pagination', 'Pagination styles', 'Page navigation styling', 'Paginated content navigation', 'Pagination styling, active states, hover effects', 'advanced', 73, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Multiple Columns', 'css-multiple-columns', 'Multi-column layouts', 'Text flowing across columns', 'Column text layout', 'column-count, column-gap, column-rule, column-width', 'advanced', 74, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS User Interface', 'css-user-interface', 'UI component styling', 'Design UI components', 'Professional UI design', 'Cards, modals, dropdowns, forms, lists', 'advanced', 75, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Variables', 'css-variables', 'CSS custom properties', 'Reusable CSS values', 'CSS variable definition and usage', '--variable: value; syntax, var() function', 'advanced', 76, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS @property', 'css-at-property', 'Define custom property types', '@property rule syntax', 'Advanced property definitions', '@property registration, inherit, initial values', 'advanced', 77, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Box Sizing', 'css-box-sizing', 'Box sizing modes', 'content-box vs border-box', 'Control box model behavior', 'box-sizing property, content-box, border-box', 'advanced', 78, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Media Queries', 'css-media-queries', 'Responsive media queries', '@media conditional styling', 'Responsive design foundation', '@media screen, print, and conditions, breakpoints', 'advanced', 79, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- FLEXBOX
('CSS', 'CSS Flexbox', 'css-flexbox', 'Flexbox layout system', 'One-dimensional flexible layout', 'Modern layout with flexbox', 'display: flex, flex-wrap, flex-direction, alignment', 'advanced', 80, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Flexbox Intro', 'flexbox-intro', 'Introduction to flexbox', 'Flexbox fundamentals', 'Learn flexbox basics', 'Container and item concepts, main axis, cross axis', 'advanced', 81, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Flex Container', 'flex-container', 'Flex container properties', 'Container configuration', 'Configure flex containers', 'justify-content, align-items, gap, flex-wrap', 'advanced', 82, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Flex Items', 'flex-items', 'Flex item behavior', 'Item sizing and ordering', 'Control flex items', 'flex: grow, shrink, basis, flex-shrink, flex-grow', 'advanced', 83, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Flex Responsive', 'flex-responsive', 'Responsive flexbox layouts', 'Adapt flex layouts', 'Responsive flex design', 'Media queries, flex-wrap behavior, responsive stacking', 'advanced', 84, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- GRID
('CSS', 'CSS Grid', 'css-grid', 'CSS Grid layout system', 'Two-dimensional grid layout', 'Master CSS Grid', 'display: grid, grid-template, grid areas', 'advanced', 85, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Grid Intro', 'grid-intro', 'Introduction to CSS Grid', 'Grid fundamentals', 'Grid layout basics', 'Grid container, items, cells, rows, columns', 'advanced', 86, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Grid Container', 'grid-container', 'Grid container properties', 'Grid setup and layout', 'Configure grid layout', 'grid-template-columns, grid-gap, grid-auto-flow', 'advanced', 87, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Grid Items', 'grid-items', 'Grid item placement', 'Item positioning on grid', 'Place items on grid', 'grid-column, grid-row, grid-area, alignment', 'advanced', 88, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'Grid 12-column Layout', 'grid-12-column-layout', '12-column grid system', 'Responsive 12-column grid', 'Common grid pattern', 'Bootstrap-like grid, responsive columns', 'advanced', 89, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS @supports', 'css-at-supports', 'Feature detection', '@supports rule for capabilities', 'Feature queries for fallbacks', 'Feature queries, conditional CSS', 'advanced', 90, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- RESPONSIVE DESIGN
('CSS', 'RWD Intro', 'rwd-intro', 'Responsive web design intro', 'Responsive design principles', 'Responsive design foundation', 'Mobile-first, viewports, breakpoints, fluid design', 'advanced', 91, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'RWD Viewport', 'rwd-viewport', 'Viewport meta tag', 'Configure viewport', 'Viewport setup for mobile', 'Viewport settings, device-width, initial-scale', 'advanced', 92, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'RWD Grid View', 'rwd-grid-view', 'Responsive grid views', 'Fluid grid systems', 'Responsive grids', 'Percentage widths, responsive grids, flexible', 'advanced', 93, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'RWD Media Queries', 'rwd-media-queries', 'Responsive media queries', 'Breakpoint-based styling', 'Media query patterns', '@media queries, breakpoints, responsive rules', 'advanced', 94, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'RWD Images', 'rwd-images', 'Responsive images', 'Adaptive image sizing', 'Mobile-friendly images', 'max-width: 100%, responsive images, srcset', 'advanced', 95, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'RWD Videos', 'rwd-videos', 'Responsive videos', 'Video responsiveness', 'Embedded videos responsive', 'aspect-ratio, video sizing, iframe scaling', 'advanced', 96, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'RWD Frameworks', 'rwd-frameworks', 'Responsive frameworks', 'Bootstrap, Tailwind CSS', 'CSS frameworks for responsive design', 'Popular CSS frameworks, grid systems', 'advanced', 97, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'RWD Templates', 'rwd-templates', 'Responsive templates', 'Template examples', 'Pre-built responsive layouts', 'Landing pages, blog templates, app layouts', 'advanced', 98, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- SASS
('CSS', 'SASS Tutorial', 'sass-tutorial', 'SASS/SCSS tutorial', 'Preprocessor for CSS', 'CSS preprocessing with SASS', 'SASS variables, nesting, mixins, functions', 'advanced', 99, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- EXAMPLES & RESOURCES
('CSS', 'CSS Templates', 'css-templates', 'CSS template designs', 'Starter templates', 'Pre-built CSS templates', 'Common template patterns, layouts', 'advanced', 100, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Examples', 'css-examples', 'CSS examples and demos', 'Practical CSS samples', 'Code examples', 'Code examples, snippets, live demos', 'advanced', 101, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Editor', 'css-editor', 'CSS code editor', 'Online CSS editor', 'Practice CSS coding', 'Online editor, code playground', 'advanced', 102, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Snippets', 'css-snippets', 'CSS code snippets', 'Reusable code pieces', 'Quick CSS solutions', 'Common snippets, ready-to-use code', 'advanced', 103, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Quiz', 'css-quiz', 'CSS knowledge quiz', 'Test your CSS knowledge', 'Interactive quiz', 'Multiple choice, interactive testing', 'advanced', 104, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Exercises', 'css-exercises', 'CSS practice exercises', 'Hands-on practice', 'Coding challenges', 'Guided exercises, hands-on practice', 'advanced', 105, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Code Challenges', 'css-code-challenges', 'CSS challenges', 'Advanced challenges', 'Build projects', 'Complex challenges, real-world scenarios', 'advanced', 106, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Website', 'css-website', 'CSS website guide', 'Building websites with CSS', 'Project guide', 'Complete website building guide', 'advanced', 107, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Syllabus', 'css-syllabus', 'Complete CSS syllabus', 'Full learning path', 'Learning roadmap', 'Complete curriculum overview', 'advanced', 108, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Study Plan', 'css-study-plan', 'CSS study plan', 'Structured learning plan', 'Weekly plan', 'Weekly schedule, learning path', 'advanced', 109, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Interview Prep', 'css-interview-prep', 'CSS interview preparation', 'Job interview readiness', 'Interview questions', 'Common questions, interview tips', 'advanced', 110, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Bootcamp', 'css-bootcamp', 'CSS bootcamp course', 'Intensive CSS course', 'Full curriculum', 'Comprehensive bootcamp course', 'advanced', 111, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Certificate', 'css-certificate', 'CSS certification program', 'Earn CSS certificate', 'Certificate path', 'Certification program, completion path', 'advanced', 112, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- REFERENCES
('CSS', 'CSS Reference', 'css-reference', 'Complete CSS reference', 'All CSS properties', 'Property documentation', 'Complete CSS property reference', 'advanced', 113, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Selectors', 'css-selectors-reference', 'CSS selectors reference', 'All selector types', 'Selector documentation', 'Complete selector reference', 'advanced', 114, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Combinators', 'css-combinators-reference', 'CSS combinators reference', 'All combinator types', 'Combinator documentation', 'Complete combinator reference', 'advanced', 115, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Pseudo-classes', 'css-pseudo-classes-reference', 'Pseudo-classes reference', 'All pseudo-classes', 'Complete pseudo-class reference', 'All CSS pseudo-classes', 'advanced', 116, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Pseudo-elements', 'css-pseudo-elements-reference', 'Pseudo-elements reference', 'All pseudo-elements', 'Complete pseudo-element reference', 'All CSS pseudo-elements', 'advanced', 117, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS At-rules', 'css-at-rules', '@-rules reference', 'All at-rules', '@media, @font-face, etc', '@-rules complete reference', 'advanced', 118, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Functions', 'css-functions', 'CSS functions reference', 'All CSS functions', 'url(), calc(), var(), etc', 'CSS functions complete reference', 'advanced', 119, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Web Safe Fonts', 'css-web-safe-fonts', 'Web safe fonts list', 'Browser-safe fonts', 'Font recommendations', 'Web-safe font recommendations', 'advanced', 120, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Animatable', 'css-animatable', 'Animatable properties', 'Properties that can animate', 'Animation targets', 'Animatable properties reference', 'advanced', 121, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Units', 'css-units-reference', 'CSS units reference', 'All unit types', 'Unit documentation', 'Complete units reference', 'advanced', 122, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS PX-EM Converter', 'css-px-em-converter', 'PX to EM converter', 'Unit conversion tool', 'Conversion utilities', 'Unit conversion tools', 'advanced', 123, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Colors', 'css-colors-reference', 'CSS color reference', 'All color formats', 'Color documentation', 'Complete color reference', 'advanced', 124, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Color Values', 'css-color-values', 'CSS color values', 'Color value formats', 'Hex, RGB, HSL, named colors', 'Color values complete reference', 'advanced', 125, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Default Values', 'css-default-values', 'CSS default values', 'Default property values', 'Browser defaults', 'CSS default values reference', 'advanced', 126, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS', 'CSS Browser Support', 'css-browser-support', 'CSS browser support', 'Feature support matrix', 'Browser compatibility', 'Browser support matrix for CSS features', 'advanced', 127, false, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
;
