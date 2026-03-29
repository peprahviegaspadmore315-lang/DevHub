export interface Lesson {
  id: number
  title: string
  summary: string
  content: string
  codeSample: string
}

export interface CourseData {
  id: number
  slug: string
  title: string
  category: 'Web Development' | 'Programming'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  description: string
  lessons: Lesson[]
  image: string
}

const HTML_TUTORIAL_CODE_SAMPLE = `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>

  <h1>Hello World</h1>
  <p>This is my first web page.</p>

</body>
</html>`

const HTML_HOME_CODE_SAMPLE = `<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>

  <h1>This is a Heading</h1>
  <p>This is a paragraph.</p>

</body>
</html>`

const HTML_INTRODUCTION_CODE_SAMPLE = `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>

  <h1>Welcome to HTML</h1>
  <p>This is my first webpage.</p>

</body>
</html>`

const HTML_EDITORS_CODE_SAMPLE = `<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>`

const HTML_BASIC_CODE_SAMPLE = `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>

  <h1>This is a Heading</h1>
  <p>This is a paragraph.</p>

</body>
</html>`

const HTML_ELEMENTS_CODE_SAMPLE = `<html>
<body>
  <h1>My Website</h1>
  <p>This is a paragraph.</p>
</body>
</html>`

const HTML_ATTRIBUTES_CODE_SAMPLE = `<a href="https://example.com" target="_blank" title="Open link">
  Visit Website
</a>`

const HTML_HEADINGS_CODE_SAMPLE = `<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
<p>This is a paragraph under a subsection.</p>`

const HTML_TUTORIAL_LESSON_CONTENT = `======================================

TITLE:
HTML Tutorial

======================================

INTRODUCTION:
HTML stands for HyperText Markup Language.

It is the standard language used to create web pages.

HTML describes the structure of a webpage using elements.

These elements tell the browser how to display content such as text, images, links, and more.

HTML is not a programming language. It is a markup language.

======================================

WHAT YOU WILL LEARN:
- What HTML is and how it works
- How to create a basic webpage
- How HTML elements are structured
- How to use tags like headings, paragraphs, and links

======================================

WHY LEARN HTML:
- It is the foundation of all websites
- It is easy to learn
- It works with CSS and JavaScript to build modern web apps

======================================

EXAMPLE:
Show a simple HTML example:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>

  <h1>Hello World</h1>
  <p>This is my first web page.</p>

</body>
</html>
\`\`\`

Explain:
- \`<!DOCTYPE html>\` defines the document type
- \`<html>\` is the root element
- \`<head>\` contains metadata
- \`<body>\` contains visible content

======================================

HOW IT WORKS:
Explain that:
- HTML uses tags like \`<p>\` and \`<h1>\`
- Tags usually come in pairs: opening and closing
- Browsers read HTML and display content visually

======================================

REAL LIFE ANALOGY:
HTML is like the skeleton of a human body.

It gives structure to a webpage.

CSS adds design, and JavaScript adds behavior.

======================================

TIP:
You can write HTML using any text editor, like VS Code.

======================================

NEXT STEP:
Move to **HTML HOME** or **HTML Introduction** to keep building your understanding step by step.

======================================`

const HTML_HOME_LESSON_CONTENT = `======================================

TITLE:
HTML HOME

======================================

INTRODUCTION:
Welcome to the HTML Tutorial.

HTML is the standard markup language used to create web pages.

With HTML, you can structure content such as headings, paragraphs, images, links, and more.

Every website you visit is built using HTML.

======================================

WHAT IS HTML:
HTML stands for HyperText Markup Language.

- HyperText means links that connect web pages
- Markup Language means it uses tags to define elements

HTML describes the structure of a webpage.

======================================

A SIMPLE HTML DOCUMENT:
Show this example:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>

  <h1>This is a Heading</h1>
  <p>This is a paragraph.</p>

</body>
</html>
\`\`\`

======================================

EXPLANATION:
Explain each part clearly:

- \`<!DOCTYPE html>\` → Defines this document as HTML5
- \`<html>\` → The root of the HTML page
- \`<head>\` → Contains meta information (not visible)
- \`<title>\` → Title shown in browser tab
- \`<body>\` → Contains visible content
- \`<h1>\` → A main heading
- \`<p>\` → A paragraph

======================================

HOW HTML ELEMENTS WORK:
Explain:
- HTML uses elements to build content
- Elements usually have:
  - Opening tag
  - Content
  - Closing tag

Example:
\`<p>This is a paragraph</p>\`

======================================

WEB BROWSER VIEW:
Explain:
Web browsers like Chrome, Edge, and Firefox read HTML files and display them visually.

======================================

WHY HTML IS IMPORTANT:
- It is the foundation of all websites
- It works with CSS (design) and JavaScript (functionality)
- Without HTML, websites cannot exist

======================================

TIP:
Always save your HTML file with a .html extension, for example \`index.html\`

======================================

NEXT STEP:
Continue with **HTML Introduction** to learn more about how HTML works.

======================================`

const HTML_INTRODUCTION_LESSON_CONTENT = `======================================

TITLE:
HTML Introduction

======================================

INTRODUCTION:
HTML stands for HyperText Markup Language.

It is the standard language used to create and structure web pages.

Every website you see on the internet is built using HTML in combination with CSS and JavaScript.

HTML is used to define the structure of a webpage, while CSS is used for styling and JavaScript adds interactivity.

======================================

WHAT IS HTML:
HTML is a markup language, not a programming language.

This means:
- It does not perform logic like calculations
- It is used to organize and display content

HTML uses elements (tags) to structure content.

Examples of content:
- Text
- Images
- Links
- Tables
- Forms

======================================

HOW HTML WORKS:
Explain clearly:

When you write HTML code:
1. You create a file, for example \`index.html\`
2. A web browser reads the file
3. The browser renders the content visually

The browser does not show the HTML code itself — it shows the result.

======================================

BASIC STRUCTURE OF AN HTML PAGE:
Show this example:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>

  <h1>Welcome to HTML</h1>
  <p>This is my first webpage.</p>

</body>
</html>
\`\`\`

======================================

DETAILED EXPLANATION:
Explain each part in a simple way:

- \`<!DOCTYPE html>\`
  Declares the document type and version of HTML.

- \`<html>\`
  The root element that contains everything on the page.

- \`<head>\`
  Contains meta information like title, links to styles, and other page settings.

- \`<title>\`
  The text shown in the browser tab.

- \`<body>\`
  Contains all visible content like text, images, buttons, and links.

======================================

HTML ELEMENTS:
Explain clearly:

An HTML element usually consists of:
- Opening tag
- Content
- Closing tag

Example:
\`<p>This is a paragraph</p>\`

Some elements do not have closing tags:
Example:
\`<br>\` (line break)
\`<img>\` (image)

======================================

HTML ATTRIBUTES:
Explain:

Attributes provide additional information about elements.

Example:
\`<a href="https://example.com">Visit</a>\`

- \`href\` is an attribute
- It defines the link destination

======================================

HTML TAGS YOU WILL LEARN:
Give a preview:

- Headings (\`<h1>\` to \`<h6>\`)
- Paragraphs (\`<p>\`)
- Links (\`<a>\`)
- Images (\`<img>\`)
- Lists (\`<ul>\`, \`<ol>\`)
- Tables (\`<table>\`)
- Forms (\`<form>\`)

======================================

REAL LIFE ANALOGY:
HTML is like the skeleton of a building.

It defines the structure and layout.

CSS is like paint and decoration.

JavaScript is like electricity and behavior.

======================================

WHY HTML IS EASY TO LEARN:
- Simple syntax
- Easy to read and write
- No special software required
- Works in all browsers

======================================

TIP:
Always close your tags properly to avoid errors.

======================================

NEXT STEP:
Move to **HTML Editors** or **HTML Basic** to continue learning and start writing HTML on your own.

======================================`

const HTML_EDITORS_LESSON_CONTENT = `======================================

TITLE:
HTML Editors

======================================

INTRODUCTION:
To write HTML code, you need an HTML editor.

An HTML editor is simply a program used to write and edit HTML code.

It allows you to create, modify, and save HTML files.

You do NOT need expensive software to write HTML.

Even a simple text editor can be used.

======================================

TYPES OF HTML EDITORS:
There are two main types of editors:

1. Text Editors (Basic)
2. Code Editors (Advanced)

======================================

1. BASIC TEXT EDITORS:
Examples:
- Notepad (Windows)
- TextEdit (Mac)

These are simple editors that allow you to type HTML code.

Advantages:
- Easy to use
- No setup required

Disadvantages:
- No color highlighting
- No suggestions or auto-completion
- Harder to manage large projects

======================================

2. CODE EDITORS (RECOMMENDED):
Examples:
- Visual Studio Code (VS Code)
- Sublime Text
- Atom

These editors are designed for programming.

Advantages:
- Syntax highlighting (colors for code)
- Auto-completion
- Error detection
- Extensions for extra features

VS Code is highly recommended for beginners.

======================================

HOW TO CREATE YOUR FIRST HTML FILE:
Step-by-step guide:

1. Open your editor, for example VS Code
2. Click "New File"
3. Write this code:

\`\`\`html
<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>
\`\`\`

4. Save the file as:
\`index.html\`

IMPORTANT:
Make sure the file extension is \`.html\`

======================================

HOW TO VIEW YOUR HTML FILE:
After saving:

1. Locate the file on your computer
2. Double-click it
3. It will open in your web browser

OR

Right-click → Open with → Browser (Chrome, Edge, etc.)

======================================

WHAT HAPPENS NEXT:
The browser reads your HTML file and displays the content.

You will see:
- A heading
- A paragraph

======================================

WHY CODE EDITORS ARE BETTER:
Explain clearly:

Code editors make development faster and easier because they:
- Highlight errors
- Suggest code automatically
- Improve readability

======================================

REAL LIFE TIP:
Use Visual Studio Code for best experience.

You can install extensions like:
- Live Server (to preview changes instantly)

======================================

COMMON MISTAKES:
- Saving file as \`.txt\` instead of \`.html\`
- Forgetting to save before opening
- Writing code outside \`<html>\` tags

======================================

TIP:
Always save your file and refresh your browser after making changes.

======================================

NEXT STEP:
Continue to **HTML Basic** to start writing and understanding simple HTML structure.

======================================`

const HTML_BASIC_LESSON_CONTENT = `======================================

TITLE:
HTML Basic

======================================

INTRODUCTION:
In this section, you will learn the basic structure of an HTML document and how to write simple HTML code.

HTML uses elements (tags) to define the structure of a webpage.

These elements are used to display content such as headings, paragraphs, links, and images.

======================================

BASIC HTML DOCUMENT:
Show this example:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>

  <h1>This is a Heading</h1>
  <p>This is a paragraph.</p>

</body>
</html>
\`\`\`

======================================

EXPLANATION:
Explain clearly:

- \`<!DOCTYPE html>\`
  Declares the document type (HTML5)

- \`<html>\`
  The root element of the page

- \`<head>\`
  Contains meta information (not visible)

- \`<title>\`
  Sets the browser tab title

- \`<body>\`
  Contains visible content

======================================

HTML HEADINGS:
HTML headings are used to define titles and subtitles.

Example:

\`\`\`html
<h1>This is heading 1</h1>
<h2>This is heading 2</h2>
<h3>This is heading 3</h3>
\`\`\`

Explain:
- \`<h1>\` is the largest and most important
- \`<h6>\` is the smallest

======================================

HTML PARAGRAPHS:
HTML paragraphs are defined using the \`<p>\` tag.

Example:

\`\`\`html
<p>This is a paragraph.</p>
\`\`\`

Explain:
- Browsers automatically add space before and after paragraphs

======================================

HTML LINKS:
HTML links are created using the \`<a>\` tag.

Example:

\`\`\`html
<a href="https://www.google.com">Visit Google</a>
\`\`\`

Explain:
- \`href\` specifies the link destination

======================================

HTML IMAGES:
Images are displayed using the \`<img>\` tag.

Example:

\`\`\`html
<img src="image.jpg" alt="My Image">
\`\`\`

Explain:
- \`src\` = image path
- \`alt\` = alternative text (important for accessibility)

======================================

HTML BUTTONS:
Buttons are created using the \`<button>\` tag.

Example:

\`\`\`html
<button>Click Me</button>
\`\`\`

======================================

HTML LISTS:
There are two types of lists:

1. Unordered List:

\`\`\`html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
\`\`\`

2. Ordered List:

\`\`\`html
<ol>
  <li>First</li>
  <li>Second</li>
</ol>
\`\`\`

======================================

HOW TO TEST YOUR CODE:
- Save your file as \`.html\`
- Open it in a browser
- Refresh after changes

======================================

COMMON MISTAKES:
- Forgetting closing tags
- Incorrect nesting of elements
- Missing quotes in attributes

======================================

TIP:
Always write clean and properly indented HTML for better readability.

======================================

NEXT STEP:
Move to **HTML Elements** to learn more about how HTML tags and elements work in detail.

======================================`

const HTML_ELEMENTS_LESSON_CONTENT = `======================================

TITLE:
HTML Elements

======================================

INTRODUCTION:
An HTML element is the basic building block of an HTML page.

Everything you see on a webpage is created using HTML elements.

An element defines how content is structured and displayed in the browser.

======================================

WHAT IS AN HTML ELEMENT:
An HTML element usually consists of:

- Opening tag
- Content
- Closing tag

Example:

\`\`\`html
<p>This is a paragraph</p>
\`\`\`

Explanation:
- \`<p>\` → opening tag
- \`This is a paragraph\` → content
- \`</p>\` → closing tag

======================================

NESTED HTML ELEMENTS:
HTML elements can be placed inside other elements.

This is called nesting.

Example:

\`\`\`html
<html>
<body>
  <h1>My Website</h1>
  <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

Explanation:
- \`<html>\` contains everything
- \`<body>\` contains visible content
- Elements inside others must be properly nested

======================================

EMPTY HTML ELEMENTS:
Some HTML elements do not have closing tags.

They are called empty elements.

Examples:

\`\`\`html
<br>
<hr>
<img src="image.jpg" alt="image">
\`\`\`

Explanation:
- These elements do not contain content
- They are self-contained

======================================

HTML TAGS VS ELEMENTS:
Explain clearly:

- A tag is the name inside angle brackets, for example \`<p>\`
- An element includes the tag + content + closing tag

Example:
\`<p>Hello</p>\` → this is an element

======================================

HTML ATTRIBUTES (INTRO):
Elements can have attributes that provide extra information.

Example:

\`\`\`html
<a href="https://example.com">Visit</a>
\`\`\`

Explanation:
- \`href\` is an attribute
- It defines where the link goes

======================================

CASE INSENSITIVITY:
HTML tags are not case-sensitive.

This means \`<P>\` and \`<p>\` work the same way in most browsers.

However, it is best practice to write HTML tags in lowercase.

======================================

WHY HTML ELEMENTS MATTER:
- They organize content on a page
- They help browsers understand what to display
- They make your code more structured and easier to read

======================================

TIP:
Always nest elements properly and keep your HTML clean and readable.

======================================

NEXT STEP:
Move to **HTML Attributes** to learn how to add extra information to HTML elements.

======================================`

const HTML_ATTRIBUTES_LESSON_CONTENT = `======================================

TITLE:
HTML Attributes

======================================

INTRODUCTION:
HTML attributes provide additional information about HTML elements.

They modify the behavior or appearance of an element and are always placed inside the opening tag.

Attributes help define things like links, images, styles, and more.

======================================

SYNTAX OF ATTRIBUTES:
Attributes are written in the opening tag using this format:

\`attribute="value"\`

Example:

\`\`\`html
<a href="https://example.com">Visit Site</a>
\`\`\`

Explanation:
- \`href\` is the attribute
- \`https://example.com\` is the value

======================================

KEY RULES:
- Attributes are always placed in the opening tag
- They usually come in name/value pairs
- Values should be enclosed in quotes (" ")
- You can use multiple attributes in one element

Example:

\`\`\`html
<img src="image.jpg" alt="My Image" width="200">
\`\`\`

======================================

COMMON HTML ATTRIBUTES:
Explain the most important ones:

1. href (for links)

\`\`\`html
<a href="https://google.com">Google</a>
\`\`\`

Defines the destination of a link.

--------------------------------------

2. src (for images)

\`\`\`html
<img src="image.jpg" alt="Image">
\`\`\`

Specifies the image source.

--------------------------------------

3. alt (for images)

\`\`\`html
<img src="image.jpg" alt="A beautiful view">
\`\`\`

Provides alternative text if the image cannot load.

--------------------------------------

4. width and height

\`\`\`html
<img src="image.jpg" width="300" height="200">
\`\`\`

Defines the size of an image.

--------------------------------------

5. style

\`\`\`html
<p style="color:blue;">This is blue text</p>
\`\`\`

Adds inline CSS styling.

--------------------------------------

6. title

\`\`\`html
<p title="This is a tooltip">Hover over me</p>
\`\`\`

Displays extra information when you hover over the element.

======================================

MULTIPLE ATTRIBUTES:
Elements can have more than one attribute.

Example:

\`\`\`html
<a href="https://example.com" target="_blank" title="Open link">
  Visit Website
</a>
\`\`\`

Explanation:
- \`href\` → link destination
- \`target="_blank"\` → opens link in new tab
- \`title\` → tooltip text

======================================

BOOLEAN ATTRIBUTES:
Some attributes do not need a value.

They are either present or not.

Example:

\`\`\`html
<input type="text" disabled>
\`\`\`

Explanation:
- \`disabled\` prevents user input

======================================

CASE INSENSITIVITY:
HTML attributes are not case-sensitive.

Example:
\`href\` and \`HREF\` work the same.

Best practice:
Always use lowercase.

======================================

QUOTES IN ATTRIBUTES:
Values should always be enclosed in quotes.

Correct:
\`\`\`html
<a href="https://example.com">
\`\`\`

Avoid:
\`\`\`html
<a href=https://example.com>
\`\`\`

======================================

WHY ATTRIBUTES ARE IMPORTANT:
- They control element behavior
- They improve accessibility
- They allow styling and interaction
- They make HTML more flexible

======================================

COMMON MISTAKES:
- Missing quotes around values
- Using wrong attribute names
- Forgetting required attributes like \`src\` in images

======================================

TIP:
Always use descriptive values for attributes like \`alt\` and \`title\` for better accessibility.

======================================

NEXT STEP:
Move to **HTML Headings** to continue learning common HTML elements used on webpages.

======================================`

const HTML_HEADINGS_LESSON_CONTENT = `======================================

TITLE:
HTML Headings

======================================

INTRODUCTION:
HTML headings are used to define titles and subtitles on a webpage.

They help organize content and make it easier to read and understand.

Headings also help search engines understand the structure of your page.

======================================

HTML HEADING TAGS:
HTML provides six levels of headings:

\`\`\`html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
\`\`\`

======================================

EXPLANATION:
- \`<h1>\` is the largest and most important heading
- \`<h6>\` is the smallest and least important
- Each level represents a different importance in the document

======================================

EXAMPLE:
Show a real example:

\`\`\`html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
<p>This is a paragraph under a subsection.</p>
\`\`\`

======================================

WHY HEADINGS ARE IMPORTANT:
- They organize content into sections
- They improve readability
- They help search engines (SEO)
- They make navigation easier

======================================

HEADING STRUCTURE (VERY IMPORTANT):
Explain clearly:

Headings should follow a proper order.

Correct structure:
\`\`\`html
<h1>Main Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
\`\`\`

Avoid skipping levels:
❌ \`<h1>\` → \`<h4>\` (not recommended)

======================================

USING HEADINGS FOR STRUCTURE:
Think of headings like an outline:

- \`<h1>\` → Page title
- \`<h2>\` → Main sections
- \`<h3>\` → Subsections

This helps users and developers understand the page layout.

======================================

STYLING HEADINGS:
Headings have default sizes, but you can style them using CSS.

Example:

\`\`\`html
<h1 style="color:blue;">Blue Heading</h1>
\`\`\`

======================================

ACCESSIBILITY:
Screen readers use headings to navigate content.

Using proper heading order helps visually impaired users.

======================================

COMMON MISTAKES:
- Using headings just for size instead of structure
- Skipping heading levels
- Using too many \`<h1>\` tags

======================================

TIP:
Use only one \`<h1>\` per page for best practice.

======================================

NEXT STEP:
Move to **HTML Paragraphs** to continue learning how to write readable content on a web page.

======================================` 

const HTML_TUTORIAL_TOPICS = [
  'HTML Tutorial',
  'HTML HOME',
  'HTML Introduction',
  'HTML Editors',
  'HTML Basic',
  'HTML Elements',
  'HTML Attributes',
  'HTML Headings',
  'HTML Paragraphs',
  'HTML Styles',
  'HTML Formatting',
  'HTML Quotations',
  'HTML Comments',
  'HTML Colors',
  'HTML CSS',
  'HTML Links',
  'HTML Images',
  'HTML Favicon',
  'HTML Page Title',
  'HTML Tables',
  'HTML Lists',
  'HTML Block & Inline',
  'HTML Div',
  'HTML Classes',
  'HTML Id',
  'HTML Buttons',
  'HTML Iframes',
  'HTML JavaScript',
  'HTML File Paths',
  'HTML Head',
  'HTML Layout',
  'HTML Responsive',
  'HTML Computercode',
  'HTML Semantics',
  'HTML Style Guide',
  'HTML Entities',
  'HTML Symbols',
  'HTML Emojis',
  'HTML Charsets',
  'HTML URL Encode',
  'HTML vs. XHTML',
] as const

const CSS_TUTORIAL_TOPICS = [
  'CSS Tutorial',
  'CSS HOME',
  'CSS Introduction',
  'CSS Syntax',
  'CSS Selectors',
  'CSS How To',
  'CSS Comments',
  'CSS Errors',
  'CSS Colors',
  'CSS Backgrounds',
  'CSS Borders',
  'CSS Margins',
  'CSS Padding',
  'CSS Height / Width',
  'CSS Box Model',
  'CSS Outline',
  'CSS Text',
  'CSS Fonts',
  'CSS Icons',
  'CSS Links',
  'CSS Lists',
  'CSS Tables',
  'CSS Display',
  'CSS Max-width',
  'CSS Position',
  'CSS Position Offsets',
  'CSS Z-index',
  'CSS Overflow',
  'CSS Float',
  'CSS Inline-block',
  'CSS Align',
  'CSS Combinators',
  'CSS Pseudo-classes',
  'CSS Pseudo-elements',
  'CSS Opacity',
  'CSS Navigation Bars',
  'CSS Dropdowns',
  'CSS Image Gallery',
  'CSS Image Sprites',
  'CSS Attribute Selectors',
  'CSS Forms',
  'CSS Counters',
  'CSS Units',
  'CSS Inheritance',
  'CSS Specificity',
  'CSS !important',
  'CSS Math Functions',
  'CSS Optimization',
  'CSS Accessibility',
  'CSS Website Layout',
  'CSS Advanced',
  'CSS Rounded Corners',
  'CSS Border Images',
  'CSS Backgrounds',
  'CSS Colors',
  'CSS Gradients',
  'CSS Shadows',
  'CSS Text Effects',
  'CSS Custom Fonts',
  'CSS 2D Transforms',
  'CSS 3D Transforms',
  'CSS Transitions',
  'CSS Animations',
  'CSS Tooltips',
  'CSS Image Styling',
  'CSS Image Modal',
  'CSS Image Centering',
  'CSS Image Filters',
  'CSS Image Shapes',
  'CSS object-fit',
  'CSS object-position',
  'CSS Masking',
  'CSS Buttons',
  'CSS Pagination',
  'CSS Multiple Columns',
  'CSS User Interface',
  'CSS Variables',
  'CSS @property',
  'CSS Box Sizing',
  'CSS Media Queries',
] as const

const PYTHON_TUTORIAL_TOPICS = [
  'Python Tutorial',
  'Python HOME',
  'Python Intro',
  'Python Get Started',
  'Python Syntax',
  'Python Output',
  'Python Comments',
  'Python Variables',
  'Python Data Types',
  'Python Numbers',
  'Python Casting',
  'Python Strings',
  'Python Booleans',
  'Python Operators',
  'Python Lists',
  'Python Tuples',
  'Python Sets',
  'Python Dictionaries',
  'Python If...Else',
  'Python Match',
  'Python While Loops',
  'Python For Loops',
  'Python Functions',
  'Python Range',
  'Python Arrays',
  'Python Iterators',
  'Python Modules',
  'Python Dates',
  'Python Math',
  'Python JSON',
  'Python RegEx',
  'Python PIP',
  'Python Try...Except',
  'Python String Formatting',
  'Python None',
  'Python User Input',
  'Python VirtualEnv',
  'Python Classes',
  'Python OOP',
  'Python Classes/Objects',
  'Python __init__ Method',
  'Python self Parameter',
  'Python Class Properties',
  'Python Class Methods',
  'Python Inheritance',
  'Python Polymorphism',
  'Python Encapsulation',
  'Python Inner Classes',
  'File Handling',
  'Python File Handling',
  'Python Read Files',
  'Python Write/Create Files',
  'Python Delete Files',
] as const

const JAVA_TUTORIAL_TOPICS = [
  'Java Tutorial',
  'Java HOME',
  'Java Intro',
  'Java Get Started',
  'Java Syntax',
  'Java Output',
  'Java Comments',
  'Java Variables',
  'Java Data Types',
  'Java Type Casting',
  'Java Operators',
  'Java Strings',
  'Java Math',
  'Java Booleans',
  'Java If...Else',
  'Java Switch',
  'Java While Loop',
  'Java For Loop',
  'Java Break/Continue',
  'Java Arrays',
  'Java Methods',
  'Java Method Challenge',
  'Java Method Parameters',
  'Java Method Overloading',
  'Java Scope',
  'Java Recursion',
  'Java Classes',
  'Java OOP',
  'Java Classes/Objects',
  'Java Class Attributes',
  'Java Class Methods',
  'Java Class Challenge',
  'Java Constructors',
  'Java this Keyword',
  'Java Modifiers',
  'Java Encapsulation',
  'Java Packages / API',
  'Java Inheritance',
  'Java Polymorphism',
  'Java super Keyword',
  'Java Inner Classes',
  'Java Abstraction',
  'Java Interface',
  'Java Anonymous Class',
  'Java Enum',
  'Java User Input',
  'Java Date',
  'Java Errors',
  'Java Debugging',
  'Java Exceptions',
  'Java Multiple Exceptions',
  'Java try-with-resources',
  'Java File Handling',
  'Java Files',
  'Java Create Files',
  'Java Write Files',
  'Java Read Files',
  'Java Delete Files',
  'Java I/O Streams',
  'Java FileInputStream',
  'Java FileOutputStream',
  'Java BufferedReader',
  'Java BufferedWriter',
  'Java Data Structures',
  'Java Collections',
  'Java List',
  'Java ArrayList',
  'Java LinkedList',
  'Java List Sorting',
  'Java Set',
  'Java HashSet',
  'Java TreeSet',
  'Java LinkedHashSet',
  'Java Map',
  'Java HashMap',
  'Java TreeMap',
  'Java LinkedHashMap',
  'Java Iterator',
  'Java Algorithms',
  'Java Advanced',
  'Java Wrapper Classes',
  'Java Generics',
  'Java Annotations',
  'Java RegEx',
  'Java Threads',
  'Java Lambda',
  'Java Advanced Sorting',
  'Java Projects',
  'Java How To\'s',
  'Java Reference',
  'Java Keywords',
  'Java String Methods',
  'Java Math Methods',
  'Java Output Methods',
  'Java Arrays Methods',
  'Java ArrayList Methods',
  'Java LinkedList Methods',
  'Java HashMap Methods',
  'Java Scanner Methods',
  'Java File Methods',
  'Java Iterator Methods',
  'Java Collections Methods',
  'Java System Methods',
  'Java Errors & Exceptions',
] as const

const buildLessonContentTemplate = ({
  title,
  introduction,
  practicePoints,
  nextStep,
}: {
  title: string
  introduction: string
  practicePoints: string[]
  nextStep: string
}) => `TITLE:
${title}

INTRODUCTION:
${introduction}

WHAT YOU WILL PRACTICE:
${practicePoints.map((point) => `- ${point}`).join('\n')}

DEVHUB TIP:
Read the explanation first, review the example, and then use DevHub practice tools to try the idea yourself.

NEXT STEP:
${nextStep}`

const JAVA_HOME_SUMMARY =
  'Learn what Java is, why developers use it, how the JVM works, and what kinds of applications you can build with it.'

const JAVA_TUTORIAL_SUMMARY =
  'Follow a complete Java roadmap from basics and OOP through exceptions, file handling, collections, advanced topics, DSA, and projects.'

const JAVA_TUTORIAL_CONTENT = `# Java Tutorial (Complete Roadmap)

## 1. Java Basics

This is where everything starts.

Learn:

- What Java is
- JVM, JRE, and JDK
- Java program structure
- Variables and data types
- Operators
- Control statements such as \`if\` and \`switch\`
- Loops such as \`for\`, \`while\`, and \`do-while\`

Mini example:

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}
\`\`\`

## 2. Object-Oriented Programming

This is Java's core.

Learn:

- Classes and objects
- Constructors
- \`this\` keyword
- Inheritance
- Polymorphism
- Abstraction
- Encapsulation

Example:

\`\`\`java
class Car {
    String brand;

    void drive() {
        System.out.println("Driving " + brand);
    }
}
\`\`\`

## 3. Core Java Concepts

Learn:

- Arrays
- Strings
- Methods
- Packages and APIs
- Wrapper classes
- Math and System classes

## 4. Exception Handling

Learn:

- Errors vs exceptions
- \`try-catch-finally\`
- \`throw\` and \`throws\`
- Multiple exceptions
- Custom exceptions

## 5. File Handling and I/O

Learn:

- \`File\` class
- \`FileReader\` and \`FileWriter\`
- \`BufferedReader\` and \`BufferedWriter\`
- \`FileInputStream\` and \`FileOutputStream\`
- How to create, read, write, and delete files

## 6. Java Collections Framework

Learn:

- \`List\` with \`ArrayList\` and \`LinkedList\`
- \`Set\` with \`HashSet\` and \`TreeSet\`
- \`Map\` with \`HashMap\` and \`TreeMap\`
- \`Iterator\`
- \`Collections\` utility methods

## 7. Advanced Java Concepts

Learn:

- Generics
- Lambda expressions
- Streams API
- Multithreading
- Synchronization
- Annotations
- Regular expressions

## 8. Data Structures and Algorithms

Learn:

- Searching such as linear and binary search
- Sorting such as bubble, quick, and merge sort
- Stacks and queues
- Linked lists
- Trees and graphs

## 9. Java Projects

Build real things like:

- Login system
- File manager
- Student management system
- Bank system
- Chat application
- Mini social app

## How Java Fits Together

Think of Java like this:

- Basics are the building blocks
- OOP gives structure to your system
- Collections store data
- Exceptions handle problems
- File handling saves data
- Advanced Java adds real-world power tools
- Projects turn everything into applications

## Best Learning Order

If you follow this order, you will improve fast:

1. Basics
2. OOP
3. Methods, strings, and arrays
4. Exceptions
5. File handling
6. Collections
7. Advanced Java
8. Projects

## Pro Tip

Do not just read Java.

- Code everything
- Break programs and fix them
- Build small projects daily

That is how Java really sticks.`

const JAVA_HOME_CONTENT = `# What is Java?

Java is a popular, high-level programming language used to build a wide range of applications, from mobile apps to web systems and enterprise software.

It was developed by Sun Microsystems in 1995 and is now owned by Oracle.

Java is known for its simplicity, reliability, and ability to run on different platforms without modification.

## Why Use Java?

Java is widely used because it offers:

- Platform Independence
Java programs can run on any device that has a Java Virtual Machine (JVM). This is often called "Write Once, Run Anywhere".
- Object-Oriented Programming (OOP)
Java follows OOP principles, making code reusable, modular, and easy to manage.
- Security
Java has built-in security features that make it suitable for web and enterprise applications.
- Large Community
Millions of developers use Java, so there are plenty of resources and support available.

## What Can You Build with Java?

With Java, you can create:

- Web applications (for example online systems)
- Mobile apps (Android development)
- Desktop applications
- Games
- Enterprise-level systems (banking, e-commerce, and more)

## How Java Works

Java works in a unique way compared to many programming languages:

- You write Java code in a .java file
- The code is compiled into bytecode using the Java compiler
- The bytecode runs on the Java Virtual Machine (JVM)
- The JVM allows the program to run on any platform

## Java Syntax Example

Here is a simple Java program:

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

## Explanation

public class Main -> Defines a class named Main
public static void main -> Entry point of the program
System.out.println() -> Prints output to the screen

## Java vs Other Languages

Java is more strict than languages like Python.
It requires more structure but gives better control.
It is faster than many interpreted languages.
It is widely used in large-scale applications.

## Getting Started

To start using Java, you need:

- Java Development Kit (JDK)
- A code editor (for example VS Code or IntelliJ IDEA)
- Basic understanding of programming concepts

## Summary

Java is a powerful, secure, and widely-used programming language. Its ability to run on different platforms and its strong community support make it a great choice for beginners and professionals alike.`

const JAVA_INTRO_SUMMARY =
  'Learn what Java is, why it is popular, how JDK, JRE, and JVM work together, and how a basic Java program is structured.'

const JAVA_INTRO_CONTENT = `# Java Introduction

## What is Java?

Java is a high-level, object-oriented programming language used to build software applications.

It is widely used for:

- Web applications
- Mobile apps such as Android
- Desktop software
- Enterprise systems
- Games

## Why Java Is Popular

Java is popular because it is:

### 1. Simple

Its syntax is easier to understand than languages like C++.

### 2. Object-Oriented

Java is built around classes and objects.

### 3. Platform Independent

Java follows the idea:

\`\`\`text
Write once, run anywhere
\`\`\`

That means:

- Write the code once
- Run it on Windows, Mac, or Linux

## How Java Works

Java uses three main components:

### 1. JDK

The Java Development Kit contains the tools used to write and compile Java code.

### 2. JRE

The Java Runtime Environment is used to run Java programs.

### 3. JVM

The Java Virtual Machine converts Java bytecode into machine code.

## Java Program Structure

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}
\`\`\`

## Explanation

- \`class\` defines the blueprint of the program
- \`main()\` is the starting point
- \`System.out.println()\` prints output
- \`{}\` marks a block of code

## Features of Java

### 1. Object-Oriented

Java uses classes and objects.

### 2. Platform Independent

It runs anywhere using the JVM.

### 3. Secure

Java avoids direct memory access in normal application code.

### 4. Robust

It has strong error handling and type checking.

### 5. Multithreaded

It can run multiple tasks at the same time.

## Real-Life Analogy

Think of Java like a fast-food system:

- You order once
- It can be delivered anywhere
- The same recipe works on different platforms

## First Java Program Output

\`\`\`text
Hello Java
\`\`\`

## Key Idea

- Java means write once, run anywhere
- Everything in Java is inside a class
- Execution starts from \`main()\`

## Summary

- Java is a powerful programming language
- It is platform independent
- It uses the JVM to run programs
- It is based on OOP with classes and objects
- It is very popular in real-world development`

const JAVA_GET_STARTED_SUMMARY =
  'Set up Java, install the JDK, write your first program, compile it with javac, and run it with the JVM.'

const JAVA_GET_STARTED_CONTENT = `# What Do You Need?

To start programming in Java, you need the following tools:

- Java Development Kit (JDK)
This includes the Java compiler (javac) and the Java Virtual Machine (JVM).
- A Code Editor or IDE
You can use:
VS Code
IntelliJ IDEA
Eclipse
Notepad (for simple programs)

## Step 1: Install Java (JDK)

To begin, download and install the Java Development Kit (JDK) from the official Oracle website.

After installation, make sure Java is properly installed by opening your terminal or command prompt and typing:

java -version

If installed correctly, it will display the installed Java version.

## Step 2: Write Your First Java Program

Open your code editor and create a new file named:

Main.java

Then write the following code:

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}

## Step 3: Compile the Java Program

Open your terminal or command prompt, navigate to the folder where your file is saved, and run:

javac Main.java

This will compile your code and create a file named:

Main.class

## Step 4: Run the Java Program

Now run the compiled program using:

java Main

Output:
Hello, Java!

## Understanding the Process

.java file -> Your source code
javac -> Compiles the code into bytecode
.class file -> Compiled bytecode
java -> Runs the program using the JVM

## Using an IDE (Optional but Recommended)

Instead of using the terminal, you can use an IDE to make things easier:

- Write code
- Run programs with one click
- Debug errors easily

Popular IDEs include:

- IntelliJ IDEA
- Eclipse
- VS Code

## Common Beginner Mistakes

- File name must match the class name (Main.java -> class Main)
- Java is case-sensitive (Main is not the same as main)
- Always include main() method as the entry point
- Missing semicolons (;) will cause errors

## Summary

To get started with Java:

- Install JDK
- Write your Java code
- Compile using javac
- Run using java

Once you understand this flow, you are ready to build Java programs.`

const JAVA_SYNTAX_SUMMARY =
  'Understand the writing rules of Java, including classes, the main method, statements, blocks, comments, and identifiers.'

const JAVA_SYNTAX_CONTENT = `# What is Java Syntax?

Java syntax refers to the set of rules that define how a Java program is written and structured.

Just like grammar in English, syntax in Java ensures that the code is understood by the compiler.

## Basic Structure of a Java Program

Every Java program follows a standard structure:

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

## Explanation of the Syntax

### 1. Class Declaration

public class Main

class -> Defines a class
Main -> Name of the class
public -> Access modifier

Note: The class name must match the file name (Main.java).

### 2. Main Method

public static void main(String[] args)

This is the entry point of every Java program.

public -> Accessible from anywhere
static -> Can run without creating an object
void -> Does not return any value
main() -> Method where execution starts

### 3. Output Statement

System.out.println("Hello, World!");

Prints text to the console
println moves the cursor to the next line

## Java is Case-Sensitive

Java is case-sensitive, meaning:

Main is not the same as main

Both are treated as different identifiers.

## Java Statements

A statement is a complete instruction in Java.

Example:

int x = 10;

Important: Every statement must end with a semicolon (;).

## Code Blocks

A block of code is written inside curly braces { }.

Example:

{
    System.out.println("This is a block");
}

Blocks are used in classes, methods, loops, and conditions.

## Java Comments

Comments are used to explain code and are ignored by the compiler.

Single-line comment:
// This is a comment

Multi-line comment:
/*
 This is a
 multi-line comment
*/

## Java Identifiers

Identifiers are names given to variables, methods, and classes.

Rules:

- Must start with a letter, $, or _
- Cannot start with a number
- Cannot use Java keywords (for example int or class)
- Should be meaningful

Example:

int age = 20;
String name = "John";

## Java Keywords

Keywords are reserved words in Java and cannot be used as identifiers.

Examples include:

int
class
public
static
void
if, else, for, while

## Whitespace in Java

Whitespace (spaces, tabs, new lines) is ignored by Java.

So this:

int x=10;

is the same as:

int     x =     10;

## Summary

Java syntax defines how code must be written.
Every program must have a class and a main() method.
Java is case-sensitive.
Statements end with ;.
Code blocks use { }.
Comments help explain code.`

const JAVA_OUTPUT_SUMMARY =
  'Learn how Java displays text and values with print(), println(), printf(), variables, and escape characters.'

const JAVA_OUTPUT_CONTENT = `# Displaying Output in Java

In Java, you can display output (text or values) using the System.out object.

The most commonly used methods are:

- println() -> Prints output and moves to the next line
- print() -> Prints output on the same line
- printf() -> Prints formatted output

## Using println()

The println() method prints text and then moves the cursor to a new line.

Example:

System.out.println("Hello World!");
System.out.println("Java is fun!");

Output:

Hello World!
Java is fun!

## Using print()

The print() method prints text but does NOT move to a new line.

Example:

System.out.print("Hello ");
System.out.print("World!");

Output:

Hello World!

## Using printf()

The printf() method is used for formatted output.

Example:

System.out.printf("My age is %d", 20);

Output:

My age is 20

Extra tip: In Java, "%n" is often better than "\\n" inside printf() because it uses the correct line break for the current system.

## Common Format Specifiers

- %d -> Integer
- %f -> Floating-point number
- %s -> String
- %c -> Character

Example:

System.out.printf("Name: %s, Age: %d", "John", 25);

## Printing Variables

You can also print variables:

int number = 10;
System.out.println(number);

## Combining Text and Variables

You can combine text and variables using the + operator:

int age = 20;
System.out.println("I am " + age + " years old.");

## New Line Character (\\n)

You can insert a new line using \\n:

System.out.println("Hello\\nWorld");

Output:

Hello
World

## Escape Characters

Escape characters are used to format text:

- \\" -> Double quote
- \\\\ -> Backslash
- \\n -> New line
- \\t -> Tab

Example:

System.out.println("He said \\"Hello!\\"");

## Summary

- println() prints and moves to a new line
- print() prints on the same line
- printf() is used for formatted output
- Use + to combine text and variables
- Escape characters help format output`

const JAVA_COMMENTS_SUMMARY =
  'Learn how Java comments work, including single-line comments, multi-line comments, and Javadoc documentation comments.'

const JAVA_COMMENTS_CONTENT = `# What are Comments?

Comments in Java are used to explain code and make it easier to understand.

They are ignored by the compiler, meaning they do not affect how the program runs.

## Why Use Comments?

Comments are useful for:

- Explaining complex code
- Making code more readable
- Adding notes for yourself or other developers
- Debugging by temporarily disabling code

## Types of Comments in Java

Java supports three types of comments:

### 1. Single-Line Comments

Single-line comments start with //.

Anything written after // on the same line is ignored.

Example:

// This is a single-line comment
System.out.println("Hello World");

### 2. Multi-Line Comments

Multi-line comments start with /* and end with */.

They can span multiple lines.

Example:

/*
 This is a multi-line comment
 It can cover multiple lines
*/
System.out.println("Hello World");

### 3. Documentation Comments (Javadoc)

Documentation comments are used to generate official documentation.

They start with /** and end with */.

Example:

/**
 * This method prints a message
 */
public void display() {
    System.out.println("Hello");
}

Extra tip: Javadoc is especially useful in larger projects because tools can turn these comments into browsable API documentation.

## Commenting Out Code

You can use comments to temporarily disable code during testing or debugging.

Example:

// System.out.println("This line will not run");
System.out.println("This line will run");

## Best Practices for Comments

- Keep comments clear and meaningful
- Avoid obvious comments that simply repeat the code
- Update comments when code changes
- Use comments to explain why, not just what

## Good vs Bad Comments

Bad Example:

int x = 10; // assign 10 to x

Good Example:

// Stores the user's age for validation
int age = 10;

## Summary

- Comments are ignored by the compiler
- They help make code easier to understand
- Java has:
  - Single-line comments (//)
  - Multi-line comments (/* */)
  - Documentation comments (/** */)
- Use comments wisely to improve readability`

const JAVA_VARIABLES_SUMMARY =
  'Learn how Java variables store data, how types work, how values change, and how to follow good naming rules.'

const JAVA_VARIABLES_CONTENT = `# What are Variables?

Variables are containers used to store data in a program.

Each variable has:

- A type, which tells Java what kind of data it stores
- A name, which identifies the variable
- A value, which is the data currently stored

## Declaring Variables

To create a variable in Java, you must specify its type and name:

\`\`\`java
int number;
\`\`\`

## Assigning Values

You can assign a value to a variable using the = operator:

\`\`\`java
int number = 10;
\`\`\`

## Example

\`\`\`java
int age = 20;
String name = "John";

System.out.println(age);
System.out.println(name);
\`\`\`

## Variable Types

Java has different types of variables:

### 1. int (Integer)

Stores whole numbers.

\`\`\`java
int num = 100;
\`\`\`

### 2. double (Decimal Numbers)

Stores numbers with decimal points.

\`\`\`java
double price = 19.99;
\`\`\`

### 3. char (Character)

Stores a single character.

\`\`\`java
char grade = 'A';
\`\`\`

### 4. boolean (True/False)

Stores only true or false.

\`\`\`java
boolean isJavaFun = true;
\`\`\`

### 5. String (Text)

Stores a sequence of characters (text).

\`\`\`java
String message = "Hello Java";
\`\`\`

## Declaring Multiple Variables

You can declare multiple variables of the same type in one line:

\`\`\`java
int x = 5, y = 10, z = 15;
\`\`\`

## Changing Variable Values

Variables can be updated after they are created:

\`\`\`java
int x = 10;
x = 20;

System.out.println(x); // Output: 20
\`\`\`

## Final Variables (Constants)

If you do not want a variable's value to change, use final:

\`\`\`java
final int MAX = 100;
\`\`\`

Note: You cannot change the value of a final variable.

## Naming Rules for Variables

- Must start with a letter, $, or _
- Cannot start with a number
- Cannot use Java keywords
- Should be meaningful

Examples:

\`\`\`java
int age = 20;      // valid
int _count = 5;    // valid
int 1num = 10;     // invalid
\`\`\`

## Naming Conventions

- Use camelCase for variable names
- Start with a lowercase letter

Example:

\`\`\`java
int studentAge = 18;
String firstName = "John";
\`\`\`

## Summary

- Variables store data
- Variables must have a type, name, and value
- Java is strongly typed, so the type must be declared
- Values can be changed unless the variable is marked final
- Follow proper naming rules and conventions`

const JAVA_OPERATORS_SUMMARY =
  'Learn how Java operators handle calculations, assignments, comparisons, logical checks, and value updates in everyday code.'

const JAVA_OPERATORS_CONTENT = `# What are Operators?

Operators are symbols used to perform operations on variables and values.

They are used for:

- Calculations
- Comparisons
- Logical decisions
- Assignments

## Types of Operators in Java

Java has several types of operators:

- Arithmetic operators
- Assignment operators
- Comparison (relational) operators
- Logical operators
- Increment and decrement operators

## 1. Arithmetic Operators

Arithmetic operators are used for basic mathematical operations.

- \`+\` -> Addition
- \`-\` -> Subtraction
- \`*\` -> Multiplication
- \`/\` -> Division
- \`%\` -> Modulus (remainder)

Example:

\`\`\`java
int a = 10;
int b = 3;

System.out.println(a + b); // 13
System.out.println(a - b); // 7
System.out.println(a * b); // 30
System.out.println(a / b); // 3
System.out.println(a % b); // 1
\`\`\`

Extra tip: When both values are integers, Java uses integer division, so \`10 / 3\` becomes \`3\`, not \`3.33\`.

## 2. Assignment Operators

Assignment operators are used to store or update values in variables.

- \`=\` -> Assign a value
- \`+=\` -> Add and assign
- \`-=\` -> Subtract and assign
- \`*=\` -> Multiply and assign
- \`/=\` -> Divide and assign

Example:

\`\`\`java
int a = 10;

a += 5;
System.out.println(a); // 15
\`\`\`

These shorthand operators make code shorter and easier to read.

## 3. Comparison (Relational) Operators

Comparison operators compare two values. The result is always \`true\` or \`false\`.

- \`==\` -> Equal to
- \`!=\` -> Not equal to
- \`>\` -> Greater than
- \`<\` -> Less than
- \`>=\` -> Greater than or equal to
- \`<=\` -> Less than or equal to

Example:

\`\`\`java
int a = 10;
int b = 5;

System.out.println(a == b); // false
System.out.println(a > b);  // true
\`\`\`

## 4. Logical Operators

Logical operators are used to combine or reverse conditions.

- \`&&\` -> AND
- \`||\` -> OR
- \`!\` -> NOT

Example:

\`\`\`java
int a = 10;
int b = 5;

System.out.println(a > 5 && b < 10); // true
System.out.println(a > 5 || b > 10); // true
System.out.println(!(a > b));        // false
\`\`\`

Logical operators are especially useful in \`if\` statements and loops.

## 5. Increment and Decrement Operators

These operators increase or decrease a value by 1.

- \`++\` -> Increase by 1
- \`--\` -> Decrease by 1

Example:

\`\`\`java
int a = 5;

a++;
System.out.println(a); // 6

a--;
System.out.println(a); // 5
\`\`\`

## Pre-increment vs Post-increment

### Pre-increment (\`++a\`)

Pre-increment increases the value first, then uses it.

\`\`\`java
int a = 5;
System.out.println(++a); // 6
\`\`\`

### Post-increment (\`a++\`)

Post-increment uses the value first, then increases it.

\`\`\`java
int a = 5;
System.out.println(a++); // 5
System.out.println(a);   // 6
\`\`\`

## Summary

- Operators perform actions on variables and values
- Arithmetic operators handle math
- Assignment operators store or update values
- Comparison operators return \`true\` or \`false\`
- Logical operators combine conditions
- Increment and decrement operators change values by 1`

const JAVA_DATA_TYPES_SUMMARY =
  'Learn how Java data types define what variables can store, including primitive types, reference types, sizes, defaults, and common usage rules.'

const JAVA_DATA_TYPES_CONTENT = `# What are Data Types?

Data types define the kind of data a variable can store.

In Java, every variable must have a data type. The data type helps determine:

- The kind of values the variable can hold
- How much memory is typically used
- Which operations make sense for that value

## Types of Data Types in Java

Java data types are divided into two main groups:

- Primitive data types
- Non-primitive data types

## 1. Primitive Data Types

Primitive data types are built-in Java types used to store simple values directly.

Java has 8 primitive data types:

- \`byte\` -> Small integer, usually 1 byte
- \`short\` -> Medium integer, usually 2 bytes
- \`int\` -> Standard integer, usually 4 bytes
- \`long\` -> Large integer, usually 8 bytes
- \`float\` -> Decimal number with less precision, usually 4 bytes
- \`double\` -> Decimal number with more precision, usually 8 bytes
- \`char\` -> Single Unicode character, usually 2 bytes
- \`boolean\` -> Stores only \`true\` or \`false\`

Examples:

\`\`\`java
byte b = 100;
short s = 1000;
int x = 10;
long l = 100000L;
float f = 10.5f;
double d = 10.5;
char c = 'A';
boolean isJavaEasy = true;
\`\`\`

### Example of Primitive Data Types

\`\`\`java
int age = 20;
double price = 99.99;
char grade = 'A';
boolean isJavaEasy = true;

System.out.println(age);
System.out.println(price);
System.out.println(grade);
System.out.println(isJavaEasy);
\`\`\`

## 2. Non-Primitive Data Types

Non-primitive data types are also called reference types.

They are more complex than primitive types and usually refer to objects or structured data.

Examples include:

- \`String\`
- Arrays
- Classes
- Interfaces

Example:

\`\`\`java
String name = "John";
System.out.println(name);
\`\`\`

Unlike primitive types, many non-primitive values can use methods:

\`\`\`java
String name = "John";
System.out.println(name.toUpperCase());
\`\`\`

## Primitive vs Non-Primitive

- Primitive types store simple values directly
- Non-primitive types usually store references to objects
- Primitive types have fixed sizes
- Non-primitive types can vary in size
- Primitive values do not have methods directly
- Non-primitive values like \`String\` can use methods
- Primitive types cannot be \`null\`
- Non-primitive types can be \`null\`

## Size of Primitive Data Types

- \`byte\` -> 1 byte
- \`short\` -> 2 bytes
- \`int\` -> 4 bytes
- \`long\` -> 8 bytes
- \`float\` -> 4 bytes
- \`double\` -> 8 bytes
- \`char\` -> 2 bytes
- \`boolean\` -> Stores \`true\` or \`false\`; its exact memory use is JVM-dependent

## Default Values

When variables are declared as class members, Java gives them default values automatically.

Local variables inside methods do not get default values and must be initialized before use.

Common default values for class fields include:

- \`int\` -> \`0\`
- \`double\` -> \`0.0\`
- \`char\` -> \`'\\u0000'\`
- \`boolean\` -> \`false\`
- \`String\` -> \`null\`

Example:

\`\`\`java
public class Defaults {
    int count;
    double price;
    boolean active;
    String name;
}
\`\`\`

## Important Notes

- \`String\` is not a primitive type; it is a class
- \`double\` is commonly used for decimal values because it is more precise than \`float\`
- \`int\` is the usual default choice for whole numbers
- \`long\` values often end with \`L\`, and \`float\` values often end with \`f\`

## Summary

- Data types define what kind of data a variable can store
- Java has 8 primitive data types
- Java also has non-primitive types like \`String\`, arrays, and classes
- Primitive types store values directly
- Non-primitive types usually store references
- Class fields get default values, but local variables must be initialized first`

const JAVA_TYPE_CASTING_SUMMARY =
  'Learn how Java type casting converts values between data types, when casting happens automatically, and when you must cast manually.'

const JAVA_TYPE_CASTING_CONTENT = `# What is Type Casting?

Type casting is the process of converting a variable from one data type to another.

In Java, type casting is useful when you want to:

- Perform calculations between different data types
- Store a value in a different type
- Control how data is handled

## Types of Type Casting

There are two main types of type casting in Java:

- Widening casting (automatic)
- Narrowing casting (manual)

## 1. Widening Casting (Automatic)

Widening casting happens when you convert a smaller data type into a larger data type.

Java does this automatically because the larger type can safely hold the smaller value.

Order of widening:

- \`byte -> short -> int -> long -> float -> double\`

Example:

\`\`\`java
int myInt = 10;
double myDouble = myInt;  // Automatic casting

System.out.println(myInt);     // 10
System.out.println(myDouble);  // 10.0
\`\`\`

## 2. Narrowing Casting (Manual)

Narrowing casting happens when you convert a larger data type into a smaller data type.

This must be done manually using parentheses.

Example:

\`\`\`java
double myDouble = 9.78;
int myInt = (int) myDouble;  // Manual casting

System.out.println(myDouble); // 9.78
System.out.println(myInt);    // 9
\`\`\`

## Important Note

When narrowing casting:

- You may lose data
- Decimal values are truncated, not rounded
- Values outside the target type's range can change unexpectedly

## More Examples

### Example 1: Converting int to long

\`\`\`java
int x = 100;
long y = x;

System.out.println(y);
\`\`\`

### Example 2: Converting double to float

\`\`\`java
double d = 10.5;
float f = (float) d;

System.out.println(f);
\`\`\`

### Example 3: Converting char to int

\`\`\`java
char letter = 'A';
int ascii = letter;

System.out.println(ascii); // 65
\`\`\`

Extra tip: Casting a \`char\` to \`int\` shows the Unicode number for that character.

## Real-Life Use Case

Type casting is often used in calculations:

\`\`\`java
int a = 5;
int b = 2;

double result = (double) a / b;

System.out.println(result); // 2.5
\`\`\`

Without casting, the result would be \`2\` because Java would perform integer division.

## Summary

- Type casting converts one data type to another
- Widening casting happens automatically
- Narrowing casting must be done manually
- Narrowing may cause data loss
- Casting is useful in calculations and data handling`

const JAVA_MATH_SUMMARY =
  'Learn how Java Math methods help with rounding, powers, square roots, min and max checks, and random values without creating objects.'

const JAVA_MATH_CONTENT = `# What is Java Math?

The \`Math\` class in Java provides built-in methods for performing mathematical operations like rounding, finding maximum values, powers, square roots, and more.

You do not need to create an object to use it because its methods are static.

Extra tip: \`Math\` is part of \`java.lang\`, so it is available automatically in every Java program.

## Using Java Math

You access Math methods using:

\`\`\`java
Math.methodName()
\`\`\`

## 1. Math.max()

Returns the larger value between two numbers.

\`\`\`java
int a = 10;
int b = 20;

System.out.println(Math.max(a, b)); // 20
\`\`\`

## 2. Math.min()

Returns the smaller value between two numbers.

\`\`\`java
int a = 10;
int b = 20;

System.out.println(Math.min(a, b)); // 10
\`\`\`

## 3. Math.sqrt()

Returns the square root of a number.

\`\`\`java
System.out.println(Math.sqrt(25)); // 5.0
\`\`\`

## 4. Math.pow()

Returns the power of a number.

\`\`\`java
System.out.println(Math.pow(2, 3)); // 8.0
\`\`\`

\`2^3 = 8\`

## 5. Math.abs()

Returns the absolute value of a number.

\`\`\`java
System.out.println(Math.abs(-10)); // 10
\`\`\`

## 6. Math.round()

Rounds a decimal number to the nearest whole number.

\`\`\`java
System.out.println(Math.round(4.6)); // 5
System.out.println(Math.round(4.3)); // 4
\`\`\`

## 7. Math.ceil()

Rounds a number up to the nearest integer.

\`\`\`java
System.out.println(Math.ceil(4.1)); // 5.0
\`\`\`

## 8. Math.floor()

Rounds a number down to the nearest integer.

\`\`\`java
System.out.println(Math.floor(4.9)); // 4.0
\`\`\`

## 9. Math.random()

Returns a random decimal number from \`0.0\` up to but not including \`1.0\`.

\`\`\`java
System.out.println(Math.random());
\`\`\`

## Generating Random Numbers in a Range

To generate a random number between 1 and 10:

\`\`\`java
int randomNum = (int) (Math.random() * 10) + 1;

System.out.println(randomNum);
\`\`\`

## Summary of Common Math Methods

- \`Math.max()\` -> Returns the larger value
- \`Math.min()\` -> Returns the smaller value
- \`Math.sqrt()\` -> Square root
- \`Math.pow()\` -> Power
- \`Math.abs()\` -> Absolute value
- \`Math.round()\` -> Rounds to the nearest whole number
- \`Math.ceil()\` -> Rounds up
- \`Math.floor()\` -> Rounds down
- \`Math.random()\` -> Random decimal number

## Summary

- \`Math\` is a built-in Java class for mathematical operations
- Its methods are static, so no object is needed
- It is commonly used in calculations, games, and simulations
- It helps simplify many common math operations`

const JAVA_STRING_SUMMARY =
  'Learn how Java strings store text, how common String methods work, and why immutability and proper comparison matter.'

const JAVA_STRING_CONTENT = `# What is a String?

A \`String\` in Java is a sequence of characters used to store text.

Strings are widely used for names, messages, sentences, and any form of textual data.

## Creating a String

In Java, strings are objects of the \`String\` class.

Example:

\`\`\`java
String name = "John";
System.out.println(name);
\`\`\`

## Difference Between String and char

- \`char\` -> Stores one character, such as \`'A'\`
- \`String\` -> Stores text made of multiple characters, such as \`"Apple"\`

## String Length

The \`length()\` method returns the number of characters in a string.

Example:

\`\`\`java
String text = "Hello";

System.out.println(text.length());
\`\`\`

Extra tip: Spaces also count as characters in a string.

## Changing Case

### To Uppercase

\`\`\`java
String text = "java";

System.out.println(text.toUpperCase());
\`\`\`

### To Lowercase

\`\`\`java
String text = "JAVA";

System.out.println(text.toLowerCase());
\`\`\`

## String Concatenation

Concatenation means joining strings together.

### Using the \`+\` Operator

\`\`\`java
String firstName = "John";
String lastName = "Doe";

System.out.println(firstName + " " + lastName);
\`\`\`

### Using the \`concat()\` Method

\`\`\`java
String a = "Hello";
String b = "World";

System.out.println(a.concat(b));
\`\`\`

## String Indexing

Each character in a string has an index starting from 0.

Example:

\`\`\`java
String word = "Java";

System.out.println(word.charAt(0)); // J
System.out.println(word.charAt(2)); // v
\`\`\`

## Finding Characters or Words

The \`indexOf()\` method finds the position of a character or word.

\`\`\`java
String text = "Hello World";

System.out.println(text.indexOf("World"));
\`\`\`

## Substring

Use \`substring()\` to extract part of a string.

\`\`\`java
String text = "Hello World";

System.out.println(text.substring(0, 5));
\`\`\`

## String Comparison

Use \`equals()\` when you want to compare the actual text inside two strings.

\`\`\`java
String a = "Java";
String b = "Java";

System.out.println(a.equals(b)); // true
\`\`\`

Important note:

- \`==\` compares whether two references point to the same object
- \`equals()\` compares the actual text values

## String Immutability

Strings in Java are immutable, which means:

- Once created, they cannot be changed
- Any modification creates a new \`String\`

Example:

\`\`\`java
String text = "Hello";
text = text + " World";

System.out.println(text);
\`\`\`

## Escape Characters in Strings

- \`\\\"\` -> Double quote
- \`\\\\\` -> Backslash
- \`\\n\` -> New line
- \`\\t\` -> Tab space

Example:

\`\`\`java
System.out.println("He said \\"Hello\\"");
\`\`\`

## Summary

- \`String\` is used to store text
- It is an object of the \`String\` class
- Strings are immutable
- Common methods include:
  - \`length()\`
  - \`toUpperCase()\` and \`toLowerCase()\`
  - \`concat()\`
  - \`charAt()\`
  - \`substring()\`
  - \`equals()\`
  - \`indexOf()\``

const JAVA_IF_ELSE_SUMMARY =
  'Learn how Java if, else if, else, and ternary expressions help programs make decisions based on conditions.'

const JAVA_IF_ELSE_CONTENT = `# What is If...Else?

The \`if...else\` statement is used to perform different actions based on different conditions.

It allows a program to make decisions.

Extra tip: Every \`if\` condition in Java must evaluate to \`true\` or \`false\`.

## The if Statement

The \`if\` statement runs a block of code only if the condition is true.

Syntax:

\`\`\`java
if (condition) {
    // code to execute if condition is true
}
\`\`\`

Example:

\`\`\`java
int age = 18;

if (age >= 18) {
    System.out.println("You are an adult");
}
\`\`\`

## The if...else Statement

The \`else\` block runs if the condition is false.

Syntax:

\`\`\`java
if (condition) {
    // true block
} else {
    // false block
}
\`\`\`

Example:

\`\`\`java
int age = 16;

if (age >= 18) {
    System.out.println("You are an adult");
} else {
    System.out.println("You are not an adult");
}
\`\`\`

## The if...else if...else Statement

Use this form when you have multiple conditions.

Java checks the conditions from top to bottom and runs the first matching block.

Syntax:

\`\`\`java
if (condition1) {
    // block 1
} else if (condition2) {
    // block 2
} else {
    // default block
}
\`\`\`

Example:

\`\`\`java
int score = 75;

if (score >= 80) {
    System.out.println("Grade A");
} else if (score >= 60) {
    System.out.println("Grade B");
} else {
    System.out.println("Grade C");
}
\`\`\`

## Nested if Statement

A nested \`if\` is an \`if\` statement inside another \`if\` statement.

Example:

\`\`\`java
int age = 20;
boolean hasID = true;

if (age >= 18) {
    if (hasID) {
        System.out.println("Allowed to enter");
    }
}
\`\`\`

## Comparison Operators in If Statements

- \`==\` -> Equal to
- \`!=\` -> Not equal to
- \`>\` -> Greater than
- \`<\` -> Less than
- \`>=\` -> Greater than or equal to
- \`<=\` -> Less than or equal to

## Logical Operators in If Statements

You can combine conditions using logical operators.

Example:

\`\`\`java
int age = 20;
boolean hasLicense = true;

if (age >= 18 && hasLicense) {
    System.out.println("You can drive");
}
\`\`\`

## Short Hand (Ternary Operator)

The ternary operator is a shorter way to write a simple \`if...else\` expression.

Syntax:

\`\`\`java
variable = (condition) ? valueIfTrue : valueIfFalse;
\`\`\`

Example:

\`\`\`java
int age = 18;

String result = (age >= 18) ? "Adult" : "Minor";

System.out.println(result);
\`\`\`

## Common Mistakes

- Using \`=\` instead of \`==\` in conditions
- Forgetting curly braces when the logic becomes hard to read
- Writing incorrect logical conditions
- Putting broader conditions before narrower ones in an \`else if\` chain

## Summary

- \`if\` runs code when a condition is true
- \`else\` runs code when the condition is false
- \`else if\` handles multiple conditions
- Nested \`if\` statements allow conditions inside conditions
- The ternary operator is a shortcut for simple \`if...else\` expressions

## Key Idea

If...else is how Java makes decisions.

Without it, programs cannot react to different situations.`

const JAVA_BOOLEANS_SUMMARY =
  'Learn how Java booleans represent true or false, how boolean expressions work, and how they drive conditions and program logic.'

const JAVA_BOOLEANS_CONTENT = `# What is a Boolean?

A \`boolean\` is a data type in Java that can only hold one of two values:

- \`true\`
- \`false\`

Booleans are mainly used for decision-making and conditional logic.

Extra tip: In Java, \`true\` and \`false\` are lowercase keywords.

## Declaring a Boolean

You declare a boolean using the \`boolean\` keyword:

\`\`\`java
boolean isJavaFun = true;
boolean isFishTasty = false;

System.out.println(isJavaFun);
System.out.println(isFishTasty);
\`\`\`

## Boolean Expressions

A boolean expression is an expression that returns either \`true\` or \`false\`.

Example:

\`\`\`java
int x = 10;
int y = 5;

System.out.println(x > y); // true
System.out.println(x < y); // false
\`\`\`

## Using Booleans in Conditions

Booleans are commonly used in \`if\` statements:

\`\`\`java
boolean isLoggedIn = true;

if (isLoggedIn) {
    System.out.println("Welcome back!");
}
\`\`\`

## Comparison Operators with Booleans

Booleans are often created using comparison operators:

- \`==\` -> Equal to
- \`!=\` -> Not equal to
- \`>\` -> Greater than
- \`<\` -> Less than
- \`>=\` -> Greater than or equal to
- \`<=\` -> Less than or equal to

Example:

\`\`\`java
int age = 18;

System.out.println(age >= 18); // true
\`\`\`

## Boolean in Variables

You can store the result of a condition inside a variable:

\`\`\`java
int age = 20;

boolean isAdult = age >= 18;

System.out.println(isAdult);
\`\`\`

This makes code easier to read when the same condition is used more than once.

## Boolean Methods

Some methods also return boolean values.

Example:

\`\`\`java
String text = "Java";

System.out.println(text.contains("J")); // true
System.out.println(text.isEmpty());     // false
\`\`\`

## Logical Use of Booleans

Booleans are often combined with logical operators:

\`\`\`java
int age = 20;
boolean hasID = true;

System.out.println(age >= 18 && hasID); // true
\`\`\`

Logical operators help combine conditions:

- \`&&\` -> AND
- \`||\` -> OR
- \`!\` -> NOT

## Summary

- A boolean has only two values: \`true\` or \`false\`
- Booleans are used for conditions and decision-making
- They are often created using comparison and logical operators
- They are very important in \`if\`, \`while\`, and \`for\` statements

## Key Idea

Booleans are the foundation of logic in Java programs.

Without booleans, you cannot make decisions in code.`

const JAVA_SWITCH_SUMMARY =
  'Learn how Java switch statements select one block from many options, when to use break, and why switch can be cleaner than long if...else chains.'

const JAVA_SWITCH_CONTENT = `# What is a Switch Statement?

The \`switch\` statement is used to select one of many code blocks to be executed.

It is often a cleaner alternative to multiple \`if...else if\` statements.

## Why Use Switch?

- Makes code easier to read
- More organized than many \`if...else\` statements
- Best when checking a single variable against multiple fixed values

## Switch Syntax

\`\`\`java
switch (expression) {
    case value1:
        // code block
        break;

    case value2:
        // code block
        break;

    default:
        // code block
}
\`\`\`

## Example of a Switch Statement

\`\`\`java
int day = 3;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;

    case 2:
        System.out.println("Tuesday");
        break;

    case 3:
        System.out.println("Wednesday");
        break;

    default:
        System.out.println("Invalid day");
}
\`\`\`

Output:

\`\`\`text
Wednesday
\`\`\`

## How Switch Works

- The expression is evaluated once
- The result is compared with each \`case\`
- If a match is found, that block is executed
- \`break\` stops execution
- \`default\` runs if no match is found

## The break Keyword

The \`break\` statement stops the switch from continuing into later cases.

Example:

\`\`\`java
int day = 1;

switch (day) {
    case 1:
        System.out.println("Monday");
    case 2:
        System.out.println("Tuesday");
}
\`\`\`

Output:

\`\`\`text
Monday
Tuesday
\`\`\`

Without \`break\`, execution continues into the next case. This is called fall-through.

## The default Case

The \`default\` case runs when no case matches.

Example:

\`\`\`java
int day = 10;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;

    default:
        System.out.println("Invalid day");
}
\`\`\`

## Switch with Strings

Switch can also work with strings.

Example:

\`\`\`java
String day = "Monday";

switch (day) {
    case "Monday":
        System.out.println("Start of the week");
        break;

    case "Friday":
        System.out.println("Weekend is near");
        break;

    default:
        System.out.println("Regular day");
}
\`\`\`

## Switch vs If...Else

- \`switch\` is best for multiple fixed values
- \`if...else\` is better for complex conditions or ranges
- \`switch\` is often cleaner when comparing one variable to many exact values
- \`if...else\` is more flexible when the logic is more detailed

Extra tip: Modern Java also supports arrow-style switch cases, but the classic form with \`case\`, \`break\`, and \`default\` is still important to understand.

## When to Use Switch

Use \`switch\` when:

- You are checking one variable
- You have many exact values to compare
- The values are known and fixed

## Summary

- \`switch\` selects one block from many options
- It uses \`case\` to match values
- \`break\` stops execution
- \`default\` handles unmatched cases
- It is a cleaner alternative to multiple \`if...else\` statements

## Key Idea

Switch makes decision-making simpler when checking one variable against many values.`

const JAVA_FOR_LOOP_SUMMARY =
  'Learn how Java for loops repeat code a set number of times, how the three loop parts work, and how to use forward, backward, and nested loops.'

const JAVA_FOR_LOOP_CONTENT = `# What is a For Loop?

A \`for\` loop is used to execute a block of code a specific number of times.

It is commonly used when you already know how many times the loop should run.

## Syntax

\`\`\`java
for (initialization; condition; update) {
    // code to execute
}
\`\`\`

## How It Works

A \`for\` loop has 3 main parts:

- Initialization -> Runs once at the start
- Condition -> Checked before each iteration
- Update -> Runs after each iteration

## Example of a For Loop

\`\`\`java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
\`\`\`

Output:

\`\`\`text
1
2
3
4
5
\`\`\`

## Explanation

- \`int i = 1\` -> Starts the counter at 1
- \`i <= 5\` -> The loop runs while \`i\` is less than or equal to 5
- \`i++\` -> Increases \`i\` by 1 after each loop

## Looping Backwards

You can also loop in reverse:

\`\`\`java
for (int i = 5; i >= 1; i--) {
    System.out.println(i);
}
\`\`\`

## For Loop with Even Numbers

\`\`\`java
for (int i = 2; i <= 10; i += 2) {
    System.out.println(i);
}
\`\`\`

## Nested For Loop

A loop inside another loop is called a nested loop.

\`\`\`java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 2; j++) {
        System.out.println(i + " " + j);
    }
}
\`\`\`

## Infinite For Loop

If you do not set a proper condition, the loop can run forever:

\`\`\`java
for (;;) {
    System.out.println("Infinite Loop");
}
\`\`\`

Use this pattern with care because it will keep running unless you stop it with something like \`break\`.

## For Loop vs While Loop

- \`for\` loop -> Best when the number of iterations is known
- \`while\` loop -> Best when the number of iterations is unknown
- \`for\` loop -> Keeps initialization, condition, and update in one line
- \`while\` loop -> Keeps those parts separate

Extra tip: Java also has an enhanced \`for\` loop, often called a for-each loop, for iterating through arrays and collections more directly.

## When to Use a For Loop

Use a \`for\` loop when:

- You know exactly how many times to repeat something
- You are working with arrays or lists
- You need counting-based repetition

## Common Mistakes

- Using the wrong loop condition, such as \`i < 5\` instead of \`i <= 5\`
- Forgetting \`i++\` or another update step, which can cause an infinite loop
- Making off-by-one errors that run the loop too many or too few times

## Summary

- A \`for\` loop repeats code a fixed number of times
- It has 3 main parts: initialization, condition, and update
- It is commonly used for counting and arrays
- It can run forward, backward, or in nested patterns

## Key Idea

For loops are best when you know exactly how many times you want to repeat something.`

const JAVA_BREAK_CONTINUE_SUMMARY =
  'Learn how Java break and continue change loop flow by stopping a loop early or skipping only the current iteration.'

const JAVA_BREAK_CONTINUE_CONTENT = `# What are Break and Continue?

\`break\` and \`continue\` are control statements used inside loops to change the flow of execution.

- \`break\` -> Stops the loop completely
- \`continue\` -> Skips the current iteration and moves to the next one

## 1. Java break Statement

### What is break?

The \`break\` statement is used to exit a loop immediately, even if the loop condition is still true.

## Example of break in a Loop

\`\`\`java
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break;
    }
    System.out.println(i);
}
\`\`\`

Output:

\`\`\`text
1
2
3
4
\`\`\`

## break in a while Loop

\`\`\`java
int i = 1;

while (i <= 10) {
    if (i == 4) {
        break;
    }
    System.out.println(i);
    i++;
}
\`\`\`

### Key Idea for break

break completely stops the loop execution.

## 2. Java continue Statement

### What is continue?

The \`continue\` statement skips the current iteration and moves to the next one.

## Example of continue in a Loop

\`\`\`java
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }
    System.out.println(i);
}
\`\`\`

Output:

\`\`\`text
1
2
4
5
\`\`\`

## continue in a while Loop

\`\`\`java
int i = 0;

while (i < 5) {
    i++;

    if (i == 3) {
        continue;
    }

    System.out.println(i);
}
\`\`\`

Extra tip: In a \`while\` loop, make sure the update still happens before \`continue\`, otherwise the loop can get stuck and run forever.

## Difference Between break and continue

- \`break\` -> Stops the loop completely
- \`continue\` -> Skips only the current iteration
- \`break\` -> Exits the loop
- \`continue\` -> Continues with the next loop cycle

## Visual Understanding

break example:

\`\`\`text
1 2 3 4 -> STOP
\`\`\`

continue example:

\`\`\`text
1 2 X 4 5
\`\`\`

\`3\` is skipped.

## When to Use break

Use \`break\` when:

- You want to stop looping early
- A condition is met and no further processing is needed
- You are searching for a value and you already found it

## When to Use continue

Use \`continue\` when:

- You want to skip unwanted values
- You want to ignore specific cases in a loop
- You are filtering data during iteration

## Common Mistakes

- Using \`break\` when you only want to skip one iteration
- Forgetting loop updates before \`continue\` in \`while\` loops
- Overusing both statements in a way that makes code harder to read

## Summary

- \`break\` exits the loop completely
- \`continue\` skips the current loop iteration
- Both are used to control loop flow
- They are very useful in \`for\` and \`while\` loops

## Key Idea

break stops the loop, while continue skips one step, but both control how loops behave.`

const JAVA_WHILE_LOOP_SUMMARY =
  'Learn how Java while loops repeat code based on a condition, when to use them, and how to avoid accidental infinite loops.'

const JAVA_WHILE_LOOP_CONTENT = `# What is a While Loop?

A \`while\` loop is used to repeatedly execute a block of code as long as a condition is true.

It checks the condition before each iteration.

## Syntax

\`\`\`java
while (condition) {
    // code to execute
}
\`\`\`

## How a While Loop Works

- The condition is checked first
- If it is \`true\`, the loop runs
- After execution, Java checks the condition again
- The loop stops when the condition becomes \`false\`

## Example of a While Loop

\`\`\`java
int i = 1;

while (i <= 5) {
    System.out.println(i);
    i++;
}
\`\`\`

Output:

\`\`\`text
1
2
3
4
5
\`\`\`

## Important Note

If you forget to update the condition or loop variable, the loop can run forever. This is called an infinite loop.

## Example of an Infinite Loop

\`\`\`java
int i = 1;

while (i <= 5) {
    System.out.println(i);
}
\`\`\`

Be careful with patterns like this because \`i\` never changes.

## Using a While Loop with Conditions

\`\`\`java
int age = 15;

while (age < 18) {
    System.out.println("You are a minor");
    age++;
}
\`\`\`

## While Loop for User Input

While loops are often used when waiting for valid input or a stop condition.

\`\`\`java
int number = 1;

while (number != 0) {
    System.out.println("Enter 0 to stop");
    number--;
}
\`\`\`

## Difference Between While Loop and For Loop

- \`while\` loop -> Best when the number of iterations is unknown
- \`for\` loop -> Best when the number of iterations is known
- \`while\` loop -> More flexible
- \`for\` loop -> More structured

Extra tip: A \`while\` loop checks the condition before running, while a \`do...while\` loop runs the code once before checking the condition.

## When to Use a While Loop

Use a \`while\` loop when:

- You do not know how many times the loop will run
- You want to repeat until a condition changes
- You are waiting for user input or events

## Common Mistakes

- Forgetting to update the loop variable
- Creating infinite loops by accident
- Writing the wrong condition logic

## Summary

- A \`while\` loop runs while a condition is true
- The condition is checked before each iteration
- You must update the loop variable or state to avoid infinite loops
- It works best when the number of iterations is unknown

## Key Idea

While loops are perfect when you want repetition based on a condition instead of a fixed number.`

const JAVA_ARRAYS_SUMMARY =
  'Learn how Java arrays store multiple values of the same type, how indexing works, and how to loop through one-dimensional and multidimensional arrays.'

const JAVA_ARRAYS_CONTENT = `# What is an Array?

An array is a data structure used to store multiple values in a single variable.

Instead of creating separate variables for each value, you can use an array.

Extra tip: In Java, all values inside one array must be of the same type.

## Why Use Arrays?

- Store multiple values in one variable
- Make repeated data easier to manage
- Keep code more organized
- Work well with loops and data processing

## Creating an Array

Syntax:

\`\`\`java
dataType[] arrayName = new dataType[size];
\`\`\`

Example:

\`\`\`java
int[] numbers = new int[5];
\`\`\`

## Array with Values

You can also assign values directly:

\`\`\`java
int[] numbers = {10, 20, 30, 40, 50};
\`\`\`

## Accessing Array Elements

Array elements are accessed using index numbers starting from 0.

\`\`\`java
int[] numbers = {10, 20, 30};

System.out.println(numbers[0]); // 10
System.out.println(numbers[1]); // 20
System.out.println(numbers[2]); // 30
\`\`\`

## Changing Array Values

\`\`\`java
int[] numbers = {10, 20, 30};

numbers[1] = 99;

System.out.println(numbers[1]); // 99
\`\`\`

## Array Length

The \`length\` property returns the size of an array.

\`\`\`java
int[] numbers = {10, 20, 30, 40};

System.out.println(numbers.length);
\`\`\`

Extra tip: \`length\` is a property for arrays, not a method, so you write \`numbers.length\`, not \`numbers.length()\`.

## Looping Through Arrays

### Using a for Loop

\`\`\`java
int[] numbers = {10, 20, 30};

for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
\`\`\`

### Using a For-Each Loop

\`\`\`java
int[] numbers = {10, 20, 30};

for (int num : numbers) {
    System.out.println(num);
}
\`\`\`

## Multidimensional Arrays

A multidimensional array is an array of arrays.

Example:

\`\`\`java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};

System.out.println(matrix[0][1]); // 2
\`\`\`

## Looping Through 2D Arrays

\`\`\`java
int[][] matrix = {
    {1, 2},
    {3, 4}
};

for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.println(matrix[i][j]);
    }
}
\`\`\`

## Common Mistakes

- Accessing an index outside the array range
- Forgetting that indexing starts from 0
- Confusing \`length\` with the last valid index

## Example of an Error

\`\`\`java
int[] numbers = {10, 20, 30};

// System.out.println(numbers[3]); // Error
\`\`\`

## Summary

- Arrays store multiple values in one variable
- Array indexing starts from 0
- Arrays have a fixed size after creation
- Arrays can be single-dimensional or multidimensional
- Arrays are commonly used with loops

## Key Idea

Arrays help you store and manage multiple values efficiently using a single variable.`

const JAVA_METHODS_SUMMARY =
  'Learn how Java methods organize reusable logic, accept parameters, return values, and support cleaner, more maintainable programs.'

const JAVA_METHODS_CONTENT = `# What is a Method?

A method is a block of code that performs a specific task.

You can think of a method like a function that you can reuse whenever needed.

## Why Use Methods?

- Reuse code instead of repeating it
- Make code easier to read
- Help organize programs
- Improve debugging and maintenance

## Creating a Method

Syntax:

\`\`\`java
returnType methodName() {
    // code to execute
}
\`\`\`

## Example of a Simple Method

\`\`\`java
public class Main {

    static void greet() {
        System.out.println("Hello from a method!");
    }

    public static void main(String[] args) {
        greet();
    }
}
\`\`\`

Output:

\`\`\`text
Hello from a method!
\`\`\`

## Method with Parameters

Methods can accept values called parameters.

\`\`\`java
public class Main {

    static void greet(String name) {
        System.out.println("Hello " + name);
    }

    public static void main(String[] args) {
        greet("John");
        greet("Ama");
    }
}
\`\`\`

Output:

\`\`\`text
Hello John
Hello Ama
\`\`\`

## Method with Return Value

A method can return a value using \`return\`.

\`\`\`java
public class Main {

    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = add(5, 3);
        System.out.println(result);
    }
}
\`\`\`

Output:

\`\`\`text
8
\`\`\`

## Types of Methods

### 1. Built-in Methods

These are already provided by Java.

\`\`\`java
Math.max(10, 20);
System.out.println("Hello");
\`\`\`

### 2. User-defined Methods

These are created by the programmer.

\`\`\`java
static void showMessage() {
    System.out.println("Custom method");
}
\`\`\`

## Method Calling

A method is executed only when it is called.

\`\`\`java
methodName();
\`\`\`

## Method with Multiple Parameters

\`\`\`java
static void addNumbers(int a, int b, int c) {
    System.out.println(a + b + c);
}
\`\`\`

## Method Overloading

Method overloading means having multiple methods with the same name but different parameters.

\`\`\`java
static int add(int a, int b) {
    return a + b;
}

static double add(double a, double b) {
    return a + b;
}
\`\`\`

Extra tip: Java decides which overloaded method to call by looking at the number and types of arguments you pass in.

## Key Rules of Methods

- Methods must be declared inside a class
- Methods can be called multiple times
- Methods can take parameters or none
- Methods can return a value or use \`void\` if nothing is returned

## Common Mistakes

- Forgetting to call the method
- Using the wrong return type
- Missing required parameters
- Confusing static and non-static methods

## Summary

- Methods are reusable blocks of code
- They make programs cleaner and more organized
- Methods can take inputs through parameters
- Methods can return outputs
- Methods can be overloaded

## Key Idea

Methods help you write code once and use it many times.`

const JAVA_METHOD_CHALLENGE_SUMMARY =
  'Practice Java methods by solving small challenges that use parameters, return values, conditions, and reusable logic.'

const JAVA_METHOD_CHALLENGE_CONTENT = `# Java Method Challenge

This lesson gives you a set of small method challenges to practice reusable logic in Java.

Extra tip: Try each task on your own first before looking at the solution.

## Challenge 1: Add Two Numbers

Task:

Create a method that takes two numbers and returns their sum.

Solution:

\`\`\`java
public class Main {

    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(add(10, 5));
    }
}
\`\`\`

Expected output:

\`\`\`text
15
\`\`\`

## Challenge 2: Check Even or Odd

Task:

Create a method that checks if a number is even or odd.

Solution:

\`\`\`java
public class Main {

    static void checkNumber(int num) {
        if (num % 2 == 0) {
            System.out.println(num + " is Even");
        } else {
            System.out.println(num + " is Odd");
        }
    }

    public static void main(String[] args) {
        checkNumber(7);
        checkNumber(10);
    }
}
\`\`\`

Expected output:

\`\`\`text
7 is Odd
10 is Even
\`\`\`

## Challenge 3: Find the Largest Number

Task:

Create a method that returns the largest of two numbers.

Solution:

\`\`\`java
public class Main {

    static int findMax(int a, int b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }

    public static void main(String[] args) {
        System.out.println(findMax(20, 35));
    }
}
\`\`\`

Expected output:

\`\`\`text
35
\`\`\`

## Challenge 4: Simple Greeting Method

Task:

Create a method that prints a greeting message using a name.

Solution:

\`\`\`java
public class Main {

    static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        greet("Ama");
        greet("Kofi");
    }
}
\`\`\`

Expected output:

\`\`\`text
Hello, Ama!
Hello, Kofi!
\`\`\`

## Challenge 5: Multiply Three Numbers

Task:

Create a method that multiplies three numbers and returns the result.

Solution:

\`\`\`java
public class Main {

    static int multiply(int a, int b, int c) {
        return a * b * c;
    }

    public static void main(String[] args) {
        System.out.println(multiply(2, 3, 4));
    }
}
\`\`\`

Expected output:

\`\`\`text
24
\`\`\`

## Key Idea

Method challenges help you practice:

- Logic building
- Parameter usage
- Return values
- Condition handling`

const JAVA_METHOD_PARAMETERS_SUMMARY =
  'Learn how Java method parameters receive input values, how parameters differ from arguments, and how multiple typed inputs make methods more flexible.'

const JAVA_METHOD_PARAMETERS_CONTENT = `# What are Method Parameters?

Method parameters are values you pass into a method so it can use them.

They act like variables inside the method, and they are defined inside the method's parentheses.

## Syntax

\`\`\`java
returnType methodName(dataType parameter1, dataType parameter2) {
    // code to execute
}
\`\`\`

## Example

\`\`\`java
public class Main {

    static void greet(String name) {
        System.out.println("Hello " + name);
    }

    public static void main(String[] args) {
        greet("Ama");
        greet("Kofi");
    }
}
\`\`\`

Output:

\`\`\`text
Hello Ama
Hello Kofi
\`\`\`

## Multiple Parameters

A method can take more than one parameter.

\`\`\`java
public class Main {

    static void fullName(String firstName, String lastName) {
        System.out.println(firstName + " " + lastName);
    }

    public static void main(String[] args) {
        fullName("John", "Doe");
    }
}
\`\`\`

Output:

\`\`\`text
John Doe
\`\`\`

## Parameters vs Arguments

- Parameter -> A variable listed in the method definition
- Argument -> The actual value passed when calling the method

Example:

\`\`\`java
static void add(int a, int b) {  // parameters
    System.out.println(a + b);
}

add(5, 10); // arguments
\`\`\`

## Parameter Types

### 1. String Parameter

\`\`\`java
static void showName(String name) {
    System.out.println(name);
}
\`\`\`

### 2. Integer Parameter

\`\`\`java
static void showAge(int age) {
    System.out.println(age);
}
\`\`\`

### 3. Multiple Data Types

\`\`\`java
static void studentInfo(String name, int age, double grade) {
    System.out.println(name + " " + age + " " + grade);
}
\`\`\`

## Default Behavior

Java does not allow default parameter values like some other languages.

That means you must pass the required arguments when calling the method.

Extra tip: The number, order, and data types of the arguments should match the method parameters.

## Common Mistakes

- Forgetting to pass arguments
- Using the wrong data type in an argument
- Mismatching the number of parameters and arguments

## Example Error

\`\`\`java
// Wrong: missing argument
greet(); // Error if the method expects a parameter
\`\`\`

## Key Idea

Parameters allow methods to be flexible and reusable with different inputs.

## Summary

- Parameters are values defined in a method declaration
- Arguments are the values passed when calling the method
- Methods can have one parameter or many parameters
- Parameters make methods reusable and dynamic

## Real-Life Analogy

Think of a method like a food order system:

- Parameters -> The form fields asking what you want
- Arguments -> Your actual order, such as rice, chicken, and a drink`

const JAVA_METHOD_OVERLOADING_SUMMARY =
  'Learn how Java method overloading lets one method name handle different parameter lists, making related actions easier to organize and reuse.'

const JAVA_METHOD_OVERLOADING_CONTENT = `# What is Method Overloading?

Method overloading means having multiple methods with the same name, but with different parameters.

Java decides which method to use based on the number, type, or order of the parameters.

## Why Use Method Overloading?

- Makes code cleaner
- Improves readability
- Allows the same method name for similar actions
- Increases flexibility

## Rules for Method Overloading

Methods must differ in at least one of these ways:

- Number of parameters
- Type of parameters
- Order of parameters

Important: Changing only the return type does not create a valid overload.

## Example 1: Different Number of Parameters

\`\`\`java
public class Main {

    static int add(int a, int b) {
        return a + b;
    }

    static int add(int a, int b, int c) {
        return a + b + c;
    }

    public static void main(String[] args) {
        System.out.println(add(5, 10));
        System.out.println(add(5, 10, 15));
    }
}
\`\`\`

Output:

\`\`\`text
15
30
\`\`\`

## Example 2: Different Data Types

\`\`\`java
public class Main {

    static int multiply(int a, int b) {
        return a * b;
    }

    static double multiply(double a, double b) {
        return a * b;
    }

    public static void main(String[] args) {
        System.out.println(multiply(2, 3));
        System.out.println(multiply(2.5, 3.5));
    }
}
\`\`\`

Output:

\`\`\`text
6
8.75
\`\`\`

## Example 3: Different Parameter Order

\`\`\`java
public class Main {

    static void display(String name, int age) {
        System.out.println(name + " is " + age);
    }

    static void display(int age, String name) {
        System.out.println(age + " years old " + name);
    }

    public static void main(String[] args) {
        display("Ama", 20);
        display(25, "Kofi");
    }
}
\`\`\`

Output:

\`\`\`text
Ama is 20
25 years old Kofi
\`\`\`

## Important Notes

- Return type alone is not enough to overload a method
- The method name stays the same
- The parameter list must be different
- Java resolves overloaded methods at compile time

## Wrong Example

This is not valid overloading because only the return type changes:

\`\`\`java
static int add(int a, int b) {
    return a + b;
}

static double add(int a, int b) { // Error
    return a + b;
}
\`\`\`

## Method Overloading vs Method Overriding

- Overloading -> Same method name, different parameters, usually in the same class
- Overriding -> Same method name, same parameters, usually between a parent class and a child class

## Real-Life Analogy

Think of a printer:

- \`print(text)\`
- \`print(image)\`
- \`print(file, copies)\`

Same name, different inputs, different behavior.

## Summary

- Method overloading means using the same method name with different parameters
- It improves readability and keeps related behavior grouped together
- Java chooses the correct overloaded method based on the arguments
- Method overloading is very common in Java APIs`

const JAVA_SCOPE_SUMMARY =
  'Learn how Java scope controls where variables are visible, including method scope, block scope, and class-level scope.'

const JAVA_SCOPE_CONTENT = `# What is Scope in Java?

Scope refers to the region of a program where a variable can be accessed.

In simple terms, scope determines where a variable is visible and usable.

## Types of Scope in Java

Java mainly has these three types of scope:

- Method scope
- Block scope
- Class scope, also called instance or class-level scope

## 1. Method Scope

Variables declared inside a method can only be used inside that method.

\`\`\`java
public class Main {

    static void myMethod() {
        int x = 10; // method scope
        System.out.println(x);
    }

    public static void main(String[] args) {
        myMethod();
    }
}
\`\`\`

Output:

\`\`\`text
10
\`\`\`

Important:

You cannot access \`x\` outside the method where it was declared.

\`\`\`java
// System.out.println(x); // Error
\`\`\`

## 2. Block Scope

A block is code inside braces, such as an \`if\` statement, loop, or switch section.

Variables declared inside a block only exist inside that block.

\`\`\`java
public class Main {

    public static void main(String[] args) {
        if (true) {
            int y = 20;
            System.out.println(y);
        }

        // System.out.println(y); // Error
    }
}
\`\`\`

Output:

\`\`\`text
20
\`\`\`

### Where Block Scope Applies

- If statements
- Loops
- Switch cases

## 3. Class Scope

Variables declared inside a class but outside methods are class-level variables.

They can be used by methods in that class. Instance variables belong to each object created from the class.

\`\`\`java
public class Main {

    int z = 30; // class scope

    void show() {
        System.out.println(z);
    }

    public static void main(String[] args) {
        Main obj = new Main();
        obj.show();
    }
}
\`\`\`

Output:

\`\`\`text
30
\`\`\`

## Local vs Class-Level Variables

- Local variable -> Declared inside a method or block and usable only there
- Instance variable -> Declared inside a class and accessible through an object

\`\`\`java
public class Main {

    int globalVar = 100; // instance variable

    void method() {
        int localVar = 50; // local variable
        System.out.println(localVar);
        System.out.println(globalVar);
    }

    public static void main(String[] args) {
        Main obj = new Main();
        obj.method();
    }
}
\`\`\`

## Important Notes

- Trying to use a variable outside its scope causes an error
- Loop variables usually do not exist outside the loop where they were declared
- Local variables must be given a value before you use them
- A local variable can hide a class variable with the same name, which is called shadowing

## Common Mistakes

- Trying to use a variable outside its scope
- Declaring the same variable name in confusing overlapping contexts
- Forgetting that loop variables do not exist outside loops

## Real-Life Analogy

Think of scope like rooms in a house:

- Method scope -> Your bedroom
- Block scope -> A smaller room inside it
- Class scope -> The whole house

You cannot use things outside the room where they belong.

## Key Idea

Scope controls where variables live and where they can be used.

## Summary

- Method scope means a variable exists only inside one method
- Block scope means a variable exists only inside one set of braces
- Class scope means a variable can be used across the class
- Scope helps prevent confusion and programming errors`

const JAVA_RECURSION_SUMMARY =
  'Learn how Java recursion works when a method calls itself, why a base case matters, and where recursion is useful.'

const JAVA_RECURSION_CONTENT = `# What is Recursion?

Recursion is when a method calls itself to solve a problem.

Instead of using loops, the method keeps breaking the problem into smaller parts until it reaches a stopping point.

## Why Use Recursion?

- Solves complex problems in a simple way
- Breaks big problems into smaller ones
- Useful in algorithms like sorting and searching
- Common in mathematics and tree structures

## Important Concept: Base Case

Every recursive method must have a base case.

The base case is the condition that stops the recursion.

Without it, the program can keep calling itself until it crashes with a stack overflow error.

## Syntax

\`\`\`java
returnType methodName() {
    if (base condition) {
        // stop recursion
    } else {
        methodName(); // recursive call
    }
}
\`\`\`

## Example 1: Counting Down

\`\`\`java
public class Main {

    static void countdown(int n) {
        if (n == 0) {
            System.out.println("Done!");
        } else {
            System.out.println(n);
            countdown(n - 1);
        }
    }

    public static void main(String[] args) {
        countdown(5);
    }
}
\`\`\`

Output:

\`\`\`text
5
4
3
2
1
Done!
\`\`\`

## Example 2: Factorial Using Recursion

A factorial is:

\`\`\`text
5! = 5 x 4 x 3 x 2 x 1
\`\`\`

\`\`\`java
public class Main {

    static int factorial(int n) {
        if (n <= 1) {
            return 1; // base case
        } else {
            return n * factorial(n - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}
\`\`\`

Output:

\`\`\`text
120
\`\`\`

## How Recursion Works

For \`factorial(5)\`, the calls happen like this:

- 5 x factorial(4)
- 4 x factorial(3)
- 3 x factorial(2)
- 2 x factorial(1)
- 1, which reaches the base case

Then the answers return back up the chain until the final result becomes 120.

## Recursion vs Loop

- Recursion -> A method calls itself
- Loop -> A block repeats using \`for\`, \`while\`, or \`do...while\`
- Recursion -> Can be cleaner for some problems
- Loop -> Usually uses less memory

## When to Use Recursion

Use recursion when:

- A problem can be divided into smaller similar problems
- You are working with trees or graphs
- You are solving mathematical problems such as factorial or Fibonacci

## Common Mistakes

- Forgetting the base case
- Creating infinite recursion
- Using a recursive call that does not move toward the base case

## Real-Life Analogy

Think of recursion like mirrors facing each other:

- One reflection creates another reflection
- It keeps going until something stops it

## Key Idea

Recursion is a method solving a problem by calling itself until a stopping condition is reached.

## Summary

- Recursion means a method calls itself
- Every recursive method needs a base case
- Recursion breaks problems into smaller versions of the same problem
- Recursion is common in math, algorithms, and data structures`

const JAVA_CLASSES_SUMMARY =
  'Learn how Java classes define data and behavior, how objects are created from classes, and why classes are the foundation of OOP.'

const JAVA_CLASSES_CONTENT = `# What is a Class?

A class is a blueprint for creating objects.

It defines:

- Attributes, which are variables
- Methods, which are functions

Think of a class as a design, and objects as the real things made from that design.

## Why Use Classes?

- Organize code properly
- Reuse code more easily
- Represent real-world things
- Form the foundation of Object-Oriented Programming, or OOP

## Syntax of a Class

\`\`\`java
class ClassName {
    // fields (variables)
    // methods
}
\`\`\`

## Example of a Class

\`\`\`java
class Car {
    String color = "Red";
    int speed = 120;

    void drive() {
        System.out.println("The car is driving");
    }
}
\`\`\`

## Creating an Object

An object is created from a class using the \`new\` keyword.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();

        System.out.println(myCar.color);
        System.out.println(myCar.speed);

        myCar.drive();
    }
}
\`\`\`

Output:

\`\`\`text
Red
120
The car is driving
\`\`\`

## Class vs Object

- Class -> Blueprint or design
- Object -> Real instance created from the class
- Class -> Defined once
- Object -> Many objects can be created from one class

## Multiple Objects

You can create many objects from one class.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Car car1 = new Car();
        Car car2 = new Car();

        car2.color = "Blue";

        System.out.println(car1.color);
        System.out.println(car2.color);
    }
}
\`\`\`

Output:

\`\`\`text
Red
Blue
\`\`\`

## Accessing Class Members

Use the dot operator:

- \`objectName.variable\`
- \`objectName.method()\`

## Real-Life Example

Think of a class like a cookie cutter:

- Class -> The cutter shape
- Objects -> The cookies made from it

All cookies are based on the same design, but they can still have different details.

## Important Keywords

- \`class\` -> Defines a class
- \`new\` -> Creates an object
- Object -> An instance of a class

## Important Notes

- Instance variables and methods usually need an object before you can use them
- The \`main\` method is static, so it cannot directly access non-static members without an object
- Classes help group related data and behavior together in one place

## Common Mistakes

- Forgetting to create an object before using instance members
- Trying to access non-static members directly in \`main\`
- Confusing a class with an object

## Key Idea

A class is a blueprint, and objects are real things created from it.

## Summary

- Classes define structure and behavior
- Objects are created from classes
- You can create many objects from one class
- Classes are a core part of Java OOP`

const JAVA_OOP_SUMMARY =
  'Learn how Java Object-Oriented Programming uses classes and objects, and understand the four main OOP pillars: encapsulation, inheritance, polymorphism, and abstraction.'

const JAVA_OOP_CONTENT = `# What is OOP?

OOP, or Object-Oriented Programming, is a programming style based on objects and classes.

It helps you structure programs using real-world concepts.

## Why Use OOP?

- Organizes code better
- Makes code reusable
- Makes programs easier to maintain and scale
- Helps model real-world problems

## Java OOP Concepts

Java OOP is commonly explained through these four main principles:

- Encapsulation
- Inheritance
- Polymorphism
- Abstraction

Everything starts with classes and objects, which are the building blocks used to apply these ideas.

## 1. Classes and Objects

- Class -> Blueprint
- Object -> Real instance created from the class

\`\`\`java
class Car {
    String brand = "Toyota";

    void drive() {
        System.out.println("Car is driving");
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        System.out.println(myCar.brand);
        myCar.drive();
    }
}
\`\`\`

## 2. Encapsulation

Encapsulation means hiding data and controlling access using methods.

\`\`\`java
class Person {
    private String name;

    public void setName(String newName) {
        name = newName;
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        Person p = new Person();
        p.setName("Ama");

        System.out.println(p.getName());
    }
}
\`\`\`

Key idea:

- Data is often hidden with \`private\`
- Getters and setters control access to that data

## 3. Inheritance

Inheritance allows one class to inherit properties and methods from another class.

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal makes sound");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.sound();
        d.bark();
    }
}
\`\`\`

Output:

\`\`\`text
Animal makes sound
Dog barks
\`\`\`

Key idea:

- \`extends\` means a child class inherits from a parent class

## 4. Polymorphism

Polymorphism means many forms.

It allows methods to behave differently depending on the situation.

### Method Overloading

\`\`\`java
class MathOp {
    int add(int a, int b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}
\`\`\`

### Method Overriding

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Meow");
    }
}
\`\`\`

## 5. Abstraction

Abstraction means hiding implementation details and showing only the essential features.

\`\`\`java
abstract class Shape {
    abstract void draw();
}

class Circle extends Shape {
    void draw() {
        System.out.println("Drawing Circle");
    }
}

public class Main {
    public static void main(String[] args) {
        Circle c = new Circle();
        c.draw();
    }
}
\`\`\`

Output:

\`\`\`text
Drawing Circle
\`\`\`

## Summary of OOP Concepts

- Class -> Blueprint
- Object -> Instance of a class
- Encapsulation -> Hiding data and controlling access
- Inheritance -> Reusing behavior from another class
- Polymorphism -> One interface or method name, many forms
- Abstraction -> Hiding complexity and exposing essentials

## Real-Life Analogy

Think of a smartphone:

- Class -> Phone design
- Object -> Your actual phone
- Encapsulation -> Lock screen protecting internal data
- Inheritance -> Different phone models sharing base features
- Polymorphism -> The same action behaving differently in different apps
- Abstraction -> You use apps without knowing their internal code

## Important Notes

- OOP helps manage large programs by grouping related data and behavior
- Not every program uses all OOP ideas in the same way, but understanding them makes Java easier to scale
- Many Java frameworks and libraries rely heavily on OOP concepts

## Key Idea

OOP structures programs around objects so code becomes cleaner, reusable, and easier to grow.

## Summary

- OOP in Java is built around classes and objects
- The four main pillars are encapsulation, inheritance, polymorphism, and abstraction
- OOP helps organize code and model real-world systems
- OOP is a major foundation of professional Java development`

const JAVA_CLASSES_OBJECTS_SUMMARY =
  'Learn how Java classes act as blueprints, how objects are created from them, and how to access properties and methods through real instances.'

const JAVA_CLASSES_OBJECTS_CONTENT = `# What are Classes and Objects?

Java is an object-oriented language, and classes and objects are central to how Java programs are structured.

- A class is a blueprint
- An object is a real thing created from that blueprint

## Real-Life Example

Think of a class like a car design:

- Class -> Car design or blueprint
- Object -> Actual car, such as a Toyota or BMW

## Java Class

### What is a Class?

A class is a template that defines:

- Properties, which are variables
- Behaviors, which are methods

## Syntax

\`\`\`java
class ClassName {
    // fields (variables)
    // methods
}
\`\`\`

## Example

\`\`\`java
class Car {
    String brand = "Toyota";
    int speed = 120;

    void drive() {
        System.out.println("Car is driving");
    }
}
\`\`\`

## Java Object

### What is an Object?

An object is an instance of a class.

It is created using the \`new\` keyword.

## Creating an Object

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();

        System.out.println(myCar.brand);
        System.out.println(myCar.speed);

        myCar.drive();
    }
}
\`\`\`

Output:

\`\`\`text
Toyota
120
Car is driving
\`\`\`

## Accessing Class Members

You use the dot operator:

- \`objectName.variable\`
- \`objectName.method()\`

## Multiple Objects

You can create many objects from one class.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Car car1 = new Car();
        Car car2 = new Car();

        car2.brand = "BMW";

        System.out.println(car1.brand);
        System.out.println(car2.brand);
    }
}
\`\`\`

Output:

\`\`\`text
Toyota
BMW
\`\`\`

## Class vs Object

- Class -> Blueprint
- Object -> Real instance
- Class -> Defined once
- Object -> Many can be created from one class

## Why Use Classes and Objects?

- Organize code better
- Represent real-world things
- Reuse code more easily
- Form the foundation of OOP

## Important Notes

- A variable like \`myCar\` stores a reference to the created object
- Different objects from the same class can still hold different values
- Objects let you reuse the same class design many times

## Common Mistakes

- Forgetting to create an object
- Trying to access instance members without an object
- Confusing the class with the object
- Using the wrong object name

## Key Idea

A class defines structure, and objects bring that structure to life.

## Summary

- Class -> Blueprint
- Object -> Instance of a class
- Objects are created using \`new\`
- You can create multiple objects from one class
- Use \`.\` to access properties and methods

## Simple Analogy

Think of a class like a cookie cutter:

- Class -> Cutter shape
- Objects -> Cookies made from it

All cookies come from the same design, but they can still be different.`

const JAVA_CLASS_ATTRIBUTES_SUMMARY =
  'Learn how Java class attributes store object data, how instance and static attributes differ, and how objects access and change attribute values.'

const JAVA_CLASS_ATTRIBUTES_CONTENT = `# What are Class Attributes?

Class attributes are variables declared inside a class.

They describe the properties or data of objects created from that class.

They are also called fields or member variables.

## Why Use Attributes?

- Store object data
- Define object properties
- Help represent real-world things
- Provide data that objects can use

## Syntax

\`\`\`java
class ClassName {
    dataType attributeName;
}
\`\`\`

## Example

\`\`\`java
class Car {
    String brand = "Toyota";
    int speed = 120;
}
\`\`\`

## Accessing Attributes

To access attributes, you normally create an object first.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();

        System.out.println(myCar.brand);
        System.out.println(myCar.speed);
    }
}
\`\`\`

Output:

\`\`\`text
Toyota
120
\`\`\`

## Modifying Attributes

You can change attribute values through objects.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();

        myCar.brand = "BMW";
        myCar.speed = 200;

        System.out.println(myCar.brand);
        System.out.println(myCar.speed);
    }
}
\`\`\`

Output:

\`\`\`text
BMW
200
\`\`\`

## Multiple Objects, Different Values

Each object has its own copy of instance attributes.

\`\`\`java
class Car {
    String brand;
    int speed;
}

public class Main {
    public static void main(String[] args) {
        Car car1 = new Car();
        car1.brand = "Toyota";

        Car car2 = new Car();
        car2.brand = "Tesla";

        System.out.println(car1.brand);
        System.out.println(car2.brand);
    }
}
\`\`\`

Output:

\`\`\`text
Toyota
Tesla
\`\`\`

## Default Values of Attributes

If you do not assign a value, Java gives class and instance attributes default values.

- \`int\` -> \`0\`
- \`double\` -> \`0.0\`
- \`boolean\` -> \`false\`
- \`String\` -> \`null\`

\`\`\`java
class Person {
    int age;
    String name;
}

public class Main {
    public static void main(String[] args) {
        Person p = new Person();

        System.out.println(p.age);
        System.out.println(p.name);
    }
}
\`\`\`

Output:

\`\`\`text
0
null
\`\`\`

Important note:

These default values apply to attributes in a class, not to local variables inside methods.

## Types of Attributes

### 1. Instance Attributes

- Belong to objects
- Each object has its own copy

### 2. Static Attributes

- Shared among all objects
- Declared using \`static\`

\`\`\`java
class Car {
    static String company = "Toyota";
}
\`\`\`

## Accessing a Static Attribute

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println(Car.company);
    }
}
\`\`\`

## Instance vs Static

- Instance attribute -> Belongs to an object
- Static attribute -> Belongs to the class
- Instance attribute -> Each object gets its own copy
- Static attribute -> Shared across all objects
- Instance attribute -> Usually accessed with an object
- Static attribute -> Best accessed with the class name

## Common Mistakes

- Forgetting to create an object for instance attributes
- Confusing class access with object access
- Thinking all attributes are shared when they are not

## Real-Life Analogy

Think of a class as a student form:

- Attributes -> Name, age, and class
- Each student object has its own values
- A school name could be static because all students share it

## Key Idea

Attributes define what an object has, which means its stored data or properties.

## Summary

- Class attributes are variables inside a class
- They define object properties
- Each object has its own copy unless the attribute is static
- Attributes are used to store data for objects`

const JAVA_CLASS_METHODS_SUMMARY =
  'Learn how Java class methods define behavior, how instance and static methods differ, and how methods work with attributes, parameters, and return values.'

const JAVA_CLASS_METHODS_CONTENT = `# What is a Class Method?

A class method is a function defined inside a class that describes what an object can do.

If attributes are what an object has, methods are what an object does.

## Why Use Methods in a Class?

- Add behavior to objects
- Organize code better
- Reuse functionality
- Work together with attributes

## Syntax

\`\`\`java
class ClassName {
    returnType methodName() {
        // code
    }
}
\`\`\`

## Example of a Class Method

\`\`\`java
class Car {
    void drive() {
        System.out.println("The car is driving");
    }
}
\`\`\`

## Calling a Method Using an Object

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.drive();
    }
}
\`\`\`

Output:

\`\`\`text
The car is driving
\`\`\`

## Methods with Attributes

Methods can use class attributes.

\`\`\`java
class Car {
    String brand = "Toyota";

    void showBrand() {
        System.out.println("Brand: " + brand);
    }
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car();
        car.showBrand();
    }
}
\`\`\`

Output:

\`\`\`text
Brand: Toyota
\`\`\`

## Methods with Parameters

\`\`\`java
class Car {
    void speed(int maxSpeed) {
        System.out.println("Max speed is " + maxSpeed);
    }
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car();
        car.speed(150);
    }
}
\`\`\`

Output:

\`\`\`text
Max speed is 150
\`\`\`

## Methods with Return Values

\`\`\`java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();

        int result = calc.add(5, 10);
        System.out.println(result);
    }
}
\`\`\`

Output:

\`\`\`text
15
\`\`\`

## Method Types in Classes

### 1. Instance Methods

- Belong to objects
- Usually require an object to call
- Can directly use instance attributes

### 2. Static Methods

- Belong to the class
- Do not require an object
- Are declared using \`static\`

\`\`\`java
class MathUtil {
    static int square(int x) {
        return x * x;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(MathUtil.square(4));
    }
}
\`\`\`

Output:

\`\`\`text
16
\`\`\`

## Class Methods vs Attributes

- Attributes -> Store data
- Methods -> Perform actions
- Attributes -> What an object has
- Methods -> What an object does

## Real-Life Analogy

Think of a car:

- Attributes -> Color, speed, brand
- Methods -> \`drive()\`, \`brake()\`, \`stop()\`

The car is not just data. It also does things.

## Common Mistakes

- Forgetting to create an object for a non-static method
- Trying to call a non-static method without an object
- Confusing a method with an attribute
- Forgetting parentheses \`()\` when calling methods

## Important Notes

- A method can read or change attribute values
- Methods may take parameters, return values, or both
- Static methods should usually be called with the class name for clarity

## Key Idea

Methods define the behavior of objects inside a class.

## Summary

- Class methods define actions
- They are called using objects, or the class name if they are static
- Methods can use attributes
- Methods can take parameters and return values
- Methods make classes more powerful and interactive`

const JAVA_CLASS_CHALLENGE_SUMMARY =
  'Practice Java classes with short challenges that reinforce attributes, objects, methods, parameters, and return values.'

const JAVA_CLASS_CHALLENGE_CONTENT = `# Java Class Challenge

These class challenges help you practice creating classes, building objects, using attributes, and calling methods.

Tip: Try solving each task on your own before looking at the solution.

## Challenge 1: Create a Simple Class

### Task

Create a class called \`Person\` with:

- A \`name\` attribute
- An \`age\` attribute

Then print both values using an object.

### Solution

\`\`\`java
class Person {
    String name = "Ama";
    int age = 20;
}

public class Main {
    public static void main(String[] args) {
        Person p = new Person();

        System.out.println(p.name);
        System.out.println(p.age);
    }
}
\`\`\`

### Expected Output

\`\`\`text
Ama
20
\`\`\`

## Challenge 2: Change Class Attributes

### Task

Create a \`Car\` class and change its values using an object.

### Solution

\`\`\`java
class Car {
    String brand;
    int speed;
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car();

        car.brand = "BMW";
        car.speed = 180;

        System.out.println(car.brand);
        System.out.println(car.speed);
    }
}
\`\`\`

### Expected Output

\`\`\`text
BMW
180
\`\`\`

## Challenge 3: Add a Method in a Class

### Task

Create a class with a method that prints a message.

### Solution

\`\`\`java
class Dog {
    void bark() {
        System.out.println("Dog is barking");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.bark();
    }
}
\`\`\`

### Expected Output

\`\`\`text
Dog is barking
\`\`\`

## Challenge 4: Class Method with a Parameter

### Task

Create a method that takes a name and prints a greeting.

### Solution

\`\`\`java
class Student {
    void greet(String name) {
        System.out.println("Hello " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.greet("Kofi");
        s.greet("Ama");
    }
}
\`\`\`

### Expected Output

\`\`\`text
Hello Kofi
Hello Ama
\`\`\`

## Challenge 5: Method with a Return Value

### Task

Create a class method that adds two numbers and returns the result.

### Solution

\`\`\`java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();

        int result = calc.add(10, 5);

        System.out.println(result);
    }
}
\`\`\`

### Expected Output

\`\`\`text
15
\`\`\`

## Key Idea

Classes combine attributes, which hold data, and methods, which define behavior, to create useful real-world models.

## What Students Should Learn

After this section, learners should understand:

- How to create a class
- How to create objects
- How to access and modify attributes
- How to use methods inside a class`

const JAVA_CONSTRUCTORS_SUMMARY =
  'Learn how Java constructors initialize objects, how parameterized and overloaded constructors work, and how they differ from regular methods.'

const JAVA_CONSTRUCTORS_CONTENT = `# What is a Constructor?

A constructor is a special method used to initialize objects.

It is called automatically when an object is created.

## Why Use Constructors?

- Set initial values for objects
- Make object creation easier
- Avoid assigning values manually every time

## Rules of Constructors

- The constructor name must be the same as the class name
- It has no return type, not even \`void\`
- It runs automatically when an object is created

## Syntax

\`\`\`java
class ClassName {
    ClassName() {
        // constructor code
    }
}
\`\`\`

## Example of a Constructor

\`\`\`java
class Car {

    Car() {
        System.out.println("Car object created");
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
    }
}
\`\`\`

Output:

\`\`\`text
Car object created
\`\`\`

## Parameterized Constructor

A constructor can take parameters to set values when creating an object.

\`\`\`java
class Car {
    String brand;

    Car(String b) {
        brand = b;
    }

    void show() {
        System.out.println(brand);
    }
}

public class Main {
    public static void main(String[] args) {
        Car car1 = new Car("Toyota");
        Car car2 = new Car("BMW");

        car1.show();
        car2.show();
    }
}
\`\`\`

Output:

\`\`\`text
Toyota
BMW
\`\`\`

## Constructor Overloading

You can have multiple constructors with different parameter lists.

\`\`\`java
class Student {

    String name;
    int age;

    Student() {
        name = "Unknown";
        age = 0;
    }

    Student(String n, int a) {
        name = n;
        age = a;
    }

    void show() {
        System.out.println(name + " " + age);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        Student s2 = new Student("Ama", 20);

        s1.show();
        s2.show();
    }
}
\`\`\`

Output:

\`\`\`text
Unknown 0
Ama 20
\`\`\`

## Constructor vs Method

- Constructor -> Same name as the class
- Method -> Can use any valid name
- Constructor -> No return type
- Method -> Has a return type or uses \`void\`
- Constructor -> Runs automatically during object creation
- Method -> Must be called manually
- Constructor -> Used to initialize objects
- Method -> Used to perform actions

## Default Constructor

If you do not create any constructor, Java automatically provides a default constructor.

\`\`\`java
class Car {
    // Java creates a default constructor automatically
}
\`\`\`

Important note:

If you write your own constructor, Java does not also add the default one for you.

## Real-Life Analogy

Think of a constructor like a factory setup machine:

- A product, which is the object, is created
- The constructor automatically sets it up
- It can assign things like brand, color, or price

## Common Mistakes

- Writing a return type in a constructor
- Forgetting that the constructor name must match the class name
- Thinking a constructor is called manually like a normal method

## Key Idea

Constructors automatically set up objects when they are created.

## Summary

- A constructor initializes objects
- It has the same name as the class
- It has no return type
- It runs automatically
- Constructors can be overloaded`

const JAVA_THIS_KEYWORD_SUMMARY =
  'Learn how Java uses this to refer to the current object, solve naming conflicts, call class methods, and chain constructors.'

const JAVA_THIS_KEYWORD_CONTENT = `# What is \`this\` in Java?

\`this\` is a reference variable that points to the current object.

It is used inside a class to refer to its own variables, methods, and constructors.

## Why Use \`this\`?

- Avoid confusion between instance variables and parameters
- Refer to the current class object
- Call another constructor in the same class

## Problem Without \`this\`

Sometimes variable names clash.

\`\`\`java
class Student {
    String name;

    Student(String name) {
        name = name; // confusing
    }

    void show() {
        System.out.println(name);
    }
}
\`\`\`

What happens here:

- The parameter \`name\` is assigned to itself
- The class variable is not updated

## Using \`this\` the Correct Way

\`\`\`java
class Student {
    String name;

    Student(String name) {
        this.name = name;
    }

    void show() {
        System.out.println(name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Ama");
        s.show();
    }
}
\`\`\`

Output:

\`\`\`text
Ama
\`\`\`

## \`this\` for Method Calls

You can use \`this\` to call methods inside the same class.

\`\`\`java
class Test {

    void display() {
        System.out.println("Hello");
    }

    void show() {
        this.display();
    }
}

public class Main {
    public static void main(String[] args) {
        Test t = new Test();
        t.show();
    }
}
\`\`\`

Output:

\`\`\`text
Hello
\`\`\`

## \`this()\` Constructor Call

\`this()\` is used to call another constructor in the same class.

\`\`\`java
class Student {
    String name;
    int age;

    Student() {
        this("Unknown", 0);
    }

    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void show() {
        System.out.println(name + " " + age);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        Student s2 = new Student("Kofi", 21);

        s1.show();
        s2.show();
    }
}
\`\`\`

Output:

\`\`\`text
Unknown 0
Kofi 21
\`\`\`

Important note:

\`this()\` must be the first statement inside a constructor.

## Common Uses of \`this\`

- \`this.name\` -> Refers to an instance variable
- \`this()\` -> Calls another constructor
- \`this.method()\` -> Calls a method on the current object
- \`this\` -> Refers to the current object itself

## Real-Life Analogy

Think of \`this\` as saying:

- I am talking about myself
- This car is mine
- This student is me

## Common Mistakes

- Forgetting to use \`this\` when parameter names match instance variables
- Confusing \`this()\` with \`this.variable\`
- Trying to use \`this\` in static methods

## Important Notes

- \`this\` works only in the context of an object
- Static methods do not belong to a specific object, so \`this\` cannot be used there
- Using \`this\` can make code clearer even when it is optional

## Key Idea

\`this\` always refers to the current object.

## Summary

- \`this\` refers to the current object
- \`this.name\` helps distinguish instance variables from parameters
- \`this()\` calls another constructor in the same class
- \`this\` is useful for cleaner and less confusing object-oriented code`

const JAVA_MODIFIERS_SUMMARY =
  'Learn how Java modifiers control access and behavior for classes, methods, and variables, including public, private, protected, static, final, and abstract.'

const JAVA_MODIFIERS_CONTENT = `# What are Modifiers in Java?

Modifiers are keywords used to change the behavior of classes, methods, and variables.

They define things like:

- Access level, meaning who can use something
- Whether it can be changed
- Whether it belongs to the class or to an object

## Types of Java Modifiers

Java has two main types:

### 1. Access Modifiers

These control where a class, method, or variable can be accessed.

### 2. Non-Access Modifiers

These control behavior such as \`final\`, \`static\`, and \`abstract\`.

## Java Access Modifiers

### 1. \`public\`

Accessible from anywhere.

\`\`\`java
public class Car {
    public String brand = "Toyota";
}
\`\`\`

### 2. \`private\`

Accessible only inside the same class.

\`\`\`java
class Car {
    private String brand = "Toyota";
}
\`\`\`

### 3. \`protected\`

Accessible in the same package and in subclasses.

\`\`\`java
class Car {
    protected String brand = "Toyota";
}
\`\`\`

### 4. Default Access

This uses no keyword.

It is accessible only within the same package.

\`\`\`java
class Car {
    String brand = "Toyota";
}
\`\`\`

## Access Level Summary

- \`public\` -> Same class, same package, subclasses, and anywhere else
- \`protected\` -> Same class, same package, and subclasses
- Default -> Same class and same package only
- \`private\` -> Same class only

## Java Non-Access Modifiers

### 1. \`static\`

Belongs to the class, not to individual objects.

\`\`\`java
class Counter {
    static int count = 0;
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Counter.count);
    }
}
\`\`\`

### 2. \`final\`

Means something cannot be changed further.

Final variable:

\`\`\`java
class Car {
    final String brand = "Toyota";
}
\`\`\`

Final method:

\`\`\`java
class Car {
    final void show() {
        System.out.println("This cannot be overridden");
    }
}
\`\`\`

Extra tip:

- A final variable cannot be reassigned
- A final method cannot be overridden
- A final class cannot be extended

### 3. \`abstract\`

Used for classes and methods that are meant to be completed later by subclasses.

\`\`\`java
abstract class Animal {
    abstract void sound();
}
\`\`\`

Important note:

An abstract class cannot be instantiated directly.

## Real-Life Analogy

- \`public\` -> Open door, everyone can enter
- \`private\` -> Locked room, only the owner can enter
- \`protected\` -> Family access
- \`static\` -> Shared TV in a house
- \`final\` -> Permanent rule that cannot change

## Common Mistakes

- Trying to access private variables directly
- Thinking static belongs to objects
- Trying to change final variables
- Trying to create an object directly from an abstract class

## Key Idea

Modifiers control both access and behavior in Java code.

## Quick Summary

- Access modifiers include \`public\`, \`private\`, \`protected\`, and default access
- Non-access modifiers include \`static\`, \`final\`, and \`abstract\`
- Modifiers help control security, structure, and behavior in Java programs`

const JAVA_ENCAPSULATION_SUMMARY =
  'Learn how Java encapsulation hides data with private fields and uses getters and setters to provide safe controlled access.'

const JAVA_ENCAPSULATION_CONTENT = `# What is Encapsulation?

Encapsulation is the process of hiding sensitive data and allowing access only through controlled methods.

It is usually achieved using:

- Private variables
- Public getter and setter methods

## Why Use Encapsulation?

- Protect data from direct access
- Control how data is changed
- Improve security
- Make code easier to maintain

## Real-Life Example

Think of a bank account:

- You cannot directly change the balance
- You must use official methods such as deposit or withdraw

That is encapsulation.

## How Encapsulation Works

- Make variables private
- Use getter and setter methods to access them

## Example of Encapsulation

### Step 1: Private Variables

\`\`\`java
class Person {
    private String name;
    private int age;
}
\`\`\`

### Step 2: Add Getters and Setters

\`\`\`java
class Person {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
\`\`\`

### Step 3: Use the Class

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Person p = new Person();

        p.setName("Ama");
        p.setAge(20);

        System.out.println(p.getName());
        System.out.println(p.getAge());
    }
}
\`\`\`

Output:

\`\`\`text
Ama
20
\`\`\`

## Getter and Setter Explained

### Getter

Used to read a value.

\`\`\`java
public String getName() {
    return name;
}
\`\`\`

### Setter

Used to update a value.

\`\`\`java
public void setName(String name) {
    this.name = name;
}
\`\`\`

## Why Not Use Public Variables?

Without encapsulation, someone could write code like this:

\`\`\`java
person.name = "Ama";
\`\`\`

Problems:

- No control over values
- Data can be changed incorrectly
- No validation happens before the value is stored

## Encapsulation with Validation

You can control input inside a setter.

\`\`\`java
class Person {
    private int age;

    public void setAge(int age) {
        if (age > 0) {
            this.age = age;
        } else {
            System.out.println("Invalid age");
        }
    }

    public int getAge() {
        return age;
    }
}
\`\`\`

This makes the class safer because bad values can be rejected before they are saved.

## Key Benefits

- Better security
- Controlled access
- Cleaner code
- Easier maintenance

## Common Mistakes

- Forgetting to create getters or setters when they are needed
- Making all variables public
- Not using validation in setters when validation is important

## Key Idea

Encapsulation means data hiding plus controlled access.

## Summary

- Encapsulation hides internal data
- Private fields protect variables from direct outside access
- Getters and setters allow safe reading and updating
- Encapsulation helps protect data quality and improve class design`

const JAVA_PACKAGES_API_SUMMARY =
  'Learn how Java packages organize code, how built-in Java APIs provide ready-made tools, and how to create and use your own packages.'

const JAVA_PACKAGES_API_CONTENT = `# What is a Package in Java?

A package is a folder-like structure used to group related classes and interfaces.

Think of it like a directory that keeps your code organized.

## Why Use Packages?

- Avoid name conflicts
- Organize code properly
- Make code easier to maintain
- Reuse existing code

## Types of Packages

### 1. Built-in Packages, Also Called Java APIs

These are already provided by Java.

Examples:

- \`java.util\` -> Utilities such as \`ArrayList\` and \`Scanner\`
- \`java.io\` -> File handling
- \`java.time\` -> Date and time tools
- \`java.lang\` -> Core Java classes that are imported automatically

### 2. User-Defined Packages

These are packages you create yourself.

## Using Built-in Packages

### Example: Using \`Scanner\`

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = input.nextLine();

        System.out.println("Hello " + name);
    }
}
\`\`\`

Output example:

\`\`\`text
Enter your name: Ama
Hello Ama
\`\`\`

## Java API: What It Means

API stands for Application Programming Interface.

In Java, it usually refers to a collection of ready-made classes and methods that you can use instead of writing everything from scratch.

## Examples of Java APIs

### 1. Math API

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.sqrt(25));
        System.out.println(Math.max(10, 20));
    }
}
\`\`\`

Output:

\`\`\`text
5.0
20
\`\`\`

### 2. Random API

\`\`\`java
import java.util.Random;

public class Main {
    public static void main(String[] args) {
        Random rand = new Random();

        System.out.println(rand.nextInt(100));
    }
}
\`\`\`

## Creating Your Own Package

### Step 1: Define the Package

\`\`\`java
package mypack;

public class MyClass {
    public void show() {
        System.out.println("Hello from package");
    }
}
\`\`\`

### Step 2: Use the Package

\`\`\`java
import mypack.MyClass;

public class Main {
    public static void main(String[] args) {
        MyClass obj = new MyClass();
        obj.show();
    }
}
\`\`\`

## Package Naming Rules

- Use lowercase letters
- Use meaningful names
- A common style looks like \`com.myapp.utils\`

## Real-Life Analogy

Think of packages like boxes in a warehouse:

- Each box contains similar items
- Everything is easier to find
- Things do not get mixed up

## Common Mistakes

- Forgetting to import packages when needed
- Misspelling package names
- Not understanding the difference between built-in packages and your own packages

## Important Notes

- \`java.lang\` is imported automatically, so classes like \`String\` and \`System\` do not need a manual import
- Importing a package does not copy code; it gives your file access to existing classes
- Using Java APIs saves time because many useful tools are already built for you

## Key Idea

Packages organize code, and APIs give you ready-made tools to use.

## Quick Summary

- A package is a folder-like way to group classes
- A Java API gives you ready-made tools and classes
- Built-in packages save time and reduce repeated work
- You can also create your own packages to organize your code`

const JAVA_INHERITANCE_SUMMARY =
  'Learn how Java inheritance lets child classes reuse and extend parent classes, reduce duplication, and support cleaner object-oriented design.'

const JAVA_INHERITANCE_CONTENT = `# What is Inheritance?

Inheritance is an OOP concept where one class, called a child class or subclass, can inherit fields and methods from another class, called a parent class or superclass.

It helps classes reuse code and build clear "is-a" relationships.

## Why Use Inheritance?

- Reuse code instead of rewriting the same fields and methods
- Make programs easier to maintain
- Reduce duplication
- Build clear relationships between related classes
- Make object-oriented programs easier to grow

## Real-Life Example

Think of a parent and child relationship:

- A child can inherit traits from a parent
- The child can also have its own special features

Example:

- Parent: \`Animal\`
- Child: \`Dog\`

## Syntax

\`\`\`java
class Parent {
    // fields and methods
}

class Child extends Parent {
    // additional fields and methods
}
\`\`\`

## Example of Inheritance

### Parent Class

\`\`\`java
class Animal {
    void eat() {
        System.out.println("This animal eats food");
    }
}
\`\`\`

### Child Class

\`\`\`java
class Dog extends Animal {
    void bark() {
        System.out.println("Dog is barking");
    }
}
\`\`\`

### Main Program

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();

        d.eat();
        d.bark();
    }
}
\`\`\`

Output:

\`\`\`text
This animal eats food
Dog is barking
\`\`\`

## Types of Inheritance in Java

### 1. Single Inheritance

One child class inherits from one parent class.

Example:

- \`Animal -> Dog\`

### 2. Multilevel Inheritance

A chain of inheritance where one child becomes the parent of another class.

Example:

- \`Animal -> Mammal -> Dog\`

### 3. Hierarchical Inheritance

Multiple child classes inherit from the same parent class.

Example:

- \`Animal\`
- \`Dog\`
- \`Cat\`

## Important Note

- Java does not support multiple inheritance with classes
- A class cannot extend two classes at the same time
- Java uses interfaces when a class needs to follow multiple type contracts

## Method Overriding

A child class can change the behavior of an inherited method. This is called method overriding.

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal makes sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.sound();
    }
}
\`\`\`

Output:

\`\`\`text
Dog barks
\`\`\`

## The super Keyword

The \`super\` keyword refers to the parent class. It is often used when a child class wants to call a parent method before adding its own behavior.

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        super.sound();
        System.out.println("Dog barks");
    }
}
\`\`\`

## Benefits Summary

- Saves time by reusing code
- Reduces repeated logic
- Improves program structure
- Makes code easier to extend later

## Common Mistakes

- Trying to use multiple inheritance with classes
- Forgetting the \`extends\` keyword
- Confusing method overriding with method overloading
- Overriding a method with the wrong signature

## Key Idea

Inheritance allows a class to reuse and extend another class.

## Quick Summary

- \`extends\` is the Java inheritance keyword
- Child classes inherit accessible fields and methods from parent classes
- Child classes can add their own features
- Child classes can override inherited methods
- Inheritance helps Java programs stay cleaner and more reusable`

const JAVA_POLYMORPHISM_SUMMARY =
  'Learn how Java polymorphism lets the same method name or parent reference behave in different ways through overloading and overriding.'

const JAVA_POLYMORPHISM_CONTENT = `# What is Polymorphism?

Polymorphism means "many forms."

In Java, polymorphism allows one method name or one parent-type reference to behave in different ways depending on the context.

## Why Use Polymorphism?

- Improves flexibility
- Makes code easier to reuse
- Helps systems grow without rewriting everything
- Supports clean object-oriented design

## Types of Polymorphism in Java

### 1. Compile-Time Polymorphism

This usually happens through method overloading.

- Same method name
- Different parameters
- Decided by the compiler

### 2. Runtime Polymorphism

This happens through method overriding.

- Same method in a parent and child class
- The version that runs depends on the real object
- Decided while the program is running

## Method Overloading: Compile-Time Polymorphism

Method overloading means using the same method name with different parameter lists.

\`\`\`java
class MathUtil {
    int add(int a, int b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}

public class Main {
    public static void main(String[] args) {
        MathUtil obj = new MathUtil();

        System.out.println(obj.add(5, 10));
        System.out.println(obj.add(5, 10, 15));
    }
}
\`\`\`

Output:

\`\`\`text
15
30
\`\`\`

## Method Overriding: Runtime Polymorphism

Method overriding happens when a child class provides its own version of a method that already exists in the parent class.

### Parent Class

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal makes sound");
    }
}
\`\`\`

### Child Class

\`\`\`java
class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks");
    }
}
\`\`\`

### Main Program

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.sound();
    }
}
\`\`\`

Output:

\`\`\`text
Dog barks
\`\`\`

This works because Java looks at the real object, \`new Dog()\`, when deciding which overridden method to run.

## Difference Between Overloading and Overriding

### Overloading

- Same method name
- Different parameters
- Usually inside the same class
- Resolved at compile time

### Overriding

- Same method name
- Same parameters
- Used in a parent-child relationship
- Resolved at runtime

## Real-Life Analogy

Think of one person behaving differently in different situations:

- Teacher in school
- Parent at home
- Player on the field

Same person, different forms of behavior.

## Key Concepts

### Method Overloading

- Same name
- Different parameters
- Same class

### Method Overriding

- Same name
- Same parameters
- Parent-child relationship

## Common Mistakes

- Confusing overloading with overriding
- Trying to overload a method by changing only the return type
- Forgetting that overriding needs inheritance
- Using different parameters when you actually mean to override

## Key Idea

Polymorphism means one action can appear in many forms.

## Summary

- Polymorphism makes Java code more flexible
- Overloading is compile-time polymorphism
- Overriding is runtime polymorphism
- Polymorphism is one of the core ideas in object-oriented programming`

const JAVA_SUPER_KEYWORD_SUMMARY =
  'Learn how the Java super keyword gives child classes direct access to parent variables, methods, and constructors in inheritance-based code.'

const JAVA_SUPER_KEYWORD_CONTENT = `# What is super in Java?

The \`super\` keyword refers to the parent class, also called the superclass.

It is used in child classes to:

- Access parent class variables
- Call parent class methods
- Call parent class constructors

## Why Use super?

- Reuse parent class code
- Avoid confusion between parent and child members
- Call overridden methods from the parent class
- Make inheritance-based code clearer

## Access Parent Class Variable

\`\`\`java
class Animal {
    String color = "White";
}

class Dog extends Animal {
    String color = "Black";

    void showColor() {
        System.out.println(color);
        System.out.println(super.color);
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.showColor();
    }
}
\`\`\`

Output:

\`\`\`text
Black
White
\`\`\`

In this example:

- \`color\` uses the child class variable
- \`super.color\` uses the parent class variable

## Call Parent Class Method

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal makes sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        super.sound();
        System.out.println("Dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.sound();
    }
}
\`\`\`

Output:

\`\`\`text
Animal makes sound
Dog barks
\`\`\`

This is useful when you want to keep the parent behavior and then add extra child behavior.

## Call Parent Constructor

\`super()\` is used to call the parent constructor.

\`\`\`java
class Animal {
    Animal() {
        System.out.println("Animal constructor");
    }
}

class Dog extends Animal {
    Dog() {
        super();
        System.out.println("Dog constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
    }
}
\`\`\`

Output:

\`\`\`text
Animal constructor
Dog constructor
\`\`\`

Important note:

- \`super()\` must be the first statement in a constructor
- If you do not write it explicitly, Java may insert it automatically when possible

## super vs this

### this

- Refers to the current object
- Used for the current class

### super

- Refers to the parent part of the current object
- Used to access parent class members

## Real-Life Analogy

Think of a child:

- \`this\` means "me, the child"
- \`super\` means "my parent"

Example:

- Child uses own phone -> \`this.phone\`
- Child uses parent's phone -> \`super.phone\`

## Key Uses of super

- \`super.variable\` accesses a parent variable
- \`super.method()\` calls a parent method
- \`super()\` calls a parent constructor

## Common Mistakes

- Using \`super\` in static methods
- Forgetting that \`super()\` must be the first line in a constructor
- Confusing \`this\` with \`super\`
- Trying to use \`super\` when there is no inheritance relationship

## Key Idea

\`super\` gives direct access to the parent class from a child class.

## Summary

- \`super.variable\` refers to a parent variable
- \`super.method()\` calls a parent method
- \`super()\` calls a parent constructor
- \`super\` works only in inheritance-based code`

const JAVA_INNER_CLASSES_SUMMARY =
  'Learn how Java inner classes group related code inside outer classes, improve encapsulation, and support helper structures such as local and anonymous classes.'

const JAVA_INNER_CLASSES_CONTENT = `# What is an Inner Class?

An inner class is a class defined inside another class.

It is used to group classes that belong together and keep related logic close to the outer class.

## Why Use Inner Classes?

- Better code organization
- Stronger encapsulation
- Easier-to-read code when helper logic belongs to one outer class
- Useful for helper classes and event-driven code

## Syntax

\`\`\`java
class OuterClass {
    class InnerClass {
        // code
    }
}
\`\`\`

## Important Note

Strictly speaking, a static nested class is not an inner class in the narrow Java definition. However, it is commonly taught alongside inner classes because it is also a class declared inside another class.

## Types of Inner Classes

### 1. Non-static Inner Class

\`\`\`java
class Outer {
    class Inner {
        void show() {
            System.out.println("Inner class method");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();

        inner.show();
    }
}
\`\`\`

Output:

\`\`\`text
Inner class method
\`\`\`

This type needs an outer object before you can create the inner object.

### 2. Static Nested Class

\`\`\`java
class Outer {
    static class Inner {
        void show() {
            System.out.println("Static inner class");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Outer.Inner obj = new Outer.Inner();
        obj.show();
    }
}
\`\`\`

Output:

\`\`\`text
Static inner class
\`\`\`

Because it is static, you do not need an outer object to create it.

### 3. Local Inner Class

A local inner class is declared inside a method.

\`\`\`java
class Outer {
    void display() {
        class Inner {
            void show() {
                System.out.println("Local inner class");
            }
        }

        Inner obj = new Inner();
        obj.show();
    }
}

public class Main {
    public static void main(String[] args) {
        Outer o = new Outer();
        o.display();
    }
}
\`\`\`

Output:

\`\`\`text
Local inner class
\`\`\`

### 4. Anonymous Inner Class

An anonymous inner class has no class name and is usually created for one-time use.

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Animal() {
            @Override
            void sound() {
                System.out.println("Dog barks");
            }
        };

        a.sound();
    }
}
\`\`\`

Output:

\`\`\`text
Dog barks
\`\`\`

## Real-Life Analogy

Think of a car factory:

- Outer class = Car
- Inner class = Engine, Wheels, Seats

These parts belong to the car and are easier to understand when grouped with it.

## Key Benefits

- Keeps related classes together
- Improves encapsulation
- Reduces code clutter
- Useful in GUI and event-handling code

## Common Mistakes

- Forgetting that non-static inner classes need an outer object
- Confusing static nested classes with non-static inner classes
- Trying to create an inner class directly without referencing the outer class
- Using inner classes when a normal top-level class would be clearer

## Key Idea

Inner classes are classes inside classes that help structure related code more clearly.

## Summary

- An inner class is declared inside another class
- Common forms include non-static, static nested, local, and anonymous classes
- Inner classes help organize code and improve encapsulation
- They are especially useful when helper logic belongs closely to one outer class`

const JAVA_ABSTRACTION_SUMMARY =
  'Learn how Java abstraction hides implementation details and exposes only essential behavior through abstract classes and interfaces.'

const JAVA_ABSTRACTION_CONTENT = `# What is Abstraction?

Abstraction is the process of hiding implementation details and showing only the important features.

It focuses on what an object does, not how it does it internally.

## Why Use Abstraction?

- Reduces complexity
- Hides unnecessary details
- Improves security and design clarity
- Makes code easier to maintain and extend

## Real-Life Example

Think of a car:

- You use the steering wheel
- You press the brake
- You use the accelerator

You do not need to know how the engine works internally.

Abstraction lets you use functionality without seeing every internal detail.

## How to Achieve Abstraction in Java

Java mainly achieves abstraction using:

- Abstract classes
- Interfaces

## Abstract Class

### What is an Abstract Class?

An abstract class:

- Cannot be used to create objects directly
- Can contain abstract methods with no body
- Can also contain normal methods with full implementation
- Can hold shared fields and constructors

Syntax:

\`\`\`java
abstract class ClassName {
    abstract void methodName();
}
\`\`\`

Example:

\`\`\`java
abstract class Animal {
    abstract void sound();

    void sleep() {
        System.out.println("This animal sleeps");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.sound();
        d.sleep();
    }
}
\`\`\`

Output:

\`\`\`text
Dog barks
This animal sleeps
\`\`\`

## Interface

### What is an Interface?

An interface is used to describe a contract that a class must follow.

In beginner Java, you can think of it as a fully abstract design that lists required behaviors.

Syntax:

\`\`\`java
interface Animal {
    void sound();
}
\`\`\`

Implementation:

\`\`\`java
class Dog implements Animal {
    @Override
    public void sound() {
        System.out.println("Dog barks");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.sound();
    }
}
\`\`\`

Output:

\`\`\`text
Dog barks
\`\`\`

Important note:

- A class uses \`extends\` with an abstract class
- A class uses \`implements\` with an interface

## Abstract Class vs Interface

### Abstract Class

- Can have abstract methods and normal methods
- Can have constructors
- Can store instance variables
- A class can extend only one class

### Interface

- Commonly used to define required behavior
- Fields are constants by default
- A class can implement multiple interfaces
- Very useful for flexible design rules

## Real-Life Analogy

### Abstract Class

A partially designed blueprint:

- Some parts are already defined
- Some parts must still be completed

### Interface

A contract:

- Rules are listed clearly
- Any class that agrees to the contract must provide the required behavior

## Key Concepts

### Abstract Class

- Partial abstraction
- Shared code plus required code
- Good when related classes have common structure

### Interface

- Contract-based design
- Supports multiple interface implementation
- Good when different classes should follow the same behavior rules

## Common Mistakes

- Trying to create an object directly from an abstract class
- Forgetting the \`implements\` keyword for interfaces
- Failing to implement required interface methods
- Confusing \`extends\` with \`implements\`

## Key Idea

Abstraction hides details and shows only the essential behavior.

## Summary

- Abstract class means partial abstraction
- Interface is commonly used for full behavioral contracts
- Abstraction helps build clean and flexible systems
- It focuses on what an object does, not how it works internally`

const JAVA_ENUM_SUMMARY =
  'Learn how Java enums define a fixed set of constants, improve type safety, and make code clearer than using raw strings or numbers.'

const JAVA_ENUM_CONTENT = `# What is an Enum?

An enum, short for enumeration, is a special type in Java used to define a fixed set of constants.

Examples include:

- Days of the week
- Directions
- Status values
- Traffic light colors

## Why Use Enum?

- Makes code more readable
- Prevents invalid values
- Groups related constants together
- Safer than using strings or numbers

## Syntax

\`\`\`java
enum EnumName {
    VALUE1, VALUE2, VALUE3
}
\`\`\`

## Simple Example

### Enum Definition

\`\`\`java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}
\`\`\`

### Using Enum

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Day today = Day.MONDAY;

        System.out.println(today);
    }
}
\`\`\`

Output:

\`\`\`text
MONDAY
\`\`\`

## Enum in a Switch Statement

Enums work very well with \`switch\`.

\`\`\`java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY
}

public class Main {
    public static void main(String[] args) {
        Day day = Day.WEDNESDAY;

        switch (day) {
            case MONDAY:
                System.out.println("Start of week");
                break;
            case WEDNESDAY:
                System.out.println("Midweek");
                break;
            case FRIDAY:
                System.out.println("Weekend soon");
                break;
            default:
                System.out.println("Other day");
        }
    }
}
\`\`\`

Output:

\`\`\`text
Midweek
\`\`\`

## Enum with a Loop

You can loop through all enum values by using \`values()\`.

\`\`\`java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY
}

public class Main {
    public static void main(String[] args) {
        for (Day d : Day.values()) {
            System.out.println(d);
        }
    }
}
\`\`\`

Output:

\`\`\`text
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
\`\`\`

## Enum with Fields and Methods

Enums can also behave like small classes and hold more structure than just names.

\`\`\`java
enum Level {
    LOW,
    MEDIUM,
    HIGH
}

public class Main {
    public static void main(String[] args) {
        Level level = Level.HIGH;

        System.out.println("Current level: " + level);
    }
}
\`\`\`

Output:

\`\`\`text
Current level: HIGH
\`\`\`

## Important Notes

- Enum values are constants
- You do not create enum values with \`new\`
- Enum names must match exactly when you use them
- Because the set is fixed, enums help prevent invalid values

## Real-Life Analogy

Think of enums like fixed options in a system:

- Traffic lights -> \`RED\`, \`YELLOW\`, \`GREEN\`
- Order status -> \`PENDING\`, \`SHIPPED\`, \`DELIVERED\`
- Days -> \`MONDAY\` to \`SUNDAY\`

You cannot create random values outside the list.

## Advantages of Enum

- Type safety
- Easy-to-read code
- Better structure than loose strings or number constants
- Built-in support for loops and switch statements

## Common Mistakes

- Trying to create enum objects with \`new\`
- Using the wrong enum name or case
- Treating enums exactly like strings
- Using raw text values when a fixed enum would be safer

## Key Idea

An enum represents a fixed set of constant values.

## Summary

- Enums are used for predefined values
- They are safer than raw strings or numbers
- They work well with switch statements and loops
- Their set of values is fixed and not meant to change at runtime`

const JAVA_ANONYMOUS_CLASS_SUMMARY =
  'Learn how Java anonymous classes create one-time class implementations inline, which is useful for quick overrides, interfaces, and event-driven code.'

const JAVA_ANONYMOUS_CLASS_CONTENT = `# What is an Anonymous Class?

An anonymous class is a class without a name.

It is used when you want to declare and create an object at the same time for one-time use.

## Why Use Anonymous Classes?

- Useful for one-time-use classes
- Reduces boilerplate code
- Common in event handling and interface implementation
- Makes short custom behavior easier to write inline

## Syntax

\`\`\`java
ClassOrInterface obj = new ClassOrInterface() {
    // method implementation
};
\`\`\`

## Anonymous Class Using a Class

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal makes sound");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Animal() {
            @Override
            void sound() {
                System.out.println("Dog barks");
            }
        };

        a.sound();
    }
}
\`\`\`

Output:

\`\`\`text
Dog barks
\`\`\`

## Anonymous Class Using an Interface

\`\`\`java
interface Animal {
    void sound();
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Animal() {
            @Override
            public void sound() {
                System.out.println("Cat meows");
            }
        };

        a.sound();
    }
}
\`\`\`

Output:

\`\`\`text
Cat meows
\`\`\`

## Where Anonymous Classes Are Used

- GUI event handling such as button clicks
- Threads through interfaces like \`Runnable\`
- Quick interface implementation
- One-time custom logic blocks

## Important Notes

- Anonymous classes do not have their own class name
- They are best for one-time use, not for reusable large code blocks
- Interface methods must still follow the correct access rules, such as \`public\`
- In modern Java, lambdas often replace anonymous classes for simple single-method interfaces

## Real-Life Analogy

Think of hiring someone for a one-time job:

- You do not create a full employee profile
- You just assign the task immediately

That is similar to how anonymous classes work.

## Anonymous Class vs Regular Class

### Regular Class

- Has a class name
- Can be reused
- Usually takes more setup code

### Anonymous Class

- Has no class name
- Usually used once
- Created inline where it is needed

## Common Mistakes

- Trying to reuse anonymous-class logic in many places
- Forgetting to override the needed method
- Confusing anonymous classes with normal inheritance structure
- Missing \`public\` when implementing interface methods

## Key Idea

An anonymous class is a quick one-time implementation created without naming a separate class.

## Summary

- Anonymous classes have no class name
- They are created and used immediately
- They are common with interfaces and event handling
- They reduce boilerplate for small one-time custom behavior`

const JAVA_USER_INPUT_SUMMARY =
  'Learn how Java user input works with Scanner so programs can read text, numbers, and other values while running instead of relying on hardcoded data.'

const JAVA_USER_INPUT_CONTENT = `# What is User Input in Java?

User input allows a program to receive data from the user while the program is running.

Instead of hardcoding values, the user can type them in.

## Java Scanner Class

Java commonly uses the \`Scanner\` class to get input from the user.

It is found in the \`java.util\` package.

## Step 1: Import Scanner

\`\`\`java
import java.util.Scanner;
\`\`\`

## Step 2: Create a Scanner Object

\`\`\`java
Scanner input = new Scanner(System.in);
\`\`\`

## Example: Taking String Input

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = input.nextLine();

        System.out.println("Hello " + name);
    }
}
\`\`\`

Example output:

\`\`\`text
Enter your name: Ama
Hello Ama
\`\`\`

## Taking Integer Input

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your age: ");
        int age = input.nextInt();

        System.out.println("You are " + age + " years old");
    }
}
\`\`\`

Output:

\`\`\`text
Enter your age: 20
You are 20 years old
\`\`\`

## Taking Multiple Inputs

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter name: ");
        String name = input.nextLine();

        System.out.print("Enter age: ");
        int age = input.nextInt();

        System.out.println(name + " is " + age + " years old");
    }
}
\`\`\`

Output:

\`\`\`text
Enter name: Kofi
Enter age: 25
Kofi is 25 years old
\`\`\`

## Common Scanner Methods

- \`nextLine()\` reads a full line of text
- \`next()\` reads a single word
- \`nextInt()\` reads an integer
- \`nextDouble()\` reads a decimal number
- \`nextBoolean()\` reads \`true\` or \`false\`

## Example: Different Data Types

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter salary: ");
        double salary = input.nextDouble();

        System.out.println("Your salary is " + salary);
    }
}
\`\`\`

Output:

\`\`\`text
Enter salary: 1500.50
Your salary is 1500.5
\`\`\`

## Important Note About nextLine() and nextInt()

One common beginner issue happens when \`nextInt()\` is followed by \`nextLine()\`.

\`nextInt()\` reads the number but leaves the newline behind, so the next \`nextLine()\` may appear to be skipped.

Example fix:

\`\`\`java
int age = input.nextInt();
input.nextLine(); // consume leftover newline
String name = input.nextLine();
\`\`\`

## Real-Life Analogy

Think of user input like filling a form on a website:

- Name field -> string input
- Age field -> integer input
- Checkbox -> boolean input

## Common Mistakes

- Forgetting to import \`Scanner\`
- Mixing \`nextLine()\` with \`nextInt()\` incorrectly
- Using the wrong Scanner method for the data type
- Forgetting that closing \`Scanner\` also closes \`System.in\`

## Good Practice Note

Closing a \`Scanner\` is good practice in many programs, but when it wraps \`System.in\` in small demo programs, closing it also closes standard input.

## Key Idea

User input makes Java programs interactive and dynamic.

## Summary

- Use \`Scanner\` for user input
- Import it from \`java.util.Scanner\`
- It supports text, numbers, and booleans
- It helps turn simple Java programs into interactive programs`

const JAVA_DATE_SUMMARY =
  'Learn how Java works with dates and times using the modern java.time API, including LocalDate, LocalTime, LocalDateTime, and DateTimeFormatter.'

const JAVA_DATE_CONTENT = `# What is Java Date?

Java provides built-in classes for working with dates and times.

You can use them to:

- Get the current date
- Get the current time
- Work with both date and time together
- Format date output

## Modern Java Date and Time API

Modern Java usually uses classes from the \`java.time\` package.

The most common ones are:

- \`LocalDate\` for date only
- \`LocalTime\` for time only
- \`LocalDateTime\` for both date and time

## Getting Current Date

\`\`\`java
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        LocalDate date = LocalDate.now();

        System.out.println(date);
    }
}
\`\`\`

Example output:

\`\`\`text
2026-03-28
\`\`\`

## Getting Current Time

\`\`\`java
import java.time.LocalTime;

public class Main {
    public static void main(String[] args) {
        LocalTime time = LocalTime.now();

        System.out.println(time);
    }
}
\`\`\`

Example output:

\`\`\`text
14:35:22.123
\`\`\`

## Getting Current Date and Time

\`\`\`java
import java.time.LocalDateTime;

public class Main {
    public static void main(String[] args) {
        LocalDateTime dateTime = LocalDateTime.now();

        System.out.println(dateTime);
    }
}
\`\`\`

Example output:

\`\`\`text
2026-03-28T14:35:22.123
\`\`\`

## Formatting Date

Java allows you to format dates and times using \`DateTimeFormatter\`.

\`\`\`java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();

        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedDate = now.format(format);

        System.out.println(formattedDate);
    }
}
\`\`\`

Example output:

\`\`\`text
28-03-2026 14:35:22
\`\`\`

## Common Date Formats

- \`yyyy-MM-dd\` -> \`2026-03-28\`
- \`dd/MM/yyyy\` -> \`28/03/2026\`
- \`dd-MM-yyyy HH:mm\` -> \`28-03-2026 14:35\`

## Getting a Specific Date

\`\`\`java
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        LocalDate date = LocalDate.of(2026, 3, 28);

        System.out.println(date);
    }
}
\`\`\`

Output:

\`\`\`text
2026-03-28
\`\`\`

## Useful Date Methods

\`\`\`java
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        LocalDate date = LocalDate.now();

        System.out.println(date.getDayOfWeek());
        System.out.println(date.getMonth());
        System.out.println(date.getYear());
    }
}
\`\`\`

Example output:

\`\`\`text
SATURDAY
MARCH
2026
\`\`\`

## Real-Life Analogy

Think of the Java Date API like a digital calendar system:

- It shows today's date
- It tracks time
- It formats events
- It helps schedule activities

## Important Notes

- Prefer the modern \`java.time\` package instead of the older \`Date\` and \`Calendar\` APIs for new code
- Example outputs change depending on the exact current date and time when the program runs
- Formatting patterns must match the layout you want exactly

## Common Mistakes

- Using the old \`Date\` class instead of \`java.time\`
- Forgetting to import the needed \`java.time\` classes
- Using the wrong formatting pattern
- Expecting example output to stay exactly the same every time

## Key Idea

The Java Date API helps you work with time in a clean, modern way.

## Summary

- Use \`LocalDate\` for date only
- Use \`LocalTime\` for time only
- Use \`LocalDateTime\` for both
- Use \`DateTimeFormatter\` to format output`

const JAVA_ERRORS_SUMMARY =
  'Learn the main kinds of Java program problems, including syntax errors, runtime errors, and logical errors, and how to recognize each one.'

const JAVA_ERRORS_CONTENT = `# What are Errors in Java?

Errors are problems that happen in a program and prevent it from working correctly.

In beginner Java lessons, program problems are often grouped into three main types:

- Syntax errors
- Runtime errors
- Logical errors

## 1. Syntax Errors

### What is it?

Syntax errors happen when you break the rules of Java syntax.

The compiler detects them before the program runs.

Example:

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World") // missing semicolon
    }
}
\`\`\`

Why it fails:

- Missing \`;\`
- Missing braces such as \`{\` or \`}\`
- Wrong spelling of keywords

### Key Idea

Syntax errors mean you broke Java grammar.

## 2. Runtime Errors

### What is it?

Runtime errors happen while the program is running.

The program compiles, but crashes or fails during execution.

Example: Division by Zero

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;

        int result = a / b;

        System.out.println(result);
    }
}
\`\`\`

Output:

\`\`\`text
Exception in thread "main" java.lang.ArithmeticException: / by zero
\`\`\`

### Key Idea

Runtime errors mean the program crashed while running.

## 3. Logical Errors

### What is it?

Logical errors happen when the program runs, but gives the wrong result.

There is no crash, but the output is wrong.

Example:

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;

        int result = a - b; // wrong logic if addition was intended

        System.out.println(result);
    }
}
\`\`\`

Output:

\`\`\`text
5
\`\`\`

Expected result:

\`\`\`text
15
\`\`\`

### Key Idea

Logical errors mean the program runs but the answer is wrong.

## Comparison Summary

- Syntax error -> happens before running, so the program does not compile
- Runtime error -> happens while running, so the program crashes or fails
- Logical error -> happens while running, but the output is incorrect

## Common Java Runtime Exceptions

- \`ArithmeticException\` -> dividing by zero
- \`NullPointerException\` -> using an object reference that is \`null\`
- \`ArrayIndexOutOfBoundsException\` -> using an invalid array index

## Example: NullPointerException

\`\`\`java
public class Main {
    public static void main(String[] args) {
        String text = null;

        System.out.println(text.length());
    }
}
\`\`\`

## How to Avoid Errors

- Double-check syntax carefully
- Validate user input
- Print values step by step when debugging
- Break large problems into smaller tests
- Learn exception handling for runtime problems

## Real-Life Analogy

- Syntax error -> wrong grammar in a sentence
- Runtime error -> tripping while walking
- Logical error -> reaching the wrong destination

## Important Note

In beginner lessons, "errors" usually means any kind of problem in code. Later in Java, you will also learn about exceptions, which are a major category of runtime problems that can often be handled.

## Key Idea

Errors are normal in programming, and good developers learn how to detect and fix them.

## Summary

- Java problems are often grouped into syntax, runtime, and logical errors
- Syntax errors stop compilation
- Runtime errors happen while the program runs
- Logical errors produce the wrong output without crashing`

const JAVA_DEBUGGING_SUMMARY =
  'Learn how Java debugging helps you find and fix bugs using print statements, breakpoints, step-by-step execution, and a simple debugging process.'

const JAVA_DEBUGGING_CONTENT = `# What is Debugging?

Debugging is the process of finding and fixing errors, often called bugs, in a program.

Bugs can be:

- Syntax errors
- Runtime errors
- Logical errors

## Why Debugging is Important

- Helps you find mistakes in code
- Improves program accuracy
- Saves time when fixing issues
- Builds confidence when programs do not behave as expected

## 1. Using Print Statements

One of the easiest ways to debug is by using \`System.out.println()\`.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;

        System.out.println("Value of a: " + a);
        System.out.println("Value of b: " + b);

        int result = a + b;

        System.out.println("Result: " + result);
    }
}
\`\`\`

Why this helps:

- You can see values step by step
- You can confirm whether variables contain what you expect
- You can narrow down where the wrong behavior begins

## 2. Temporarily Isolating Code

You can temporarily comment out lines of code to isolate a problem while testing.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;

        // int result = a / b; // temporarily disabled

        System.out.println("Debugging complete");
    }
}
\`\`\`

This can help during investigation, but it is only a temporary technique, not a full debugging method by itself.

## 3. Using an IDE Debugger

Most developers use a debugger inside an IDE such as:

- IntelliJ IDEA
- Eclipse
- NetBeans

What the debugger helps you do:

- Run code step by step
- See variable values live
- Pause execution
- Find the exact line where behavior changes

## 4. Breakpoints

A breakpoint is a marker placed on a line of code where execution should pause.

Why breakpoints are useful:

- Inspect variables at a specific moment
- Track program flow
- Check whether a condition is being reached
- Find logical errors more easily

## 5. Step-by-Step Execution

Debugger tools often include:

- Step Over -> move to the next line in the current method
- Step Into -> go inside the called method
- Step Out -> finish the current method and return to the caller

## 6. Common Debugging Process

### Step 1: Identify the Problem

- Is the program crashing?
- Is the output wrong?
- Is part of the program not running?

### Step 2: Reproduce the Bug

Run the same case again so the issue can be observed consistently.

### Step 3: Isolate the Cause

Use print statements, breakpoints, or stepping to narrow the problem down.

### Step 4: Fix the Code

Update the logic, syntax, or data handling that caused the bug.

### Step 5: Test Again

Make sure the fix works and did not create a new problem somewhere else.

## Real-Life Analogy

Debugging is like fixing a broken car:

- Check the engine
- Test parts one by one
- Find the fault
- Repair it
- Test again

## Common Debugging Mistakes

- Guessing instead of checking actual values
- Ignoring error messages
- Changing too many things at once
- Forgetting to test again after the fix

## Important Note

Debugging is not about never making mistakes. It is about learning how to investigate problems calmly and efficiently.

## Key Idea

Debugging means finding bugs, understanding why they happen, and fixing them in a reliable way.

## Summary

- Debugging is the process of finding and fixing bugs
- Print statements help with simple checks
- IDE debuggers are stronger tools for complex problems
- Breakpoints and step execution help you inspect program flow
- Good debugging is systematic, not guesswork`

const JAVA_EXCEPTIONS_SUMMARY =
  'Learn what Java exceptions are, how checked and unchecked exceptions differ, and how try, catch, and finally help programs handle failures more safely.'

const JAVA_EXCEPTIONS_CONTENT = `# What is an Exception?

An exception is an unexpected event that occurs during program execution and disrupts the normal flow of the program.

In simple terms, something goes wrong while the program is running.

## Example of an Exception

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;

        int result = a / b;

        System.out.println(result);
    }
}
\`\`\`

Output:

\`\`\`text
Exception in thread "main" java.lang.ArithmeticException: / by zero
\`\`\`

## Difference Between Error and Exception

### Error

- Usually more serious
- Often not something your program is expected to recover from easily
- Example: major system-level failure

### Exception

- Usually something a program can anticipate or handle
- Often related to bad input, missing data, or runtime problems
- Example: divide by zero

## Types of Exceptions in Java

Java exceptions are commonly divided into two groups:

### 1. Checked Exceptions

Checked exceptions are known to the compiler.

The compiler requires you to handle them or declare them.

Examples:

- File not found
- Database connection issues
- Other operations that can fail in expected ways

### 2. Unchecked Exceptions

Unchecked exceptions happen at runtime.

They are not forced by the compiler in the same way checked exceptions are.

Examples:

- \`ArithmeticException\`
- \`NullPointerException\`
- \`ArrayIndexOutOfBoundsException\`

## Example: NullPointerException

\`\`\`java
public class Main {
    public static void main(String[] args) {
        String text = null;

        System.out.println(text.length());
    }
}
\`\`\`

## What is Exception Handling?

Exception handling is the process of dealing with problems so the program can respond more safely instead of crashing immediately.

Java commonly uses:

- \`try\`
- \`catch\`
- \`finally\`

## try and catch

Syntax:

\`\`\`java
try {
    // risky code
} catch (ExceptionType e) {
    // handle error
}
\`\`\`

Example:

\`\`\`java
public class Main {
    public static void main(String[] args) {
        try {
            int a = 10;
            int b = 0;

            int result = a / b;

            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero!");
        }
    }
}
\`\`\`

Output:

\`\`\`text
Cannot divide by zero!
\`\`\`

## finally Block

The \`finally\` block always runs, whether an exception happens or not.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        try {
            int a = 10 / 2;
            System.out.println(a);
        } catch (Exception e) {
            System.out.println("Error occurred");
        } finally {
            System.out.println("This always runs");
        }
    }
}
\`\`\`

Output:

\`\`\`text
5
This always runs
\`\`\`

## Common Exception Types

- \`ArithmeticException\` -> divide by zero
- \`NullPointerException\` -> using a \`null\` object reference
- \`ArrayIndexOutOfBoundsException\` -> invalid array index
- \`NumberFormatException\` -> invalid number conversion

## Real-Life Analogy

Think of exceptions like driving a car:

- Unexpected pothole -> exception
- You slow down or avoid it -> handling
- The car continues moving -> the program continues

## Important Note

Not every problem is handled the same way. Sometimes the best solution is to prevent the exception by validating data before risky code runs.

## Key Idea

Exceptions are problems a program can often detect and handle so it can fail more safely.

## Summary

- An exception is a problem that disrupts normal program flow
- Java has checked and unchecked exceptions
- \`try\` and \`catch\` help handle problems
- \`finally\` runs whether an exception happens or not
- Exception handling helps prevent sudden program failure`

const JAVA_MULTIPLE_EXCEPTIONS_SUMMARY =
  'Learn how Java handles different exception types with multiple catch blocks, general exception handling, and correct catch-block ordering.'

const JAVA_MULTIPLE_EXCEPTIONS_CONTENT = `# What are Multiple Exceptions?

A program can throw different types of exceptions in different situations.

Java allows you to handle them using:

- Multiple \`catch\` blocks
- A more general \`Exception\` catch when appropriate

## 1. Multiple catch Blocks

You can write more than one \`catch\` block for different exception types.

Syntax:

\`\`\`java
try {
    // risky code
} catch (ExceptionType1 e) {
    // handle first error
} catch (ExceptionType2 e) {
    // handle second error
}
\`\`\`

Example:

\`\`\`java
public class Main {
    public static void main(String[] args) {
        try {
            int[] numbers = {1, 2, 3};

            int result = numbers[5] / 0;

            System.out.println(result);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array index is invalid!");
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero!");
        }
    }
}
\`\`\`

Output:

\`\`\`text
Array index is invalid!
\`\`\`

Only the first matching exception handler runs.

## 2. Catching a General Exception

You can also use \`Exception\` to catch many kinds of exceptions in one place.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        try {
            int a = 10 / 0;
            int[] arr = new int[3];
            arr[5] = 10;
        } catch (Exception e) {
            System.out.println("Something went wrong!");
        }
    }
}
\`\`\`

Output:

\`\`\`text
Something went wrong!
\`\`\`

This is useful in simple cases, but specific exception types are usually better when you want different responses for different problems.

## 3. Order of catch Blocks

Always place specific exceptions first and general ones later.

### Correct Order

\`\`\`java
try {
    // code
} catch (ArithmeticException e) {
    System.out.println("Arithmetic error");
} catch (Exception e) {
    System.out.println("General error");
}
\`\`\`

### Wrong Order

\`\`\`java
try {
    // code
} catch (Exception e) {
    System.out.println("General error");
} catch (ArithmeticException e) {
    System.out.println("Arithmetic error");
}
\`\`\`

This causes a compile-time error because \`Exception\` already catches everything that comes after it.

## 4. Real-Life Example

Imagine a banking app:

- Invalid PIN -> one kind of problem
- Insufficient balance -> another kind of problem
- Network failure -> another kind of problem

Different problems may need different responses, so separate handlers can make the program clearer and safer.

## Important Note

If you only use a general \`Exception\` catch everywhere, your code can become harder to understand and harder to debug. Specific handlers usually give better feedback.

## Key Idea

Multiple exceptions let a Java program respond differently depending on what went wrong.

## Summary

- Use multiple \`catch\` blocks for different exceptions
- You can use \`Exception\` to catch many errors in one place
- Put specific exceptions before general ones
- Multiple exception handling makes programs more stable and user-friendly`

const JAVA_TRY_WITH_RESOURCES_SUMMARY =
  'Learn how Java try-with-resources automatically closes files, streams, and other closeable resources so code stays cleaner and safer.'

const JAVA_TRY_WITH_RESOURCES_CONTENT = `# What is Try-with-Resources?

Try-with-resources is a Java feature that automatically closes resources after they are used.

It helps prevent memory leaks and resource mismanagement.

## What is a Resource?

A resource is anything that should be closed after use, such as:

- Files
- Database connections
- Input and output streams

## Why Use Try-with-Resources?

Without it:

- You might forget to close resources
- Programs can leak resources or hold them too long
- The code becomes longer and harder to read

With try-with-resources:

- Resources are closed automatically
- The code is cleaner
- Programs are safer and easier to maintain

## Syntax

\`\`\`java
try (Resource resource = new Resource()) {
    // use resource
} catch (Exception e) {
    // handle error
}
\`\`\`

## Example: FileReader

\`\`\`java
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try (FileReader reader = new FileReader("file.txt")) {
            int data = reader.read();

            while (data != -1) {
                System.out.print((char) data);
                data = reader.read();
            }
        } catch (IOException e) {
            System.out.println("Error reading file");
        }
    }
}
\`\`\`

## How it Works

Java automatically closes the resource after the \`try\` block finishes.

That still happens when:

- The code finishes normally
- An error occurs inside the block

## Multiple Resources

You can declare more than one resource in the same try statement.

\`\`\`java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try (
            FileReader fr = new FileReader("file.txt");
            BufferedReader br = new BufferedReader(fr)
        ) {
            System.out.println(br.readLine());
        } catch (IOException e) {
            System.out.println("Error reading file");
        }
    }
}
\`\`\`

Important note:

- When several resources are declared, Java closes them automatically in reverse order

## Important Rule

Any resource used in try-with-resources must implement the \`AutoCloseable\` interface.

Many Java file and stream classes already do this for you.

## Traditional Way Without Try-with-Resources

\`\`\`java
FileReader fr = null;

try {
    fr = new FileReader("file.txt");
    System.out.println(fr.read());
} catch (IOException e) {
    System.out.println("Error");
} finally {
    try {
        if (fr != null) {
            fr.close();
        }
    } catch (IOException e) {
        System.out.println("Close error");
    }
}
\`\`\`

This works, but it is much longer and harder to manage.

## Real-Life Analogy

Think of try-with-resources like turning off a tap automatically:

- You use the water
- When you are done, it shuts off itself
- You do not need to remember to do it manually

## Common Mistakes

- Forgetting that only \`AutoCloseable\` resources can be used
- Assuming cleanup will happen without a closeable resource
- Writing longer manual cleanup code when try-with-resources would be simpler
- Ignoring exceptions that can still happen while the resource is being used

## Key Idea

Try-with-resources automatically handles cleanup so you do not forget to close important resources.

## Summary

- It automatically closes resources
- It is cleaner than manual \`finally\` cleanup
- It works with files, streams, database-style resources, and more
- It requires a resource that implements \`AutoCloseable\`
- It helps prevent resource leaks`

const JAVA_FILE_HANDLING_SUMMARY =
  'Learn how Java file handling creates, reads, writes, and deletes files so programs can store data permanently on the computer.'

const JAVA_FILE_HANDLING_CONTENT = `# What is File Handling in Java?

File handling allows Java programs to create, read, write, and delete files.

It is used when a program needs to store data permanently instead of keeping everything only in memory.

## Common File Operations

- Create a file
- Write to a file
- Read a file
- Delete a file

## 1. Creating a File

Java often uses the \`File\` class from \`java.io\`.

\`\`\`java
import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            File file = new File("myfile.txt");

            if (file.createNewFile()) {
                System.out.println("File created: " + file.getName());
            } else {
                System.out.println("File already exists.");
            }
        } catch (IOException e) {
            System.out.println("An error occurred.");
        }
    }
}
\`\`\`

## 2. Writing to a File

Use \`FileWriter\` to write text to a file.

\`\`\`java
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileWriter writer = new FileWriter("myfile.txt");

            writer.write("Hello, this is Java file handling!");
            writer.close();

            System.out.println("Successfully wrote to file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
        }
    }
}
\`\`\`

## 3. Reading a File

You can read a file using \`Scanner\` or classes such as \`FileReader\`.

Example using \`Scanner\`:

\`\`\`java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        try {
            File file = new File("myfile.txt");
            Scanner reader = new Scanner(file);

            while (reader.hasNextLine()) {
                String data = reader.nextLine();
                System.out.println(data);
            }

            reader.close();
        } catch (FileNotFoundException e) {
            System.out.println("File not found.");
        }
    }
}
\`\`\`

## 4. Deleting a File

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("myfile.txt");

        if (file.delete()) {
            System.out.println("Deleted the file: " + file.getName());
        } else {
            System.out.println("Failed to delete the file.");
        }
    }
}
\`\`\`

## Useful File Handling Methods

- \`createNewFile()\` creates a new file
- \`write()\` writes data to a file
- \`delete()\` deletes a file
- \`exists()\` checks whether a file exists
- \`getName()\` gets the file name

## Important Notes

- Files are often created in the project or working directory by default when you use a relative path
- Always close file-related resources after use
- Use \`try-catch\` to handle problems safely
- In real programs, try-with-resources is often cleaner than manually calling \`close()\`

## Real-Life Analogy

Think of file handling like a digital notebook:

- Create -> make a new notebook
- Write -> add notes
- Read -> open and read notes
- Delete -> throw the notebook away

## Common Mistakes

- Forgetting to close files or readers
- Using the wrong file path
- Not handling exceptions
- Assuming a file already exists when it has not been created yet

## Key Idea

File handling allows Java programs to store and retrieve data permanently.

## Summary

- Java can create, read, write, and delete files
- Common tools include \`File\`, \`FileWriter\`, and \`Scanner\`
- File data is stored permanently on disk
- Exception handling is important when working with files`

const JAVA_FILES_SUMMARY =
  'Learn how the Java File class represents files and folders, checks their properties, and manages file-system paths without reading or writing content itself.'

const JAVA_FILES_CONTENT = `# What is a File in Java?

In Java, a file is represented by an object that points to a real file or directory on your computer.

Java commonly uses the \`File\` class from \`java.io\` to work with file-system paths.

## Important Point

The \`File\` class does not read or write file content by itself.

It mainly helps you:

- Create files or folders
- Check file information
- Delete files
- List directory contents
- Work with file paths

## 1. Creating a File Object

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("myfile.txt");

        System.out.println("File object created for: " + file.getName());
    }
}
\`\`\`

Creating the \`File\` object does not create the real file yet. It only creates a Java object that points to that path.

## 2. Check If a File Exists

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("myfile.txt");

        if (file.exists()) {
            System.out.println("File exists.");
        } else {
            System.out.println("File does not exist.");
        }
    }
}
\`\`\`

## 3. Getting File Information

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("myfile.txt");

        if (file.exists()) {
            System.out.println("File name: " + file.getName());
            System.out.println("Absolute path: " + file.getAbsolutePath());
            System.out.println("Writable: " + file.canWrite());
            System.out.println("Readable: " + file.canRead());
            System.out.println("File size (bytes): " + file.length());
        }
    }
}
\`\`\`

## 4. Creating a New File

\`\`\`java
import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            File file = new File("newfile.txt");

            if (file.createNewFile()) {
                System.out.println("File created: " + file.getName());
            } else {
                System.out.println("File already exists.");
            }
        } catch (IOException e) {
            System.out.println("Error occurred.");
        }
    }
}
\`\`\`

## 5. Deleting a File

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("newfile.txt");

        if (file.delete()) {
            System.out.println("Deleted file: " + file.getName());
        } else {
            System.out.println("Failed to delete file.");
        }
    }
}
\`\`\`

## 6. Working with Folders

You can also use \`File\` for directories.

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File folder = new File("myFolder");

        if (folder.mkdir()) {
            System.out.println("Folder created.");
        } else {
            System.out.println("Folder already exists or failed.");
        }
    }
}
\`\`\`

## 7. Listing Files in a Folder

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File folder = new File("myFolder");

        String[] files = folder.list();

        if (files != null) {
            for (String fileName : files) {
                System.out.println(fileName);
            }
        }
    }
}
\`\`\`

## Common File Methods

- \`exists()\` checks if a file exists
- \`createNewFile()\` creates a file
- \`delete()\` deletes a file
- \`getName()\` gets the file name
- \`getAbsolutePath()\` gets the full path
- \`length()\` gets the file size
- \`mkdir()\` creates a folder

## Important Notes

- The \`File\` class represents file-system paths, not file content
- Relative paths usually point to locations under the program's current working directory
- To read or write actual content, you usually combine \`File\` with classes like \`Scanner\`, \`FileReader\`, or \`FileWriter\`
- File operations can fail, so exception handling is important

## Real-Life Analogy

Think of \`File\` like a folder label in a filing cabinet:

- It tells you where the file is
- It helps identify the file or folder
- It does not automatically open and read the contents

## Common Mistakes

- Thinking \`File\` reads or writes the file content by itself
- Assuming a file exists just because a \`File\` object was created
- Using the wrong file path
- Forgetting to handle failures when creating files

## Key Idea

The Java \`File\` class helps manage files and folders as file-system objects, but not their content directly.

## Summary

- \`File\` represents files and folders
- It can create, delete, check, and list file-system entries
- It does not read or write content by itself
- It is used to manage the file-system structure`

const JAVA_CREATE_FILES_SUMMARY =
  'Learn how Java creates new empty files with the File class and createNewFile(), including what happens when the file already exists.'

const JAVA_CREATE_FILES_CONTENT = `# What does "Create File" Mean in Java?

Creating a file means making a new empty file on your computer using Java code.

Java commonly uses the \`File\` class from the \`java.io\` package for this.

## 1. Import the File Class

\`\`\`java
import java.io.File;
import java.io.IOException;
\`\`\`

## 2. Create a New File

Use the \`createNewFile()\` method.

\`\`\`java
import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            File file = new File("myfile.txt");

            if (file.createNewFile()) {
                System.out.println("File created: " + file.getName());
            } else {
                System.out.println("File already exists.");
            }
        } catch (IOException e) {
            System.out.println("An error occurred.");
        }
    }
}
\`\`\`

## Output Examples

If the file is new:

\`\`\`text
File created: myfile.txt
\`\`\`

If the file already exists:

\`\`\`text
File already exists.
\`\`\`

## How It Works

Java checks:

- Does the file already exist?
- If no, Java creates it
- If yes, Java does not create another one

## Important Notes

- The file is often created in the project's working directory when you use a relative path
- You must handle \`IOException\`
- The created file is empty by default
- \`createNewFile()\` creates the file itself, but it does not write content into it

## 3. Create a File in a Folder

\`\`\`java
import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            File file = new File("myFolder/myfile.txt");

            if (file.createNewFile()) {
                System.out.println("File created in folder.");
            } else {
                System.out.println("File already exists.");
            }
        } catch (IOException e) {
            System.out.println("Error occurred.");
        }
    }
}
\`\`\`

## 4. Common Mistakes

- Forgetting to handle \`IOException\`
- Using the wrong file path
- Trying to create a file inside a folder that does not exist
- Expecting \`createNewFile()\` to add text automatically

## Real-Life Analogy

Think of file creation like making a new empty document:

- You give it a name
- You save it
- It exists now, but it has no content yet

## Key Idea

Java can create files with \`createNewFile()\`, and it only creates the file when it does not already exist.

## Summary

- Use the \`File\` class
- Use the \`createNewFile()\` method
- It returns \`true\` if the file is created
- It returns \`false\` if the file already exists
- You must handle \`IOException\``

const JAVA_WRITE_FILES_SUMMARY =
  'Learn how Java writes text into files with FileWriter, including overwriting, writing multiple lines, and appending new content safely.'

const JAVA_WRITE_FILES_CONTENT = `# What is Writing to a File?

Writing to a file means saving text data into a file using Java.

Java commonly uses the \`FileWriter\` class for writing text into files.

## 1. Using FileWriter

### Import Required Class

\`\`\`java
import java.io.FileWriter;
import java.io.IOException;
\`\`\`

### Example: Write to a File

\`\`\`java
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileWriter writer = new FileWriter("myfile.txt");

            writer.write("Hello, this is Java file writing!");
            writer.close();

            System.out.println("Successfully wrote to file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
        }
    }
}
\`\`\`

Output:

\`\`\`text
Successfully wrote to file.
\`\`\`

## What Happens?

Java will:

- Create the file if it does not exist
- Overwrite existing content by default
- Write the text you provide

## 2. Writing Multiple Lines

\`\`\`java
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileWriter writer = new FileWriter("myfile.txt");

            writer.write("Line 1: Hello Java\\n");
            writer.write("Line 2: File Writing Example\\n");
            writer.write("Line 3: W3Schools Style Learning");

            writer.close();

            System.out.println("File written successfully.");
        } catch (IOException e) {
            System.out.println("Error occurred.");
        }
    }
}
\`\`\`

## 3. Append to a File

By default, Java overwrites the file.

To add new content instead of replacing old content, use append mode with \`true\`.

\`\`\`java
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileWriter writer = new FileWriter("myfile.txt", true);

            writer.write("\\nNew line added!");
            writer.close();

            System.out.println("Content added to file.");
        } catch (IOException e) {
            System.out.println("Error occurred.");
        }
    }
}
\`\`\`

## 4. Useful FileWriter Methods

- \`write()\` writes text into the file
- \`close()\` closes the file and finishes writing
- \`flush()\` forces buffered data to be written immediately

## 5. Important Rules

- Always close the file after writing
- Use \`try-catch\` to handle \`IOException\`
- Use append mode if you do not want to overwrite the file
- Be careful with relative paths because they write into the current working directory

## Better Cleanup Option

In real programs, try-with-resources is often cleaner than manually calling \`close()\`.

\`\`\`java
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try (FileWriter writer = new FileWriter("myfile.txt")) {
            writer.write("Hello from try-with-resources!");
        } catch (IOException e) {
            System.out.println("Error occurred.");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of file writing like writing in a notebook:

- Open notebook -> \`FileWriter\`
- Write notes -> \`write()\`
- Close notebook -> \`close()\`

## Common Mistakes

- Forgetting to close the file
- Overwriting a file accidentally
- Not handling \`IOException\`
- Expecting append behavior without passing \`true\`

## Key Idea

\`FileWriter\` allows Java programs to save text data into files permanently.

## Summary

- Use \`FileWriter\` to write text files
- \`write()\` adds content
- \`close()\` finishes and closes the writer
- Default mode overwrites the file
- Use \`true\` for append mode`

const JAVA_READ_FILES_SUMMARY =
  'Learn how Java reads saved file content with Scanner, FileReader, and BufferedReader, and when each approach makes the most sense.'

const JAVA_READ_FILES_CONTENT = `# What is Reading a File?

Reading a file means accessing and displaying data stored in a file.

Java can read files using:

- \`Scanner\` for simple reading
- \`FileReader\` for character-by-character reading
- \`BufferedReader\` for faster line-based reading

## 1. Reading a File Using Scanner

### Import Classes

\`\`\`java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
\`\`\`

### Example

\`\`\`java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        try {
            File file = new File("myfile.txt");
            Scanner reader = new Scanner(file);

            while (reader.hasNextLine()) {
                String data = reader.nextLine();
                System.out.println(data);
            }

            reader.close();
        } catch (FileNotFoundException e) {
            System.out.println("File not found.");
        }
    }
}
\`\`\`

Example output:

\`\`\`text
Line 1: Hello Java
Line 2: File Writing Example
Line 3: W3Schools Style Learning
\`\`\`

## 2. Reading a File Using FileReader

\`\`\`java
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileReader reader = new FileReader("myfile.txt");

            int character;

            while ((character = reader.read()) != -1) {
                System.out.print((char) character);
            }

            reader.close();
        } catch (IOException e) {
            System.out.println("Error reading file.");
        }
    }
}
\`\`\`

This approach reads one character at a time, which is useful for simple low-level reading but can be slower for large files.

## 3. Reading a File Using BufferedReader

\`BufferedReader\` is often better for reading larger files line by line.

\`\`\`java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader("myfile.txt"));

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            reader.close();
        } catch (IOException e) {
            System.out.println("Error reading file.");
        }
    }
}
\`\`\`

## 4. Comparison of Methods

- \`Scanner\` -> best for simple files and beginner-friendly reading
- \`FileReader\` -> reads character by character and is usually slower
- \`BufferedReader\` -> better for larger files and faster line-based reading

## Better Cleanup Option

In real programs, try-with-resources is often cleaner than manually closing the reader.

\`\`\`java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("myfile.txt"))) {
            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Error reading file.");
        }
    }
}
\`\`\`

## Important Notes

- The file must exist before you can read it
- Always close the reader after use
- Use exception handling when opening or reading files
- \`BufferedReader\` is often the better choice for larger files

## Real-Life Analogy

Think of file reading like opening a notebook:

- \`Scanner\` -> reading page by page
- \`FileReader\` -> reading letter by letter
- \`BufferedReader\` -> reading full lines quickly

## Common Mistakes

- Trying to read a file that does not exist
- Forgetting to close the reader
- Using the wrong file path
- Using a slower reading style when line-based reading would be simpler

## Key Idea

Reading files lets Java programs retrieve stored data and display or process it.

## Summary

- Java can read files using \`Scanner\`, \`FileReader\`, and \`BufferedReader\`
- \`BufferedReader\` is often the fastest line-based option for larger files
- File reading should use exception handling
- The file must exist before it can be read`

const JAVA_DELETE_FILES_SUMMARY =
  'Learn how Java deletes files and empty folders with the File class, including safe checks before removal and the meaning of delete() returning true or false.'

const JAVA_DELETE_FILES_CONTENT = `# What is Deleting a File?

Deleting a file means removing it permanently from the storage system using Java.

Java commonly uses the \`File\` class to delete files and folders.

## 1. Delete a File

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("myfile.txt");

        if (file.delete()) {
            System.out.println("Deleted the file: " + file.getName());
        } else {
            System.out.println("Failed to delete the file.");
        }
    }
}
\`\`\`

## Output Examples

If successful:

\`\`\`text
Deleted the file: myfile.txt
\`\`\`

If the file does not exist or cannot be removed:

\`\`\`text
Failed to delete the file.
\`\`\`

## 2. Check Before Deleting

It is usually better to check whether the file exists first.

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("myfile.txt");

        if (file.exists()) {
            if (file.delete()) {
                System.out.println("File deleted successfully.");
            } else {
                System.out.println("Unable to delete file.");
            }
        } else {
            System.out.println("File does not exist.");
        }
    }
}
\`\`\`

## 3. Delete a Folder

You can also delete folders, but only if they are empty.

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File folder = new File("myFolder");

        if (folder.delete()) {
            System.out.println("Folder deleted.");
        } else {
            System.out.println("Failed to delete folder (maybe not empty).");
        }
    }
}
\`\`\`

## Important Rules

- The file or folder must exist before it can be deleted
- A folder must usually be empty before \`delete()\` will remove it
- \`delete()\` returns \`true\` when deletion succeeds
- \`delete()\` returns \`false\` when deletion fails
- Deletion is usually permanent, so it should be done carefully

## 4. Simple Safety Check

\`\`\`java
import java.io.File;

public class Main {
    public static void main(String[] args) {
        File file = new File("myfile.txt");

        if (file.exists()) {
            System.out.println("File exists, safe to delete.");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of deleting a file like throwing away a document:

- Once deleted, it is gone
- You can only remove it if it exists
- Folders need to be cleared first if they contain items

## Common Mistakes

- Trying to delete a file that does not exist
- Forgetting that a folder must be empty
- Not checking the return value of \`delete()\`
- Deleting the wrong path by mistake

## Key Idea

Java file deletion uses \`delete()\` to permanently remove files or empty folders.

## Summary

- Use \`file.delete()\` to remove files
- It returns \`true\` if deletion succeeds
- Folders usually must be empty before deletion
- It is safer to check existence before deleting`

const JAVA_IO_STREAMS_SUMMARY =
  'Learn how Java I/O streams move data into and out of programs, and how byte streams and character streams are used for different kinds of files.'

const JAVA_IO_STREAMS_CONTENT = `# What are I/O Streams?

I/O streams, which means input and output streams, are used to read and write data in Java as a continuous flow of bytes or characters.

You can think of a stream as a pipeline carrying data between a program and a file, keyboard, or network source.

## Types of Streams

Java has two main stream categories:

### 1. Byte Streams

Byte streams handle raw binary data.

Examples:

- Images
- Audio
- Video
- General binary files

Common base classes:

- \`InputStream\`
- \`OutputStream\`

### 2. Character Streams

Character streams handle text data.

Examples:

- \`.txt\` files
- Text-based content

Common base classes:

- \`Reader\`
- \`Writer\`

## 1. Byte Stream Example: FileInputStream

Reading a file byte by byte:

\`\`\`java
import java.io.FileInputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileInputStream input = new FileInputStream("myfile.txt");

            int data;

            while ((data = input.read()) != -1) {
                System.out.print((char) data);
            }

            input.close();
        } catch (IOException e) {
            System.out.println("Error reading file");
        }
    }
}
\`\`\`

## 2. Byte Stream Writing: FileOutputStream

\`\`\`java
import java.io.FileOutputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileOutputStream output = new FileOutputStream("myfile.txt");

            String text = "Hello Java Streams!";
            byte[] bytes = text.getBytes();

            output.write(bytes);
            output.close();

            System.out.println("Data written successfully");
        } catch (IOException e) {
            System.out.println("Error writing file");
        }
    }
}
\`\`\`

## 3. Character Stream Example: FileReader

\`\`\`java
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileReader reader = new FileReader("myfile.txt");

            int data;

            while ((data = reader.read()) != -1) {
                System.out.print((char) data);
            }

            reader.close();
        } catch (IOException e) {
            System.out.println("Error reading file");
        }
    }
}
\`\`\`

## 4. Character Stream Writing: FileWriter

\`\`\`java
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            FileWriter writer = new FileWriter("myfile.txt");

            writer.write("Hello Character Streams!");
            writer.close();

            System.out.println("Written successfully");
        } catch (IOException e) {
            System.out.println("Error writing file");
        }
    }
}
\`\`\`

## Byte Streams vs Character Streams

- Byte streams -> better for binary data
- Character streams -> better for readable text
- \`InputStream\` and \`OutputStream\` work with bytes
- \`Reader\` and \`Writer\` work with characters

## Real-Life Analogy

Think of streams like water pipes:

- Input stream -> data flows into your program
- Output stream -> data flows out of your program
- Byte stream -> raw unprocessed flow
- Character stream -> text-friendly readable flow

## Important Notes

- Always close streams after use
- Use \`try-catch\` to handle I/O problems
- Choose the right stream type for the data you are working with
- Streams process data sequentially
- In real programs, try-with-resources is often the cleanest way to manage streams safely

## Common Mistakes

- Forgetting to close the stream
- Using a byte stream when a character stream would be clearer for text
- Ignoring \`IOException\`
- Mixing text and binary handling carelessly

## Key Idea

Java I/O streams move data between a program and external sources such as files in a controlled flow.

## Summary

- Streams are Java's data-flow system for input and output
- Byte streams are used for binary data
- Character streams are used for text data
- Streams are a core part of reading and writing files efficiently`

const JAVA_FILE_INPUT_STREAM_SUMMARY =
  'Learn how Java FileInputStream reads raw bytes from files, when it is best used, and how methods like read, readAllBytes, available, and skip work in practice.'

const JAVA_FILE_INPUT_STREAM_CONTENT = `# Java FileInputStream

## What is FileInputStream?

\`FileInputStream\` is used to read data from a file in byte format.

Best for:

- Images
- Videos
- Audio
- Any binary file
- Even text files, though that is not ideal

## 1. Import FileInputStream

\`\`\`java
import java.io.FileInputStream;
import java.io.IOException;
\`\`\`

## 2. Basic Example (Read File Byte by Byte)

\`\`\`java
import java.io.FileInputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            FileInputStream fis = new FileInputStream("test.txt");

            int data;

            while ((data = fis.read()) != -1) {
                System.out.print((char) data);
            }

            fis.close();

        } catch (IOException e) {
            System.out.println("Error reading file");
        }
    }
}
\`\`\`

## Key Idea in the Loop

\`\`\`java
fis.read()
\`\`\`

- Reads 1 byte at a time
- Returns the ASCII value as an \`int\`
- Returns \`-1\` when the file ends

## 3. Read File as Byte Array

\`\`\`java
import java.io.FileInputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            FileInputStream fis = new FileInputStream("test.txt");

            byte[] data = fis.readAllBytes();

            String content = new String(data);

            System.out.println(content);

            fis.close();

        } catch (IOException e) {
            System.out.println("Error");
        }
    }
}
\`\`\`

## 4. Check Available Bytes

\`\`\`java
System.out.println(fis.available());
\`\`\`

Shows how many bytes can be read.

## 5. Skip Bytes

\`\`\`java
fis.skip(5);
\`\`\`

Skips the first 5 bytes.

## Full Example Program

\`\`\`java
import java.io.FileInputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            FileInputStream fis = new FileInputStream("test.txt");

            int i;

            while ((i = fis.read()) != -1) {
                System.out.print((char) i);
            }

            fis.close();

        } catch (IOException e) {
            System.out.println("File error");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of FileInputStream like opening a sealed box and taking items one byte at a time.

You do not see structure like words or lines, only raw data flowing in.

## FileInputStream vs FileReader

- FileInputStream
  Reads bytes
  Best for images, videos, and binary files
  Fast for raw data
  No encoding support

- FileReader
  Reads characters
  Best for text files
  Better for readable text
  Supports character-based reading

## Common Mistakes

- Using FileInputStream for text processing when a character reader would be clearer
- Forgetting to close the stream
- Not handling \`IOException\`
- Casting bytes incorrectly

## Key Idea

FileInputStream reads raw binary data as bytes from a file.

## Summary

- \`read()\` reads 1 byte
- \`readAllBytes()\` reads the whole file
- \`available()\` checks remaining bytes
- \`skip()\` skips bytes
- Always \`close()\` the stream`

const JAVA_FILE_OUTPUT_STREAM_SUMMARY =
  'Learn how Java FileOutputStream writes raw bytes into files, how append mode works, and how methods like write, getBytes, flush, and close are used in practice.'

const JAVA_FILE_OUTPUT_STREAM_CONTENT = `# Java FileOutputStream

## What is FileOutputStream?

\`FileOutputStream\` is used to write data to a file in byte format.

It is best for:

- Writing text files in a low-level way
- Images, videos, and audio
- Any binary data

## 1. Import FileOutputStream

\`\`\`java
import java.io.FileOutputStream;
import java.io.IOException;
\`\`\`

## 2. Basic Example (Write to File)

\`\`\`java
import java.io.FileOutputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            FileOutputStream fos = new FileOutputStream("test.txt");

            String text = "Hello Java FileOutputStream";

            byte[] data = text.getBytes();

            fos.write(data);

            fos.close();

            System.out.println("File written successfully");

        } catch (IOException e) {
            System.out.println("Error writing file");
        }
    }
}
\`\`\`

## Key Idea

\`\`\`java
fos.write(data);
\`\`\`

This writes bytes into the file.

## 3. Write Single Character

\`\`\`java
FileOutputStream fos = new FileOutputStream("test.txt");

fos.write(65); // ASCII for 'A'

fos.close();
\`\`\`

Output in file:

\`\`\`text
A
\`\`\`

## 4. Append Mode

By default, the file is overwritten.

To append instead of replacing the old content:

\`\`\`java
FileOutputStream fos = new FileOutputStream("test.txt", true);
\`\`\`

\`true\` means append mode.

## 5. Write Multiple Lines

\`\`\`java
import java.io.FileOutputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            FileOutputStream fos = new FileOutputStream("test.txt");

            String text = "Line 1\\nLine 2\\nLine 3";

            fos.write(text.getBytes());

            fos.close();

        } catch (IOException e) {
            System.out.println("Error");
        }
    }
}
\`\`\`

## 6. Flush Data

\`\`\`java
fos.flush();
\`\`\`

This forces data to be written immediately.

## Full Example Program

\`\`\`java
import java.io.FileOutputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            FileOutputStream fos = new FileOutputStream("output.txt");

            String message = "Welcome to Java FileOutputStream";

            fos.write(message.getBytes());

            fos.close();

            System.out.println("Done writing file");

        } catch (IOException e) {
            System.out.println("Error occurred");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of \`FileOutputStream\` like writing on a blank sheet of paper:

- You control every character or byte
- You can overwrite or append
- You must close the stream after writing

## FileOutputStream vs FileWriter

- \`FileOutputStream\`: works with bytes and is better for binary files
- \`FileWriter\`: works with characters and is easier for text files
- \`FileOutputStream\`: lower-level and more flexible for raw data

## Common Mistakes

- Forgetting \`.getBytes()\`
- Not closing the stream
- Overwriting a file accidentally
- Confusing it with \`FileWriter\`

## Key Idea

\`FileOutputStream\` writes raw byte data into a file.

## Summary

- \`write()\` writes data
- \`getBytes()\` converts text to bytes
- \`true\` enables append mode
- \`close()\` finishes writing
- \`flush()\` forces data to be written`

const JAVA_BUFFERED_READER_SUMMARY =
  'Learn how Java BufferedReader reads text efficiently line by line, why it is faster than FileReader, and how readLine works with files and keyboard input.'

const JAVA_BUFFERED_READER_CONTENT = `# Java BufferedReader

## What is BufferedReader?

\`BufferedReader\` is used to read text from a file or input stream efficiently, usually line by line.

It is faster than \`FileReader\` because it uses a buffer in memory.

## Why BufferedReader Is Important

Compared to \`FileReader\`:

- \`FileReader\`: slower, reads character by character
- \`BufferedReader\`: faster, reads line by line
- \`BufferedReader\`: more efficient for larger text input

## 1. Import BufferedReader

\`\`\`java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
\`\`\`

## 2. Basic Example (Read File Line by Line)

\`\`\`java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            BufferedReader br = new BufferedReader(new FileReader("test.txt"));

            String line;

            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }

            br.close();

        } catch (IOException e) {
            System.out.println("Error reading file");
        }
    }
}
\`\`\`

## Key Method

\`\`\`java
br.readLine()
\`\`\`

- Reads one full line at a time
- Returns \`null\` when the file ends

## 3. Reading User Input (Keyboard)

\`BufferedReader\` can also read from the keyboard:

\`\`\`java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            BufferedReader br = new BufferedReader(
                new InputStreamReader(System.in)
            );

            System.out.print("Enter your name: ");
            String name = br.readLine();

            System.out.println("Hello " + name);

        } catch (IOException e) {
            System.out.println("Error");
        }
    }
}
\`\`\`

## 4. Convert String to Number

\`BufferedReader\` reads everything as \`String\`, so you convert it manually:

\`\`\`java
int age = Integer.parseInt(br.readLine());
double price = Double.parseDouble(br.readLine());
\`\`\`

## Full Example Program

\`\`\`java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        try {
            BufferedReader br = new BufferedReader(new FileReader("test.txt"));

            String line;

            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }

            br.close();

        } catch (IOException e) {
            System.out.println("File error");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of \`BufferedReader\` like a delivery truck:

- Instead of carrying one item at a time like \`FileReader\`
- It carries a whole box using a buffer
- That makes reading faster and more efficient

## BufferedReader vs Scanner

- \`BufferedReader\`: faster
- \`Scanner\`: slower
- \`BufferedReader\`: reads strings and needs manual parsing
- \`Scanner\`: reads multiple types more directly
- \`BufferedReader\`: often better for large files

## Common Mistakes

- Forgetting that \`readLine()\` returns a \`String\`
- Not converting strings to \`int\` or \`double\` when needed
- Forgetting to close the stream
- Confusing \`Scanner\` and \`BufferedReader\`

## Key Idea

\`BufferedReader\` reads text efficiently line by line using a buffer.

## Summary

- \`readLine()\` reads a full line
- \`BufferedReader\` is fast for text reading
- It works with files and keyboard input
- It needs manual type conversion`

const JAVA_BUFFERED_WRITER_SUMMARY =
  'Learn how Java BufferedWriter writes text efficiently by buffering characters, including line-based writing, append mode, and cleaner file output.'

const JAVA_BUFFERED_WRITER_CONTENT = `# What is BufferedWriter?

\`BufferedWriter\` is used to write text to a file efficiently by buffering characters before writing them to the output source.

Instead of sending every character immediately, it collects text in memory and writes it in larger chunks.

## Why BufferedWriter?

Without buffering:

- Writing can be slower because each small write may trigger more file operations

With \`BufferedWriter\`:

- Java stores text in a buffer first
- It writes larger chunks at once
- Text output is often faster and cleaner

## 1. Import BufferedWriter

\`\`\`java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
\`\`\`

## 2. Writing to a File

\`\`\`java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            BufferedWriter writer = new BufferedWriter(
                new FileWriter("myfile.txt")
            );

            writer.write("Hello Java BufferedWriter!");
            writer.newLine();
            writer.write("Writing is now faster and cleaner.");

            writer.close();

            System.out.println("File written successfully");
        } catch (IOException e) {
            System.out.println("Error writing file.");
        }
    }
}
\`\`\`

Output in the file:

\`\`\`text
Hello Java BufferedWriter!
Writing is now faster and cleaner.
\`\`\`

## 3. Important Methods

- \`write()\` writes text
- \`newLine()\` adds a new line
- \`flush()\` forces buffered text to be written immediately
- \`close()\` closes the writer and writes any remaining buffered data

## 4. Append Mode

By default, \`BufferedWriter\` overwrites the file because it often wraps a normal \`FileWriter\`.

To append instead, enable append mode in the underlying \`FileWriter\`.

\`\`\`java
BufferedWriter writer = new BufferedWriter(
    new FileWriter("myfile.txt", true)
);
\`\`\`

Example: append data

\`\`\`java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            BufferedWriter writer = new BufferedWriter(
                new FileWriter("myfile.txt", true)
            );

            writer.write("Appending new line here!");
            writer.newLine();

            writer.close();

            System.out.println("Data appended");
        } catch (IOException e) {
            System.out.println("Error writing file.");
        }
    }
}
\`\`\`

## 5. How It Works

\`BufferedWriter\`:

- Stores text in memory first
- Writes data in larger chunks
- Reduces the number of direct write operations
- Improves performance for repeated text output

## Better Cleanup Option

In real programs, try-with-resources is often the cleanest way to manage a \`BufferedWriter\`.

\`\`\`java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("myfile.txt", true))) {
            writer.write("Buffered writing with automatic cleanup.");
            writer.newLine();
        } catch (IOException e) {
            System.out.println("Error writing file.");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of \`BufferedWriter\` like writing notes on a draft sheet before submitting a final page:

- You do not submit every word the moment you write it
- You collect the text first
- Then you send it together in a more efficient way

## Common Mistakes

- Forgetting to close the writer
- Overwriting a file by accident instead of appending
- Confusing \`BufferedWriter\` with byte-stream writers
- Forgetting to add line breaks when needed with \`newLine()\` or \`\\n\`

## Key Idea

\`BufferedWriter\` improves text-writing performance by using a memory buffer before saving data to a file.

## Summary

- It writes text efficiently
- It uses buffering, which is often faster than plain \`FileWriter\`
- It supports \`write()\`, \`newLine()\`, \`flush()\`, and \`close()\`
- It can append when the wrapped \`FileWriter\` uses \`true\`
- It should be closed after use`

const JAVA_DATA_STRUCTURES_SUMMARY =
  'Learn how Java data structures organize and store data efficiently through core collection types like lists, sets, maps, and queues.'

const JAVA_DATA_STRUCTURES_CONTENT = `# What are Data Structures?

Data structures are ways of organizing and storing data in Java so it can be used efficiently.

Think of them as containers that store data in different ways depending on the task.

## Why Data Structures Matter

- They help you store large amounts of data
- They can make programs faster and more efficient
- They are used in real-world apps such as chat systems, media platforms, and banking software

## Types of Data Structures in Java

Java data structures are mainly used through the Java Collections Framework.

Common groups include:

- Lists
- Sets
- Maps
- Queues

## 1. List

A \`List\` stores data in order and allows duplicates.

Common class: \`ArrayList\`

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        System.out.println(names);
    }
}
\`\`\`

Features of a list:

- Ordered
- Allows duplicates
- Dynamic size

## 2. Set

A \`Set\` stores only unique values, so duplicates are not kept.

Common class: \`HashSet\`

\`\`\`java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> names = new HashSet<>();

        names.add("John");
        names.add("Mary");
        names.add("John");

        System.out.println(names);
    }
}
\`\`\`

Features of a set:

- No duplicates allowed
- Often unordered
- Fast lookup in many common implementations

## 3. Map

A \`Map\` stores data in key-value pairs.

Common class: \`HashMap\`

\`\`\`java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> ages = new HashMap<>();

        ages.put("John", 25);
        ages.put("Mary", 30);

        System.out.println(ages.get("John"));
    }
}
\`\`\`

Features of a map:

- Key-value storage
- Keys are unique
- Fast searching by key

## 4. Queue

A \`Queue\` works like a line: first in, first out.

Example: \`LinkedList\` used as a queue

\`\`\`java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<>();

        queue.add("Alice");
        queue.add("Bob");
        queue.add("Charlie");

        System.out.println(queue.remove());
    }
}
\`\`\`

Features of a queue:

- FIFO, which means first in, first out
- Useful in scheduling systems
- Processes tasks in order

## 5. Common Data Structure Comparison

- List: ordered, allows duplicates, flexible for indexed access
- Set: focused on uniqueness, usually ideal when duplicates are not allowed
- Map: stores values by key, useful for fast lookups
- Queue: processes items in arrival order

## Important Note

Different data structures solve different problems.

Choosing the right one can improve:

- Speed
- Memory use
- Code clarity

## Real-Life Analogy

- List: a to-do list
- Set: unique ID cards
- Map: a dictionary, where a word maps to a meaning
- Queue: a line at a bank or ticket counter

## Why Java Uses Data Structures

Real applications need:

- Fast search
- Organized storage
- Efficient processing

That is why data structures are a core part of Java programming.

## Key Idea

Java data structures are specialized ways of storing and accessing data efficiently, mostly through the Collections Framework.

## Summary

- Java data structures help store and manage data efficiently
- Common types include \`List\`, \`Set\`, \`Map\`, and \`Queue\`
- Each structure has its own strengths and use cases
- They are essential for building practical real-world applications`

const JAVA_COLLECTIONS_SUMMARY =
  'Learn how the Java Collections Framework provides ready-made classes and interfaces for storing, managing, and manipulating groups of objects efficiently.'

const JAVA_COLLECTIONS_CONTENT = `# What is Java Collections?

The Java Collections Framework is a set of classes and interfaces used to store, manage, and manipulate groups of objects efficiently.

It provides ready-made data structures such as lists, sets, maps, and queues.

## Why Use Collections?

- You do not need to build common data structures from scratch
- It is easier to store and manage large amounts of data
- It offers fast and optimized implementations
- It includes built-in methods for sorting, searching, and updating data

## Main Interfaces in the Collections Framework

The Java Collections Framework is mainly built around these core interfaces:

- \`List\`
- \`Set\`
- \`Queue\`
- \`Map\`

Important note:

- \`List\`, \`Set\`, and \`Queue\` are part of the \`Collection\` hierarchy
- \`Map\` is part of the Collections Framework, but it is not a child of the \`Collection\` interface

## 1. List Interface

A \`List\` is an ordered collection that allows duplicates.

Common implementation: \`ArrayList\`

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();

        list.add("John");
        list.add("Mary");
        list.add("Alex");

        System.out.println(list);
    }
}
\`\`\`

Features:

- Ordered
- Allows duplicates
- Dynamic size

## 2. Set Interface

A \`Set\` is a collection that does not allow duplicates.

Common implementation: \`HashSet\`

\`\`\`java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> set = new HashSet<>();

        set.add("A");
        set.add("B");
        set.add("A");

        System.out.println(set);
    }
}
\`\`\`

Features:

- No duplicates
- Often unordered
- Fast access in common implementations

## 3. Map Interface

A \`Map\` stores data in key-value pairs.

Common implementation: \`HashMap\`

\`\`\`java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();

        map.put("John", 20);
        map.put("Mary", 25);

        System.out.println(map.get("John"));
    }
}
\`\`\`

Features:

- Key-value pairs
- Keys are unique
- Fast lookup by key

## 4. Queue Interface

A \`Queue\` usually follows FIFO, which means first in, first out.

Common implementation: \`LinkedList\`

\`\`\`java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<>();

        queue.add("A");
        queue.add("B");
        queue.add("C");

        System.out.println(queue.remove());
    }
}
\`\`\`

Features:

- FIFO behavior
- Useful in scheduling systems
- Processes tasks in order

## Collection Hierarchy

\`\`\`text
Collection
|- List
|  |- ArrayList
|  |- LinkedList
|- Set
|  |- HashSet
|  |- TreeSet
|- Queue
   |- LinkedList
   |- PriorityQueue

Map
|- HashMap
|- TreeMap
\`\`\`

## Common Collection Methods

- \`add()\` adds an element
- \`remove()\` removes an element
- \`size()\` returns the number of elements
- \`contains()\` checks whether an element exists
- \`clear()\` removes all elements

## Real-Life Analogy

- List: a playlist with songs in order
- Set: a collection of unique ID cards
- Map: a phonebook that matches names to numbers
- Queue: a bank line where the first person is served first

## Key Idea

The Java Collections Framework gives you ready-made data structures so you can store and manipulate groups of objects efficiently without rebuilding common tools yourself.

## Summary

- Collections are a framework for storing groups of data
- Main types include \`List\`, \`Set\`, \`Map\`, and \`Queue\`
- Built-in methods make managing data easier
- Collections are used widely in real-world Java applications`

const JAVA_COLLECTIONS_METHODS_SUMMARY =
  'Learn how Java Collections utility methods like sort, reverse, shuffle, max, min, frequency, copy, fill, and swap help manipulate collection data quickly.'

const JAVA_COLLECTIONS_METHODS_CONTENT = `# Java Collections Methods

## What are Collections?

The Java Collections Framework is a set of classes and interfaces used to store and manipulate groups of objects.

Common ones include:

- \`ArrayList\`
- \`LinkedList\`
- \`HashSet\`
- \`HashMap\`

All of them use ready-made methods to manage data.

## 1. Import Collections

\`\`\`java
import java.util.*;
\`\`\`

## 2. Important Collections Utility Methods

Java provides a helper class called:

\`\`\`text
Collections
\`\`\`

This is different from \`Collection\`.

## 1. sort() - Sort Elements

\`\`\`java
ArrayList<Integer> list = new ArrayList<>();

list.add(5);
list.add(2);
list.add(9);

Collections.sort(list);

System.out.println(list);
\`\`\`

Output:

\`\`\`text
[2, 5, 9]
\`\`\`

## 2. reverse() - Reverse Order

\`\`\`java
Collections.reverse(list);
\`\`\`

Output:

\`\`\`text
[9, 5, 2]
\`\`\`

## 3. shuffle() - Random Order

\`\`\`java
Collections.shuffle(list);
\`\`\`

This randomizes the elements.

## 4. max() - Find Largest Element

\`\`\`java
System.out.println(Collections.max(list));
\`\`\`

## 5. min() - Find Smallest Element

\`\`\`java
System.out.println(Collections.min(list));
\`\`\`

## 6. frequency() - Count Occurrences

\`\`\`java
list.add(5);
list.add(5);

System.out.println(Collections.frequency(list, 5));
\`\`\`

Output:

\`\`\`text
2
\`\`\`

## 7. copy() - Copy List

\`\`\`java
ArrayList<Integer> src = new ArrayList<>();
ArrayList<Integer> dest = new ArrayList<>();

src.add(1);
src.add(2);

dest.add(0);
dest.add(0);

Collections.copy(dest, src);
\`\`\`

Important:

- The destination list must already have enough size

## 8. fill() - Replace All Values

\`\`\`java
Collections.fill(list, 100);
\`\`\`

All elements become \`100\`.

## 9. swap() - Swap Elements

\`\`\`java
Collections.swap(list, 0, 2);
\`\`\`

This swaps the values at two index positions.

## Full Example

\`\`\`java
import java.util.*;

public class Main {
    public static void main(String[] args) {

        ArrayList<Integer> list = new ArrayList<>();

        list.add(10);
        list.add(3);
        list.add(7);
        list.add(3);

        Collections.sort(list);
        System.out.println("Sorted: " + list);

        Collections.reverse(list);
        System.out.println("Reversed: " + list);

        System.out.println("Max: " + Collections.max(list));
        System.out.println("Min: " + Collections.min(list));
        System.out.println("Frequency of 3: " + Collections.frequency(list, 3));
    }
}
\`\`\`

## Collections Methods Summary

- \`sort()\` sorts a list
- \`reverse()\` reverses order
- \`shuffle()\` randomizes order
- \`max()\` finds the largest element
- \`min()\` finds the smallest element
- \`frequency()\` counts occurrences
- \`copy()\` copies one list into another
- \`fill()\` replaces all values
- \`swap()\` swaps two elements

## Real-Life Analogy

Think of Collections methods like a toolbox for organizing items:

- \`sort\` arranges books neatly
- \`shuffle\` mixes cards
- \`max\` and \`min\` find the biggest or smallest item
- \`frequency\` counts repeated items

## Common Mistakes

- Using \`Collections\` instead of \`Collection\` incorrectly
- Trying to use \`copy()\` without pre-sizing the destination list
- Confusing \`Arrays.sort()\` with \`Collections.sort()\`
- Forgetting generic types such as \`<Integer>\` or \`<String>\`

## Key Idea

The \`Collections\` class gives you ready-made algorithms for data manipulation.`

const JAVA_SYSTEM_METHODS_SUMMARY =
  'Learn how Java System methods handle output, input, timing, array copying, system properties, program exit, and memory-related operations.'

const JAVA_SYSTEM_METHODS_CONTENT = `# Java System Methods

## What is System class?

The \`System\` class in Java provides useful system-level methods and variables for:

- Output
- Input
- Time
- Memory
- Program control

It is in \`java.lang\`, so no import is needed.

## 1. System.out.println() - Output

\`\`\`java
System.out.println("Hello Java");
\`\`\`

This prints output to the console.

## 2. System.in - Input Source

It is used with \`Scanner\` or \`BufferedReader\`.

\`\`\`java
Scanner sc = new Scanner(System.in);
\`\`\`

Or:

\`\`\`java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
\`\`\`

## 3. System.err.println() - Error Output

\`\`\`java
System.err.println("This is an error message");
\`\`\`

This is used for error messages and may appear differently in some consoles.

## 4. System.exit() - Stop Program

\`\`\`java
System.exit(0);
\`\`\`

Meaning:

- \`0\` means normal termination
- \`1\` often means abnormal termination

This immediately stops program execution.

## 5. System.currentTimeMillis() - Time in Milliseconds

\`\`\`java
long time = System.currentTimeMillis();

System.out.println(time);
\`\`\`

This returns time since January 1, 1970.

Example: measure execution time

\`\`\`java
long start = System.currentTimeMillis();

for (int i = 0; i < 1000000; i++) {
    // loop
}

long end = System.currentTimeMillis();

System.out.println("Time taken: " + (end - start) + " ms");
\`\`\`

## 6. System.arraycopy() - Copy Arrays

\`\`\`java
int[] a = {1, 2, 3};
int[] b = new int[3];

System.arraycopy(a, 0, b, 0, a.length);
\`\`\`

Meaning:

\`\`\`text
source, start index, destination, start index, length
\`\`\`

## 7. System.getProperty() - Get System Info

\`\`\`java
System.out.println(System.getProperty("os.name"));
System.out.println(System.getProperty("user.name"));
System.out.println(System.getProperty("java.version"));
\`\`\`

## 8. System.gc() - Request Garbage Collection

\`\`\`java
System.gc();
\`\`\`

This suggests that Java clean unused objects, but it is not guaranteed.

## Full Example Program

\`\`\`java
public class Main {
    public static void main(String[] args) {

        System.out.println("Program started");

        System.out.println("OS: " + System.getProperty("os.name"));
        System.out.println("Java Version: " + System.getProperty("java.version"));

        long start = System.currentTimeMillis();

        for (int i = 0; i < 100000; i++) {
            // dummy work
        }

        long end = System.currentTimeMillis();

        System.out.println("Time taken: " + (end - start) + " ms");

        System.out.println("Program ending");

        System.exit(0);
    }
}
\`\`\`

## System Methods Summary

- \`out.println()\` prints output
- \`err.println()\` prints error output
- \`in\` is the input stream
- \`exit()\` stops the program
- \`currentTimeMillis()\` gets time
- \`arraycopy()\` copies arrays
- \`getProperty()\` reads system info
- \`gc()\` requests garbage collection

## Real-Life Analogy

Think of the \`System\` class like the operating panel of Java:

- It prints messages
- It can stop the program
- It measures time
- It reads system information
- It helps manage memory-related behavior

## Common Mistakes

- Using \`System.exit()\` without a real reason
- Confusing \`System.out\` and \`System.err\`
- Passing wrong parameters to \`arraycopy()\`
- Thinking \`gc()\` forces memory cleanup immediately

## Key Idea

The \`System\` class gives direct access to the program environment and execution tools.`

const JAVA_ERRORS_EXCEPTIONS_SUMMARY =
  'Learn the difference between Java errors and exceptions, how checked and unchecked exceptions work, and how try, catch, finally, throw, and throws are used.'

const JAVA_ERRORS_EXCEPTIONS_CONTENT = `# Java Errors and Exceptions

## Big Idea

In Java, problems during program execution are divided into:

- Errors
- Exceptions

## 1. Java Errors

### What are Errors?

Errors are serious problems that cannot usually be handled by the program.

They are often caused by the system, JVM, or environment.

### Examples of Errors

#### 1. StackOverflowError

Occurs when recursion never stops:

\`\`\`java
public class Main {
    static void test() {
        test(); // infinite recursion
    }

    public static void main(String[] args) {
        test();
    }
}
\`\`\`

#### 2. OutOfMemoryError

Occurs when memory is full:

\`\`\`java
int[] arr = new int[1000000000];
\`\`\`

### Key Point about Errors

- They are usually fatal
- They are often caused by JVM or system issues
- They are not the normal kind of problem you handle in application logic

## 2. Java Exceptions

### What are Exceptions?

Exceptions are problems that occur during program execution but can be handled.

This is where Java uses \`try\`, \`catch\`, and \`finally\`.

### Types of Exceptions

#### 1. Checked Exceptions

These must be handled before running the program.

Examples:

- \`IOException\`
- \`FileNotFoundException\`

\`\`\`java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {

        FileReader file = new FileReader("test.txt");
    }
}
\`\`\`

Or using \`try-catch\`:

\`\`\`java
try {
    FileReader file = new FileReader("test.txt");
} catch (IOException e) {
    System.out.println("File not found");
}
\`\`\`

#### 2. Unchecked Exceptions

These happen during execution.

Examples:

- \`ArithmeticException\`
- \`NullPointerException\`
- \`ArrayIndexOutOfBoundsException\`

Example: \`ArithmeticException\`

\`\`\`java
public class Main {
    public static void main(String[] args) {

        int a = 10;
        int b = 0;

        System.out.println(a / b);
    }
}
\`\`\`

Example: \`NullPointerException\`

\`\`\`java
String name = null;

System.out.println(name.length());
\`\`\`

Example: \`ArrayIndexOutOfBoundsException\`

\`\`\`java
int[] arr = {1, 2, 3};

System.out.println(arr[5]);
\`\`\`

## 3. Handling Exceptions (try-catch)

\`\`\`java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
}
\`\`\`

## 4. finally Block

The \`finally\` block always runs whether an exception happens or not.

\`\`\`java
try {
    int x = 10 / 2;
} catch (Exception e) {
    System.out.println("Error");
} finally {
    System.out.println("This always runs");
}
\`\`\`

## 5. throw Keyword

It is used to manually create an exception.

\`\`\`java
public class Main {
    static void checkAge(int age) {
        if (age < 18) {
            throw new ArithmeticException("Not allowed");
        }
    }

    public static void main(String[] args) {
        checkAge(15);
    }
}
\`\`\`

## 6. throws Keyword

It is used to declare exceptions.

\`\`\`java
public static void test() throws IOException {
    FileReader file = new FileReader("test.txt");
}
\`\`\`

## Full Summary Program

\`\`\`java
public class Main {
    public static void main(String[] args) {

        try {
            int[] arr = {1, 2, 3};

            System.out.println(arr[5]);

        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Index error");
        } finally {
            System.out.println("Program finished");
        }
    }
}
\`\`\`

## Differences

- Errors: very serious problems
- Exceptions: less serious and often recoverable
- Errors: usually related to JVM or system failure
- Exceptions: usually related to program logic or runtime conditions
- Example error: \`OutOfMemoryError\`
- Example exception: \`NullPointerException\`

## Real-Life Analogy

Think of:

- Errors as engine failure in a car
- Exceptions as a flat tire or low fuel

Errors break the system badly, while exceptions are often issues you can detect and handle.

## Common Mistakes

- Confusing errors and exceptions
- Not using \`try-catch\` where needed
- Catching generic \`Exception\` everywhere
- Ignoring runtime exceptions

## Key Idea

- Errors are serious system failures
- Exceptions are runtime problems that programs can often handle`

const JAVA_LIST_SUMMARY =
  'Learn how a Java List stores ordered data with duplicates, dynamic sizing, and index-based access through implementations like ArrayList.'

const JAVA_LIST_CONTENT = `# What is a List in Java?

A \`List\` is an ordered collection of elements that allows:

- Duplicates
- Dynamic size
- Indexed access, similar to arrays

In simple terms, a \`List\` is like a smart array that can grow or shrink when needed.

## Why Use List?

- It stores data in order
- It allows duplicates
- It is easy to access by index
- It comes with useful built-in methods

## Important Note

\`List\` is an interface, not a concrete class.

That means you usually create a \`List\` by using a class that implements it, such as:

- \`ArrayList\`
- \`LinkedList\`

The most common implementation for beginners is \`ArrayList\`.

## Common List Implementation

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        System.out.println(names);
    }
}
\`\`\`

## 1. Creating a List

You can also declare the variable with the \`List\` interface type.

\`\`\`java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");

        System.out.println(names);
    }
}
\`\`\`

This is often preferred because it keeps your code flexible.

## 2. Accessing Elements

Lists use indexes that start at \`0\`.

\`\`\`java
System.out.println(names.get(0));
\`\`\`

Output:

\`\`\`text
John
\`\`\`

## 3. Modifying Elements

\`\`\`java
names.set(1, "David");
\`\`\`

This changes the value at index \`1\`.

## 4. Removing Elements

\`\`\`java
names.remove(0);
\`\`\`

## 5. List Size

\`\`\`java
System.out.println(names.size());
\`\`\`

## 6. Looping Through a List

Using a \`for\` loop:

\`\`\`java
for (int i = 0; i < names.size(); i++) {
    System.out.println(names.get(i));
}
\`\`\`

Using a for-each loop:

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

## 7. Common List Methods

- \`add()\` adds an element
- \`get()\` gets an element by index
- \`set()\` updates an element
- \`remove()\` deletes an element
- \`size()\` returns the number of items
- \`clear()\` removes all items
- \`contains()\` checks whether an element exists

## Real-Life Analogy

Think of a \`List\` like a music playlist:

- Songs stay in order
- The same song can appear more than once
- You can add or remove songs anytime
- You can pick a song by position

## Key Idea

A Java \`List\` is an ordered, dynamic collection that allows duplicates and gives you index-based access to elements.

## Summary

- A \`List\` is an ordered collection
- It allows duplicates
- \`ArrayList\` is the most common implementation
- It supports indexing
- It includes powerful built-in methods for managing data`

const JAVA_ARRAY_LIST_SUMMARY =
  'Learn how Java ArrayList works as a resizable array with dynamic sizing, index access, duplicates, and built-in collection methods.'

const JAVA_ARRAY_LIST_CONTENT = `# What is ArrayList?

\`ArrayList\` is a resizable array in Java.

Unlike normal arrays, it can grow and shrink dynamically.

## Why Use ArrayList?

- It does not have a fixed size
- It is easy to add or remove elements
- It gives fast access using indexes
- It is part of the Java Collections Framework

## 1. Import ArrayList

\`\`\`java
import java.util.ArrayList;
\`\`\`

## 2. Create an ArrayList

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[John, Mary, Alex]
\`\`\`

## 3. Add Elements

\`\`\`java
names.add("David");
\`\`\`

## 4. Access Elements

\`\`\`java
System.out.println(names.get(0));
\`\`\`

Output:

\`\`\`text
John
\`\`\`

## 5. Modify Elements

\`\`\`java
names.set(1, "Sarah");
\`\`\`

## 6. Remove Elements

\`\`\`java
names.remove(2);
\`\`\`

## 7. Get Size

\`\`\`java
System.out.println(names.size());
\`\`\`

## 8. Loop Through ArrayList

Using a \`for\` loop:

\`\`\`java
for (int i = 0; i < names.size(); i++) {
    System.out.println(names.get(i));
}
\`\`\`

Using a for-each loop:

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

## 9. Sorting an ArrayList

\`\`\`java
import java.util.Collections;

Collections.sort(names);
\`\`\`

## 10. ArrayList with Numbers

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(5);
        numbers.add(20);

        System.out.println(numbers);
    }
}
\`\`\`

## Important Notes

- \`ArrayList\` cannot store primitive types directly
- Use wrapper classes instead:
  - \`int\` becomes \`Integer\`
  - \`double\` becomes \`Double\`
  - \`char\` becomes \`Character\`
- \`ArrayList\` keeps insertion order and allows duplicates

## Array vs ArrayList

- Array: fixed size, usually faster, fewer built-in helpers
- ArrayList: dynamic size, slightly more overhead, many built-in methods

## Real-Life Analogy

Think of \`ArrayList\` like a shopping basket:

- You can add items anytime
- You can remove items anytime
- The items stay in order
- The basket can adjust as your items change

## Common Mistakes

- Trying to store primitive types directly
- Accessing an invalid index
- Forgetting to import \`ArrayList\`
- Confusing arrays with \`ArrayList\`

## Key Idea

\`ArrayList\` is a flexible, dynamic version of arrays with powerful built-in methods for managing ordered data.

## Summary

- It is a dynamic array in Java
- It allows duplicates
- It uses indexes
- It provides built-in methods
- It is part of the Collections Framework`

const JAVA_LINKED_LIST_SUMMARY =
  'Learn how Java LinkedList stores data as linked nodes, making insertions and deletions efficient while trading off some random-access speed.'

const JAVA_LINKED_LIST_CONTENT = `# What is LinkedList?

\`LinkedList\` is a dynamic data structure where elements are stored as connected nodes, and each node links to the next one.

Unlike \`ArrayList\`, elements are not stored in one continuous memory block.

## How It Works

Each node contains:

- Data
- A link to another node

Think of it like a chain:

\`\`\`text
[Data | Next] -> [Data | Next] -> [Data | Next]
\`\`\`

## Why Use LinkedList?

- Fast insertion and deletion in many cases
- No shifting of many elements when adding or removing near the ends
- Dynamic size

## Important Note

Java's \`LinkedList\` is also commonly used as:

- A \`List\`
- A queue
- A deque for first-and-last operations

That is why methods like \`addFirst()\` and \`addLast()\` are available.

## 1. Import LinkedList

\`\`\`java
import java.util.LinkedList;
\`\`\`

## 2. Create a LinkedList

\`\`\`java
import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {
        LinkedList<String> names = new LinkedList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[John, Mary, Alex]
\`\`\`

## 3. Add Elements

\`\`\`java
names.add("David");
names.addFirst("Start");
names.addLast("End");
\`\`\`

## 4. Access Elements

\`\`\`java
System.out.println(names.get(0));
System.out.println(names.getFirst());
System.out.println(names.getLast());
\`\`\`

## 5. Remove Elements

\`\`\`java
names.remove();
names.removeFirst();
names.removeLast();
\`\`\`

## 6. Get Size

\`\`\`java
System.out.println(names.size());
\`\`\`

## 7. Loop Through LinkedList

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

## Key Methods

- \`add()\` adds an element
- \`addFirst()\` adds at the beginning
- \`addLast()\` adds at the end
- \`getFirst()\` gets the first element
- \`getLast()\` gets the last element
- \`removeFirst()\` removes the first element
- \`removeLast()\` removes the last element

## LinkedList vs ArrayList

- ArrayList: elements are stored in an array, random access is usually faster
- LinkedList: elements are linked as nodes, inserting and deleting can be easier in some cases
- ArrayList: often better when you mostly read by index
- LinkedList: often better when you frequently add or remove near the ends

## Real-Life Analogy

Think of \`LinkedList\` like train coaches:

- Each coach connects to the next one
- It is easy to add or remove coaches
- It is harder to jump directly to a coach in the middle

## When to Use LinkedList

Use it when:

- You frequently add or remove elements
- You do not need very fast random access
- You want queue-like or deque-like behavior

## Common Mistakes

- Using \`LinkedList\` when fast index access is the main goal
- Assuming it is always faster than \`ArrayList\`
- Ignoring the extra memory overhead from linked nodes

## Key Idea

\`LinkedList\` stores elements as connected nodes, which can make insertions and deletions more flexible than array-based structures.

## Summary

- It is a dynamic data structure
- It uses linked nodes instead of a simple resizable array
- It supports fast insert and delete operations in the right situations
- Random access is usually slower than \`ArrayList\`
- It is useful for queues and other highly dynamic collections`

const JAVA_LIST_SORTING_SUMMARY =
  'Learn how Java sorts lists in ascending or descending order with Collections.sort() and reverseOrder() for strings and numbers.'

const JAVA_LIST_SORTING_CONTENT = `# What is List Sorting?

List sorting is the process of arranging elements in a list in a specific order.

Usually this means:

- Ascending order, such as A to Z or 1 to 9
- Descending order, such as Z to A or 9 to 1

## 1. Sorting a List in Ascending Order

Java provides the \`Collections.sort()\` method.

\`\`\`java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        Collections.sort(names);

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[Alex, John, Mary]
\`\`\`

## 2. Sorting Numbers

\`\`\`java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(50);
        numbers.add(10);
        numbers.add(30);

        Collections.sort(numbers);

        System.out.println(numbers);
    }
}
\`\`\`

Output:

\`\`\`text
[10, 30, 50]
\`\`\`

## 3. Sorting in Descending Order

Use \`Collections.reverseOrder()\`.

\`\`\`java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(50);
        numbers.add(10);
        numbers.add(30);

        Collections.sort(numbers, Collections.reverseOrder());

        System.out.println(numbers);
    }
}
\`\`\`

Output:

\`\`\`text
[50, 30, 10]
\`\`\`

## 4. Looping After Sorting

\`\`\`java
for (int num : numbers) {
    System.out.println(num);
}
\`\`\`

## 5. Sorting with the List Interface

Sorting also works when the variable is declared as a \`List\`.

\`\`\`java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();

        list.add("Banana");
        list.add("Apple");
        list.add("Orange");

        Collections.sort(list);

        System.out.println(list);
    }
}
\`\`\`

## 6. How Sorting Works

Java uses built-in sorting algorithms to:

- Compare elements
- Rearrange them in order

That means you do not need to build the sorting logic yourself for basic cases.

## Important Note

\`Collections.sort()\` works best when the elements have a natural order, such as:

- Strings
- Integers
- Doubles

For more advanced custom sorting, Java also supports comparators.

## Real-Life Analogy

Think of sorting like arranging exam scores:

- Ascending means lowest to highest
- Descending means highest to lowest

## Common Mistakes

- Forgetting to import \`Collections\`
- Trying to sort incompatible types
- Forgetting \`reverseOrder()\` for descending order

## Key Idea

Java makes list sorting easy with \`Collections.sort()\` for ascending order and \`Collections.reverseOrder()\` for descending order.

## Summary

- Use \`Collections.sort()\` for ascending order
- Use \`Collections.reverseOrder()\` for descending order
- Sorting works with strings and numbers
- It is very useful in real applications`

const JAVA_SET_SUMMARY =
  'Learn how a Java Set stores unique elements, ignores duplicates automatically, and supports implementations like HashSet, LinkedHashSet, and TreeSet.'

const JAVA_SET_CONTENT = `# What is a Set in Java?

A \`Set\` is a collection that does not allow duplicate elements.

If you try to add a duplicate value, it is ignored automatically.

## Key Features of Set

- No duplicates allowed
- Dynamic size
- Fast operations in common implementations
- No index-based access like a list

## Important Note About Order

A plain \`Set\` does not guarantee insertion order.

Different implementations behave differently:

- \`HashSet\`: fast and usually unordered
- \`LinkedHashSet\`: keeps insertion order
- \`TreeSet\`: keeps elements in sorted order

## 1. Common Set Implementations

Java provides several types of \`Set\`:

- \`HashSet\`
- \`LinkedHashSet\`
- \`TreeSet\`

## 2. Using HashSet

\`\`\`java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> names = new HashSet<>();

        names.add("John");
        names.add("Mary");
        names.add("John");

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[John, Mary]
\`\`\`

The duplicate \`"John"\` is ignored.

## 3. Using LinkedHashSet

\`\`\`java
import java.util.LinkedHashSet;

public class Main {
    public static void main(String[] args) {
        LinkedHashSet<String> set = new LinkedHashSet<>();

        set.add("A");
        set.add("B");
        set.add("C");

        System.out.println(set);
    }
}
\`\`\`

Output:

\`\`\`text
[A, B, C]
\`\`\`

\`LinkedHashSet\` keeps insertion order.

## 4. Using TreeSet

\`\`\`java
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        TreeSet<Integer> numbers = new TreeSet<>();

        numbers.add(50);
        numbers.add(10);
        numbers.add(30);

        System.out.println(numbers);
    }
}
\`\`\`

Output:

\`\`\`text
[10, 30, 50]
\`\`\`

\`TreeSet\` keeps elements sorted.

## 5. Common Set Methods

- \`add()\` adds an element
- \`remove()\` removes an element
- \`contains()\` checks if an element exists
- \`size()\` returns the number of elements
- \`clear()\` removes all elements

## 6. Loop Through a Set

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

## Set vs List

- List: ordered, allows duplicates, supports indexes
- Set: focuses on uniqueness, no indexing, order depends on implementation

## Real-Life Analogy

Think of a \`Set\` like a collection of unique event tickets:

- Each ticket should appear only once
- Duplicates are not allowed
- Order often does not matter unless you choose an ordered set type

## When to Use Set

Use a \`Set\` when:

- You want unique values only
- You do not need index-based access
- You want fast membership checks

## Common Mistakes

- Expecting ordered output from \`HashSet\`
- Trying to access elements by index
- Forgetting that duplicates are ignored

## Key Idea

A Java \`Set\` stores unique elements and automatically prevents duplicates.

## Summary

- A \`Set\` stores unique values
- Common implementations are \`HashSet\`, \`LinkedHashSet\`, and \`TreeSet\`
- It does not support indexing like a list
- It is useful for unique-data handling and fast lookups`

const JAVA_HASH_SET_SUMMARY =
  'Learn how Java HashSet stores unique elements with fast hashing-based operations while not guaranteeing insertion order.'

const JAVA_HASH_SET_CONTENT = `# What is HashSet?

\`HashSet\` is a class in Java that implements the \`Set\` interface and stores unique elements only.

It does not allow duplicates and it does not maintain insertion order.

## Key Features of HashSet

- No duplicate elements
- Unordered output
- Fast performance for add, search, and remove in common cases
- Uses hashing internally

## 1. Import HashSet

\`\`\`java
import java.util.HashSet;
\`\`\`

## 2. Create a HashSet

\`\`\`java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> names = new HashSet<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");
        names.add("John");

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[John, Mary, Alex]
\`\`\`

The duplicate \`"John"\` is ignored automatically.

## 3. Check if an Element Exists

\`\`\`java
System.out.println(names.contains("Mary"));
\`\`\`

Output:

\`\`\`text
true
\`\`\`

## 4. Remove Elements

\`\`\`java
names.remove("Alex");
\`\`\`

## 5. Get Size

\`\`\`java
System.out.println(names.size());
\`\`\`

## 6. Loop Through HashSet

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

## 7. HashSet with Numbers

\`\`\`java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<Integer> numbers = new HashSet<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(10);

        System.out.println(numbers);
    }
}
\`\`\`

## Important Notes

- \`HashSet\` does not support indexing, so you cannot use \`get(0)\`
- Element order is not guaranteed
- It is often very fast for searching and inserting
- It uses a hash table internally

## HashSet vs ArrayList

- HashSet: no duplicates, no guaranteed order, no index access
- ArrayList: duplicates allowed, keeps order, supports indexing
- HashSet: often better for fast membership checks
- ArrayList: often better when position and ordered access matter

## Real-Life Analogy

Think of \`HashSet\` like a unique registration system:

- Each person should register only once
- Duplicate entries are rejected
- The order of stored entries is not the main concern

## When to Use HashSet

Use \`HashSet\` when:

- You want unique data only
- You need fast search or membership checks
- Order is not important

## Common Mistakes

- Expecting ordered output
- Trying to access items by index
- Forgetting that duplicates are ignored

## Key Idea

\`HashSet\` stores unique elements and uses hashing to keep common operations fast.

## Summary

- It implements the \`Set\` interface
- It does not allow duplicates
- It does not guarantee order
- It provides very fast common operations
- It does not support indexing`

const JAVA_TREE_SET_SUMMARY =
  'Learn how Java TreeSet stores unique elements in automatically sorted order using a tree-based structure.'

const JAVA_TREE_SET_CONTENT = `# What is TreeSet?

\`TreeSet\` is a class in Java that implements the \`Set\` interface and stores elements in sorted order.

It does not allow duplicates and it automatically sorts elements.

## Key Features of TreeSet

- No duplicates
- Automatically sorted
- Elements are usually stored in ascending order
- Slower than \`HashSet\` because ordering must be maintained
- Uses a tree-based structure internally

## 1. Import TreeSet

\`\`\`java
import java.util.TreeSet;
\`\`\`

## 2. Create a TreeSet

\`\`\`java
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        TreeSet<Integer> numbers = new TreeSet<>();

        numbers.add(50);
        numbers.add(10);
        numbers.add(30);
        numbers.add(10);

        System.out.println(numbers);
    }
}
\`\`\`

Output:

\`\`\`text
[10, 30, 50]
\`\`\`

The elements are sorted automatically and the duplicate is ignored.

## 3. TreeSet with Strings

\`\`\`java
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        TreeSet<String> names = new TreeSet<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[Alex, John, Mary]
\`\`\`

## 4. Important Methods

- \`add()\` adds an element
- \`remove()\` removes an element
- \`contains()\` checks whether an element exists
- \`size()\` returns the number of elements
- \`first()\` returns the smallest element
- \`last()\` returns the largest element

## 5. Example: first() and last()

\`\`\`java
System.out.println(numbers.first());
System.out.println(numbers.last());
\`\`\`

Output:

\`\`\`text
10
50
\`\`\`

## 6. Loop Through TreeSet

\`\`\`java
for (int num : numbers) {
    System.out.println(num);
}
\`\`\`

## TreeSet vs HashSet vs LinkedHashSet

- HashSet: no guaranteed order, usually the fastest
- LinkedHashSet: keeps insertion order
- TreeSet: keeps sorted order

All three reject duplicates, but they differ in how they keep or do not keep order.

## How TreeSet Works

Internally, \`TreeSet\` uses a self-balancing tree structure.

That allows it to:

- Keep elements sorted automatically
- Maintain order during insertion
- Support methods like \`first()\` and \`last()\`

## Important Note

\`TreeSet\` works best with elements that can be compared naturally, such as:

- Numbers
- Strings

If you use custom objects, they usually need comparison logic.

## Real-Life Analogy

Think of \`TreeSet\` like books arranged on a shelf in alphabetical order:

- The books stay sorted
- Duplicate books are not repeated
- It is easy to find the first and last item

## When to Use TreeSet

Use \`TreeSet\` when:

- You need sorted data automatically
- You do not want duplicates
- Sorted order matters more than insertion order

## Common Mistakes

- Expecting insertion order instead of sorted order
- Trying to store non-comparable objects without comparison logic
- Ignoring the slower performance compared with \`HashSet\`

## Key Idea

\`TreeSet\` stores unique elements and keeps them sorted automatically.

## Summary

- It implements the \`Set\` interface
- It does not allow duplicates
- It keeps elements sorted automatically
- It is slower than \`HashSet\`
- It is useful when ordered unique data is needed`

const JAVA_LINKED_HASH_SET_SUMMARY =
  'Learn how Java LinkedHashSet stores unique elements while preserving insertion order with hashing-based performance.'

const JAVA_LINKED_HASH_SET_CONTENT = `# What is LinkedHashSet?

\`LinkedHashSet\` is a class that implements the \`Set\` interface and stores unique elements while maintaining insertion order.

It combines two important ideas:

- \`HashSet\`: no duplicates
- Linked ordering: keeps the order in which items were added

## Key Features of LinkedHashSet

- No duplicates
- Maintains insertion order
- Usually faster than \`TreeSet\`
- Usually a little slower than \`HashSet\`

## 1. Import LinkedHashSet

\`\`\`java
import java.util.LinkedHashSet;
\`\`\`

## 2. Create a LinkedHashSet

\`\`\`java
import java.util.LinkedHashSet;

public class Main {
    public static void main(String[] args) {
        LinkedHashSet<String> names = new LinkedHashSet<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");
        names.add("John");

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[John, Mary, Alex]
\`\`\`

The order is preserved and the duplicate is ignored.

## 3. Common Methods

\`\`\`java
names.add("David");
names.remove("Alex");
System.out.println(names.contains("Mary"));
System.out.println(names.size());
\`\`\`

## 4. Loop Through LinkedHashSet

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

## 5. LinkedHashSet with Numbers

\`\`\`java
import java.util.LinkedHashSet;

public class Main {
    public static void main(String[] args) {
        LinkedHashSet<Integer> numbers = new LinkedHashSet<>();

        numbers.add(50);
        numbers.add(10);
        numbers.add(30);

        System.out.println(numbers);
    }
}
\`\`\`

Output:

\`\`\`text
[50, 10, 30]
\`\`\`

The insertion order is maintained.

## HashSet vs LinkedHashSet vs TreeSet

- HashSet: no guaranteed order, usually the fastest
- LinkedHashSet: keeps insertion order
- TreeSet: keeps sorted order

All three reject duplicates, but they differ in how they preserve or organize order.

## How It Works

Internally, \`LinkedHashSet\` uses:

- A hash-based structure for fast operations
- Extra linked ordering so it can remember insertion order

That is why it keeps order better than \`HashSet\`, but is usually still faster than \`TreeSet\`.

## Real-Life Analogy

Think of \`LinkedHashSet\` like an attendance list:

- Names appear in the order people arrived
- Each person should appear only once
- The order is preserved without sorting alphabetically

## When to Use LinkedHashSet

Use \`LinkedHashSet\` when:

- You need unique elements
- You want to keep insertion order
- You do not need automatic sorting

## Common Mistakes

- Expecting sorted order instead of insertion order
- Trying to access elements by index
- Ignoring the small performance difference compared with \`HashSet\`

## Key Idea

\`LinkedHashSet\` stores unique elements while preserving the order they were added.

## Summary

- It does not allow duplicates
- It keeps insertion order
- It is usually faster than \`TreeSet\`
- It is usually a bit slower than \`HashSet\`
- It is best for ordered unique data`

const JAVA_MAP_SUMMARY =
  'Learn how a Java Map stores key-value pairs, uses unique keys for fast lookup, and supports implementations like HashMap, LinkedHashMap, and TreeMap.'

const JAVA_MAP_CONTENT = `# What is a Map in Java?

A \`Map\` is a collection-like structure that stores data in key-value pairs.

Each key is unique and is used to access its corresponding value.

Example concept:

\`\`\`text
Name -> Age
John -> 25
Mary -> 30
\`\`\`

Here, the key points to its value.

## Key Features of Map

- Stores data as key-value pairs
- Keys must be unique
- Values can be duplicated
- Supports fast data retrieval using keys

## Important Note

\`Map\` is part of the Java Collections Framework, but it is separate from the \`Collection\` interface.

That is why it behaves differently from \`List\` and \`Set\`.

## 1. Common Map Implementations

- \`HashMap\`: fast and usually unordered
- \`LinkedHashMap\`: keeps insertion order
- \`TreeMap\`: keeps keys sorted

## 2. Using HashMap

\`\`\`java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> ages = new HashMap<>();

        ages.put("John", 25);
        ages.put("Mary", 30);
        ages.put("Alex", 20);

        System.out.println(ages);
    }
}
\`\`\`

Output:

\`\`\`text
{John=25, Mary=30, Alex=20}
\`\`\`

## 3. Access Values

\`\`\`java
System.out.println(ages.get("John"));
\`\`\`

Output:

\`\`\`text
25
\`\`\`

## 4. Update Values

\`\`\`java
ages.put("John", 35);
\`\`\`

Using the same key again updates the value.

## 5. Remove Elements

\`\`\`java
ages.remove("Alex");
\`\`\`

## 6. Check Keys or Values

\`\`\`java
ages.containsKey("Mary");
ages.containsValue(30);
\`\`\`

## 7. Loop Through a Map

Using keys:

\`\`\`java
for (String key : ages.keySet()) {
    System.out.println(key);
}
\`\`\`

Using values:

\`\`\`java
for (int value : ages.values()) {
    System.out.println(value);
}
\`\`\`

Using key-value pairs:

\`\`\`java
for (String key : ages.keySet()) {
    System.out.println(key + ": " + ages.get(key));
}
\`\`\`

## 8. Important Methods

- \`put()\` adds a key-value pair
- \`get()\` gets a value by key
- \`remove()\` removes an entry
- \`containsKey()\` checks for a key
- \`containsValue()\` checks for a value
- \`keySet()\` returns all keys
- \`values()\` returns all values
- \`size()\` returns the number of entries

## Map vs List vs Set

- List: stores single values, allows duplicates, uses indexes
- Set: stores unique single values, no indexing
- Map: stores key-value pairs, keys are unique, access happens by key

## Real-Life Analogy

Think of a \`Map\` like a dictionary:

- Word = key
- Meaning = value
- You search using the word to find the meaning

## When to Use Map

Use a \`Map\` when:

- You need fast lookup using a key
- You want to associate one piece of data with another
- You want efficient storage and retrieval

## Common Mistakes

- Reusing duplicate keys and expecting separate entries
- Forgetting that missing keys often return \`null\`
- Expecting order from \`HashMap\`

## Key Idea

A Java \`Map\` stores key-value pairs for fast and efficient access.

## Summary

- It stores key-value pairs
- Keys must be unique
- Values can repeat
- Common types include \`HashMap\`, \`LinkedHashMap\`, and \`TreeMap\`
- It is very important in real-world applications`

const JAVA_HASH_MAP_SUMMARY =
  'Learn how Java HashMap stores key-value pairs with very fast hashing-based access while not guaranteeing order.'

const JAVA_HASH_MAP_CONTENT = `# What is HashMap?

\`HashMap\` is a class that implements the \`Map\` interface and stores data in key-value pairs.

It is designed for fast access to values using keys.

## Key Features of HashMap

- Stores data as key-value pairs
- Keys must be unique
- Values can be duplicated
- No guaranteed order
- Very fast performance in common cases

## 1. Import HashMap

\`\`\`java
import java.util.HashMap;
\`\`\`

## 2. Create a HashMap

\`\`\`java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> ages = new HashMap<>();

        ages.put("John", 25);
        ages.put("Mary", 30);
        ages.put("Alex", 20);

        System.out.println(ages);
    }
}
\`\`\`

Output:

\`\`\`text
{John=25, Mary=30, Alex=20}
\`\`\`

## 3. Access Values

\`\`\`java
System.out.println(ages.get("Mary"));
\`\`\`

Output:

\`\`\`text
30
\`\`\`

## 4. Add or Update Values

\`\`\`java
ages.put("John", 35);
\`\`\`

If the key already exists, the old value is overwritten.

## 5. Remove Elements

\`\`\`java
ages.remove("Alex");
\`\`\`

## 6. Check Key or Value

\`\`\`java
ages.containsKey("John");
ages.containsValue(30);
\`\`\`

## 7. Get Size

\`\`\`java
System.out.println(ages.size());
\`\`\`

## 8. Loop Through HashMap

Using keys:

\`\`\`java
for (String key : ages.keySet()) {
    System.out.println(key);
}
\`\`\`

Using values:

\`\`\`java
for (int value : ages.values()) {
    System.out.println(value);
}
\`\`\`

Using key-value pairs:

\`\`\`java
for (String key : ages.keySet()) {
    System.out.println(key + ": " + ages.get(key));
}
\`\`\`

## 9. Example with Different Data Types

\`\`\`java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<Integer, String> students = new HashMap<>();

        students.put(1, "Alice");
        students.put(2, "Bob");

        System.out.println(students.get(1));
    }
}
\`\`\`

## Important Notes

- Duplicate keys overwrite previous values
- Order is not guaranteed
- A \`HashMap\` can store \`null\` keys and values
- Hashing is used internally for speed

## HashMap vs LinkedHashMap vs TreeMap

- HashMap: no guaranteed order, usually the fastest
- LinkedHashMap: keeps insertion order
- TreeMap: keeps keys sorted

All three use unique keys, but they differ in how they manage order.

## Real-Life Analogy

Think of \`HashMap\` like phone contacts:

- Name = key
- Phone number = value
- You search using the name
- Fast lookup matters more than order

## When to Use HashMap

Use \`HashMap\` when:

- You need fast lookup
- You do not care about order
- You want to store key-value pairs efficiently

## Common Mistakes

- Expecting ordered output
- Reusing duplicate keys and losing the old value
- Calling \`get()\` with a missing key and forgetting it may return \`null\`

## Key Idea

\`HashMap\` stores key-value pairs using hashing for very fast data access.

## Summary

- It stores key-value pairs
- Keys must be unique
- It offers very fast common operations
- It does not guarantee order
- It is widely used in real-world applications`

const JAVA_TREE_MAP_SUMMARY =
  'Learn how Java TreeMap stores key-value pairs with keys kept automatically sorted using a tree-based structure.'

const JAVA_TREE_MAP_CONTENT = `# What is TreeMap?

\`TreeMap\` is a class that implements the \`Map\` interface and stores data in key-value pairs sorted by keys.

It automatically keeps keys in ascending order.

## Key Features of TreeMap

- Stores key-value pairs
- Keys are sorted automatically
- Duplicate keys are not allowed
- Slower than \`HashMap\` because sorted order must be maintained
- Uses a tree-based structure internally

## 1. Import TreeMap

\`\`\`java
import java.util.TreeMap;
\`\`\`

## 2. Create a TreeMap

\`\`\`java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> ages = new TreeMap<>();

        ages.put("John", 25);
        ages.put("Mary", 30);
        ages.put("Alex", 20);

        System.out.println(ages);
    }
}
\`\`\`

Output:

\`\`\`text
{Alex=20, John=25, Mary=30}
\`\`\`

The keys are sorted alphabetically.

## 3. Access Values

\`\`\`java
System.out.println(ages.get("John"));
\`\`\`

## 4. Important Methods

- \`put()\` adds or updates an entry
- \`get()\` gets a value by key
- \`remove()\` removes an entry
- \`containsKey()\` checks whether a key exists
- \`firstKey()\` returns the smallest key
- \`lastKey()\` returns the largest key

## 5. Example: firstKey() and lastKey()

\`\`\`java
System.out.println(ages.firstKey());
System.out.println(ages.lastKey());
\`\`\`

Output:

\`\`\`text
Alex
Mary
\`\`\`

## 6. Loop Through TreeMap

\`\`\`java
for (String key : ages.keySet()) {
    System.out.println(key + ": " + ages.get(key));
}
\`\`\`

## 7. TreeMap with Numbers

\`\`\`java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<Integer, String> data = new TreeMap<>();

        data.put(3, "C");
        data.put(1, "A");
        data.put(2, "B");

        System.out.println(data);
    }
}
\`\`\`

Output:

\`\`\`text
{1=A, 2=B, 3=C}
\`\`\`

## How TreeMap Works

Internally, \`TreeMap\` uses a self-balancing tree structure.

That allows it to:

- Keep keys sorted at all times
- Maintain order during insertion
- Support methods like \`firstKey()\` and \`lastKey()\`

## TreeMap vs HashMap vs LinkedHashMap

- HashMap: no guaranteed order, usually the fastest
- LinkedHashMap: keeps insertion order
- TreeMap: keeps keys sorted

All three require unique keys, but they differ in how they handle ordering.

## Important Note

\`TreeMap\` works best with keys that can be compared naturally, such as:

- Strings
- Integers

If you use custom object keys, they usually need comparison logic.

## Real-Life Analogy

Think of \`TreeMap\` like a dictionary arranged alphabetically:

- Words are the keys
- Meanings are the values
- It is easy to find the first and last entries

## When to Use TreeMap

Use \`TreeMap\` when:

- You need sorted keys
- You want ordered data automatically
- You do not mind slightly slower performance

## Common Mistakes

- Expecting insertion order
- Using non-comparable keys without comparison logic
- Ignoring the performance cost compared with \`HashMap\`

## Key Idea

\`TreeMap\` stores key-value pairs in sorted order using a tree structure.

## Summary

- It is a sorted key-value map
- Keys must be unique
- Keys are ordered automatically
- It is slower than \`HashMap\`
- It is useful for ordered data`

const JAVA_LINKED_HASH_MAP_SUMMARY =
  'Learn how Java LinkedHashMap stores key-value pairs while preserving insertion order with near-HashMap-style lookup behavior.'

const JAVA_LINKED_HASH_MAP_CONTENT = `# What is LinkedHashMap?

\`LinkedHashMap\` is a class that implements the \`Map\` interface and stores data in key-value pairs while maintaining insertion order.

You can think of it as:

- \`HashMap\` for fast key-based lookup
- Plus order tracking so entries stay in the order they were added

## Key Features of LinkedHashMap

- Stores key-value pairs
- Maintains insertion order
- Does not allow duplicate keys
- Allows one \`null\` key and multiple \`null\` values
- Usually a little slower than \`HashMap\` because it keeps order information

## 1. Import LinkedHashMap

\`\`\`java
import java.util.LinkedHashMap;
\`\`\`

## 2. Create a LinkedHashMap

\`\`\`java
import java.util.LinkedHashMap;

public class Main {
    public static void main(String[] args) {
        LinkedHashMap<String, Integer> ages = new LinkedHashMap<>();

        ages.put("John", 25);
        ages.put("Mary", 30);
        ages.put("Alex", 20);

        System.out.println(ages);
    }
}
\`\`\`

Output:

\`\`\`text
{John=25, Mary=30, Alex=20}
\`\`\`

The output follows insertion order.

## 3. Access Values

\`\`\`java
System.out.println(ages.get("Mary"));
\`\`\`

Output:

\`\`\`text
30
\`\`\`

## 4. Update Values

\`\`\`java
ages.put("John", 40);
\`\`\`

If the key already exists, the value is updated.

## 5. Remove Elements

\`\`\`java
ages.remove("Alex");
\`\`\`

## 6. Check Keys and Values

\`\`\`java
ages.containsKey("John");
ages.containsValue(30);
\`\`\`

## 7. Loop Through LinkedHashMap

Using \`keySet()\`:

\`\`\`java
for (String key : ages.keySet()) {
    System.out.println(key + ": " + ages.get(key));
}
\`\`\`

## 8. Example with Numbers as Keys

\`\`\`java
import java.util.LinkedHashMap;

public class Main {
    public static void main(String[] args) {
        LinkedHashMap<Integer, String> map = new LinkedHashMap<>();

        map.put(1, "One");
        map.put(2, "Two");
        map.put(3, "Three");

        System.out.println(map);
    }
}
\`\`\`

Output:

\`\`\`text
{1=One, 2=Two, 3=Three}
\`\`\`

## How LinkedHashMap Works

Internally, \`LinkedHashMap\` uses:

- A hash-based structure for fast lookup
- Linked ordering so entries remember their insertion order

That means each entry is connected to the previous and next entry in insertion sequence.

## LinkedHashMap vs HashMap vs TreeMap

- HashMap: no guaranteed order
- LinkedHashMap: keeps insertion order
- TreeMap: keeps keys sorted

Comparison summary:

- HashMap is usually the fastest
- LinkedHashMap is fast and predictable
- TreeMap is slower but automatically sorted

## Real-Life Analogy

Think of \`LinkedHashMap\` like a shopping receipt:

- Items appear in the order you bought them
- Each item id is unique
- Each item can still be looked up quickly

## When to Use LinkedHashMap

Use \`LinkedHashMap\` when:

- You need fast lookup
- You want to preserve insertion order
- You do not need sorted keys

## Common Mistakes

- Thinking it sorts keys, which it does not
- Forgetting that duplicate keys overwrite old values
- Using it when sorted order is required, where \`TreeMap\` would fit better

## Key Idea

\`LinkedHashMap\` stores key-value pairs while preserving the order in which entries were added.

## Summary

- It stores key-value pairs
- It maintains insertion order
- It is fast and predictable
- It is slightly slower than \`HashMap\`
- It is great for ordered data display`

const JAVA_ITERATOR_SUMMARY =
  'Learn how Java Iterator safely traverses collections one element at a time and supports safe removal during iteration.'

const JAVA_ITERATOR_CONTENT = `# What is an Iterator?

An \`Iterator\` is an object used to traverse collections one element at a time.

It is commonly used with collections like:

- \`List\`
- \`Set\`
- \`Map\` data viewed through entry or key collections

It gives you a safe way to move through elements step by step.

## Why Use Iterator?

An iterator helps you:

- Loop through collections
- Remove elements safely while looping
- Avoid errors such as \`ConcurrentModificationException\`

## 1. Import Iterator

\`\`\`java
import java.util.ArrayList;
import java.util.Iterator;
\`\`\`

## 2. Create and Use an Iterator

\`\`\`java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        Iterator<String> it = names.iterator();

        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }
}
\`\`\`

Output:

\`\`\`text
John
Mary
Alex
\`\`\`

## 3. Iterator Methods

- \`hasNext()\` checks if more elements exist
- \`next()\` returns the next element
- \`remove()\` removes the current element safely

## 4. Removing Elements with Iterator

\`\`\`java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        Iterator<String> it = names.iterator();

        while (it.hasNext()) {
            String name = it.next();

            if (name.equals("Mary")) {
                it.remove();
            }
        }

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[John, Alex]
\`\`\`

## 5. Iterator with Set

\`\`\`java
import java.util.HashSet;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        HashSet<Integer> numbers = new HashSet<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        Iterator<Integer> it = numbers.iterator();

        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }
}
\`\`\`

## 6. Why Iterator Can Be Better Than a For-Each Loop

Risky approach:

\`\`\`java
for (String name : names) {
    if (name.equals("Mary")) {
        names.remove(name);
    }
}
\`\`\`

Safer iterator approach:

\`\`\`java
Iterator<String> it = names.iterator();

while (it.hasNext()) {
    if (it.next().equals("Mary")) {
        it.remove();
    }
}
\`\`\`

The iterator version is safer because removal happens through the iterator itself.

## Real-Life Analogy

Think of an iterator like a checklist worker:

- It moves item by item
- It can safely cross out items while working
- It avoids breaking the list while moving through it

## When to Use Iterator

Use an iterator when:

- You need to loop through a collection manually
- You may remove items during looping
- You want safe traversal one element at a time

## Common Mistakes

- Calling \`next()\` without checking \`hasNext()\`
- Removing directly from the collection while iterating
- Reusing an iterator after the collection changes in unsupported ways

## Key Idea

\`Iterator\` lets you safely traverse and sometimes modify collections one element at a time.

## Summary

- It is used to loop through collections
- It works with lists, sets, and other collection views
- It supports safe removal during iteration
- The main methods are \`hasNext()\`, \`next()\`, and \`remove()\``

const JAVA_ITERATOR_METHODS_SUMMARY =
  'Learn how Java Iterator methods like hasNext, next, and remove safely traverse and modify collections one element at a time.'

const JAVA_ITERATOR_METHODS_CONTENT = `# Java Iterator Methods

## What is Iterator?

An \`Iterator\` is an object used to traverse collections like \`List\` and \`Set\`.

Think of it like a cursor moving through items one by one.

## 1. Import Iterator

\`\`\`java
import java.util.Iterator;
import java.util.ArrayList;
\`\`\`

## 2. Create Iterator

\`\`\`java
ArrayList<String> names = new ArrayList<>();

names.add("John");
names.add("Mary");
names.add("Alex");

Iterator<String> it = names.iterator();
\`\`\`

## 3. hasNext() - Check Next Element

\`\`\`java
while (it.hasNext()) {
    System.out.println(it.next());
}
\`\`\`

- Returns \`true\` if there is another element
- Returns \`false\` if the iterator has reached the end

## 4. next() - Get Next Element

\`\`\`java
String name = it.next();
\`\`\`

This moves the cursor forward and returns the current value.

## 5. remove() - Delete Current Element

\`\`\`java
it.remove();
\`\`\`

Important:

- It can only be used after \`next()\`
- It removes the current element safely

## Full Example Program

\`\`\`java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {

        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        Iterator<String> it = names.iterator();

        while (it.hasNext()) {
            String name = it.next();

            if (name.equals("Mary")) {
                it.remove();
            } else {
                System.out.println(name);
            }
        }
    }
}
\`\`\`

Output:

\`\`\`text
John
Alex
\`\`\`

\`Mary\` was removed safely.

## Why Iterator Is Important

Without an iterator, removing items during a loop can cause:

\`\`\`text
ConcurrentModificationException
\`\`\`

Iterator solves that safely.

## Iterator Methods Summary

- \`hasNext()\` checks whether another element exists
- \`next()\` returns the next element
- \`remove()\` removes the current element safely

## Real-Life Analogy

Think of an iterator like a person walking through a row of boxes:

- \`hasNext()\` asks whether there is another box
- \`next()\` picks the next box
- \`remove()\` removes the current box safely

## Iterator vs For Loop

- Iterator: safe for removal during traversal
- For loop: risky for direct removal in many collections
- Iterator: best for collections
- For loop: often simpler for arrays or fixed index-based access

## Common Mistakes

- Calling \`remove()\` before \`next()\`
- Using the iterator after it finishes
- Modifying the list directly while iterating
- Forgetting to check \`hasNext()\`

## Key Idea

\`Iterator\` lets you safely traverse and modify collections one element at a time.

## Summary

- \`hasNext()\` checks the next item
- \`next()\` gets the item
- \`remove()\` deletes the item safely
- It is used with lists, sets, and other collections`

const JAVA_ALGORITHMS_SUMMARY =
  'Learn how Java algorithms solve problems step by step through sorting, searching, recursion, and efficiency-focused problem solving.'

const JAVA_ALGORITHMS_CONTENT = `# What is an Algorithm?

An algorithm is a step-by-step procedure used to solve a problem or perform a task.

In Java, algorithms are commonly used to:

- Sort data
- Search data
- Process collections
- Solve logical problems

## Why Algorithms Matter

- They improve program efficiency
- They help programs handle large data better
- They are used in real applications such as search engines, banking systems, and AI tools

## Types of Algorithms in Java

Common categories include:

- Sorting algorithms
- Searching algorithms
- Recursion algorithms
- Mathematical algorithms

## 1. Sorting Algorithm

Sorting arranges data in order, such as ascending or descending order.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] numbers = {5, 2, 9, 1, 3};

        Arrays.sort(numbers);

        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}
\`\`\`

Output:

\`\`\`text
1 2 3 5 9
\`\`\`

## 2. Searching Algorithm

Searching finds a specific value inside data.

Example: linear search

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40};

        int target = 30;
        boolean found = false;

        for (int num : numbers) {
            if (num == target) {
                found = true;
                break;
            }
        }

        System.out.println(found);
    }
}
\`\`\`

Output:

\`\`\`text
true
\`\`\`

## 3. Binary Search

Binary search is faster, but it works only on sorted arrays or sorted lists.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 3, 5, 7, 9};

        int index = Arrays.binarySearch(numbers, 5);

        System.out.println(index);
    }
}
\`\`\`

Output:

\`\`\`text
2
\`\`\`

## 4. Recursion Algorithm

Recursion is when a method calls itself to solve a smaller part of the same problem.

\`\`\`java
public class Main {
    static int factorial(int n) {
        if (n == 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}
\`\`\`

Output:

\`\`\`text
120
\`\`\`

## 5. Algorithm Efficiency

Algorithms are often compared by how efficient they are.

Common complexity ideas include:

- \`O(1)\`: constant time
- \`O(log n)\`: very efficient growth
- \`O(n)\`: linear time
- \`O(n^2)\`: slower for large data

This helps developers choose better solutions as data grows.

## Real-Life Analogy

Think of algorithms like directions to a destination:

- A clear step-by-step route gets you there
- A faster route is a better algorithm
- A slower route still works, but wastes time

## Common Mistakes

- Using slow algorithms for large data sets
- Forgetting that binary search needs sorted data first
- Writing recursion without a stopping condition

## Key Idea

Algorithms are step-by-step solutions that help Java programs become efficient, correct, and scalable.

## Summary

- Algorithms solve problems step by step
- Common types include sorting, searching, and recursion
- Efficiency matters when data grows
- Algorithms are used in real-world software everywhere`

const JAVA_ADVANCED_SUMMARY =
  'Learn how Advanced Java brings together powerful real-world topics like generics, streams, lambdas, threads, JDBC, and scalable application design.'

const JAVA_ADVANCED_CONTENT = `# What is Advanced Java?

Advanced Java refers to more powerful features and concepts used to build real-world, scalable applications.

It goes beyond basics like variables and loops into areas such as:

- Performance
- Application architecture
- Modern programming styles

## Key Advanced Topics in Java

## 1. Java Generics

Generics help you write type-safe and reusable code.

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("Hello");

        System.out.println(list.get(0));
    }
}
\`\`\`

## 2. Java Streams API

Streams help process collections and arrays in a clean and expressive way.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};

        Arrays.stream(numbers)
              .filter(n -> n > 2)
              .forEach(System.out::println);
    }
}
\`\`\`

## 3. Lambda Expressions

Lambdas are a short way to write functional-style behavior.

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(1);
        nums.add(2);
        nums.add(3);

        nums.forEach(n -> System.out.println(n));
    }
}
\`\`\`

## 4. Multithreading

Multithreading lets a program run multiple tasks at the same time.

\`\`\`java
public class Main extends Thread {
    public void run() {
        System.out.println("Thread running");
    }

    public static void main(String[] args) {
        Main t = new Main();
        t.start();
    }
}
\`\`\`

## 5. Java Networking

Networking is used for communication between systems, such as:

- HTTP requests
- APIs
- Client-server applications

## 6. Java JDBC

JDBC is used to connect Java applications to databases.

\`\`\`java
import java.sql.Connection;
import java.sql.DriverManager;

public class Main {
    public static void main(String[] args) {
        try {
            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/mydb", "user", "pass"
            );

            System.out.println("Connected!");
        } catch (Exception e) {
            System.out.println("Connection failed");
        }
    }
}
\`\`\`

## 7. Advanced File Handling

Advanced file handling often uses:

- Streams
- Buffers
- Try-with-resources

This makes file operations cleaner and more efficient.

## 8. Advanced Exception Handling

Advanced exception handling includes:

- Custom exceptions
- Multiple catch blocks
- Try-with-resources

These patterns help professional applications recover from problems more safely.

## 9. Advanced Collections

Advanced collection usage often includes:

- HashMap
- TreeSet
- Comparator-based sorting
- Stream-based collection processing

## 10. Java Annotations

Annotations provide metadata that gives extra information to code.

\`\`\`java
@Override
public String toString() {
    return "Example";
}
\`\`\`

## Real-Life Analogy

Think of Advanced Java like building a full system:

- Basic Java gives you the tools
- Advanced Java helps you design, organize, and scale the whole structure

## Why Learn Advanced Java?

- To build real-world applications
- To improve performance
- To work with databases and APIs
- To prepare for backend and enterprise development

## Common Mistakes

- Skipping core fundamentals
- Jumping into frameworks too early
- Ignoring performance ideas
- Not practicing with real projects

## Key Idea

Advanced Java focuses on building scalable, efficient, and professional applications.

## Summary

- It covers powerful real-world Java concepts
- It includes topics like generics, streams, threads, JDBC, and annotations
- It is essential for backend and enterprise work
- It helps strengthen architecture and problem-solving skills`

const JAVA_WRAPPER_CLASSES_SUMMARY =
  'Learn how Java wrapper classes turn primitive values into objects so they can be used with collections, generics, and object-based APIs.'

const JAVA_WRAPPER_CLASSES_CONTENT = `# What are Wrapper Classes?

Wrapper classes are objects that wrap primitive data types so they can be used like regular Java objects.

Java provides a wrapper class for each primitive type.

## Why Use Wrapper Classes?

Some Java features work with objects, not primitives.

Common examples include:

- Collections such as \`ArrayList\` and \`HashMap\`
- Generics
- Object methods and utility methods

## Primitive Types vs Wrapper Classes

\`\`\`text
int     -> Integer
double  -> Double
char    -> Character
boolean -> Boolean
long    -> Long
float   -> Float
short   -> Short
byte    -> Byte
\`\`\`

## 1. Creating Wrapper Objects

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Integer num = Integer.valueOf(10);
        Double price = Double.valueOf(20.5);

        System.out.println(num);
        System.out.println(price);
    }
}
\`\`\`

## 2. Autoboxing

Autoboxing means Java automatically converts a primitive into its wrapper object.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Integer num = 10;

        System.out.println(num);
    }
}
\`\`\`

## 3. Unboxing

Unboxing means Java automatically converts a wrapper object back into a primitive value.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        Integer num = 20;
        int value = num;

        System.out.println(value);
    }
}
\`\`\`

## 4. Using Wrapper Classes in Collections

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);

        System.out.println(numbers);
    }
}
\`\`\`

You cannot use primitive types such as \`int\` directly in generic collections.

## 5. Useful Wrapper Methods

\`\`\`java
Integer num = 100;

System.out.println(num.toString());
System.out.println(num.intValue());
System.out.println(Integer.parseInt("50"));
\`\`\`

Output:

\`\`\`text
100
100
50
\`\`\`

## 6. Converting Strings to Numbers

\`\`\`java
int number = Integer.parseInt("123");
double price = Double.parseDouble("10.5");
\`\`\`

## 7. Comparing Wrapper Objects

\`\`\`java
Integer a = 100;
Integer b = 100;

System.out.println(a.equals(b));
\`\`\`

Use \`.equals()\` for value comparison instead of depending on \`==\`.

## Important Notes

- Wrapper classes are objects, not primitives
- They usually use more memory than primitive values
- They are required for collections and generics
- They provide useful helper methods

## Real-Life Analogy

Think of wrapper classes like packaging a raw item:

- Primitive = raw item
- Wrapper = packaged item with labels and extra features

## Common Mistakes

- Using \`==\` instead of \`.equals()\` for value comparison
- Forgetting that collections need wrapper types instead of primitives
- Ignoring autoboxing and unboxing behavior during method calls

## Key Idea

Wrapper classes convert primitive data types into objects so they can work with more advanced Java features.

## Summary

- They wrap primitives into objects
- They allow use in collections and generics
- They support autoboxing and unboxing
- They provide useful helper methods
- They are important in modern Java programming`

const JAVA_GENERICS_SUMMARY =
  'Learn how Java generics add type safety, reduce casting, and help classes, methods, and collections work cleanly with reusable typed code.'

const JAVA_GENERICS_CONTENT = `# What are Generics?

Generics allow you to write classes, methods, and interfaces that work with different data types safely.

Instead of using \`Object\` everywhere, you specify the intended type.

## Why Use Generics?

- They improve type safety
- They reduce or eliminate manual casting
- They make code reusable
- They improve readability

## 1. Without Generics

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList list = new ArrayList();

        list.add("Hello");
        list.add(10);

        String text = (String) list.get(0);
    }
}
\`\`\`

Problems with raw types:

- No type safety
- Runtime errors become more likely
- Manual casting is needed

## 2. With Generics

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();

        list.add("Hello");
        // list.add(10); // compile-time error

        String text = list.get(0);
    }
}
\`\`\`

Generics move many type mistakes from runtime to compile time.

## 3. Generic Class

\`\`\`java
class Box<T> {
    T value;

    void set(T value) {
        this.value = value;
    }

    T get() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<Integer> box = new Box<>();

        box.set(100);

        System.out.println(box.get());
    }
}
\`\`\`

## 4. Generic Method

\`\`\`java
public class Main {
    public static <T> void printData(T data) {
        System.out.println(data);
    }

    public static void main(String[] args) {
        printData("Hello");
        printData(123);
    }
}
\`\`\`

## 5. Multiple Type Parameters

\`\`\`java
class Pair<K, V> {
    K key;
    V value;

    Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
}
\`\`\`

This is common in structures such as maps, entries, and reusable utility classes.

## 6. Bounded Generics

Bounded generics restrict the allowed types.

\`\`\`java
class NumberBox<T extends Number> {
    T num;

    NumberBox(T num) {
        this.num = num;
    }
}
\`\`\`

This means only types that extend \`Number\` are allowed.

## 7. Wildcards

Wildcards use \`?\` when the exact generic type is not important.

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void printList(ArrayList<?> list) {
        for (Object item : list) {
            System.out.println(item);
        }
    }
}
\`\`\`

Wildcards are useful when you want flexibility while still keeping type rules clear.

## Common Generic Classes

- \`ArrayList<T>\`
- \`HashMap<K, V>\`
- \`HashSet<T>\`
- \`LinkedList<T>\`

## Real-Life Analogy

Think of generics like labeled containers:

- \`Box<String>\` means only strings should go inside
- \`Box<Integer>\` means only integers should go inside

The label keeps the container safe and predictable.

## Common Mistakes

- Using raw types instead of proper generic types
- Mixing incompatible types
- Forgetting bounds when a type should be restricted

## Key Idea

Generics provide type safety and reusable code by letting Java know the intended data type at compile time.

## Summary

- Generics make code type-safe
- They reduce manual casting
- They improve readability and reuse
- They are used heavily in collections
- They are essential in advanced Java`

const JAVA_ANNOTATIONS_SUMMARY =
  'Learn how Java annotations add metadata to code, help tools and the compiler understand intent, and support modern frameworks and cleaner Java design.'

const JAVA_ANNOTATIONS_CONTENT = `# What are Annotations?

Annotations are metadata added to code.

They do not directly change the program logic, but they provide extra information to the compiler, runtime, or tools that inspect the code.

## Simple Example

\`\`\`java
@Override
public String toString() {
    return "Example";
}
\`\`\`

\`@Override\` tells Java that this method is meant to override a method from a parent class.

## Why Use Annotations?

- They improve readability
- They help the compiler detect mistakes
- They are used heavily by frameworks such as Spring and Hibernate
- They add extra information without changing the main logic

## 1. Common Built-In Annotations

### \`@Override\`

This ensures that a method really overrides a parent method.

\`\`\`java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}
\`\`\`

If the method signature is wrong, the compiler can warn you immediately.

### \`@Deprecated\`

This marks code as outdated.

\`\`\`java
@Deprecated
void oldMethod() {
    System.out.println("This is old");
}
\`\`\`

Java usually shows a warning when deprecated code is used.

### \`@SuppressWarnings\`

This hides a specific compiler warning.

\`\`\`java
@SuppressWarnings("unchecked")
public class Main {
    public static void main(String[] args) {
    }
}
\`\`\`

Use it carefully, because hiding a warning does not remove the real risk behind it.

## 2. Custom Annotations

You can create your own annotation.

\`\`\`java
@interface MyAnnotation {
    String value();
}
\`\`\`

Using the custom annotation:

\`\`\`java
@MyAnnotation(value = "Hello")
public class Main {
}
\`\`\`

Custom annotations become useful when tools, reflection, or frameworks read them.

## 3. Annotation Types

- Marker annotation: no value, such as \`@Override\`
- Single-value annotation: one value
- Full annotation: multiple named values

## 4. Meta-Annotations

Meta-annotations are annotations used on other annotations.

\`\`\`java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface MyAnnotation {
    String value();
}
\`\`\`

Common meta-annotations:

- \`@Retention\` controls when the annotation is available
- \`@Target\` controls where the annotation can be used
- \`@Inherited\` allows inheritance in some situations
- \`@Documented\` includes it in generated documentation

## 5. Where Annotations Are Used

Annotations can be placed on:

- Classes
- Methods
- Fields
- Parameters

## Real-Life Analogy

Think of annotations like labels on folders:

- The folder contents stay the same
- The label gives extra information
- Other people or systems understand how to use it better

## Common Mistakes

- Thinking annotations directly replace program logic
- Forgetting \`@Override\` and missing an override mistake
- Creating custom annotations without any code that reads or processes them

## Key Idea

Annotations provide extra information to the compiler, runtime, or tools without directly changing the core program behavior.

## Summary

- Annotations are metadata for code
- They improve readability and safety
- Java includes built-in and custom annotations
- Meta-annotations control annotation behavior
- Frameworks use annotations heavily in modern Java`

const buildHtmlLessonSummary = (title: string) => {
  const normalized = title.toLowerCase()

  if (normalized.includes('tutorial') || normalized.includes('home') || normalized.includes('introduction')) {
    return `Start ${title} with a clear guided explanation of how HTML structures real web pages.`
  }

  if (
    normalized.includes('layout') ||
    normalized.includes('responsive') ||
    normalized.includes('semantics') ||
    normalized.includes('style guide')
  ) {
    return `Use ${title} to build cleaner, more professional HTML pages that are easier to scale and maintain.`
  }

  return `Learn ${title} with practical markup examples and clear explanations you can apply in DevHub right away.`
}

const buildHtmlLessonContent = (title: string) => {
  switch (title) {
    case 'HTML Tutorial':
      return HTML_TUTORIAL_LESSON_CONTENT
    case 'HTML HOME':
      return HTML_HOME_LESSON_CONTENT
    case 'HTML Introduction':
      return HTML_INTRODUCTION_LESSON_CONTENT
    case 'HTML Editors':
      return HTML_EDITORS_LESSON_CONTENT
    case 'HTML Basic':
      return HTML_BASIC_LESSON_CONTENT
    case 'HTML Elements':
      return HTML_ELEMENTS_LESSON_CONTENT
    case 'HTML Attributes':
      return HTML_ATTRIBUTES_LESSON_CONTENT
    case 'HTML Headings':
      return HTML_HEADINGS_LESSON_CONTENT
    default: {
      const cleanTitle = title.replace(/^HTML\s+/i, '')
      return buildLessonContentTemplate({
        title,
        introduction: `${cleanTitle} helps you understand a practical part of HTML so you can structure pages clearly, read code faster, and build cleaner websites.`,
        practicePoints: [
          `Understand the purpose of ${cleanTitle} in an HTML document`,
          `Recognize the most common tags, attributes, or patterns related to ${cleanTitle}`,
          `Connect ${cleanTitle} to real page-building tasks inside DevHub`,
        ],
        nextStep: 'Continue to the next HTML topic to keep strengthening your web-page foundations.',
      })
    }
  }
}

const buildHtmlLessonCodeSample = (title: string) => {
  const normalized = title.toLowerCase()

  if (normalized.includes('tutorial') || normalized.includes('home') || normalized.includes('introduction') || normalized.includes('basic')) {
    return HTML_TUTORIAL_CODE_SAMPLE
  }
  if (normalized.includes('editor')) return HTML_EDITORS_CODE_SAMPLE
  if (normalized.includes('element')) return HTML_ELEMENTS_CODE_SAMPLE
  if (normalized.includes('attribute')) return HTML_ATTRIBUTES_CODE_SAMPLE
  if (normalized.includes('heading')) return HTML_HEADINGS_CODE_SAMPLE
  if (normalized.includes('paragraph')) return '<p>This is a simple HTML paragraph.</p>'
  if (normalized.includes('style') && !normalized.includes('guide')) return '<p style="color: royalblue; font-size: 18px;">Styled text</p>'
  if (normalized.includes('formatting')) return '<strong>Bold</strong> <em>Italic</em> <mark>Highlighted</mark>'
  if (normalized.includes('quotation')) return '<blockquote cite="https://example.com">Learning HTML builds strong web foundations.</blockquote>'
  if (normalized.includes('comment')) return '<!-- This comment helps document the page structure -->'
  if (normalized.includes('color')) return '<h1 style="color: tomato;">Hello DevHub</h1>'
  if (normalized.includes('html css')) return '<style>\n  .card { color: #0ea5e9; }\n</style>\n<div class="card">Styled with CSS</div>'
  if (normalized.includes('link')) return '<a href="https://example.com" target="_blank">Visit Example</a>'
  if (normalized.includes('image')) return '<img src="https://via.placeholder.com/150" alt="Sample image">'
  if (normalized.includes('favicon')) return '<link rel="icon" type="image/png" href="/favicon.png">'
  if (normalized.includes('page title')) return '<head>\n  <title>My Page Title</title>\n</head>'
  if (normalized.includes('table')) return '<table>\n  <tr><th>Name</th><th>Track</th></tr>\n  <tr><td>Ada</td><td>HTML</td></tr>\n</table>'
  if (normalized.includes('list')) return '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>'
  if (normalized.includes('block') || normalized.includes('inline')) return '<div>Block element</div><span>Inline element</span>'
  if (normalized.includes(' div')) return '<div class="card">This content lives inside a div.</div>'
  if (normalized.includes('class')) return '<p class="highlight">This paragraph uses a class.</p>'
  if (normalized.includes(' id')) return '<h1 id="main-title">Main Page Title</h1>'
  if (normalized.includes('button')) return '<button type="button">Click me</button>'
  if (normalized.includes('iframe')) return '<iframe src="https://example.com" title="Embedded example"></iframe>'
  if (normalized.includes('javascript')) return '<button onclick="alert(\'Hello from HTML JavaScript\')">Try it</button>'
  if (normalized.includes('file paths')) return '<img src="images/logo.png" alt="Logo loaded from a file path">'
  if (normalized.includes('html head')) return '<head>\n  <meta charset="UTF-8">\n  <title>Head Example</title>\n</head>'
  if (normalized.includes('layout')) return '<header>Header</header><main>Main content</main><footer>Footer</footer>'
  if (normalized.includes('responsive')) return '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
  if (normalized.includes('computercode')) return '<code>console.log("Hello DevHub");</code>'
  if (normalized.includes('semantics')) return '<article><header><h2>Semantic Article</h2></header><p>Meaningful structure matters.</p></article>'
  if (normalized.includes('style guide')) return '<section>\n  <h1>Consistent Heading</h1>\n  <p>Use clear, tidy markup.</p>\n</section>'
  if (normalized.includes('entities')) return '&lt;section&gt; &amp; &copy;'
  if (normalized.includes('symbols')) return '&euro; &copy; &hearts;'
  if (normalized.includes('emojis')) return '&#128640; &#128187; &#128640;'
  if (normalized.includes('charset')) return '<meta charset="UTF-8">'
  if (normalized.includes('url encode')) return '<a href="/search?q=html%20tutorial">Encoded search link</a>'
  if (normalized.includes('xhtml')) return '<br />\n<img src="logo.png" alt="Logo" />'

  return '<p>Practice this HTML topic in DevHub.</p>'
}

const createHtmlLesson = (title: string, id: number): Lesson => ({
  id,
  title,
  summary: buildHtmlLessonSummary(title),
  content: buildHtmlLessonContent(title),
  codeSample: buildHtmlLessonCodeSample(title),
})

const buildCssLessonSummary = (title: string) => {
  const normalized = title.toLowerCase()

  if (normalized.includes('tutorial') || normalized.includes('home') || normalized.includes('introduction')) {
    return `Start ${title} with a practical overview of how CSS controls color, layout, and presentation across a website.`
  }

  if (normalized.includes('advanced') || normalized.includes('animation') || normalized.includes('transform') || normalized.includes('media queries')) {
    return `Use ${title} to move beyond basics and build polished, responsive interfaces inside DevHub.`
  }

  return `Learn ${title} with clear styling examples that show how CSS changes the way HTML looks and behaves.`
}

const buildCssLessonContent = (title: string) => {
  const cleanTitle = title.replace(/^CSS\s+/i, '')

  return buildLessonContentTemplate({
    title,
    introduction: `${cleanTitle} is part of CSS styling. This lesson shows how it affects the way elements look, align, respond, or animate on a real page.`,
    practicePoints: [
      `Understand what ${cleanTitle} controls in a stylesheet`,
      `Review the common CSS properties and values connected to ${cleanTitle}`,
      `See how ${cleanTitle} improves page structure, readability, or responsiveness`,
    ],
    nextStep: 'Move to the next CSS topic to keep building a stronger design and layout toolkit.',
  })
}

const buildCssLessonCodeSample = (title: string) => {
  const normalized = title.toLowerCase()

  if (normalized.includes('tutorial') || normalized.includes('home') || normalized.includes('introduction')) {
    return 'body {\n  font-family: Arial, sans-serif;\n  color: #0f172a;\n  background: #f8fafc;\n}'
  }
  if (normalized.includes('syntax') || normalized.includes('selector')) return 'p {\n  color: #2563eb;\n  font-size: 18px;\n}'
  if (normalized.includes('color')) return '.card {\n  color: #0ea5e9;\n  background: #e0f2fe;\n}'
  if (normalized.includes('background')) return '.hero {\n  background: linear-gradient(135deg, #0ea5e9, #6366f1);\n}'
  if (normalized.includes('border')) return '.panel {\n  border: 2px solid #38bdf8;\n  border-radius: 16px;\n}'
  if (normalized.includes('margin')) return '.section {\n  margin: 24px auto;\n}'
  if (normalized.includes('padding')) return '.section {\n  padding: 20px;\n}'
  if (normalized.includes('height / width') || normalized.includes('max-width')) return '.container {\n  width: 100%;\n  max-width: 960px;\n}'
  if (normalized.includes('box model') || normalized.includes('box sizing')) return '* {\n  box-sizing: border-box;\n}'
  if (normalized.includes('outline')) return 'button:focus {\n  outline: 3px solid #38bdf8;\n}'
  if (normalized.includes('text') || normalized.includes('font')) return 'h1 {\n  font-size: 2rem;\n  letter-spacing: 0.02em;\n}'
  if (normalized.includes('icon')) return '.icon {\n  font-size: 1.5rem;\n  color: #06b6d4;\n}'
  if (normalized.includes('link')) return 'a:hover {\n  text-decoration: underline;\n}'
  if (normalized.includes('list')) return 'ul {\n  list-style: square;\n  padding-left: 1.5rem;\n}'
  if (normalized.includes('table')) return 'table {\n  border-collapse: collapse;\n  width: 100%;\n}'
  if (normalized.includes('display') || normalized.includes('inline-block')) return '.badge {\n  display: inline-block;\n}'
  if (normalized.includes('position')) return '.tooltip {\n  position: absolute;\n  top: 0;\n  right: 0;\n}'
  if (normalized.includes('z-index')) return '.modal {\n  position: fixed;\n  z-index: 1000;\n}'
  if (normalized.includes('overflow')) return '.output {\n  overflow: auto;\n}'
  if (normalized.includes('float')) return 'img {\n  float: right;\n  margin-left: 1rem;\n}'
  if (normalized.includes('align')) return '.layout {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}'
  if (normalized.includes('pseudo-class')) return 'button:hover {\n  background: #0ea5e9;\n}'
  if (normalized.includes('pseudo-element')) return 'h2::after {\n  content: " *";\n}'
  if (normalized.includes('opacity')) return '.muted {\n  opacity: 0.72;\n}'
  if (normalized.includes('navigation bars') || normalized.includes('dropdown')) return 'nav ul {\n  display: flex;\n  gap: 1rem;\n}'
  if (normalized.includes('image gallery') || normalized.includes('multiple columns')) return '.gallery {\n  columns: 3;\n  gap: 1rem;\n}'
  if (normalized.includes('image sprites')) return '.icon-home {\n  background-position: 0 0;\n}'
  if (normalized.includes('attribute selectors')) return 'input[type="email"] {\n  border-color: #2563eb;\n}'
  if (normalized.includes('forms')) return 'input, textarea {\n  width: 100%;\n  padding: 0.75rem;\n}'
  if (normalized.includes('counters')) return 'body {\n  counter-reset: section;\n}'
  if (normalized.includes('units') || normalized.includes('math functions')) return '.hero {\n  font-size: clamp(1.2rem, 3vw, 2.5rem);\n}'
  if (normalized.includes('inheritance') || normalized.includes('specificity') || normalized.includes('important')) return '.card p {\n  color: inherit !important;\n}'
  if (normalized.includes('optimization') || normalized.includes('accessibility')) return ':focus-visible {\n  outline: 2px solid #0ea5e9;\n}'
  if (normalized.includes('website layout') || normalized.includes('user interface')) return '.dashboard {\n  display: grid;\n  grid-template-columns: 280px 1fr;\n  gap: 1.5rem;\n}'
  if (normalized.includes('rounded corners')) return '.chip {\n  border-radius: 999px;\n}'
  if (normalized.includes('gradients')) return '.banner {\n  background: linear-gradient(90deg, #38bdf8, #8b5cf6);\n}'
  if (normalized.includes('shadows')) return '.card {\n  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);\n}'
  if (normalized.includes('custom fonts')) return '@font-face {\n  font-family: "DevHub Sans";\n  src: url("/fonts/devhub.woff2");\n}'
  if (normalized.includes('2d transforms') || normalized.includes('3d transforms')) return '.card:hover {\n  transform: translateY(-4px) rotate(1deg);\n}'
  if (normalized.includes('transitions')) return '.button {\n  transition: background-color 0.2s ease, transform 0.2s ease;\n}'
  if (normalized.includes('animations')) return '@keyframes pulse {\n  from { opacity: 0.5; }\n  to { opacity: 1; }\n}'
  if (normalized.includes('tooltips')) return '.tooltip::after {\n  content: attr(data-tip);\n}'
  if (normalized.includes('image styling') || normalized.includes('image centering') || normalized.includes('image filters') || normalized.includes('image shapes') || normalized.includes('image modal')) return 'img {\n  display: block;\n  margin: 0 auto;\n  filter: grayscale(0.1);\n}'
  if (normalized.includes('object-fit') || normalized.includes('object-position')) return 'img.cover {\n  object-fit: cover;\n  object-position: center;\n}'
  if (normalized.includes('masking')) return '.avatar {\n  mask-image: radial-gradient(circle, #000 70%, transparent 72%);\n}'
  if (normalized.includes('buttons')) return '.button {\n  padding: 0.75rem 1rem;\n  border-radius: 999px;\n}'
  if (normalized.includes('pagination')) return '.pagination {\n  display: flex;\n  gap: 0.5rem;\n}'
  if (normalized.includes('variables') || normalized.includes('@property')) return ':root {\n  --brand: #0ea5e9;\n}\n.card {\n  border-color: var(--brand);\n}'
  if (normalized.includes('media queries')) return '@media (max-width: 768px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}'

  return '.example {\n  color: #0f172a;\n}'
}

const createCssLesson = (title: string, id: number): Lesson => ({
  id,
  title,
  summary: buildCssLessonSummary(title),
  content: buildCssLessonContent(title),
  codeSample: buildCssLessonCodeSample(title),
})

const JAVA_REGEX_SUMMARY =
  'Learn how Java regular expressions use Pattern, Matcher, and String methods to validate, search, replace, and split text with concise patterns.'

const JAVA_REGEX_CONTENT = `# Java RegEx (Regular Expressions)

## What is RegEx?

RegEx (Regular Expression) is a sequence of characters that defines a search pattern.

Used for:

- Validating input such as emails and passwords
- Searching text
- Replacing text

## Why Use RegEx?

- Powerful text processing
- Saves time compared to manual checking
- Used in real apps for forms, parsing, and validation

## 1. Java RegEx Classes

Java provides:

- \`Pattern\` -> defines the pattern
- \`Matcher\` -> performs matching

## 2. Basic Example

\`\`\`java
import java.util.regex.*;

public class Main {
    public static void main(String[] args) {

        Pattern pattern = Pattern.compile("Java");
        Matcher matcher = pattern.matcher("I love Java");

        boolean match = matcher.find();

        System.out.println(match);
    }
}
\`\`\`

Output:

\`\`\`text
true
\`\`\`

## 3. Simple Way (matches)

\`\`\`java
public class Main {
    public static void main(String[] args) {

        System.out.println("Java".matches("Java"));
    }
}
\`\`\`

## 4. Common RegEx Patterns

- \`.\` -> Any character
- \`\\\\d\` -> Digit (0-9)
- \`\\\\D\` -> Non-digit
- \`\\\\s\` -> Whitespace
- \`\\\\S\` -> Non-whitespace
- \`\\\\w\` -> Word character
- \`\\\\W\` -> Non-word character

## 5. Quantifiers

- \`+\` -> One or more
- \`*\` -> Zero or more
- \`?\` -> Zero or one
- \`{n}\` -> Exactly n times

Example:

\`\`\`java
System.out.println("12345".matches("\\\\d+"));
\`\`\`

Output:

\`\`\`text
true
\`\`\`

## 6. Email Validation Example

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String email = "test@example.com";

        boolean isValid = email.matches("^[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w+$");

        System.out.println(isValid);
    }
}
\`\`\`

## 7. Replace Text

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String text = "Java123";

        String result = text.replaceAll("\\\\d", "");

        System.out.println(result);
    }
}
\`\`\`

Output:

\`\`\`text
Java
\`\`\`

## 8. Split String

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String text = "apple,banana,orange";

        String[] parts = text.split(",");

        for (String part : parts) {
            System.out.println(part);
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of RegEx like a search filter.

You define a pattern, and it finds matching text instantly.

## Common Mistakes

- Forgetting to escape \`\\\` -> use \`\\\\\`
- Writing overly complex patterns
- Using \`matches()\` instead of \`find()\` incorrectly

## Key Idea

RegEx allows you to search, validate, and manipulate text using patterns.

## Summary

- Pattern-based text matching
- Uses \`Pattern\` and \`Matcher\`
- Supports validation and replacement
- Very powerful for real-world apps`

const JAVA_REGEX_CODE_SAMPLE = `import java.util.regex.*;

public class Main {
  public static void main(String[] args) {
    String email = "test@example.com";
    boolean isValid = email.matches("^[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w+$");

    System.out.println(isValid);
  }
}`

const JAVA_THREADS_SUMMARY =
  'Learn how Java threads run tasks concurrently, how Thread and Runnable differ, and why synchronization matters when multiple threads share data.'

const JAVA_THREADS_CONTENT = `# Java Threads

## What is a Thread?

A thread is a small unit of a program that can run independently.

Java allows multiple threads to run concurrently (at the same time).

## Why Use Threads?

- Perform multiple tasks simultaneously
- Improve performance
- Used in real apps such as games, servers, downloads, and UI apps

## 1. Creating a Thread (Method 1: Extend Thread)

\`\`\`java
public class Main extends Thread {

    public void run() {
        System.out.println("Thread is running");
    }

    public static void main(String[] args) {
        Main t = new Main();
        t.start();
    }
}
\`\`\`

## 2. Creating a Thread (Method 2: Implement Runnable)

Preferred method:

\`\`\`java
public class Main implements Runnable {

    public void run() {
        System.out.println("Thread running");
    }

    public static void main(String[] args) {
        Thread t = new Thread(new Main());
        t.start();
    }
}
\`\`\`

## Why Runnable is Better?

- Supports multiple inheritance
- More flexible
- Cleaner design

## 3. Running Multiple Threads

\`\`\`java
public class Main extends Thread {

    public void run() {
        System.out.println(Thread.currentThread().getName());
    }

    public static void main(String[] args) {

        Main t1 = new Main();
        Main t2 = new Main();

        t1.start();
        t2.start();
    }
}
\`\`\`

Output (example):

\`\`\`text
Thread-0
Thread-1
\`\`\`

Order may change, and that is important.

## 4. Thread Methods

- \`start()\` -> Starts the thread
- \`run()\` -> Code to execute
- \`sleep()\` -> Pauses the thread
- \`join()\` -> Waits for another thread
- \`isAlive()\` -> Checks if a thread is running

Example: \`sleep()\`

\`\`\`java
public class Main extends Thread {

    public void run() {
        try {
            Thread.sleep(1000);
            System.out.println("Running...");
        } catch (InterruptedException e) {
            System.out.println(e);
        }
    }

    public static void main(String[] args) {
        new Main().start();
    }
}
\`\`\`

## 5. Thread Synchronization

Prevents multiple threads from accessing shared data incorrectly.

\`\`\`java
class Counter {

    int count = 0;

    synchronized void increment() {
        count++;
    }
}
\`\`\`

## 6. Problems in Multithreading

### Race Condition

Multiple threads modify data at the same time, which can lead to the wrong result.

### Deadlock

Threads wait forever for each other.

## Real-Life Analogy

Think of threads like multiple chefs in a kitchen.

Each works on a different task, so cooking becomes faster overall, but they still need coordination to avoid chaos.

## When to Use Threads

Use threads when:

- Running background tasks
- Handling multiple users on servers
- Performing heavy computations

## Common Mistakes

- Calling \`run()\` instead of \`start()\`
- Ignoring synchronization
- Expecting a fixed execution order
- Creating too many threads

## Key Idea

Threads allow multiple tasks to run concurrently, improving performance and responsiveness.

## Summary

- Thread = independent unit of execution
- Two ways: \`Thread\` class and \`Runnable\`
- Runs concurrently
- Needs careful synchronization
- Used in real-world systems`

const JAVA_THREADS_CODE_SAMPLE = `public class Main implements Runnable {
  public void run() {
    System.out.println("Thread running");
  }

  public static void main(String[] args) {
    Thread t = new Thread(new Main());
    t.start();
  }
}`

const JAVA_LAMBDA_SUMMARY =
  'Learn how Java lambda expressions shorten anonymous functions, work with functional interfaces, and make modern collection and stream code cleaner.'

const JAVA_LAMBDA_CONTENT = `# Java Lambda Expressions

## What is a Lambda Expression?

A lambda expression is a short way to write anonymous functions (functions without a name).

It is mainly used with:

- Collections
- Streams API
- Functional interfaces

## Basic Syntax

\`\`\`java
(parameters) -> expression
\`\`\`

or

\`\`\`java
(parameters) -> {
    // code block
}
\`\`\`

## Why Use Lambda?

- Less code and cleaner syntax
- More readable
- Used in modern Java (Java 8+)
- Works well with Streams

## 1. Simple Lambda Example

\`\`\`java
public class Main {
    public static void main(String[] args) {

        Runnable r = () -> System.out.println("Hello Lambda");

        new Thread(r).start();
    }
}
\`\`\`

## 2. Lambda with Parameters

\`\`\`java
public class Main {
    public static void main(String[] args) {

        java.util.function.BiFunction<Integer, Integer, Integer> add =
            (a, b) -> a + b;

        System.out.println(add.apply(5, 3));
    }
}
\`\`\`

Output:

\`\`\`text
8
\`\`\`

## 3. Lambda with Collections

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");
        names.add("Alex");

        names.forEach(name -> System.out.println(name));
    }
}
\`\`\`

## 4. Lambda with Sorting

\`\`\`java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {

        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(50);
        numbers.add(10);
        numbers.add(30);

        Collections.sort(numbers, (a, b) -> a - b);

        System.out.println(numbers);
    }
}
\`\`\`

Output:

\`\`\`text
[10, 30, 50]
\`\`\`

## 5. Functional Interface

Lambda expressions work with functional interfaces, which are interfaces with one method.

Example:

\`\`\`java
interface MyFunction {
    void sayHello();
}

public class Main {
    public static void main(String[] args) {

        MyFunction f = () -> System.out.println("Hello!");

        f.sayHello();
    }
}
\`\`\`

## Common Functional Interfaces

- \`Runnable\` -> No input, no output
- \`Consumer\` -> Takes input, no return value
- \`Supplier\` -> No input, returns a value
- \`Function<T, R>\` -> Takes input, returns a value

## 6. Lambda vs Traditional Code

Traditional:

\`\`\`java
new Thread(new Runnable() {
    public void run() {
        System.out.println("Running");
    }
}).start();
\`\`\`

Lambda:

\`\`\`java
new Thread(() -> System.out.println("Running")).start();
\`\`\`

## Real-Life Analogy

Think of a lambda like a shortcut command.

Instead of writing full instructions, you use a quick and direct expression.

## Common Mistakes

- Using lambda without a functional interface
- Writing complex logic inside a lambda
- Forgetting type inference rules

## Key Idea

Lambda expressions allow you to write shorter and cleaner code for functional programming.

## Summary

- Short form of anonymous functions
- Uses \`->\` syntax
- Works with functional interfaces
- Makes code cleaner and more modern
- Widely used with Streams`

const JAVA_LAMBDA_CODE_SAMPLE = `import java.util.ArrayList;
import java.util.Collections;

public class Main {
  public static void main(String[] args) {
    ArrayList<Integer> numbers = new ArrayList<>();

    numbers.add(50);
    numbers.add(10);
    numbers.add(30);

    Collections.sort(numbers, (a, b) -> a - b);

    System.out.println(numbers);
  }
}`

const JAVA_ADVANCED_SORTING_SUMMARY =
  'Learn how Java advanced sorting uses Comparable and Comparator to control how objects are ordered by one field, multiple fields, or custom logic.'

const JAVA_ADVANCED_SORTING_CONTENT = `# Java Advanced Sorting

## What is Advanced Sorting?

Advanced sorting means customizing how data is sorted, not just using default ascending or descending order.

You control:

- How objects are compared
- Which field to sort by
- Complex sorting logic

## Key Tools for Advanced Sorting

- \`Comparable\` -> default sorting
- \`Comparator\` -> custom sorting
- \`Collections.sort()\` and \`List.sort()\`

## 1. Using Comparable (Default Sorting)

The class defines its own sorting logic.

Example:

\`\`\`java
class Student implements Comparable<Student> {

    String name;
    int age;

    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int compareTo(Student s) {
        return this.age - s.age; // sort by age
    }
}
\`\`\`

Using it:

\`\`\`java
import java.util.*;

public class Main {
    public static void main(String[] args) {

        ArrayList<Student> list = new ArrayList<>();

        list.add(new Student("John", 22));
        list.add(new Student("Mary", 18));
        list.add(new Student("Alex", 25));

        Collections.sort(list);

        for (Student s : list) {
            System.out.println(s.name + " " + s.age);
        }
    }
}
\`\`\`

Output:

\`\`\`text
Mary 18
John 22
Alex 25
\`\`\`

## 2. Using Comparator (Custom Sorting)

Comparator uses external sorting logic, so it is more flexible.

Example:

\`\`\`java
import java.util.*;

class Student {
    String name;
    int age;

    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

public class Main {
    public static void main(String[] args) {

        ArrayList<Student> list = new ArrayList<>();

        list.add(new Student("John", 22));
        list.add(new Student("Mary", 18));
        list.add(new Student("Alex", 25));

        Collections.sort(list, (a, b) -> a.age - b.age);

        for (Student s : list) {
            System.out.println(s.name + " " + s.age);
        }
    }
}
\`\`\`

## 3. Sorting by Different Fields

Sort by name:

\`\`\`java
Collections.sort(list, (a, b) -> a.name.compareTo(b.name));
\`\`\`

Sort by age descending:

\`\`\`java
Collections.sort(list, (a, b) -> b.age - a.age);
\`\`\`

## 4. Using List.sort()

\`\`\`java
list.sort((a, b) -> a.age - b.age);
\`\`\`

This is a modern and cleaner approach.

## 5. Multiple-Level Sorting

Sort by age, then by name:

\`\`\`java
list.sort((a, b) -> {
    if (a.age != b.age) {
        return a.age - b.age;
    }
    return a.name.compareTo(b.name);
});
\`\`\`

## 6. Using Comparator Methods (Cleaner)

\`\`\`java
import java.util.*;

list.sort(Comparator.comparing(s -> s.age));
\`\`\`

Descending:

\`\`\`java
list.sort(Comparator.comparing((Student s) -> s.age).reversed());
\`\`\`

## Comparable vs Comparator

- Comparable
  Inside the class
  Less flexible
  Good for default sorting

- Comparator
  Outside the class
  More flexible
  Good for custom sorting and multiple sorting strategies

## Real-Life Analogy

Think of sorting like a student ranking system.

You might sort by age, by name, by grades, or by multiple criteria depending on what matters most.

## Common Mistakes

- Using subtraction for large numbers, which can cause overflow
- Forgetting to use \`compareTo()\` for strings
- Writing overly complex lambdas when cleaner Comparator methods exist

## Key Idea

Advanced sorting lets you control how objects are ordered using Comparable and Comparator.

## Summary

- \`Comparable\` -> default sorting
- \`Comparator\` -> custom sorting
- Supports multi-level sorting
- Works with objects
- Essential for real-world apps`

const JAVA_ADVANCED_SORTING_CODE_SAMPLE = `import java.util.ArrayList;
import java.util.Comparator;

class Student {
  String name;
  int age;

  Student(String name, int age) {
    this.name = name;
    this.age = age;
  }
}

public class Main {
  public static void main(String[] args) {
    ArrayList<Student> list = new ArrayList<>();

    list.add(new Student("John", 22));
    list.add(new Student("Mary", 18));
    list.add(new Student("Alex", 25));

    list.sort(Comparator.comparing((Student s) -> s.age).thenComparing(s -> s.name));

    for (Student s : list) {
      System.out.println(s.name + " " + s.age);
    }
  }
}`

const JAVA_PROJECTS_SUMMARY =
  'Explore practical Java project ideas from beginner to career-focused builds so you can turn syntax, OOP, collections, files, and frameworks into portfolio-ready work.'

const JAVA_PROJECTS_CONTENT = `# Java Projects

## Why Build Projects?

- Apply what you have learned
- Improve problem-solving
- Build a portfolio
- Prepare for jobs and real-world apps

## Beginner Projects

### 1. Simple Calculator

Concepts:

- Variables
- Operators
- If-else and switch

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter first number: ");
        int a = sc.nextInt();

        System.out.print("Enter operator (+ - * /): ");
        char op = sc.next().charAt(0);

        System.out.print("Enter second number: ");
        int b = sc.nextInt();

        int result;

        switch(op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = a / b; break;
            default: System.out.println("Invalid"); return;
        }

        System.out.println("Result: " + result);
    }
}
\`\`\`

### 2. Number Guessing Game

Concepts:

- Loops
- Random
- Conditions

### 3. Student Grade System

Concepts:

- Arrays or ArrayList
- If-else
- Methods

## Intermediate Projects

### 4. To-Do List App

Concepts:

- ArrayList
- CRUD operations
- Loops

Features:

- Add task
- Remove task
- View tasks

### 5. Bank Management System

Concepts:

- OOP (classes and objects)
- Encapsulation
- Methods

Features:

- Create account
- Deposit and withdraw
- Check balance

### 6. Contact Management System

Concepts:

- HashMap
- File handling

Features:

- Save contacts
- Search by name
- Delete contact

## Advanced Projects

### 7. File-Based Notes App

Concepts:

- File handling
- BufferedReader and BufferedWriter

Features:

- Save notes
- Read notes
- Delete notes

### 8. Multithreaded Downloader

Concepts:

- Threads
- Networking

### 9. Chat Application

Concepts:

- Sockets
- Multithreading

### 10. Mini E-commerce System

Concepts:

- OOP
- Collections
- Sorting and filtering

Features:

- Add products
- Cart system
- Checkout

## Pro-Level Projects (Career Boosters)

### 11. REST API Backend

Use:

- Java and Spring Boot

Features:

- User authentication
- CRUD operations
- Database with MySQL

### 12. Library Management System

Concepts:

- OOP
- Collections
- File or database storage

### 13. Online Quiz System

Features:

- Questions
- Timer
- Score calculation

## How to Build Projects

- Start simple
- Add features gradually
- Break the work into small tasks
- Test as you build
- Improve the code structure over time

## Real-Life Analogy

Think of projects like gym training.

Theory is like learning the exercises.

Projects are like actually lifting the weights.

## Key Idea

Projects turn your knowledge into real skills and help make you job-ready.`

const JAVA_PROJECTS_CODE_SAMPLE = `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);

    System.out.print("Enter first number: ");
    int a = sc.nextInt();

    System.out.print("Enter operator (+ - * /): ");
    char op = sc.next().charAt(0);

    System.out.print("Enter second number: ");
    int b = sc.nextInt();

    int result;

    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = a / b; break;
      default:
        System.out.println("Invalid");
        return;
    }

    System.out.println("Result: " + result);
  }
}`

const JAVA_HOW_TOS_SUMMARY =
  "Learn practical Java How To's with quick solutions for common programming tasks, from reversing strings to sorting arrays and reading user input."

const JAVA_HOW_TOS_CONTENT = `# Java How To's

## What are How To's?

How To's are quick solutions to common programming problems.

Instead of theory, you get ready-to-use code snippets.

## 1. How to Reverse a String

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String str = "Hello";
        String reversed = "";

        for (int i = str.length() - 1; i >= 0; i--) {
            reversed += str.charAt(i);
        }

        System.out.println(reversed);
    }
}
\`\`\`

## 2. How to Count Words in a String

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String text = "Java is fun";

        String[] words = text.split(" ");

        System.out.println(words.length);
    }
}
\`\`\`

## 3. How to Check Palindrome

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String str = "madam";
        String reversed = "";

        for (int i = str.length() - 1; i >= 0; i--) {
            reversed += str.charAt(i);
        }

        if (str.equals(reversed)) {
            System.out.println("Palindrome");
        } else {
            System.out.println("Not Palindrome");
        }
    }
}
\`\`\`

## 4. How to Generate Random Numbers

\`\`\`java
import java.util.Random;

public class Main {
    public static void main(String[] args) {

        Random rand = new Random();

        int number = rand.nextInt(100);

        System.out.println(number);
    }
}
\`\`\`

## 5. How to Find Largest Number in Array

\`\`\`java
public class Main {
    public static void main(String[] args) {

        int[] numbers = {10, 50, 20, 80};

        int max = numbers[0];

        for (int num : numbers) {
            if (num > max) {
                max = num;
            }
        }

        System.out.println(max);
    }
}
\`\`\`

## 6. How to Sort an Array

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] numbers = {5, 2, 9, 1};

        Arrays.sort(numbers);

        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}
\`\`\`

## 7. How to Convert String to Integer

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String str = "123";

        int num = Integer.parseInt(str);

        System.out.println(num);
    }
}
\`\`\`

## 8. How to Remove Duplicates from List

\`\`\`java
import java.util.*;

public class Main {
    public static void main(String[] args) {

        ArrayList<Integer> list = new ArrayList<>();

        list.add(1);
        list.add(2);
        list.add(2);
        list.add(3);

        HashSet<Integer> set = new HashSet<>(list);

        System.out.println(set);
    }
}
\`\`\`

## 9. How to Read User Input

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter name: ");
        String name = sc.nextLine();

        System.out.println("Hello " + name);
    }
}
\`\`\`

## 10. How to Check Even or Odd

\`\`\`java
public class Main {
    public static void main(String[] args) {

        int num = 7;

        if (num % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of How To's like a toolbox.

Each snippet is a tool, and you pick what you need quickly to save time and effort.

## Key Idea

Java How To's provide quick solutions for common programming tasks.

## Summary

- Practical code snippets
- Solves common problems
- Easy to reuse
- Helps build real applications faster

## What You've Achieved

You have now covered:

- Core Java
- OOP
- Collections
- Advanced Java
- Threads, lambdas, and generics
- Projects and algorithms

That is already a strong job-ready foundation level.`

const JAVA_HOW_TOS_CODE_SAMPLE = `public class Main {
  public static void main(String[] args) {
    String str = "Hello";
    String reversed = "";

    for (int i = str.length() - 1; i >= 0; i--) {
      reversed += str.charAt(i);
    }

    System.out.println(reversed);
  }
}`

const JAVA_REFERENCE_SUMMARY =
  'Learn how Java references point to objects in memory, why multiple variables can share the same object, and how that affects comparison, null handling, arrays, and garbage collection.'

const JAVA_REFERENCE_CONTENT = `# Java Reference

## What is a Reference in Java?

A reference is a variable that stores the memory address of an object, not the actual value.

In simple terms:

- Primitive types store actual values
- Objects store references (addresses)

## 1. Primitive vs Reference

Primitive type:

\`\`\`java
int a = 10;
\`\`\`

\`a\` directly holds \`10\`.

Reference type:

\`\`\`java
String name = "John";
\`\`\`

\`name\` does not store \`"John"\` directly.

It stores a reference to where \`"John"\` is stored in memory.

## 2. Object References

\`\`\`java
class Car {
    String brand;
}

public class Main {
    public static void main(String[] args) {

        Car c1 = new Car();
        c1.brand = "Toyota";

        Car c2 = c1; // same reference

        System.out.println(c2.brand);
    }
}
\`\`\`

Output:

\`\`\`text
Toyota
\`\`\`

Both \`c1\` and \`c2\` point to the same object.

## 3. Same Object, Multiple References

\`\`\`java
c1.brand = "BMW";

System.out.println(c2.brand);
\`\`\`

Output:

\`\`\`text
BMW
\`\`\`

Changing the object through one reference affects the other.

## 4. Null Reference

\`\`\`java
Car c = null;

System.out.println(c.brand); // ERROR
\`\`\`

Meaning:

- \`c\` is pointing to nothing
- Accessing members through it causes an error

Output:

\`\`\`text
NullPointerException
\`\`\`

## 5. Reference Comparison

Wrong way:

\`\`\`java
String a = new String("Hi");
String b = new String("Hi");

System.out.println(a == b);
\`\`\`

\`==\` compares memory addresses.

Output:

\`\`\`text
false
\`\`\`

Correct way:

\`\`\`java
System.out.println(a.equals(b));
\`\`\`

Output:

\`\`\`text
true
\`\`\`

## 6. Reference in Arrays

\`\`\`java
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;

arr2[0] = 99;

System.out.println(arr1[0]);
\`\`\`

Output:

\`\`\`text
99
\`\`\`

Both arrays point to the same memory.

## 7. Garbage Collection

\`\`\`java
Car c1 = new Car();
c1 = null;
\`\`\`

- The object is now unreachable
- Java can automatically remove it through the garbage collector

## Real-Life Analogy

Think of references like a house and its address.

- Object = house
- Reference = address of the house

Multiple people can share the same address.

## Key Differences

- Primitive
  Stores the value itself
  Examples: \`int\`, \`char\`
  Copying duplicates the value

- Reference
  Stores an address
  Examples: \`String\`, arrays, objects
  Copying duplicates the address, not the object

## Key Idea

Java references point to objects in memory, and multiple references can point to the same object.

## Common Mistakes

- Using \`==\` instead of \`.equals()\` for object values
- Forgetting null checks
- Thinking objects are copied when assigned

## Summary

- Reference = memory address of an object
- Multiple references can share one object
- \`==\` compares addresses
- \`.equals()\` compares values
- Null references cause errors

## Where This Leads

Understanding references helps with:

- OOP mastery
- Collections behavior
- Memory management
- Real backend systems
- Debugging complex bugs`

const JAVA_REFERENCE_CODE_SAMPLE = `class Car {
  String brand;
}

public class Main {
  public static void main(String[] args) {
    Car c1 = new Car();
    c1.brand = "Toyota";

    Car c2 = c1;
    c1.brand = "BMW";

    System.out.println(c2.brand);
  }
}`

const JAVA_KEYWORDS_SUMMARY =
  'Learn what Java keywords are, why they are reserved, and how they define data types, control flow, OOP structure, modifiers, exceptions, and program organization.'

const JAVA_KEYWORDS_CONTENT = `# Java Keywords

## What are Java Keywords?

Java keywords are reserved words that have a special meaning in the language.

You cannot use them as variable names, class names, or method names.

Invalid example:

\`\`\`java
int class = 10;   // ERROR
\`\`\`

\`class\` is a keyword.

Correct example:

\`\`\`java
int number = 10;
\`\`\`

## Java Keyword List (Main Ones)

Java has more than 50 keywords, but here are some of the most important ones.

### 1. Data Type Keywords

- \`int\`
- \`float\`
- \`double\`
- \`char\`
- \`boolean\`
- \`byte\`
- \`short\`
- \`long\`

### 2. Control Flow Keywords

- \`if\`
- \`else\`
- \`switch\`
- \`case\`
- \`for\`
- \`while\`
- \`do\`
- \`break\`
- \`continue\`
- \`return\`

### 3. Object-Oriented Keywords

- \`class\`
- \`interface\`
- \`extends\`
- \`implements\`
- \`new\`
- \`this\`
- \`super\`

### 4. Access Modifiers

- \`public\`
- \`private\`
- \`protected\`

### 5. Non-Access Modifiers

- \`static\`
- \`final\`
- \`abstract\`
- \`synchronized\`
- \`volatile\`

### 6. Exception Handling

- \`try\`
- \`catch\`
- \`finally\`
- \`throw\`
- \`throws\`

### 7. Package Related

- \`package\`
- \`import\`

### 8. Boolean and Return Control

- \`true\`
- \`false\`
- \`null\`

## 1. Example Using Keywords

\`\`\`java
public class Main {

    public static void main(String[] args) {

        int number = 10;

        if (number > 5) {
            System.out.println("Greater than 5");
        } else {
            System.out.println("Less or equal to 5");
        }
    }
}
\`\`\`

## 2. Keywords in Action (OOP Example)

\`\`\`java
class Car {
    String brand;

    void show() {
        System.out.println("Car brand: " + brand);
    }
}
\`\`\`

## 3. Why Keywords Matter

They define the structure of Java programs.

Without keywords, Java would not understand:

- classes
- loops
- conditions
- objects
- errors

## Real-Life Analogy

Think of keywords like building blocks of a house.

You cannot replace bricks with random objects, because each keyword has a fixed meaning and role.

## Important Rules

- You cannot rename keywords
- You cannot use them as identifiers
- They are case-sensitive, so \`class\` is not the same as \`Class\`

## Common Mistakes

- Writing \`Int\` instead of \`int\`
- Using \`Class\` as a variable name
- Confusing \`static\` and \`this\`

## Key Idea

Java keywords are reserved words that define the structure and rules of the language.

## Summary

- Reserved words in Java
- Have fixed meanings
- Cannot be used as names
- Control structure, OOP, logic, and exceptions
- Essential for writing correct Java code

## Where This Leads You

Once you understand keywords, you are ready for:

- Full OOP mastery
- Frameworks like Spring Boot
- Real backend systems
- Interview questions`

const JAVA_KEYWORDS_CODE_SAMPLE = `public class Main {
  public static void main(String[] args) {
    int number = 10;

    if (number > 5) {
      System.out.println("Greater than 5");
    } else {
      System.out.println("Less or equal to 5");
    }
  }
}`

const JAVA_STRING_METHODS_SUMMARY =
  'Learn the most useful Java String methods for checking length, changing case, extracting text, comparing values, splitting data, and handling real app input.'

const JAVA_STRING_METHODS_CONTENT = `# Java String Methods

## What is a String in Java?

A String is a sequence of characters.

\`\`\`java
String name = "Hello";
\`\`\`

Strings are objects in Java, not primitive types.

## Most Important String Methods

### 1. \`length()\`

Finds the number of characters.

\`\`\`java
String text = "Java";
System.out.println(text.length());
\`\`\`

Output:

\`\`\`text
4
\`\`\`

### 2. \`toUpperCase()\`

Converts text to uppercase.

\`\`\`java
System.out.println("java".toUpperCase());
\`\`\`

Output:

\`\`\`text
JAVA
\`\`\`

### 3. \`toLowerCase()\`

\`\`\`java
System.out.println("JAVA".toLowerCase());
\`\`\`

Output:

\`\`\`text
java
\`\`\`

### 4. \`charAt()\`

Gets a character at a position.

\`\`\`java
String name = "Java";
System.out.println(name.charAt(1));
\`\`\`

Output:

\`\`\`text
a
\`\`\`

### 5. \`indexOf()\`

Finds the position of a character or text.

\`\`\`java
System.out.println("Java".indexOf("a"));
\`\`\`

Output:

\`\`\`text
1
\`\`\`

### 6. \`lastIndexOf()\`

\`\`\`java
System.out.println("banana".lastIndexOf("a"));
\`\`\`

Output:

\`\`\`text
5
\`\`\`

### 7. \`substring()\`

Extracts part of a string.

\`\`\`java
String text = "Programming";
System.out.println(text.substring(0, 4));
\`\`\`

Output:

\`\`\`text
Prog
\`\`\`

### 8. \`contains()\`

Checks whether text exists inside the string.

\`\`\`java
System.out.println("Java is fun".contains("Java"));
\`\`\`

Output:

\`\`\`text
true
\`\`\`

### 9. \`equals()\`

Compares actual content.

\`\`\`java
String a = "Java";
String b = "Java";

System.out.println(a.equals(b));
\`\`\`

Output:

\`\`\`text
true
\`\`\`

### 10. \`equalsIgnoreCase()\`

\`\`\`java
System.out.println("JAVA".equalsIgnoreCase("java"));
\`\`\`

Output:

\`\`\`text
true
\`\`\`

### 11. \`replace()\`

Replaces characters or text.

\`\`\`java
System.out.println("Java".replace("a", "o"));
\`\`\`

Output:

\`\`\`text
Jovo
\`\`\`

### 12. \`trim()\`

Removes spaces at the beginning and end.

\`\`\`java
System.out.println("  Java  ".trim());
\`\`\`

Output:

\`\`\`text
Java
\`\`\`

### 13. \`split()\`

Breaks a string into parts.

\`\`\`java
String text = "apple,banana,mango";
String[] fruits = text.split(",");

System.out.println(fruits[1]);
\`\`\`

Output:

\`\`\`text
banana
\`\`\`

### 14. \`isEmpty()\`

\`\`\`java
System.out.println("".isEmpty());
\`\`\`

Output:

\`\`\`text
true
\`\`\`

### 15. \`concat()\`

\`\`\`java
System.out.println("Hello".concat(" World"));
\`\`\`

Output:

\`\`\`text
Hello World
\`\`\`

## Real-Life Example (Login Check)

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String username = "admin";
        String input = "Admin";

        if (username.equalsIgnoreCase(input)) {
            System.out.println("Login successful");
        } else {
            System.out.println("Login failed");
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of String methods like tools for editing text.

- \`substring()\` cuts text
- \`indexOf()\` searches text
- \`toUpperCase()\` and \`toLowerCase()\` change case
- \`replace()\` changes words or characters
- \`split()\` breaks text apart

## Common Mistakes

- Using \`==\` instead of \`equals()\`
- Forgetting that strings are immutable
- Using wrong indexes with \`substring()\`

## Key Idea

String methods help you search, modify, and analyze text efficiently in Java.

## Summary

- Strings are objects
- Java provides many built-in String methods
- String methods are used in almost every Java program
- They are important for real apps such as login, search, and validation`

const JAVA_STRING_METHODS_CODE_SAMPLE = `public class Main {
  public static void main(String[] args) {
    String username = "admin";
    String input = "Admin";

    if (username.equalsIgnoreCase(input)) {
      System.out.println("Login successful");
    } else {
      System.out.println("Login failed");
    }
  }
}`

const JAVA_MATH_METHODS_SUMMARY =
  'Learn the most useful Java Math methods for comparisons, powers, roots, rounding, randomness, and constants so you can solve real calculation problems quickly.'

const JAVA_MATH_METHODS_CONTENT = `# Java Math Methods

## What is Math in Java?

Math is a built-in class in Java that provides mathematical functions such as:

- rounding
- powers
- square roots
- random numbers
- max and min

You do not need to create an object.

\`\`\`java
Math.methodName()
\`\`\`

## 1. \`Math.max()\`

Returns the larger number.

\`\`\`java
public class Main {
    public static void main(String[] args) {

        System.out.println(Math.max(10, 20));
    }
}
\`\`\`

Output:

\`\`\`text
20
\`\`\`

## 2. \`Math.min()\`

\`\`\`java
System.out.println(Math.min(10, 20));
\`\`\`

Output:

\`\`\`text
10
\`\`\`

## 3. \`Math.sqrt()\`

Square root:

\`\`\`java
System.out.println(Math.sqrt(25));
\`\`\`

Output:

\`\`\`text
5.0
\`\`\`

## 4. \`Math.pow()\`

Power or exponent:

\`\`\`java
System.out.println(Math.pow(2, 3));
\`\`\`

Output:

\`\`\`text
8.0
\`\`\`

## 5. \`Math.abs()\`

Absolute value removes the negative sign.

\`\`\`java
System.out.println(Math.abs(-10));
\`\`\`

Output:

\`\`\`text
10
\`\`\`

## 6. \`Math.round()\`

Rounds to the nearest integer.

\`\`\`java
System.out.println(Math.round(4.6));
\`\`\`

Output:

\`\`\`text
5
\`\`\`

## 7. \`Math.ceil()\`

Always rounds up.

\`\`\`java
System.out.println(Math.ceil(4.1));
\`\`\`

Output:

\`\`\`text
5.0
\`\`\`

## 8. \`Math.floor()\`

Always rounds down.

\`\`\`java
System.out.println(Math.floor(4.9));
\`\`\`

Output:

\`\`\`text
4.0
\`\`\`

## 9. \`Math.random()\`

Generates a random number between \`0.0\` and \`1.0\`.

\`\`\`java
System.out.println(Math.random());
\`\`\`

Example output:

\`\`\`text
0.732918...
\`\`\`

Random number in range:

\`\`\`java
int num = (int)(Math.random() * 100) + 1;
System.out.println(num);
\`\`\`

## 10. \`Math.PI\`

Value of pi:

\`\`\`java
System.out.println(Math.PI);
\`\`\`

Output:

\`\`\`text
3.141592653589793
\`\`\`

## Real-Life Example: Area of Circle

\`\`\`java
public class Main {
    public static void main(String[] args) {

        double radius = 5;

        double area = Math.PI * Math.pow(radius, 2);

        System.out.println(area);
    }
}
\`\`\`

## Real-Life Analogy

Think of Math like a built-in calculator brain.

You do not build the math tools yourself. You just call what you need instantly.

## Common Mistakes

- Forgetting the \`Math.\` prefix
- Confusing \`ceil()\` and \`floor()\`
- Expecting \`random()\` to give integers directly
- Forgetting to cast \`Math.random()\` when needed

## Key Idea

The Java Math class provides ready-made functions for fast and accurate calculations.

## Summary

- \`max()\` and \`min()\` compare numbers
- \`sqrt()\` and \`pow()\` perform calculations
- \`round()\`, \`ceil()\`, and \`floor()\` handle rounding
- \`random()\` handles randomness
- \`PI\` gives a constant value

## Where This Leads

Once you understand Math, you are ready for:

- Algorithms such as sorting and searching
- Games with random logic
- Data science basics
- Backend calculations
- Competitive programming`

const JAVA_MATH_METHODS_CODE_SAMPLE = `public class Main {
  public static void main(String[] args) {
    double radius = 5;
    double area = Math.PI * Math.pow(radius, 2);

    System.out.println(area);
  }
}`

const JAVA_OUTPUT_METHODS_SUMMARY =
  'Learn how Java output methods like print, println, and printf control formatting, line breaks, and structured text display in real programs.'

const JAVA_OUTPUT_METHODS_CONTENT = `# Java Output Methods

## 1. \`System.out.println()\`

Prints output and moves to the next line.

\`\`\`java
public class Main {
    public static void main(String[] args) {

        System.out.println("Hello");
        System.out.println("World");
    }
}
\`\`\`

Output:

\`\`\`text
Hello
World
\`\`\`

## 2. \`System.out.print()\`

Prints output on the same line.

\`\`\`java
public class Main {
    public static void main(String[] args) {

        System.out.print("Hello ");
        System.out.print("World");
    }
}
\`\`\`

Output:

\`\`\`text
Hello World
\`\`\`

## 3. \`System.out.printf()\`

Formatted output is very useful.

\`\`\`java
public class Main {
    public static void main(String[] args) {

        int age = 20;

        System.out.printf("I am %d years old", age);
    }
}
\`\`\`

Output:

\`\`\`text
I am 20 years old
\`\`\`

## Common Format Specifiers

- \`%d\` -> Integer
- \`%f\` -> Float or double
- \`%s\` -> String
- \`%c\` -> Character

Example with multiple values:

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String name = "John";
        int age = 25;

        System.out.printf("Name: %s, Age: %d", name, age);
    }
}
\`\`\`

Output:

\`\`\`text
Name: John, Age: 25
\`\`\`

## 4. Escape Sequences

Escape sequences are used inside output strings.

- \`\\n\` -> New line
- \`\\t\` -> Tab space
- \`\\\\\` -> Backslash
- \`\\"\` -> Double quote

Example:

\`\`\`java
public class Main {
    public static void main(String[] args) {

        System.out.println("Hello\\nWorld");
    }
}
\`\`\`

Output:

\`\`\`text
Hello
World
\`\`\`

## 5. Concatenation in Output

Joining text and variables:

\`\`\`java
public class Main {
    public static void main(String[] args) {

        int score = 90;

        System.out.println("Score: " + score);
    }
}
\`\`\`

## Real-Life Example (Login System Output)

\`\`\`java
public class Main {
    public static void main(String[] args) {

        String user = "admin";

        System.out.println("Welcome, " + user + "!");
    }
}
\`\`\`

Output:

\`\`\`text
Welcome, admin!
\`\`\`

## Real-Life Analogy

Think of output methods like a printer system.

- \`print()\` keeps printing on the same line
- \`println()\` prints and moves down
- \`printf()\` creates structured formatted output

## Common Mistakes

- Forgetting quotes
- Using \`%d\` for strings
- Mixing \`print()\` and \`println()\` without planning the output
- Forgetting to escape special characters

## Key Idea

Java output methods control how data is displayed to users or developers.

## Summary

- \`println()\` -> new line output
- \`print()\` -> same line output
- \`printf()\` -> formatted output
- Escape sequences control formatting
- These methods are used in all Java programs`

const JAVA_OUTPUT_METHODS_CODE_SAMPLE = `public class Main {
  public static void main(String[] args) {
    String name = "John";
    int age = 25;

    System.out.printf("Name: %s, Age: %d", name, age);
  }
}`

const JAVA_ARRAYS_METHODS_SUMMARY =
  'Learn the most useful Java Arrays class methods for printing, sorting, searching, filling, comparing, copying, and working with multidimensional arrays.'

const JAVA_ARRAYS_METHODS_CONTENT = `# Java Array Methods

## What is an Array?

An array is a container that stores multiple values of the same type.

\`\`\`java
int[] numbers = {10, 20, 30, 40};
\`\`\`

## Important Array Methods (from Arrays class)

In Java, most array methods come from:

\`\`\`java
java.util.Arrays
\`\`\`

So you use:

\`\`\`java
Arrays.methodName()
\`\`\`

## 1. \`Arrays.toString()\`

Prints an array properly.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] arr = {1, 2, 3, 4};

        System.out.println(Arrays.toString(arr));
    }
}
\`\`\`

Output:

\`\`\`text
[1, 2, 3, 4]
\`\`\`

## 2. \`Arrays.sort()\`

Sorts an array in ascending order.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] arr = {5, 2, 9, 1};

        Arrays.sort(arr);

        System.out.println(Arrays.toString(arr));
    }
}
\`\`\`

Output:

\`\`\`text
[1, 2, 5, 9]
\`\`\`

## 3. \`Arrays.binarySearch()\`

Finds the index of an element, but the array must be sorted first.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] arr = {1, 2, 5, 9};

        int index = Arrays.binarySearch(arr, 5);

        System.out.println(index);
    }
}
\`\`\`

Output:

\`\`\`text
2
\`\`\`

## 4. \`Arrays.fill()\`

Fills an array with the same value.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] arr = new int[5];

        Arrays.fill(arr, 7);

        System.out.println(Arrays.toString(arr));
    }
}
\`\`\`

Output:

\`\`\`text
[7, 7, 7, 7, 7]
\`\`\`

## 5. \`Arrays.equals()\`

Compares two arrays.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] a = {1, 2, 3};
        int[] b = {1, 2, 3};

        System.out.println(Arrays.equals(a, b));
    }
}
\`\`\`

Output:

\`\`\`text
true
\`\`\`

## 6. \`Arrays.copyOf()\`

Copies an array.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] arr = {1, 2, 3};

        int[] copy = Arrays.copyOf(arr, 5);

        System.out.println(Arrays.toString(copy));
    }
}
\`\`\`

Output:

\`\`\`text
[1, 2, 3, 0, 0]
\`\`\`

## 7. \`Arrays.copyOfRange()\`

Copies part of an array.

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[] arr = {10, 20, 30, 40, 50};

        int[] part = Arrays.copyOfRange(arr, 1, 4);

        System.out.println(Arrays.toString(part));
    }
}
\`\`\`

Output:

\`\`\`text
[20, 30, 40]
\`\`\`

## 8. Multidimensional Arrays

Print a 2D array:

\`\`\`java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {

        int[][] matrix = {
            {1, 2},
            {3, 4}
        };

        System.out.println(Arrays.deepToString(matrix));
    }
}
\`\`\`

Output:

\`\`\`text
[[1, 2], [3, 4]]
\`\`\`

## Real-Life Analogy

Think of arrays like a box of items.

- \`sort()\` organizes items
- \`fill()\` puts the same item everywhere
- \`copyOf()\` duplicates the box
- \`binarySearch()\` finds an item inside

## Common Mistakes

- Printing an array without \`Arrays.toString()\`
- Using \`binarySearch()\` on an unsorted array
- Confusing shallow copy and deep copy
- Forgetting \`import java.util.Arrays\`

## Key Idea

Java array methods through the Arrays class help you manipulate, search, sort, and copy arrays easily.

## Summary

- \`toString()\` prints arrays
- \`sort()\` arranges data
- \`binarySearch()\` finds elements
- \`fill()\` sets values
- \`equals()\` compares arrays
- \`copyOf()\` duplicates arrays`

const JAVA_ARRAYS_METHODS_CODE_SAMPLE = `import java.util.Arrays;

public class Main {
  public static void main(String[] args) {
    int[] arr = {5, 2, 9, 1};

    Arrays.sort(arr);

    System.out.println(Arrays.toString(arr));
  }
}`

const JAVA_ARRAY_LIST_METHODS_SUMMARY =
  'Learn the most useful Java ArrayList methods for adding, reading, updating, removing, checking, sorting, and converting flexible lists of objects.'

const JAVA_ARRAY_LIST_METHODS_CONTENT = `# Java ArrayList Methods

## What is ArrayList?

ArrayList is part of the Java Collections Framework and is used to store dynamic lists of objects.

Unlike arrays, it can grow automatically.

\`\`\`java
import java.util.ArrayList;
\`\`\`

## 1. Creating an ArrayList

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        ArrayList<String> names = new ArrayList<>();

        names.add("John");
        names.add("Mary");

        System.out.println(names);
    }
}
\`\`\`

Output:

\`\`\`text
[John, Mary]
\`\`\`

## 2. \`add()\` - Add Elements

\`\`\`java
names.add("Alex");
\`\`\`

Adds an item to the list.

## 3. \`get()\` - Access Elements

\`\`\`java
System.out.println(names.get(0));
\`\`\`

Output:

\`\`\`text
John
\`\`\`

## 4. \`set()\` - Update Element

\`\`\`java
names.set(1, "Jane");
\`\`\`

Replaces the value at an index.

## 5. \`remove()\` - Delete Element

\`\`\`java
names.remove(0);
\`\`\`

Removes an item by index.

## 6. \`size()\` - Get Length

\`\`\`java
System.out.println(names.size());
\`\`\`

Output:

\`\`\`text
2
\`\`\`

## 7. \`clear()\` - Remove All Items

\`\`\`java
names.clear();
\`\`\`

Empties the list.

## 8. \`contains()\` - Check Element

\`\`\`java
System.out.println(names.contains("John"));
\`\`\`

Output:

\`\`\`text
true / false
\`\`\`

## 9. \`indexOf()\` - Find Position

\`\`\`java
System.out.println(names.indexOf("Mary"));
\`\`\`

Output:

\`\`\`text
1
\`\`\`

## 10. Loop Through ArrayList

Using a for loop:

\`\`\`java
for (int i = 0; i < names.size(); i++) {
    System.out.println(names.get(i));
}
\`\`\`

Using a for-each loop:

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

## 11. Sorting ArrayList

\`\`\`java
import java.util.Collections;

Collections.sort(names);
\`\`\`

Sorts alphabetically.

## 12. Reverse ArrayList

\`\`\`java
Collections.reverse(names);
\`\`\`

## 13. Convert ArrayList to Array

\`\`\`java
String[] arr = names.toArray(new String[0]);
\`\`\`

## 14. Remove by Value

\`\`\`java
names.remove("John");
\`\`\`

Removes the first matching value.

## 15. Check if Empty

\`\`\`java
System.out.println(names.isEmpty());
\`\`\`

## Real-Life Example (Student List System)

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        ArrayList<String> students = new ArrayList<>();

        students.add("Ama");
        students.add("Kofi");
        students.add("Yaw");

        students.remove("Kofi");

        for (String s : students) {
            System.out.println(s);
        }
    }
}
\`\`\`

## Real-Life Analogy

Think of ArrayList like a notebook.

You can:

- add pages
- remove pages
- edit pages
- rearrange pages

Unlike arrays, which are fixed in size, ArrayList is flexible.

## Common Mistakes

- Forgetting \`import java.util.ArrayList\`
- Confusing \`size()\` with \`length\`
- Using primitive types directly instead of wrappers like \`Integer\`
- Causing index out of bounds errors

## Key Idea

ArrayList is a dynamic, flexible list that allows easy adding, removing, and updating of elements.

## Summary

- \`add()\` inserts
- \`get()\` accesses
- \`set()\` updates
- \`remove()\` deletes
- \`size()\` gets the length
- \`contains()\` checks for an item
- \`sort()\` arranges values`

const JAVA_ARRAY_LIST_METHODS_CODE_SAMPLE = `import java.util.ArrayList;

public class Main {
  public static void main(String[] args) {
    ArrayList<String> students = new ArrayList<>();

    students.add("Ama");
    students.add("Kofi");
    students.add("Yaw");

    students.remove("Kofi");

    for (String s : students) {
      System.out.println(s);
    }
  }
}`

const JAVA_LINKED_LIST_METHODS_SUMMARY =
  'Learn the most useful Java LinkedList methods for adding, accessing, removing, looping, reversing, and comparing node-based lists with ArrayList.'

const JAVA_LINKED_LIST_METHODS_CONTENT = `# Java LinkedList Methods

## What is a LinkedList?

A LinkedList is a data structure where each element (node) is connected to the next one.

Unlike ArrayList:

- It is not stored in continuous memory
- It is faster for insert and delete operations in the middle
- It is slower for random access

## Creating a LinkedList

\`\`\`java
import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {

        LinkedList<String> list = new LinkedList<>();

        list.add("A");
        list.add("B");
        list.add("C");

        System.out.println(list);
    }
}
\`\`\`

## 1. \`add()\` - Add Elements

\`\`\`java
list.add("D");
\`\`\`

## 2. \`addFirst()\` - Add at Beginning

\`\`\`java
list.addFirst("Start");
\`\`\`

## 3. \`addLast()\` - Add at End

\`\`\`java
list.addLast("End");
\`\`\`

## 4. \`get()\` - Access Element

\`\`\`java
System.out.println(list.get(1));
\`\`\`

## 5. \`getFirst()\` - First Element

\`\`\`java
System.out.println(list.getFirst());
\`\`\`

## 6. \`getLast()\` - Last Element

\`\`\`java
System.out.println(list.getLast());
\`\`\`

## 7. \`remove()\` - Remove Element

\`\`\`java
list.remove("B");
\`\`\`

## 8. \`removeFirst()\`

\`\`\`java
list.removeFirst();
\`\`\`

## 9. \`removeLast()\`

\`\`\`java
list.removeLast();
\`\`\`

## 10. \`size()\` - Count Elements

\`\`\`java
System.out.println(list.size());
\`\`\`

## 11. \`contains()\` - Check Element

\`\`\`java
System.out.println(list.contains("A"));
\`\`\`

## 12. \`clear()\` - Remove All

\`\`\`java
list.clear();
\`\`\`

## 13. Loop Through LinkedList

For-each loop:

\`\`\`java
for (String item : list) {
    System.out.println(item);
}
\`\`\`

Using Iterator:

\`\`\`java
import java.util.Iterator;

Iterator<String> it = list.iterator();

while (it.hasNext()) {
    System.out.println(it.next());
}
\`\`\`

## 14. Reverse LinkedList

\`\`\`java
import java.util.Collections;

Collections.reverse(list);
\`\`\`

## 15. Convert to Array

\`\`\`java
String[] arr = list.toArray(new String[0]);
\`\`\`

## Real-Life Example (Playlist System)

\`\`\`java
import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {

        LinkedList<String> playlist = new LinkedList<>();

        playlist.add("Song A");
        playlist.add("Song B");
        playlist.addFirst("Intro Song");
        playlist.addLast("Outro Song");

        playlist.remove("Song B");

        for (String song : playlist) {
            System.out.println(song);
        }
    }
}
\`\`\`

## ArrayList vs LinkedList

- ArrayList
  Dynamic array
  Fast access
  Slower insert and delete in the middle
  Best for read-heavy work

- LinkedList
  Node-based structure
  Slower access
  Faster insert and delete in the middle
  Best for frequent dynamic changes

## Real-Life Analogy

Think of LinkedList like a chain of links.

Each item knows the next one, so it is easy to insert or remove links, but you still have to follow the chain to find items.

## Common Mistakes

- Using LinkedList when you need fast random access
- Confusing LinkedList with ArrayList
- Forgetting that LinkedList uses nodes, not direct index-based storage internally

## Key Idea

LinkedList is best for frequent insertions and deletions, not fast searching.

## Summary

- Node-based structure
- \`addFirst()\` and \`addLast()\`
- \`removeFirst()\` and \`removeLast()\`
- Slower access than ArrayList
- Better for dynamic changes`

const JAVA_LINKED_LIST_METHODS_CODE_SAMPLE = `import java.util.LinkedList;

public class Main {
  public static void main(String[] args) {
    LinkedList<String> playlist = new LinkedList<>();

    playlist.add("Song A");
    playlist.add("Song B");
    playlist.addFirst("Intro Song");
    playlist.addLast("Outro Song");

    playlist.remove("Song B");

    for (String song : playlist) {
      System.out.println(song);
    }
  }
}`

const JAVA_HASH_MAP_METHODS_SUMMARY =
  'Learn the most useful Java HashMap methods for storing, updating, checking, looping through, and retrieving key-value data efficiently.'

const JAVA_HASH_MAP_METHODS_CONTENT = `# Java HashMap Methods

## What is HashMap?

A HashMap stores data in key-value pairs.

Example:

\`\`\`text
"name" -> "John"
"age" -> 20
\`\`\`

- Keys must be unique
- Values can repeat
- No guaranteed order

## Creating a HashMap

\`\`\`java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {

        HashMap<String, Integer> map = new HashMap<>();

        map.put("John", 20);
        map.put("Mary", 22);

        System.out.println(map);
    }
}
\`\`\`

## 1. \`put()\` - Add or Update Value

\`\`\`java
map.put("Alex", 25);
\`\`\`

If the key exists, it updates the value.

If the key does not exist, it adds a new entry.

## 2. \`get()\` - Retrieve Value

\`\`\`java
System.out.println(map.get("John"));
\`\`\`

Output:

\`\`\`text
20
\`\`\`

## 3. \`remove()\` - Delete Entry

\`\`\`java
map.remove("Mary");
\`\`\`

## 4. \`containsKey()\` - Check if Key Exists

\`\`\`java
System.out.println(map.containsKey("John"));
\`\`\`

Output:

\`\`\`text
true
\`\`\`

## 5. \`containsValue()\` - Check if Value Exists

\`\`\`java
System.out.println(map.containsValue(20));
\`\`\`

## 6. \`size()\` - Number of Entries

\`\`\`java
System.out.println(map.size());
\`\`\`

## 7. \`clear()\` - Remove Everything

\`\`\`java
map.clear();
\`\`\`

## 8. \`isEmpty()\` - Check if Empty

\`\`\`java
System.out.println(map.isEmpty());
\`\`\`

## 9. \`keySet()\` - Get All Keys

\`\`\`java
for (String key : map.keySet()) {
    System.out.println(key);
}
\`\`\`

Output:

\`\`\`text
John
Mary
\`\`\`

## 10. \`values()\` - Get All Values

\`\`\`java
for (Integer value : map.values()) {
    System.out.println(value);
}
\`\`\`

## 11. \`entrySet()\` - Keys and Values Together

\`\`\`java
for (HashMap.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}
\`\`\`

## 12. \`replace()\` - Update Value

\`\`\`java
map.replace("John", 30);
\`\`\`

## 13. \`putIfAbsent()\` - Add Only If Missing

\`\`\`java
map.putIfAbsent("Kofi", 18);
\`\`\`

## Real-Life Example (Student Grades System)

\`\`\`java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {

        HashMap<String, Integer> grades = new HashMap<>();

        grades.put("Ama", 85);
        grades.put("Kofi", 70);
        grades.put("Yaw", 90);

        grades.replace("Kofi", 75);

        for (String name : grades.keySet()) {
            System.out.println(name + " scored " + grades.get(name));
        }
    }
}
\`\`\`

## HashMap vs LinkedList vs ArrayList

- ArrayList
  Structure: list
  Access: index
  Order: yes
  Best for lists

- LinkedList
  Structure: list
  Access: node-based
  Order: yes
  Best for insert and delete operations

- HashMap
  Structure: key-value pairs
  Access: key
  Order: no guaranteed order
  Best for fast lookup

## Real-Life Analogy

Think of HashMap like a dictionary or a contacts app.

- Word -> meaning
- Name -> phone number

## Common Mistakes

- Using duplicate keys
- Expecting ordered output
- Confusing \`keySet()\` and \`values()\`
- Forgetting generics like \`HashMap<String, Integer>\`

## Key Idea

HashMap is one of the fastest ways to store and retrieve data using a key.

## Summary

- \`put()\` adds or updates
- \`get()\` retrieves
- \`remove()\` deletes
- \`keySet()\` gives keys only
- \`values()\` gives values only
- \`entrySet()\` gives both keys and values`

const JAVA_HASH_MAP_METHODS_CODE_SAMPLE = `import java.util.HashMap;

public class Main {
  public static void main(String[] args) {
    HashMap<String, Integer> grades = new HashMap<>();

    grades.put("Ama", 85);
    grades.put("Kofi", 70);
    grades.put("Yaw", 90);

    grades.replace("Kofi", 75);

    for (String name : grades.keySet()) {
      System.out.println(name + " scored " + grades.get(name));
    }
  }
}`

const JAVA_SCANNER_METHODS_SUMMARY =
  'Learn the most useful Java Scanner methods for reading numbers, words, lines, booleans, and validated input from users safely.'

const JAVA_SCANNER_METHODS_CONTENT = `# Java Scanner Methods

## What is Scanner?

Scanner is a class used to take input from the user through the keyboard, files, and other input sources.

The most common use is keyboard input.

## Import Scanner

\`\`\`java
import java.util.Scanner;
\`\`\`

## Creating a Scanner Object

\`\`\`java
Scanner input = new Scanner(System.in);
\`\`\`

## 1. \`nextInt()\` - Read Integer

\`\`\`java
int age = input.nextInt();
\`\`\`

Reads whole numbers.

## 2. \`nextDouble()\` - Read Decimal

\`\`\`java
double price = input.nextDouble();
\`\`\`

## 3. \`next()\` - Read Single Word

\`\`\`java
String name = input.next();
\`\`\`

Stops at a space.

Example:

\`\`\`text
John Doe
\`\`\`

Only \`John\` would be read.

## 4. \`nextLine()\` - Read Full Line

\`\`\`java
String fullName = input.nextLine();
\`\`\`

Reads everything including spaces.

Example:

\`\`\`text
John Doe
\`\`\`

## Scanner Trap

When you use \`nextInt()\` before \`nextLine()\`, the next line input may be skipped.

Fix:

\`\`\`java
int age = input.nextInt();
input.nextLine(); // clear buffer
String name = input.nextLine();
\`\`\`

## 5. \`nextBoolean()\` - Read True or False

\`\`\`java
boolean isStudent = input.nextBoolean();
\`\`\`

Input example:

\`\`\`text
true
\`\`\`

## 6. \`nextFloat()\` - Read Float

\`\`\`java
float weight = input.nextFloat();
\`\`\`

## 7. \`hasNext()\` - Check If Input Exists

\`\`\`java
while (input.hasNext()) {
    System.out.println(input.next());
}
\`\`\`

## 8. \`hasNextInt()\` - Check Integer Input

\`\`\`java
if (input.hasNextInt()) {
    int num = input.nextInt();
}
\`\`\`

## Full Example Program

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = input.nextLine();

        System.out.print("Enter your age: ");
        int age = input.nextInt();

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
    }
}
\`\`\`

## Real-Life Analogy

Think of Scanner like a microphone for your program.

The user speaks by entering data, and Scanner listens and records it.

## Common Mistakes

- Mixing \`nextLine()\` with \`nextInt()\` without clearing the buffer
- Using \`next()\` when a full sentence is needed
- Forgetting to import Scanner
- Forgetting to close Scanner when appropriate

## Good Practice

\`\`\`java
input.close();
\`\`\`

This frees resources.

## Key Idea

Scanner is used to capture user input from the keyboard in Java programs.

## Summary

- \`nextInt()\` reads numbers
- \`nextDouble()\` reads decimals
- \`next()\` reads one word
- \`nextLine()\` reads a full sentence
- \`hasNext()\` checks whether input exists`

const JAVA_SCANNER_METHODS_CODE_SAMPLE = `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);

    System.out.print("Enter your name: ");
    String name = input.nextLine();

    System.out.print("Enter your age: ");
    int age = input.nextInt();

    System.out.println("Name: " + name);
    System.out.println("Age: " + age);

    input.close();
  }
}`

const JAVA_FILE_METHODS_SUMMARY =
  'Learn the core Java File methods for creating, checking, deleting, and inspecting files and folders without yet reading or writing their contents.'

const JAVA_FILE_METHODS_CONTENT = `# Java File Methods (File Handling Basics)

## What is the File class?

Java uses the \`File\` class to create, check, delete, and get information about files and folders.

Import first:

\`\`\`java
import java.io.File;
import java.io.IOException;
\`\`\`

## 1. Create a File Object

\`\`\`java
File file = new File("myfile.txt");
\`\`\`

This does not create the file yet.

It only creates a reference to that path.

## 2. \`createNewFile()\` - Create File

\`\`\`java
File file = new File("myfile.txt");

try {
    if (file.createNewFile()) {
        System.out.println("File created successfully");
    } else {
        System.out.println("File already exists");
    }
} catch (IOException e) {
    System.out.println("Error occurred");
}
\`\`\`

## 3. \`exists()\` - Check File Exists

\`\`\`java
System.out.println(file.exists());
\`\`\`

Output:

\`\`\`text
true / false
\`\`\`

## 4. \`getName()\` - Get File Name

\`\`\`java
System.out.println(file.getName());
\`\`\`

## 5. \`getAbsolutePath()\` - Full Path

\`\`\`java
System.out.println(file.getAbsolutePath());
\`\`\`

Shows the full file location.

## 6. \`length()\` - File Size

\`\`\`java
System.out.println(file.length());
\`\`\`

Returns the size in bytes.

## 7. \`canRead()\` - Check Read Permission

\`\`\`java
System.out.println(file.canRead());
\`\`\`

## 8. \`canWrite()\` - Check Write Permission

\`\`\`java
System.out.println(file.canWrite());
\`\`\`

## 9. \`isFile()\` - Check if It Is a File

\`\`\`java
System.out.println(file.isFile());
\`\`\`

## 10. \`isDirectory()\` - Check if It Is a Folder

\`\`\`java
System.out.println(file.isDirectory());
\`\`\`

## 11. \`delete()\` - Delete File

\`\`\`java
if (file.delete()) {
    System.out.println("File deleted");
} else {
    System.out.println("Failed to delete file");
}
\`\`\`

## 12. Create Folder (Directory)

\`\`\`java
File folder = new File("myFolder");

if (folder.mkdir()) {
    System.out.println("Folder created");
}
\`\`\`

## 13. Create Nested Folders

\`\`\`java
File folders = new File("parent/child/grandchild");

folders.mkdirs();
\`\`\`

This creates multiple directories at once.

## Full Example Program

\`\`\`java
import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {

        File file = new File("test.txt");

        try {
            if (file.createNewFile()) {
                System.out.println("File created");
            } else {
                System.out.println("File already exists");
            }
        } catch (IOException e) {
            System.out.println("Error occurred");
        }

        System.out.println("File name: " + file.getName());
        System.out.println("Path: " + file.getAbsolutePath());
        System.out.println("Exists: " + file.exists());
    }
}
\`\`\`

## Real-Life Analogy

Think of the File class like a file manager such as Windows Explorer.

You can:

- check files
- create files
- delete files
- check properties

But you do not open or edit file content yet. That comes with streams and readers/writers.

## Common Mistakes

- Thinking \`new File()\` creates a file
- Forgetting \`IOException\` handling
- Mixing File methods with content-writing methods
- Not checking \`exists()\` before deleting

## Key Idea

The File class manages file information and paths, not the actual file content.

## Summary

- \`createNewFile()\` creates a file
- \`exists()\` checks a file
- \`delete()\` removes a file
- \`getName()\` gets the file name
- \`getAbsolutePath()\` gets the full path
- \`mkdir()\` creates a folder`

const JAVA_FILE_METHODS_CODE_SAMPLE = `import java.io.File;
import java.io.IOException;

public class Main {
  public static void main(String[] args) {
    File file = new File("test.txt");

    try {
      if (file.createNewFile()) {
        System.out.println("File created");
      } else {
        System.out.println("File already exists");
      }
    } catch (IOException e) {
      System.out.println("Error occurred");
    }

    System.out.println("File name: " + file.getName());
    System.out.println("Path: " + file.getAbsolutePath());
    System.out.println("Exists: " + file.exists());
  }
}`

const buildJavaLessonSummary = (title: string) => {
  const normalized = title.toLowerCase()

  if (normalized === 'java tutorial') {
    return JAVA_TUTORIAL_SUMMARY
  }

  if (normalized === 'java home') {
    return JAVA_HOME_SUMMARY
  }

  if (normalized === 'java intro' || normalized === 'java introduction') {
    return JAVA_INTRO_SUMMARY
  }

  if (normalized === 'java get started') {
    return JAVA_GET_STARTED_SUMMARY
  }

  if (normalized === 'java syntax') {
    return JAVA_SYNTAX_SUMMARY
  }

  if (normalized === 'java output') {
    return JAVA_OUTPUT_SUMMARY
  }

  if (normalized === 'java comments') {
    return JAVA_COMMENTS_SUMMARY
  }

  if (normalized === 'java variables') {
    return JAVA_VARIABLES_SUMMARY
  }

  if (normalized === 'java operators') {
    return JAVA_OPERATORS_SUMMARY
  }

  if (normalized === 'java data types') {
    return JAVA_DATA_TYPES_SUMMARY
  }

  if (normalized === 'java type casting') {
    return JAVA_TYPE_CASTING_SUMMARY
  }

  if (normalized === 'java math') {
    return JAVA_MATH_SUMMARY
  }

  if (normalized === 'java string') {
    return JAVA_STRING_SUMMARY
  }

  if (normalized === 'java if...else') {
    return JAVA_IF_ELSE_SUMMARY
  }

  if (normalized === 'java booleans') {
    return JAVA_BOOLEANS_SUMMARY
  }

  if (normalized === 'java switch' || normalized === 'java switch statement') {
    return JAVA_SWITCH_SUMMARY
  }

  if (normalized === 'java for loop') {
    return JAVA_FOR_LOOP_SUMMARY
  }

  if (normalized === 'java break/continue' || normalized === 'java break and continue') {
    return JAVA_BREAK_CONTINUE_SUMMARY
  }

  if (normalized === 'java while loop') {
    return JAVA_WHILE_LOOP_SUMMARY
  }

  if (normalized === 'java arrays' || normalized === 'java array') {
    return JAVA_ARRAYS_SUMMARY
  }

  if (normalized === 'java methods') {
    return JAVA_METHODS_SUMMARY
  }

  if (normalized === 'java method challenge') {
    return JAVA_METHOD_CHALLENGE_SUMMARY
  }

  if (normalized === 'java method parameters') {
    return JAVA_METHOD_PARAMETERS_SUMMARY
  }

  if (normalized === 'java method overloading') {
    return JAVA_METHOD_OVERLOADING_SUMMARY
  }

  if (normalized === 'java scope') {
    return JAVA_SCOPE_SUMMARY
  }

  if (normalized === 'java recursion') {
    return JAVA_RECURSION_SUMMARY
  }

  if (normalized === 'java classes') {
    return JAVA_CLASSES_SUMMARY
  }

  if (
    normalized === 'java oop' ||
    normalized === 'java oop (object-oriented programming)' ||
    normalized === 'java object-oriented programming'
  ) {
    return JAVA_OOP_SUMMARY
  }

  if (normalized === 'java classes and objects') {
    return JAVA_CLASSES_OBJECTS_SUMMARY
  }

  if (normalized === 'java class attributes') {
    return JAVA_CLASS_ATTRIBUTES_SUMMARY
  }

  if (normalized === 'java class methods') {
    return JAVA_CLASS_METHODS_SUMMARY
  }

  if (normalized === 'java class challenge') {
    return JAVA_CLASS_CHALLENGE_SUMMARY
  }

  if (normalized === 'java constructors') {
    return JAVA_CONSTRUCTORS_SUMMARY
  }

  if (normalized === 'java this keyword') {
    return JAVA_THIS_KEYWORD_SUMMARY
  }

  if (normalized === 'java modifiers') {
    return JAVA_MODIFIERS_SUMMARY
  }

  if (normalized === 'java encapsulation') {
    return JAVA_ENCAPSULATION_SUMMARY
  }

  if (normalized === 'java packages / api' || normalized === 'java packages / apis') {
    return JAVA_PACKAGES_API_SUMMARY
  }

  if (normalized === 'java inheritance') {
    return JAVA_INHERITANCE_SUMMARY
  }

  if (normalized === 'java polymorphism') {
    return JAVA_POLYMORPHISM_SUMMARY
  }

  if (normalized === 'java super keyword') {
    return JAVA_SUPER_KEYWORD_SUMMARY
  }

  if (normalized === 'java inner classes' || normalized === 'java inner class') {
    return JAVA_INNER_CLASSES_SUMMARY
  }

  if (normalized === 'java abstraction') {
    return JAVA_ABSTRACTION_SUMMARY
  }

  if (normalized === 'java enum') {
    return JAVA_ENUM_SUMMARY
  }

  if (normalized === 'java anonymous' || normalized === 'java anonymous class') {
    return JAVA_ANONYMOUS_CLASS_SUMMARY
  }

  if (normalized === 'java user input') {
    return JAVA_USER_INPUT_SUMMARY
  }

  if (normalized === 'java date') {
    return JAVA_DATE_SUMMARY
  }

  if (normalized === 'java errors') {
    return JAVA_ERRORS_SUMMARY
  }

  if (normalized === 'java errors & exceptions' || normalized === 'java errors and exceptions') {
    return JAVA_ERRORS_EXCEPTIONS_SUMMARY
  }

  if (normalized === 'java debugging') {
    return JAVA_DEBUGGING_SUMMARY
  }

  if (normalized === 'java exceptions') {
    return JAVA_EXCEPTIONS_SUMMARY
  }

  if (normalized === 'java multiple exceptions') {
    return JAVA_MULTIPLE_EXCEPTIONS_SUMMARY
  }

  if (normalized === 'java try-with-resources' || normalized === 'java try with resources') {
    return JAVA_TRY_WITH_RESOURCES_SUMMARY
  }

  if (normalized === 'java file handling') {
    return JAVA_FILE_HANDLING_SUMMARY
  }

  if (normalized === 'java files') {
    return JAVA_FILES_SUMMARY
  }

  if (normalized === 'java create files' || normalized === 'java create file') {
    return JAVA_CREATE_FILES_SUMMARY
  }

  if (normalized === 'java write files' || normalized === 'java write file') {
    return JAVA_WRITE_FILES_SUMMARY
  }

  if (normalized === 'java read files' || normalized === 'java read file') {
    return JAVA_READ_FILES_SUMMARY
  }

  if (normalized === 'java delete files' || normalized === 'java delete file') {
    return JAVA_DELETE_FILES_SUMMARY
  }

  if (normalized === 'java i/o streams' || normalized === 'java io streams') {
    return JAVA_IO_STREAMS_SUMMARY
  }

  if (normalized === 'java fileinputstream' || normalized === 'java file input stream') {
    return JAVA_FILE_INPUT_STREAM_SUMMARY
  }

  if (normalized === 'java fileoutputstream' || normalized === 'java file output stream') {
    return JAVA_FILE_OUTPUT_STREAM_SUMMARY
  }

  if (normalized === 'java bufferedreader' || normalized === 'java buffered reader') {
    return JAVA_BUFFERED_READER_SUMMARY
  }

  if (normalized === 'java bufferedwriter' || normalized === 'java buffered writer') {
    return JAVA_BUFFERED_WRITER_SUMMARY
  }

  if (normalized === 'java data structures' || normalized === 'java data structure') {
    return JAVA_DATA_STRUCTURES_SUMMARY
  }

  if (normalized === 'java collections' || normalized === 'java collections framework') {
    return JAVA_COLLECTIONS_SUMMARY
  }

  if (normalized === 'java collections methods' || normalized === 'java collection methods') {
    return JAVA_COLLECTIONS_METHODS_SUMMARY
  }

  if (normalized === 'java system methods' || normalized === 'java system method') {
    return JAVA_SYSTEM_METHODS_SUMMARY
  }

  if (normalized === 'java list') {
    return JAVA_LIST_SUMMARY
  }

  if (normalized === 'java arraylist' || normalized === 'java array list') {
    return JAVA_ARRAY_LIST_SUMMARY
  }

  if (normalized === 'java linkedlist' || normalized === 'java linked list') {
    return JAVA_LINKED_LIST_SUMMARY
  }

  if (normalized === 'java list sorting') {
    return JAVA_LIST_SORTING_SUMMARY
  }

  if (normalized === 'java set') {
    return JAVA_SET_SUMMARY
  }

  if (normalized === 'java hashset' || normalized === 'java hash set') {
    return JAVA_HASH_SET_SUMMARY
  }

  if (normalized === 'java treeset' || normalized === 'java tree set') {
    return JAVA_TREE_SET_SUMMARY
  }

  if (normalized === 'java linkedhashset' || normalized === 'java linked hash set') {
    return JAVA_LINKED_HASH_SET_SUMMARY
  }

  if (normalized === 'java map') {
    return JAVA_MAP_SUMMARY
  }

  if (normalized === 'java hashmap' || normalized === 'java hash map') {
    return JAVA_HASH_MAP_SUMMARY
  }

  if (normalized === 'java treemap' || normalized === 'java tree map') {
    return JAVA_TREE_MAP_SUMMARY
  }

  if (normalized === 'java linkedhashmap' || normalized === 'java linked hash map') {
    return JAVA_LINKED_HASH_MAP_SUMMARY
  }

  if (normalized === 'java iterator') {
    return JAVA_ITERATOR_SUMMARY
  }

  if (normalized === 'java iterator methods' || normalized === 'java iterator method') {
    return JAVA_ITERATOR_METHODS_SUMMARY
  }

  if (normalized === 'java algorithms' || normalized === 'java algorithm') {
    return JAVA_ALGORITHMS_SUMMARY
  }

  if (normalized === 'java advanced') {
    return JAVA_ADVANCED_SUMMARY
  }

  if (normalized === 'java wrapper classes' || normalized === 'java wrapper class') {
    return JAVA_WRAPPER_CLASSES_SUMMARY
  }

  if (normalized === 'java generics' || normalized === 'java generic') {
    return JAVA_GENERICS_SUMMARY
  }

  if (normalized === 'java annotations' || normalized === 'java annotation') {
    return JAVA_ANNOTATIONS_SUMMARY
  }

  if (normalized === 'java regex' || normalized === 'java regular expressions') {
    return JAVA_REGEX_SUMMARY
  }

  if (normalized === 'java threads' || normalized === 'java thread') {
    return JAVA_THREADS_SUMMARY
  }

  if (normalized === 'java lambda' || normalized === 'java lambda expressions') {
    return JAVA_LAMBDA_SUMMARY
  }

  if (normalized === 'java advanced sorting') {
    return JAVA_ADVANCED_SORTING_SUMMARY
  }

  if (normalized === 'java projects' || normalized === 'java project') {
    return JAVA_PROJECTS_SUMMARY
  }

  if (normalized === 'java how to\'s' || normalized === 'java how tos') {
    return JAVA_HOW_TOS_SUMMARY
  }

  if (normalized === 'java reference') {
    return JAVA_REFERENCE_SUMMARY
  }

  if (normalized === 'java keywords' || normalized === 'java keyword') {
    return JAVA_KEYWORDS_SUMMARY
  }

  if (normalized === 'java string methods' || normalized === 'java string method') {
    return JAVA_STRING_METHODS_SUMMARY
  }

  if (normalized === 'java math methods' || normalized === 'java math method') {
    return JAVA_MATH_METHODS_SUMMARY
  }

  if (normalized === 'java output methods' || normalized === 'java output method') {
    return JAVA_OUTPUT_METHODS_SUMMARY
  }

  if (normalized === 'java arrays methods' || normalized === 'java array methods') {
    return JAVA_ARRAYS_METHODS_SUMMARY
  }

  if (normalized === 'java arraylist methods' || normalized === 'java array list methods') {
    return JAVA_ARRAY_LIST_METHODS_SUMMARY
  }

  if (normalized === 'java linkedlist methods' || normalized === 'java linked list methods') {
    return JAVA_LINKED_LIST_METHODS_SUMMARY
  }

  if (normalized === 'java hashmap methods' || normalized === 'java hash map methods') {
    return JAVA_HASH_MAP_METHODS_SUMMARY
  }

  if (normalized === 'java scanner methods' || normalized === 'java scanner method') {
    return JAVA_SCANNER_METHODS_SUMMARY
  }

  if (normalized === 'java file methods' || normalized === 'java file method') {
    return JAVA_FILE_METHODS_SUMMARY
  }

  if (normalized.includes('tutorial') || normalized.includes('home') || normalized.includes('intro') || normalized.includes('get started')) {
    return `Start ${title} with a practical Java foundation focused on syntax, structure, and how object-oriented code is organized.`
  }

  if (
    normalized.includes('class') ||
    normalized.includes('oop') ||
    normalized.includes('inheritance') ||
    normalized.includes('polymorphism') ||
    normalized.includes('abstraction') ||
    normalized.includes('interface')
  ) {
    return `Use ${title} to strengthen the object-oriented side of Java and write cleaner reusable code.`
  }

  return `Learn ${title} with clear Java examples that connect syntax, structure, and practical application.`
}

const buildJavaLessonContent = (title: string) => {
  const normalized = title.toLowerCase()
  const cleanTitle = title.replace(/^Java\s+/i, '')

  if (normalized === 'java tutorial') {
    return JAVA_TUTORIAL_CONTENT
  }

  if (normalized === 'java home') {
    return JAVA_HOME_CONTENT
  }

  if (normalized === 'java intro' || normalized === 'java introduction') {
    return JAVA_INTRO_CONTENT
  }

  if (normalized === 'java get started') {
    return JAVA_GET_STARTED_CONTENT
  }

  if (normalized === 'java syntax') {
    return JAVA_SYNTAX_CONTENT
  }

  if (normalized === 'java output') {
    return JAVA_OUTPUT_CONTENT
  }

  if (normalized === 'java comments') {
    return JAVA_COMMENTS_CONTENT
  }

  if (normalized === 'java variables') {
    return JAVA_VARIABLES_CONTENT
  }

  if (normalized === 'java operators') {
    return JAVA_OPERATORS_CONTENT
  }

  if (normalized === 'java data types') {
    return JAVA_DATA_TYPES_CONTENT
  }

  if (normalized === 'java type casting') {
    return JAVA_TYPE_CASTING_CONTENT
  }

  if (normalized === 'java math') {
    return JAVA_MATH_CONTENT
  }

  if (normalized === 'java string') {
    return JAVA_STRING_CONTENT
  }

  if (normalized === 'java if...else') {
    return JAVA_IF_ELSE_CONTENT
  }

  if (normalized === 'java booleans') {
    return JAVA_BOOLEANS_CONTENT
  }

  if (normalized === 'java switch' || normalized === 'java switch statement') {
    return JAVA_SWITCH_CONTENT
  }

  if (normalized === 'java for loop') {
    return JAVA_FOR_LOOP_CONTENT
  }

  if (normalized === 'java break/continue' || normalized === 'java break and continue') {
    return JAVA_BREAK_CONTINUE_CONTENT
  }

  if (normalized === 'java while loop') {
    return JAVA_WHILE_LOOP_CONTENT
  }

  if (normalized === 'java arrays' || normalized === 'java array') {
    return JAVA_ARRAYS_CONTENT
  }

  if (normalized === 'java methods') {
    return JAVA_METHODS_CONTENT
  }

  if (normalized === 'java method challenge') {
    return JAVA_METHOD_CHALLENGE_CONTENT
  }

  if (normalized === 'java method parameters') {
    return JAVA_METHOD_PARAMETERS_CONTENT
  }

  if (normalized === 'java method overloading') {
    return JAVA_METHOD_OVERLOADING_CONTENT
  }

  if (normalized === 'java scope') {
    return JAVA_SCOPE_CONTENT
  }

  if (normalized === 'java recursion') {
    return JAVA_RECURSION_CONTENT
  }

  if (normalized === 'java classes') {
    return JAVA_CLASSES_CONTENT
  }

  if (
    normalized === 'java oop' ||
    normalized === 'java oop (object-oriented programming)' ||
    normalized === 'java object-oriented programming'
  ) {
    return JAVA_OOP_CONTENT
  }

  if (normalized === 'java classes and objects') {
    return JAVA_CLASSES_OBJECTS_CONTENT
  }

  if (normalized === 'java class attributes') {
    return JAVA_CLASS_ATTRIBUTES_CONTENT
  }

  if (normalized === 'java class methods') {
    return JAVA_CLASS_METHODS_CONTENT
  }

  if (normalized === 'java class challenge') {
    return JAVA_CLASS_CHALLENGE_CONTENT
  }

  if (normalized === 'java constructors') {
    return JAVA_CONSTRUCTORS_CONTENT
  }

  if (normalized === 'java this keyword') {
    return JAVA_THIS_KEYWORD_CONTENT
  }

  if (normalized === 'java modifiers') {
    return JAVA_MODIFIERS_CONTENT
  }

  if (normalized === 'java encapsulation') {
    return JAVA_ENCAPSULATION_CONTENT
  }

  if (normalized === 'java packages / api' || normalized === 'java packages / apis') {
    return JAVA_PACKAGES_API_CONTENT
  }

  if (normalized === 'java inheritance') {
    return JAVA_INHERITANCE_CONTENT
  }

  if (normalized === 'java polymorphism') {
    return JAVA_POLYMORPHISM_CONTENT
  }

  if (normalized === 'java super keyword') {
    return JAVA_SUPER_KEYWORD_CONTENT
  }

  if (normalized === 'java inner classes' || normalized === 'java inner class') {
    return JAVA_INNER_CLASSES_CONTENT
  }

  if (normalized === 'java abstraction') {
    return JAVA_ABSTRACTION_CONTENT
  }

  if (normalized === 'java enum') {
    return JAVA_ENUM_CONTENT
  }

  if (normalized === 'java anonymous' || normalized === 'java anonymous class') {
    return JAVA_ANONYMOUS_CLASS_CONTENT
  }

  if (normalized === 'java user input') {
    return JAVA_USER_INPUT_CONTENT
  }

  if (normalized === 'java date') {
    return JAVA_DATE_CONTENT
  }

  if (normalized === 'java errors') {
    return JAVA_ERRORS_CONTENT
  }

  if (normalized === 'java errors & exceptions' || normalized === 'java errors and exceptions') {
    return JAVA_ERRORS_EXCEPTIONS_CONTENT
  }

  if (normalized === 'java debugging') {
    return JAVA_DEBUGGING_CONTENT
  }

  if (normalized === 'java exceptions') {
    return JAVA_EXCEPTIONS_CONTENT
  }

  if (normalized === 'java multiple exceptions') {
    return JAVA_MULTIPLE_EXCEPTIONS_CONTENT
  }

  if (normalized === 'java try-with-resources' || normalized === 'java try with resources') {
    return JAVA_TRY_WITH_RESOURCES_CONTENT
  }

  if (normalized === 'java file handling') {
    return JAVA_FILE_HANDLING_CONTENT
  }

  if (normalized === 'java files') {
    return JAVA_FILES_CONTENT
  }

  if (normalized === 'java create files' || normalized === 'java create file') {
    return JAVA_CREATE_FILES_CONTENT
  }

  if (normalized === 'java write files' || normalized === 'java write file') {
    return JAVA_WRITE_FILES_CONTENT
  }

  if (normalized === 'java read files' || normalized === 'java read file') {
    return JAVA_READ_FILES_CONTENT
  }

  if (normalized === 'java delete files' || normalized === 'java delete file') {
    return JAVA_DELETE_FILES_CONTENT
  }

  if (normalized === 'java i/o streams' || normalized === 'java io streams') {
    return JAVA_IO_STREAMS_CONTENT
  }

  if (normalized === 'java fileinputstream' || normalized === 'java file input stream') {
    return JAVA_FILE_INPUT_STREAM_CONTENT
  }

  if (normalized === 'java fileoutputstream' || normalized === 'java file output stream') {
    return JAVA_FILE_OUTPUT_STREAM_CONTENT
  }

  if (normalized === 'java bufferedreader' || normalized === 'java buffered reader') {
    return JAVA_BUFFERED_READER_CONTENT
  }

  if (normalized === 'java bufferedwriter' || normalized === 'java buffered writer') {
    return JAVA_BUFFERED_WRITER_CONTENT
  }

  if (normalized === 'java data structures' || normalized === 'java data structure') {
    return JAVA_DATA_STRUCTURES_CONTENT
  }

  if (normalized === 'java collections' || normalized === 'java collections framework') {
    return JAVA_COLLECTIONS_CONTENT
  }

  if (normalized === 'java collections methods' || normalized === 'java collection methods') {
    return JAVA_COLLECTIONS_METHODS_CONTENT
  }

  if (normalized === 'java system methods' || normalized === 'java system method') {
    return JAVA_SYSTEM_METHODS_CONTENT
  }

  if (normalized === 'java list') {
    return JAVA_LIST_CONTENT
  }

  if (normalized === 'java arraylist' || normalized === 'java array list') {
    return JAVA_ARRAY_LIST_CONTENT
  }

  if (normalized === 'java linkedlist' || normalized === 'java linked list') {
    return JAVA_LINKED_LIST_CONTENT
  }

  if (normalized === 'java list sorting') {
    return JAVA_LIST_SORTING_CONTENT
  }

  if (normalized === 'java set') {
    return JAVA_SET_CONTENT
  }

  if (normalized === 'java hashset' || normalized === 'java hash set') {
    return JAVA_HASH_SET_CONTENT
  }

  if (normalized === 'java treeset' || normalized === 'java tree set') {
    return JAVA_TREE_SET_CONTENT
  }

  if (normalized === 'java linkedhashset' || normalized === 'java linked hash set') {
    return JAVA_LINKED_HASH_SET_CONTENT
  }

  if (normalized === 'java map') {
    return JAVA_MAP_CONTENT
  }

  if (normalized === 'java hashmap' || normalized === 'java hash map') {
    return JAVA_HASH_MAP_CONTENT
  }

  if (normalized === 'java treemap' || normalized === 'java tree map') {
    return JAVA_TREE_MAP_CONTENT
  }

  if (normalized === 'java linkedhashmap' || normalized === 'java linked hash map') {
    return JAVA_LINKED_HASH_MAP_CONTENT
  }

  if (normalized === 'java iterator') {
    return JAVA_ITERATOR_CONTENT
  }

  if (normalized === 'java iterator methods' || normalized === 'java iterator method') {
    return JAVA_ITERATOR_METHODS_CONTENT
  }

  if (normalized === 'java algorithms' || normalized === 'java algorithm') {
    return JAVA_ALGORITHMS_CONTENT
  }

  if (normalized === 'java advanced') {
    return JAVA_ADVANCED_CONTENT
  }

  if (normalized === 'java wrapper classes' || normalized === 'java wrapper class') {
    return JAVA_WRAPPER_CLASSES_CONTENT
  }

  if (normalized === 'java generics' || normalized === 'java generic') {
    return JAVA_GENERICS_CONTENT
  }

  if (normalized === 'java annotations' || normalized === 'java annotation') {
    return JAVA_ANNOTATIONS_CONTENT
  }

  if (normalized === 'java regex' || normalized === 'java regular expressions') {
    return JAVA_REGEX_CONTENT
  }

  if (normalized === 'java threads' || normalized === 'java thread') {
    return JAVA_THREADS_CONTENT
  }

  if (normalized === 'java lambda' || normalized === 'java lambda expressions') {
    return JAVA_LAMBDA_CONTENT
  }

  if (normalized === 'java advanced sorting') {
    return JAVA_ADVANCED_SORTING_CONTENT
  }

  if (normalized === 'java projects' || normalized === 'java project') {
    return JAVA_PROJECTS_CONTENT
  }

  if (normalized === 'java how to\'s' || normalized === 'java how tos') {
    return JAVA_HOW_TOS_CONTENT
  }

  if (normalized === 'java reference') {
    return JAVA_REFERENCE_CONTENT
  }

  if (normalized === 'java keywords' || normalized === 'java keyword') {
    return JAVA_KEYWORDS_CONTENT
  }

  if (normalized === 'java string methods' || normalized === 'java string method') {
    return JAVA_STRING_METHODS_CONTENT
  }

  if (normalized === 'java math methods' || normalized === 'java math method') {
    return JAVA_MATH_METHODS_CONTENT
  }

  if (normalized === 'java output methods' || normalized === 'java output method') {
    return JAVA_OUTPUT_METHODS_CONTENT
  }

  if (normalized === 'java arrays methods' || normalized === 'java array methods') {
    return JAVA_ARRAYS_METHODS_CONTENT
  }

  if (normalized === 'java arraylist methods' || normalized === 'java array list methods') {
    return JAVA_ARRAY_LIST_METHODS_CONTENT
  }

  if (normalized === 'java linkedlist methods' || normalized === 'java linked list methods') {
    return JAVA_LINKED_LIST_METHODS_CONTENT
  }

  if (normalized === 'java hashmap methods' || normalized === 'java hash map methods') {
    return JAVA_HASH_MAP_METHODS_CONTENT
  }

  if (normalized === 'java scanner methods' || normalized === 'java scanner method') {
    return JAVA_SCANNER_METHODS_CONTENT
  }

  if (normalized === 'java file methods' || normalized === 'java file method') {
    return JAVA_FILE_METHODS_CONTENT
  }

  return buildLessonContentTemplate({
    title,
    introduction: `${cleanTitle} is part of the Java path in DevHub. This lesson helps you understand when to use it, how it appears in code, and how it fits into larger Java programs.`,
    practicePoints: [
      `Understand the role of ${cleanTitle} in Java development`,
      `Review the core Java syntax and structure used for ${cleanTitle}`,
      `Connect ${cleanTitle} to practical console, file, or object-oriented examples`,
    ],
    nextStep: 'Continue to the next Java topic to keep building a stronger programming foundation.',
  })
}

const buildJavaLessonCodeSample = (title: string) => {
  const normalized = title.toLowerCase()

  if (normalized === 'java tutorial') {
    return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Java");\n  }\n}'
  }

  if (normalized === 'java intro' || normalized === 'java introduction') {
    return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Java");\n  }\n}'
  }

  if (normalized.includes('tutorial') || normalized.includes('home') || normalized.includes('intro') || normalized.includes('get started') || normalized.includes('syntax')) {
    return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}'
  }
  if (normalized === 'java output methods' || normalized === 'java output method') {
    return JAVA_OUTPUT_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java arrays methods' || normalized === 'java array methods') {
    return JAVA_ARRAYS_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java arraylist methods' || normalized === 'java array list methods') {
    return JAVA_ARRAY_LIST_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java linkedlist methods' || normalized === 'java linked list methods') {
    return JAVA_LINKED_LIST_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java hashmap methods' || normalized === 'java hash map methods') {
    return JAVA_HASH_MAP_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java scanner methods' || normalized === 'java scanner method') {
    return JAVA_SCANNER_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java file methods' || normalized === 'java file method') {
    return JAVA_FILE_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java output' || normalized.includes('output')) {
    return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n    System.out.print("Java ");\n    System.out.print("Output");\n    System.out.println();\n    System.out.printf("Score: %d%n", 100);\n  }\n}'
  }
  if (normalized === 'java comments') {
    return 'public class Main {\n  /**\n   * Entry point for the program.\n   */\n  public static void main(String[] args) {\n    // Single-line comment\n    /* Multi-line comment */\n    System.out.println("Comments explain code.");\n  }\n}'
  }
  if (normalized.includes('comment')) return '// This is a Java comment\nSystem.out.println("Comments explain code.");'
  if (normalized === 'java variables') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int age = 20;\n    String name = "John";\n    final double price = 19.99;\n\n    System.out.println(name + " is " + age + " years old.");\n    System.out.println("Price: " + price);\n  }\n}'
  }
  if (normalized === 'java operators') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int a = 10;\n    int b = 3;\n\n    System.out.println("Addition: " + (a + b));\n    System.out.println("Greater than: " + (a > b));\n    System.out.println("Logical AND: " + (a > 5 && b < 5));\n    System.out.println("Pre-increment: " + (++a));\n  }\n}'
  }
  if (normalized === 'java data types') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int age = 20;\n    double price = 99.99;\n    char grade = \'A\';\n    boolean isJavaEasy = true;\n    String name = "John";\n\n    System.out.println(name + " is " + age + " years old.");\n    System.out.println("Price: " + price);\n    System.out.println("Grade: " + grade);\n    System.out.println("Java easy? " + isJavaEasy);\n  }\n}'
  }
  if (normalized === 'java type casting') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int wholeNumber = 10;\n    double widenedValue = wholeNumber;\n\n    double decimalNumber = 9.78;\n    int narrowedValue = (int) decimalNumber;\n\n    System.out.println(widenedValue);\n    System.out.println(narrowedValue);\n    System.out.println((double) 5 / 2);\n  }\n}'
  }
  if (normalized === 'java math') {
    return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println(Math.max(10, 20));\n    System.out.println(Math.sqrt(25));\n    System.out.println(Math.pow(2, 3));\n    System.out.println((int) (Math.random() * 10) + 1);\n  }\n}'
  }
  if (normalized === 'java string') {
    return 'public class Main {\n  public static void main(String[] args) {\n    String firstName = "John";\n    String lastName = "Doe";\n    String fullName = firstName + " " + lastName;\n\n    System.out.println(fullName);\n    System.out.println(fullName.length());\n    System.out.println(fullName.toUpperCase());\n    System.out.println(fullName.charAt(0));\n  }\n}'
  }
  if (normalized === 'java if...else') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int score = 75;\n\n    if (score >= 80) {\n      System.out.println("Grade A");\n    } else if (score >= 60) {\n      System.out.println("Grade B");\n    } else {\n      System.out.println("Grade C");\n    }\n  }\n}'
  }
  if (normalized === 'java booleans') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int age = 20;\n    boolean hasID = true;\n    boolean isAdult = age >= 18;\n\n    System.out.println(isAdult);\n    System.out.println(isAdult && hasID);\n  }\n}'
  }
  if (normalized === 'java switch' || normalized === 'java switch statement') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int day = 3;\n\n    switch (day) {\n      case 1:\n        System.out.println("Monday");\n        break;\n      case 2:\n        System.out.println("Tuesday");\n        break;\n      case 3:\n        System.out.println("Wednesday");\n        break;\n      default:\n        System.out.println("Invalid day");\n    }\n  }\n}'
  }
  if (normalized === 'java for loop') {
    return 'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 5; i++) {\n      System.out.println(i);\n    }\n  }\n}'
  }
  if (normalized === 'java break/continue' || normalized === 'java break and continue') {
    return 'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 5; i++) {\n      if (i == 3) {\n        continue;\n      }\n      if (i == 5) {\n        break;\n      }\n      System.out.println(i);\n    }\n  }\n}'
  }
  if (normalized === 'java while loop') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int i = 1;\n\n    while (i <= 5) {\n      System.out.println(i);\n      i++;\n    }\n  }\n}'
  }
  if (normalized === 'java arrays' || normalized === 'java array') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int[] numbers = {10, 20, 30};\n\n    for (int number : numbers) {\n      System.out.println(number);\n    }\n\n    System.out.println("Length: " + numbers.length);\n  }\n}'
  }
  if (normalized === 'java methods') {
    return 'public class Main {\n  static int add(int a, int b) {\n    return a + b;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(add(5, 3));\n  }\n}'
  }
  if (normalized === 'java method challenge') {
    return 'public class Main {\n  static int multiply(int a, int b, int c) {\n    return a * b * c;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(multiply(2, 3, 4));\n  }\n}'
  }
  if (normalized === 'java method parameters') {
    return 'public class Main {\n  static void greet(String name, int age) {\n    System.out.println(name + " is " + age + " years old.");\n  }\n\n  public static void main(String[] args) {\n    greet("Ama", 20);\n  }\n}'
  }
  if (normalized === 'java method overloading') {
    return 'public class Main {\n  static int add(int a, int b) {\n    return a + b;\n  }\n\n  static int add(int a, int b, int c) {\n    return a + b + c;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(add(5, 10));\n    System.out.println(add(5, 10, 15));\n  }\n}'
  }
  if (normalized === 'java scope') {
    return 'public class Main {\n  int classValue = 10;\n\n  public static void main(String[] args) {\n    Main obj = new Main();\n\n    for (int i = 0; i < 1; i++) {\n      int blockValue = 5;\n      System.out.println(blockValue);\n    }\n\n    System.out.println(obj.classValue);\n  }\n}'
  }
  if (normalized === 'java recursion') {
    return 'public class Main {\n  static int factorial(int n) {\n    if (n <= 1) {\n      return 1;\n    }\n    return n * factorial(n - 1);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(factorial(5));\n  }\n}'
  }
  if (normalized === 'java classes') {
    return 'class Car {\n  String color = "Red";\n\n  void drive() {\n    System.out.println("The car is driving");\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Car myCar = new Car();\n    System.out.println(myCar.color);\n    myCar.drive();\n  }\n}'
  }
  if (
    normalized === 'java oop' ||
    normalized === 'java oop (object-oriented programming)' ||
    normalized === 'java object-oriented programming'
  ) {
    return 'class Animal {\n  void sound() {\n    System.out.println("Animal sound");\n  }\n}\n\nclass Dog extends Animal {\n  @Override\n  void sound() {\n    System.out.println("Dog barks");\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Animal pet = new Dog();\n    pet.sound();\n  }\n}'
  }
  if (normalized === 'java classes and objects') {
    return 'class Car {\n  String brand = "Toyota";\n  int speed = 120;\n\n  void drive() {\n    System.out.println("Car is driving");\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Car myCar = new Car();\n    System.out.println(myCar.brand);\n    System.out.println(myCar.speed);\n    myCar.drive();\n  }\n}'
  }
  if (normalized === 'java class attributes') {
    return 'class Car {\n  String brand = "Toyota";\n  int speed = 120;\n  static String company = "Toyota";\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Car myCar = new Car();\n    myCar.speed = 200;\n\n    System.out.println(myCar.brand);\n    System.out.println(myCar.speed);\n    System.out.println(Car.company);\n  }\n}'
  }
  if (normalized === 'java class methods') {
    return 'class Car {\n  String brand = "Toyota";\n\n  void showBrand() {\n    System.out.println("Brand: " + brand);\n  }\n\n  static int square(int x) {\n    return x * x;\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Car car = new Car();\n    car.showBrand();\n    System.out.println(Car.square(4));\n  }\n}'
  }
  if (normalized === 'java class challenge') {
    return 'class Calculator {\n  int add(int a, int b) {\n    return a + b;\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Calculator calc = new Calculator();\n    System.out.println(calc.add(10, 5));\n  }\n}'
  }
  if (normalized === 'java constructors') {
    return 'class Car {\n  String brand;\n\n  Car(String brandName) {\n    brand = brandName;\n  }\n\n  void show() {\n    System.out.println(brand);\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Car car = new Car("Toyota");\n    car.show();\n  }\n}'
  }
  if (normalized === 'java this keyword') {
    return 'class Student {\n  String name;\n\n  Student(String name) {\n    this.name = name;\n  }\n\n  void show() {\n    System.out.println(this.name);\n  }\n\n  public static void main(String[] args) {\n    Student s = new Student("Ama");\n    s.show();\n  }\n}'
  }
  if (normalized === 'java modifiers') {
    return 'abstract class Animal {\n  abstract void sound();\n}\n\nclass Dog extends Animal {\n  @Override\n  void sound() {\n    System.out.println("Bark");\n  }\n}\n\nclass Counter {\n  static final int LIMIT = 10;\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println(Counter.LIMIT);\n    new Dog().sound();\n  }\n}'
  }
  if (normalized === 'java encapsulation') {
    return 'class Person {\n  private String name;\n\n  public void setName(String name) {\n    this.name = name;\n  }\n\n  public String getName() {\n    return name;\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Person p = new Person();\n    p.setName("Ama");\n    System.out.println(p.getName());\n  }\n}'
  }
  if (normalized === 'java packages / api' || normalized === 'java packages / apis') {
    return 'import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> topics = new ArrayList<>();\n    topics.add("Packages");\n    topics.add("APIs");\n\n    System.out.println(topics.get(0));\n    System.out.println("Scanner is part of java.util");\n  }\n}'
  }
  if (normalized === 'java inheritance') {
    return 'class Animal {\n  void eat() {\n    System.out.println("This animal eats food");\n  }\n}\n\nclass Dog extends Animal {\n  void bark() {\n    System.out.println("Dog is barking");\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Dog d = new Dog();\n    d.eat();\n    d.bark();\n  }\n}'
  }
  if (normalized === 'java polymorphism') {
    return 'class Animal {\n  void sound() {\n    System.out.println("Animal makes sound");\n  }\n}\n\nclass Dog extends Animal {\n  @Override\n  void sound() {\n    System.out.println("Dog barks");\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Animal pet = new Dog();\n    pet.sound();\n  }\n}'
  }
  if (normalized === 'java super keyword') {
    return 'class Animal {\n  String color = "White";\n\n  void sound() {\n    System.out.println("Animal makes sound");\n  }\n}\n\nclass Dog extends Animal {\n  String color = "Black";\n\n  @Override\n  void sound() {\n    super.sound();\n    System.out.println("Dog barks");\n  }\n\n  void showColor() {\n    System.out.println(color);\n    System.out.println(super.color);\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Dog d = new Dog();\n    d.showColor();\n    d.sound();\n  }\n}'
  }
  if (normalized === 'java inner classes' || normalized === 'java inner class') {
    return 'class Outer {\n  class Inner {\n    void show() {\n      System.out.println("Inner class method");\n    }\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Outer outer = new Outer();\n    Outer.Inner inner = outer.new Inner();\n    inner.show();\n  }\n}'
  }
  if (normalized === 'java abstraction') {
    return 'abstract class Animal {\n  abstract void sound();\n\n  void sleep() {\n    System.out.println("This animal sleeps");\n  }\n}\n\nclass Dog extends Animal {\n  @Override\n  void sound() {\n    System.out.println("Dog barks");\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Dog d = new Dog();\n    d.sound();\n    d.sleep();\n  }\n}'
  }
  if (normalized === 'java enum') {
    return 'enum Day {\n  MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Day day = Day.WEDNESDAY;\n\n    switch (day) {\n      case MONDAY:\n        System.out.println("Start of week");\n        break;\n      case WEDNESDAY:\n        System.out.println("Midweek");\n        break;\n      case FRIDAY:\n        System.out.println("Weekend soon");\n        break;\n      default:\n        System.out.println("Other day");\n    }\n  }\n}'
  }
  if (normalized === 'java anonymous' || normalized === 'java anonymous class') {
    return 'interface Animal {\n  void sound();\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Animal a = new Animal() {\n      @Override\n      public void sound() {\n        System.out.println("Cat meows");\n      }\n    };\n\n    a.sound();\n  }\n}'
  }
  if (normalized === 'java user input') {
    return 'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n\n    System.out.print("Enter your name: ");\n    String name = input.nextLine();\n\n    System.out.print("Enter your age: ");\n    int age = input.nextInt();\n\n    System.out.println(name + " is " + age + " years old");\n  }\n}'
  }
  if (normalized === 'java date') {
    return 'import java.time.LocalDateTime;\nimport java.time.format.DateTimeFormatter;\n\npublic class Main {\n  public static void main(String[] args) {\n    LocalDateTime now = LocalDateTime.now();\n    DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");\n\n    System.out.println(now.format(format));\n  }\n}'
  }
  if (normalized === 'java errors') {
    return 'public class Main {\n  public static void main(String[] args) {\n    // Syntax error example:\n    // System.out.println("Hello World")\n\n    int a = 10;\n    int b = 0;\n\n    // Runtime error example:\n    // System.out.println(a / b);\n\n    int result = a - 5; // Logical error if addition was intended\n    System.out.println(result);\n  }\n}'
  }
  if (normalized === 'java errors & exceptions' || normalized === 'java errors and exceptions') {
    return 'public class Main {\n  public static void main(String[] args) {\n    try {\n      int[] arr = {1, 2, 3};\n      System.out.println(arr[5]);\n    } catch (ArrayIndexOutOfBoundsException e) {\n      System.out.println("Index error");\n    } finally {\n      System.out.println("Program finished");\n    }\n  }\n}'
  }
  if (normalized === 'java debugging') {
    return 'public class Main {\n  public static void main(String[] args) {\n    int a = 10;\n    int b = 5;\n\n    System.out.println("Value of a: " + a);\n    System.out.println("Value of b: " + b);\n\n    int result = a + b;\n\n    System.out.println("Result: " + result);\n  }\n}'
  }
  if (normalized === 'java exceptions') {
    return 'public class Main {\n  public static void main(String[] args) {\n    try {\n      int a = 10;\n      int b = 0;\n      int result = a / b;\n\n      System.out.println(result);\n    } catch (ArithmeticException e) {\n      System.out.println("Cannot divide by zero!");\n    } finally {\n      System.out.println("This always runs");\n    }\n  }\n}'
  }
  if (normalized === 'java multiple exceptions') {
    return 'public class Main {\n  public static void main(String[] args) {\n    try {\n      int[] numbers = {1, 2, 3};\n      int result = numbers[5] / 0;\n\n      System.out.println(result);\n    } catch (ArrayIndexOutOfBoundsException e) {\n      System.out.println("Array index is invalid!");\n    } catch (ArithmeticException e) {\n      System.out.println("Cannot divide by zero!");\n    } catch (Exception e) {\n      System.out.println("Something else went wrong!");\n    }\n  }\n}'
  }
  if (normalized === 'java try-with-resources' || normalized === 'java try with resources') {
    return 'import java.io.FileReader;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try (FileReader reader = new FileReader("file.txt")) {\n      int data = reader.read();\n\n      while (data != -1) {\n        System.out.print((char) data);\n        data = reader.read();\n      }\n    } catch (IOException e) {\n      System.out.println("Error reading file");\n    }\n  }\n}'
  }
  if (normalized === 'java file handling') {
    return 'import java.io.File;\nimport java.io.FileWriter;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try {\n      File file = new File("myfile.txt");\n      file.createNewFile();\n\n      FileWriter writer = new FileWriter(file);\n      writer.write("Hello from Java file handling!");\n      writer.close();\n\n      System.out.println("Successfully wrote to file.");\n    } catch (IOException e) {\n      System.out.println("An error occurred.");\n    }\n  }\n}'
  }
  if (normalized === 'java files') {
    return 'import java.io.File;\n\npublic class Main {\n  public static void main(String[] args) {\n    File file = new File("myfile.txt");\n\n    System.out.println("Name: " + file.getName());\n    System.out.println("Absolute path: " + file.getAbsolutePath());\n    System.out.println("Exists? " + file.exists());\n  }\n}'
  }
  if (normalized === 'java create files' || normalized === 'java create file') {
    return 'import java.io.File;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try {\n      File file = new File("myfile.txt");\n\n      if (file.createNewFile()) {\n        System.out.println("File created: " + file.getName());\n      } else {\n        System.out.println("File already exists.");\n      }\n    } catch (IOException e) {\n      System.out.println("An error occurred.");\n    }\n  }\n}'
  }
  if (normalized === 'java write files' || normalized === 'java write file') {
    return 'import java.io.FileWriter;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try {\n      FileWriter writer = new FileWriter("myfile.txt", true);\n      writer.write("Hello from Java file writing!\\n");\n      writer.close();\n\n      System.out.println("Successfully wrote to file.");\n    } catch (IOException e) {\n      System.out.println("An error occurred.");\n    }\n  }\n}'
  }
  if (normalized === 'java read files' || normalized === 'java read file') {
    return 'import java.io.BufferedReader;\nimport java.io.FileReader;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try (BufferedReader reader = new BufferedReader(new FileReader("myfile.txt"))) {\n      String line;\n\n      while ((line = reader.readLine()) != null) {\n        System.out.println(line);\n      }\n    } catch (IOException e) {\n      System.out.println("Error reading file.");\n    }\n  }\n}'
  }
  if (normalized === 'java delete files' || normalized === 'java delete file') {
    return 'import java.io.File;\n\npublic class Main {\n  public static void main(String[] args) {\n    File file = new File("myfile.txt");\n\n    if (file.exists()) {\n      if (file.delete()) {\n        System.out.println("File deleted successfully.");\n      } else {\n        System.out.println("Unable to delete file.");\n      }\n    } else {\n      System.out.println("File does not exist.");\n    }\n  }\n}'
  }
  if (normalized === 'java i/o streams' || normalized === 'java io streams') {
    return 'import java.io.FileOutputStream;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try {\n      FileOutputStream output = new FileOutputStream("myfile.txt");\n      output.write("Hello Java Streams!".getBytes());\n      output.close();\n\n      System.out.println("Data written successfully");\n    } catch (IOException e) {\n      System.out.println("Error writing file");\n    }\n  }\n}'
  }
  if (normalized === 'java fileinputstream' || normalized === 'java file input stream') {
    return 'import java.io.FileInputStream;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try {\n      FileInputStream fis = new FileInputStream("test.txt");\n\n      int i;\n\n      while ((i = fis.read()) != -1) {\n        System.out.print((char) i);\n      }\n\n      fis.close();\n    } catch (IOException e) {\n      System.out.println("File error");\n    }\n  }\n}'
  }
  if (normalized === 'java fileoutputstream' || normalized === 'java file output stream') {
    return 'import java.io.FileOutputStream;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try {\n      FileOutputStream fos = new FileOutputStream("test.txt");\n\n      String text = "Hello Java FileOutputStream";\n      byte[] data = text.getBytes();\n\n      fos.write(data);\n      fos.close();\n\n      System.out.println("File written successfully");\n    } catch (IOException e) {\n      System.out.println("Error writing file");\n    }\n  }\n}'
  }
  if (normalized === 'java bufferedreader' || normalized === 'java buffered reader') {
    return 'import java.io.BufferedReader;\nimport java.io.FileReader;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try {\n      BufferedReader br = new BufferedReader(new FileReader("test.txt"));\n\n      String line;\n\n      while ((line = br.readLine()) != null) {\n        System.out.println(line);\n      }\n\n      br.close();\n    } catch (IOException e) {\n      System.out.println("Error reading file");\n    }\n  }\n}'
  }
  if (normalized === 'java bufferedwriter' || normalized === 'java buffered writer') {
    return 'import java.io.BufferedWriter;\nimport java.io.FileWriter;\nimport java.io.IOException;\n\npublic class Main {\n  public static void main(String[] args) {\n    try (BufferedWriter writer = new BufferedWriter(new FileWriter("myfile.txt", true))) {\n      writer.write("Hello Java BufferedWriter!");\n      writer.newLine();\n      writer.write("Buffered writing is fast and clean.");\n    } catch (IOException e) {\n      System.out.println("Error writing file.");\n    }\n  }\n}'
  }
  if (normalized === 'java data structures' || normalized === 'java data structure') {
    return 'import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.LinkedList;\nimport java.util.Queue;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> list = new ArrayList<>();\n    list.add("Java");\n    list.add("Java");\n\n    HashSet<String> set = new HashSet<>();\n    set.add("Java");\n    set.add("Java");\n\n    HashMap<String, Integer> map = new HashMap<>();\n    map.put("Age", 20);\n\n    Queue<String> queue = new LinkedList<>();\n    queue.add("First");\n    queue.add("Second");\n\n    System.out.println(list);\n    System.out.println(set);\n    System.out.println(map.get("Age"));\n    System.out.println(queue.remove());\n  }\n}'
  }
  if (normalized === 'java collections' || normalized === 'java collections framework') {
    return 'import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.LinkedList;\nimport java.util.Queue;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> list = new ArrayList<>();\n    list.add("John");\n    list.add("Mary");\n\n    HashSet<String> set = new HashSet<>();\n    set.add("A");\n    set.add("A");\n\n    HashMap<String, Integer> map = new HashMap<>();\n    map.put("John", 20);\n\n    Queue<String> queue = new LinkedList<>();\n    queue.add("First");\n    queue.add("Second");\n\n    System.out.println(list);\n    System.out.println(set);\n    System.out.println(map.get("John"));\n    System.out.println(queue.remove());\n  }\n}'
  }
  if (normalized === 'java collections methods' || normalized === 'java collection methods') {
    return 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> list = new ArrayList<>();\n    list.add(10);\n    list.add(3);\n    list.add(7);\n    list.add(3);\n\n    Collections.sort(list);\n    System.out.println("Sorted: " + list);\n\n    Collections.reverse(list);\n    System.out.println("Reversed: " + list);\n\n    System.out.println("Max: " + Collections.max(list));\n    System.out.println("Min: " + Collections.min(list));\n    System.out.println("Frequency of 3: " + Collections.frequency(list, 3));\n  }\n}'
  }
  if (normalized === 'java system methods' || normalized === 'java system method') {
    return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Program started");\n    System.out.println("OS: " + System.getProperty("os.name"));\n    System.out.println("Java Version: " + System.getProperty("java.version"));\n\n    long start = System.currentTimeMillis();\n\n    for (int i = 0; i < 100000; i++) {\n      // dummy work\n    }\n\n    long end = System.currentTimeMillis();\n    System.out.println("Time taken: " + (end - start) + " ms");\n    System.out.println("Program ending");\n  }\n}'
  }
  if (normalized === 'java list') {
    return 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n  public static void main(String[] args) {\n    List<String> names = new ArrayList<>();\n    names.add("John");\n    names.add("Mary");\n    names.add("John");\n\n    System.out.println(names.get(0));\n    names.set(1, "David");\n\n    for (String name : names) {\n      System.out.println(name);\n    }\n  }\n}'
  }
  if (normalized === 'java arraylist' || normalized === 'java array list') {
    return 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> names = new ArrayList<>();\n    names.add("John");\n    names.add("Mary");\n    names.add("Alex");\n\n    System.out.println(names.get(0));\n    names.set(1, "Sarah");\n    Collections.sort(names);\n\n    for (String name : names) {\n      System.out.println(name);\n    }\n  }\n}'
  }
  if (normalized === 'java linkedlist' || normalized === 'java linked list') {
    return 'import java.util.LinkedList;\n\npublic class Main {\n  public static void main(String[] args) {\n    LinkedList<String> names = new LinkedList<>();\n    names.add("John");\n    names.addFirst("Start");\n    names.addLast("End");\n\n    System.out.println(names.getFirst());\n    System.out.println(names.getLast());\n\n    for (String name : names) {\n      System.out.println(name);\n    }\n  }\n}'
  }
  if (normalized === 'java list sorting') {
    return 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> numbers = new ArrayList<>();\n    numbers.add(50);\n    numbers.add(10);\n    numbers.add(30);\n\n    Collections.sort(numbers);\n    System.out.println(numbers);\n\n    Collections.sort(numbers, Collections.reverseOrder());\n    System.out.println(numbers);\n  }\n}'
  }
  if (normalized === 'java set') {
    return 'import java.util.HashSet;\nimport java.util.LinkedHashSet;\nimport java.util.TreeSet;\n\npublic class Main {\n  public static void main(String[] args) {\n    HashSet<String> names = new HashSet<>();\n    names.add("John");\n    names.add("Mary");\n    names.add("John");\n\n    LinkedHashSet<String> ordered = new LinkedHashSet<>();\n    ordered.add("A");\n    ordered.add("B");\n\n    TreeSet<Integer> sorted = new TreeSet<>();\n    sorted.add(50);\n    sorted.add(10);\n    sorted.add(30);\n\n    System.out.println(names);\n    System.out.println(ordered);\n    System.out.println(sorted);\n  }\n}'
  }
  if (normalized === 'java hashset' || normalized === 'java hash set') {
    return 'import java.util.HashSet;\n\npublic class Main {\n  public static void main(String[] args) {\n    HashSet<String> names = new HashSet<>();\n    names.add("John");\n    names.add("Mary");\n    names.add("Alex");\n    names.add("John");\n\n    System.out.println(names.contains("Mary"));\n    names.remove("Alex");\n    System.out.println(names);\n  }\n}'
  }
  if (normalized === 'java treeset' || normalized === 'java tree set') {
    return 'import java.util.TreeSet;\n\npublic class Main {\n  public static void main(String[] args) {\n    TreeSet<Integer> numbers = new TreeSet<>();\n    numbers.add(50);\n    numbers.add(10);\n    numbers.add(30);\n    numbers.add(10);\n\n    System.out.println(numbers);\n    System.out.println(numbers.first());\n    System.out.println(numbers.last());\n  }\n}'
  }
  if (normalized === 'java linkedhashset' || normalized === 'java linked hash set') {
    return 'import java.util.LinkedHashSet;\n\npublic class Main {\n  public static void main(String[] args) {\n    LinkedHashSet<String> names = new LinkedHashSet<>();\n    names.add("John");\n    names.add("Mary");\n    names.add("Alex");\n    names.add("John");\n\n    System.out.println(names);\n    System.out.println(names.contains("Mary"));\n  }\n}'
  }
  if (normalized === 'java map') {
    return 'import java.util.HashMap;\n\npublic class Main {\n  public static void main(String[] args) {\n    HashMap<String, Integer> ages = new HashMap<>();\n    ages.put("John", 25);\n    ages.put("Mary", 30);\n    ages.put("Alex", 20);\n\n    System.out.println(ages.get("John"));\n\n    for (String key : ages.keySet()) {\n      System.out.println(key + ": " + ages.get(key));\n    }\n  }\n}'
  }
  if (normalized === 'java hashmap' || normalized === 'java hash map') {
    return 'import java.util.HashMap;\n\npublic class Main {\n  public static void main(String[] args) {\n    HashMap<String, Integer> ages = new HashMap<>();\n    ages.put("John", 25);\n    ages.put("Mary", 30);\n    ages.put("John", 35);\n\n    System.out.println(ages.get("Mary"));\n    System.out.println(ages.containsKey("John"));\n\n    for (String key : ages.keySet()) {\n      System.out.println(key + ": " + ages.get(key));\n    }\n  }\n}'
  }
  if (normalized === 'java treemap' || normalized === 'java tree map') {
    return 'import java.util.TreeMap;\n\npublic class Main {\n  public static void main(String[] args) {\n    TreeMap<String, Integer> ages = new TreeMap<>();\n    ages.put("John", 25);\n    ages.put("Mary", 30);\n    ages.put("Alex", 20);\n\n    System.out.println(ages);\n    System.out.println(ages.firstKey());\n    System.out.println(ages.lastKey());\n  }\n}'
  }
  if (normalized === 'java linkedhashmap' || normalized === 'java linked hash map') {
    return 'import java.util.LinkedHashMap;\n\npublic class Main {\n  public static void main(String[] args) {\n    LinkedHashMap<String, Integer> ages = new LinkedHashMap<>();\n    ages.put("John", 25);\n    ages.put("Mary", 30);\n    ages.put("Alex", 20);\n    ages.put("John", 40);\n\n    for (String key : ages.keySet()) {\n      System.out.println(key + ": " + ages.get(key));\n    }\n  }\n}'
  }
  if (normalized === 'java iterator') {
    return 'import java.util.ArrayList;\nimport java.util.Iterator;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> names = new ArrayList<>();\n    names.add("John");\n    names.add("Mary");\n    names.add("Alex");\n\n    Iterator<String> it = names.iterator();\n    while (it.hasNext()) {\n      if (it.next().equals("Mary")) {\n        it.remove();\n      }\n    }\n\n    System.out.println(names);\n  }\n}'
  }
  if (normalized === 'java iterator methods' || normalized === 'java iterator method') {
    return 'import java.util.ArrayList;\nimport java.util.Iterator;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> names = new ArrayList<>();\n    names.add("John");\n    names.add("Mary");\n    names.add("Alex");\n\n    Iterator<String> it = names.iterator();\n\n    while (it.hasNext()) {\n      String name = it.next();\n\n      if (name.equals("Mary")) {\n        it.remove();\n      } else {\n        System.out.println(name);\n      }\n    }\n  }\n}'
  }
  if (normalized === 'java algorithms' || normalized === 'java algorithm') {
    return 'import java.util.Arrays;\n\npublic class Main {\n  static int factorial(int n) {\n    if (n == 1) {\n      return 1;\n    }\n    return n * factorial(n - 1);\n  }\n\n  public static void main(String[] args) {\n    int[] numbers = {5, 2, 9, 1, 3};\n    Arrays.sort(numbers);\n    System.out.println(Arrays.toString(numbers));\n    System.out.println(Arrays.binarySearch(numbers, 5));\n    System.out.println(factorial(5));\n  }\n}'
  }
  if (normalized === 'java advanced') {
    return 'import java.util.ArrayList;\nimport java.util.Arrays;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> list = new ArrayList<>();\n    list.add("Hello");\n\n    System.out.println(list.get(0));\n\n    Arrays.stream(new int[] {1, 2, 3, 4, 5})\n      .filter(n -> n > 2)\n      .forEach(System.out::println);\n  }\n}'
  }
  if (normalized === 'java wrapper classes' || normalized === 'java wrapper class') {
    return 'import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    Integer num = 10;\n    int value = num;\n\n    ArrayList<Integer> numbers = new ArrayList<>();\n    numbers.add(value);\n\n    System.out.println(num.equals(10));\n    System.out.println(Integer.parseInt("50"));\n    System.out.println(numbers);\n  }\n}'
  }
  if (normalized === 'java generics' || normalized === 'java generic') {
    return 'import java.util.ArrayList;\n\nclass Box<T> {\n  T value;\n\n  void set(T value) {\n    this.value = value;\n  }\n\n  T get() {\n    return value;\n  }\n}\n\npublic class Main {\n  public static <T> void printData(T data) {\n    System.out.println(data);\n  }\n\n  public static void main(String[] args) {\n    ArrayList<String> list = new ArrayList<>();\n    list.add("Hello");\n\n    Box<Integer> box = new Box<>();\n    box.set(100);\n\n    printData(list.get(0));\n    printData(box.get());\n  }\n}'
  }
  if (normalized === 'java annotations' || normalized === 'java annotation') {
    return 'class Animal {\n  void sound() {\n    System.out.println("Animal sound");\n  }\n}\n\nclass Dog extends Animal {\n  @Override\n  void sound() {\n    System.out.println("Bark");\n  }\n}\n\npublic class Main {\n  @Deprecated\n  static void oldMethod() {\n    System.out.println("This is old");\n  }\n\n  public static void main(String[] args) {\n    new Dog().sound();\n    oldMethod();\n  }\n}'
  }
  if (normalized === 'java regex' || normalized === 'java regular expressions' || normalized.includes('regex')) {
    return JAVA_REGEX_CODE_SAMPLE
  }
  if (normalized === 'java threads' || normalized === 'java thread') {
    return JAVA_THREADS_CODE_SAMPLE
  }
  if (normalized === 'java lambda' || normalized === 'java lambda expressions') {
    return JAVA_LAMBDA_CODE_SAMPLE
  }
  if (normalized === 'java advanced sorting') {
    return JAVA_ADVANCED_SORTING_CODE_SAMPLE
  }
  if (normalized === 'java projects' || normalized === 'java project') {
    return JAVA_PROJECTS_CODE_SAMPLE
  }
  if (normalized === 'java how to\'s' || normalized === 'java how tos') {
    return JAVA_HOW_TOS_CODE_SAMPLE
  }
  if (normalized === 'java reference') {
    return JAVA_REFERENCE_CODE_SAMPLE
  }
  if (normalized === 'java keywords' || normalized === 'java keyword') {
    return JAVA_KEYWORDS_CODE_SAMPLE
  }
  if (normalized === 'java string methods' || normalized === 'java string method') {
    return JAVA_STRING_METHODS_CODE_SAMPLE
  }
  if (normalized === 'java math methods' || normalized === 'java math method') {
    return JAVA_MATH_METHODS_CODE_SAMPLE
  }
  if (normalized.includes('variable') || normalized.includes('data types') || normalized.includes('type casting')) return 'int age = 20;\ndouble score = 96.5;\nSystem.out.println((int) score);'
  if (normalized.includes('operator') || normalized.includes('boolean') || normalized.includes('math')) return 'int a = 4;\nint b = 6;\nSystem.out.println(a + b);\nSystem.out.println(b > a);'
  if (normalized.includes('string')) return 'String name = "DevHub";\nSystem.out.println(name.toUpperCase());'
  if (normalized.includes('if...else')) return 'int score = 75;\nif (score >= 50) {\n  System.out.println("Passed");\n} else {\n  System.out.println("Try again");\n}'
  if (normalized.includes('switch')) return 'int day = 2;\nswitch (day) {\n  case 1 -> System.out.println("Monday");\n  case 2 -> System.out.println("Tuesday");\n  default -> System.out.println("Other");\n}'
  if (normalized.includes('while loop')) return 'int count = 1;\nwhile (count <= 3) {\n  System.out.println(count);\n  count++;\n}'
  if (normalized.includes('for loop')) return 'for (int i = 1; i <= 3; i++) {\n  System.out.println(i);\n}'
  if (normalized.includes('break/continue')) return 'for (int i = 0; i < 5; i++) {\n  if (i == 2) continue;\n  System.out.println(i);\n}'
  if (normalized.includes('array')) return 'String[] topics = {"Syntax", "Loops", "Classes"};\nSystem.out.println(topics[0]);'
  if (normalized.includes('method')) return 'static int add(int a, int b) {\n  return a + b;\n}\n\nSystem.out.println(add(2, 3));'
  if (normalized.includes('scope')) return 'public class Main {\n  static int outside = 10;\n  public static void main(String[] args) {\n    int inside = 5;\n    System.out.println(outside + inside);\n  }\n}'
  if (normalized.includes('recursion')) return 'static int factorial(int n) {\n  return n == 1 ? 1 : n * factorial(n - 1);\n}'
  if (
    normalized.includes('class') ||
    normalized.includes('oop') ||
    normalized.includes('constructor') ||
    normalized.includes('this keyword') ||
    normalized.includes('modifier') ||
    normalized.includes('encapsulation') ||
    normalized.includes('inheritance') ||
    normalized.includes('polymorphism') ||
    normalized.includes('super keyword') ||
    normalized.includes('inner classes') ||
    normalized.includes('abstraction') ||
    normalized.includes('interface') ||
    normalized.includes('anonymous') ||
    normalized.includes('enum')
  ) {
    return 'class Student {\n  private String name;\n\n  Student(String name) {\n    this.name = name;\n  }\n\n  public void introduce() {\n    System.out.println("I am " + name);\n  }\n}\n\nnew Student("Ada").introduce();'
  }
  if (normalized.includes('packages / api')) return 'import java.util.ArrayList;\nArrayList<String> topics = new ArrayList<>();'
  if (normalized.includes('user input')) return 'import java.util.Scanner;\nScanner scanner = new Scanner(System.in);\nString name = scanner.nextLine();\nSystem.out.println(name);'
  if (normalized.includes('date')) return 'import java.time.LocalDate;\nSystem.out.println(LocalDate.now());'
  if (normalized.includes('error') || normalized.includes('debugging') || normalized.includes('exception') || normalized.includes('try-with-resources')) {
    return 'try {\n  int result = 10 / 0;\n} catch (ArithmeticException error) {\n  System.out.println("Cannot divide by zero");\n}'
  }
  if (normalized.includes('file') || normalized.includes('stream') || normalized.includes('bufferedreader') || normalized.includes('bufferedwriter')) {
    return 'import java.io.File;\nFile file = new File("notes.txt");\nSystem.out.println(file.getName());'
  }
  if (
    normalized.includes('data structures') ||
    normalized.includes('collections') ||
    normalized.includes('list') ||
    normalized.includes('arraylist') ||
    normalized.includes('linkedlist') ||
    normalized.includes('set') ||
    normalized.includes('hashset') ||
    normalized.includes('treeset') ||
    normalized.includes('linkedhashset') ||
    normalized.includes('map') ||
    normalized.includes('hashmap') ||
    normalized.includes('treemap') ||
    normalized.includes('linkedhashmap') ||
    normalized.includes('iterator') ||
    normalized.includes('sorting') ||
    normalized.includes('algorithms')
  ) {
    return 'import java.util.ArrayList;\nArrayList<Integer> numbers = new ArrayList<>();\nnumbers.add(3);\nnumbers.add(1);\nnumbers.add(2);\nSystem.out.println(numbers);'
  }
  if (
    normalized.includes('advanced') ||
    normalized.includes('wrapper') ||
    normalized.includes('generic') ||
    normalized.includes('annotation') ||
    normalized.includes('regex') ||
    normalized.includes('thread') ||
    normalized.includes('lambda')
  ) {
    return 'Runnable task = () -> System.out.println("Running in Java");\nnew Thread(task).start();'
  }
  if (normalized.includes('project') || normalized.includes('how to') || normalized.includes('reference') || normalized.includes('keyword') || normalized.includes('methods')) {
    return `System.out.println("${title}");`
  }

  return 'System.out.println("Keep practicing Java in DevHub.");'
}

const createJavaLesson = (title: string, id: number): Lesson => ({
  id,
  title,
  summary: buildJavaLessonSummary(title),
  content: buildJavaLessonContent(title),
  codeSample: buildJavaLessonCodeSample(title),
})

const buildPythonLessonSummary = (title: string) => {
  const normalized = title.toLowerCase()

  if (
    normalized.includes('tutorial') ||
    normalized.includes('home') ||
    normalized.includes('intro') ||
    normalized.includes('overview') ||
    normalized.includes('get started')
  ) {
    return `Get a guided introduction to ${title} and see how it fits into the wider Python learning path.`
  }

  if (
    normalized.includes('reference') ||
    normalized.includes('glossary') ||
    normalized.includes('keywords') ||
    normalized.includes('built-in') ||
    normalized.includes('methods')
  ) {
    return `Use ${title} as a quick Python reference while you learn and build.`
  }

  if (
    normalized.includes('quiz') ||
    normalized.includes('exercise') ||
    normalized.includes('challenge') ||
    normalized.includes('interview') ||
    normalized.includes('certificate') ||
    normalized.includes('training') ||
    normalized.includes('study plan') ||
    normalized.includes('bootcamp') ||
    normalized.includes('syllabus') ||
    normalized.includes('compiler') ||
    normalized.includes('examples')
  ) {
    return `Use ${title} to review, practice, and strengthen your Python skills.`
  }

  if (
    normalized.includes('django') ||
    normalized.includes('numpy') ||
    normalized.includes('pandas') ||
    normalized.includes('scipy') ||
    normalized.includes('matplotlib') ||
    normalized.includes('machine learning') ||
    normalized.includes('mysql') ||
    normalized.includes('mongodb')
  ) {
    return `Explore ${title} and see how Python connects to real-world tools, data, and application development.`
  }

  return `Learn the core idea behind ${title} with clear explanations and practical Python examples.`
}

const buildPythonLessonContent = (title: string) => {
  const cleanTitle = title.replace(/^Python\s+/i, '')

  return `TITLE:
${title}

INTRODUCTION:
This DevHub lesson focuses on ${cleanTitle}. You will learn what it means in Python, when to use it, and how it connects to the rest of the Python tutorial.

WHAT YOU WILL PRACTICE:
- Understand the main idea behind ${cleanTitle}
- Review the most common Python syntax related to this topic
- Connect the concept to a practical beginner-friendly example

DEVHUB TIP:
Read the explanation, inspect the example, and then open Try It Yourself to practice the idea on your own.

NEXT STEP:
Continue to the next Python topic to keep building your skills step by step.`
}

const buildPythonLessonCodeSample = (title: string) => {
  const normalized = title.toLowerCase()

  if (normalized.includes('output')) {
    return 'print("Hello, Python!")\nprint("Output makes your code visible.")'
  }

  if (normalized.includes('comment')) {
    return '# This is a comment\nprint("Comments help explain Python code.")'
  }

  if (normalized.includes('variable') || normalized.includes('data types') || normalized.includes('casting')) {
    return 'name = "DevHub"\nage = int("20")\nprint(name, age)'
  }

  if (normalized.includes('number') || normalized.includes('math')) {
    return 'value = 12.5\nprint(round(value))\nprint(abs(-7))'
  }

  if (normalized.includes('string formatting')) {
    return 'name = "Ada"\nscore = 95\nprint(f"{name} scored {score}")'
  }

  if (normalized.includes('string')) {
    return 'message = "python tutorial"\nprint(message.title())\nprint(message.replace("tutorial", "lesson"))'
  }

  if (normalized.includes('boolean') || normalized.includes('operator')) {
    return 'age = 20\nis_adult = age >= 18\nprint(is_adult and age > 10)'
  }

  if (normalized.includes('list') || normalized.includes('array')) {
    return 'topics = ["variables", "loops", "functions"]\ntopics.append("files")\nprint(topics)'
  }

  if (normalized.includes('tuple')) {
    return 'dimensions = (1920, 1080)\nprint(dimensions[0])'
  }

  if (normalized.includes('set')) {
    return 'tags = {"python", "loops", "python"}\nprint(tags)'
  }

  if (normalized.includes('dictionary')) {
    return 'student = {"name": "Ada", "track": "Python"}\nprint(student["name"])'
  }

  if (normalized.includes('if...else') || normalized.includes('match')) {
    return 'status = "beginner"\nif status == "beginner":\n    print("Start with the basics")\nelse:\n    print("Keep leveling up")'
  }

  if (normalized.includes('while loop')) {
    return 'count = 1\nwhile count <= 3:\n    print(count)\n    count += 1'
  }

  if (normalized.includes('for loop') || normalized.includes('range')) {
    return 'for step in range(1, 4):\n    print(f"Step {step}")'
  }

  if (normalized.includes('function')) {
    return 'def greet(name):\n    return f"Hello, {name}"\n\nprint(greet("Learner"))'
  }

  if (normalized.includes('iterator')) {
    return 'numbers = iter([1, 2, 3])\nprint(next(numbers))\nprint(next(numbers))'
  }

  if (normalized.includes('module') || normalized.includes('pip')) {
    return 'import math\nprint(math.sqrt(81))'
  }

  if (normalized.includes('date')) {
    return 'from datetime import date\nprint(date.today())'
  }

  if (normalized.includes('json')) {
    return 'import json\nuser = {"name": "Ada", "level": "beginner"}\nprint(json.dumps(user))'
  }

  if (normalized.includes('regex')) {
    return 'import re\ntext = "Python 101"\nprint(re.findall(r"\\d+", text))'
  }

  if (normalized.includes('try...except') || normalized.includes('exception')) {
    return 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")'
  }

  if (normalized.includes('none')) {
    return 'result = None\nif result is None:\n    print("No result yet")'
  }

  if (normalized.includes('user input')) {
    return 'name = input("Enter your name: ")\nprint(f"Hello, {name}")'
  }

  if (normalized.includes('virtualenv')) {
    return '# Create a virtual environment\n# python -m venv .venv'
  }

  if (
    normalized.includes('class') ||
    normalized.includes('oop') ||
    normalized.includes('inheritance') ||
    normalized.includes('polymorphism') ||
    normalized.includes('encapsulation') ||
    normalized.includes('__init__') ||
    normalized.includes('self parameter')
  ) {
    return 'class Student:\n    def __init__(self, name):\n        self.name = name\n\n    def introduce(self):\n        print(f"I am {self.name}")\n\nStudent("Ada").introduce()'
  }

  if (normalized.includes('file handling') || normalized.includes('read files') || normalized.includes('write/create files') || normalized.includes('delete files')) {
    return 'with open("notes.txt", "w") as file:\n    file.write("Practice Python daily.")'
  }

  if (normalized.includes('numpy')) {
    return 'import numpy as np\nnumbers = np.array([1, 2, 3])\nprint(numbers.mean())'
  }

  if (normalized.includes('pandas')) {
    return 'import pandas as pd\ndata = pd.DataFrame({"name": ["Ada", "Linus"]})\nprint(data.head())'
  }

  if (normalized.includes('scipy')) {
    return 'from scipy import constants\nprint(constants.pi)'
  }

  if (normalized.includes('django')) {
    return '# django-admin startproject devhub_project'
  }

  if (
    normalized.includes('matplotlib') ||
    normalized.includes('plot') ||
    normalized.includes('subplot') ||
    normalized.includes('scatter') ||
    normalized.includes('bars') ||
    normalized.includes('histogram') ||
    normalized.includes('pie charts')
  ) {
    return 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [2, 4, 6])\nplt.show()'
  }

  if (
    normalized.includes('machine learning') ||
    normalized.includes('regression') ||
    normalized.includes('decision tree') ||
    normalized.includes('confusion matrix') ||
    normalized.includes('clustering') ||
    normalized.includes('grid search') ||
    normalized.includes('k-means') ||
    normalized.includes('cross validation') ||
    normalized.includes('k-nearest') ||
    normalized.includes('mean median mode') ||
    normalized.includes('standard deviation') ||
    normalized.includes('percentile') ||
    normalized.includes('distribution')
  ) {
    return 'from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nprint("Machine learning model ready")'
  }

  if (
    normalized.includes('dsa') ||
    normalized.includes('stack') ||
    normalized.includes('queue') ||
    normalized.includes('linked list') ||
    normalized.includes('hash table') ||
    normalized.includes('tree') ||
    normalized.includes('graph') ||
    normalized.includes('search') ||
    normalized.includes('sort')
  ) {
    return 'numbers = [5, 2, 9, 1]\nprint(sorted(numbers))'
  }

  if (normalized.includes('mysql')) {
    return 'import mysql.connector\nprint("Connect to MySQL and run your query here.")'
  }

  if (normalized.includes('mongodb')) {
    return 'from pymongo import MongoClient\nprint("Connect to MongoDB and run your query here.")'
  }

  if (
    normalized.includes('how to') ||
    normalized.includes('remove list duplicates') ||
    normalized.includes('reverse a string') ||
    normalized.includes('add two numbers')
  ) {
    return 'numbers = [1, 1, 2, 3]\nunique_numbers = list(dict.fromkeys(numbers))\nprint(unique_numbers)'
  }

  if (
    normalized.includes('quiz') ||
    normalized.includes('examples') ||
    normalized.includes('compiler') ||
    normalized.includes('exercise') ||
    normalized.includes('challenge') ||
    normalized.includes('server') ||
    normalized.includes('study plan') ||
    normalized.includes('interview') ||
    normalized.includes('bootcamp') ||
    normalized.includes('certificate') ||
    normalized.includes('training')
  ) {
    return `topic = "${title}"\nprint(f"Keep practicing: {topic}")`
  }

  return `topic = "${title}"\nprint(f"Studying: {topic}")`
}

const createPythonLesson = (title: string, id: number): Lesson => ({
  id,
  title,
  summary: buildPythonLessonSummary(title),
  content: buildPythonLessonContent(title),
  codeSample: buildPythonLessonCodeSample(title),
})

export const courseData: CourseData[] = [
  {
    id: 1,
    slug: 'html-tutorial',
    title: 'HTML Tutorial',
    category: 'Web Development',
    difficulty: 'BEGINNER',
    description: 'Learn the basics of HTML to build web pages.',
    image: 'html.png',
    lessons: HTML_TUTORIAL_TOPICS.map((title, index) => createHtmlLesson(title, index + 1)),
  },
  {
    id: 2,
    slug: 'css-tutorial',
    title: 'CSS Tutorial',
    category: 'Web Development',
    difficulty: 'BEGINNER',
    description: 'Style your web page using CSS for color, layout, and typography.',
    image: 'css.png',
    lessons: CSS_TUTORIAL_TOPICS.map((title, index) => createCssLesson(title, index + 1)),
  },
  {
    id: 3,
    slug: 'java-tutorial',
    title: 'Java Tutorial',
    category: 'Programming',
    difficulty: 'BEGINNER',
    description: 'Learn Java from scratch with clear object-oriented lessons and practical examples.',
    image: 'javascript.png',
    lessons: JAVA_TUTORIAL_TOPICS.map((title, index) => createJavaLesson(title, index + 1)),
  },
  {
    id: 4,
    slug: 'python-tutorial',
    title: 'Python Tutorial',
    category: 'Programming',
    difficulty: 'BEGINNER',
    description: 'Start programming in Python with easy-to-follow exercises.',
    image: 'python.png',
    lessons: PYTHON_TUTORIAL_TOPICS.map((title, index) => createPythonLesson(title, index + 1)),
  },
]
