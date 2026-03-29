-- ============================================
-- Sample Topics Data
-- Beginner-friendly programming tutorials
-- with high-quality YouTube video tutorials
-- ============================================

-- ============================================
-- HTML Topics
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, video_url, video_duration)
VALUES
(
    'html',
    'Introduction to HTML',
    'introduction-to-html',
    'Learn what HTML is and why every website needs it.',
    'HTML is the foundation of every webpage. Without HTML, browsers would not know how to show your content. It is easy to learn and the perfect starting point for web development.',
    'HTML stands for HyperText Markup Language. It is not a programming language - it is a markup language that tells browsers how to display content.

Think of HTML like the skeleton of a building. It provides the structure that holds everything together.

Every webpage you see uses HTML. When you visit a website, your browser downloads the HTML file and displays it as text, images, buttons, and more.

HTML uses tags to mark up content. Tags are words inside angle brackets like <h1> and </h1>. The browser reads these tags and shows the content between them.',
    'HTML stands for HyperText Markup Language
HTML is not a programming language - it is markup
HTML provides the structure of webpages
Tags tell the browser what to display
Most tags have opening and closing parts
HTML files end with .html',
    'beginner',
    1,
    'https://www.youtube.com/watch?v=DE4Tm4LhfxY',
    600
),

(
    'html',
    'HTML Elements',
    'html-elements',
    'Learn how to create headings, paragraphs, links, and images.',
    'Everything you see on a webpage is an element. Elements let you structure your content into headings, paragraphs, lists, links, and images. Knowing elements is essential for building any webpage.',
    'An HTML element has three parts:

1. Opening tag - like <p>
2. Content - your text goes here
3. Closing tag - like </p>

Together, they make a complete element: <p>Hello!</p>

Some elements do not need closing tags. These are called empty elements or self-closing tags:

- <br> adds a line break
- <img> adds an image
- <hr> adds a horizontal line

Common elements you will use:
- <h1> to <h6> for headings (h1 is biggest)
- <p> for paragraphs
- <a> for links
- <img> for images
- <ul> and <li> for lists',
    'Elements have opening and closing tags
Content goes between the tags
<h1> to <h6> are headings (h1 is biggest)
<p> creates paragraphs
<a href="url"> creates links
<img src="url"> displays images
<br> and <img> are self-closing tags',
    'beginner',
    2,
    'https://www.youtube.com/watch?v=salY_Sm6mv4',
    720
);

-- HTML Code Examples
INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Basic HTML Page', 'The structure every webpage needs', '<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is my first webpage.</p>
</body>
</html>', 'html', 'A complete webpage with title, heading, and paragraph', 1
FROM topics WHERE slug = 'introduction-to-html';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Different Headings', 'h1 is biggest, h6 is smallest', '<h1>Main Title</h1>
<h2>Subtitle</h2>
<h3>Section Header</h3>
<p>Normal paragraph text.</p>', 'html', 'Shows how heading sizes work', 1
FROM topics WHERE slug = 'html-elements';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Link and Image', 'Clickable link and displayed image', '<a href="https://google.com">Visit Google</a>

<img src="photo.jpg" alt="A photo">', 'html', 'A clickable link and an image', 2
FROM topics WHERE slug = 'html-elements';

-- ============================================
-- CSS Topics
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, video_url, video_duration)
VALUES
(
    'css',
    'Introduction to CSS',
    'introduction-to-css',
    'Learn how to add colors, fonts, and style to your webpages.',
    'CSS makes websites beautiful! Without CSS, all websites would look the same - plain black text on white backgrounds. CSS lets you add colors, change fonts, and create layouts that impress visitors.',
    'CSS stands for Cascading Style Sheets. If HTML is the skeleton, CSS is the skin, hair, and clothes.

CSS works by selecting HTML elements and applying styles to them. The basic structure is:

selector { property: value; }

For example, to make all paragraphs blue:
p { color: blue; }

You can add CSS to HTML in three ways:
1. Inline - inside HTML tags
2. Internal - inside <style> in <head>
3. External - in a separate .css file (best practice)',
    'CSS means Cascading Style Sheets
CSS styles HTML elements
Use: selector { property: value; }
p { color: blue; } changes paragraph color
CSS can change colors, fonts, sizes, spacing
External CSS files are best for big projects',
    'beginner',
    1,
    'https://www.youtube.com/watch?v=1PnVor36_40',
    720
),

(
    'css',
    'CSS Selectors',
    'css-selectors',
    'Learn how to target specific elements to style them.',
    'Selectors tell CSS which elements to style. Without selectors, CSS would not know what to change. Different selectors let you style all paragraphs, specific buttons, or just one special element.',
    'A selector targets specific HTML elements. The three most common selectors are:

1. Tag selector - targets all elements of one type
   p { color: red; }
   This makes ALL paragraphs red.

2. Class selector - targets elements with a class
   .highlight { background: yellow; }
   This styles elements with class="highlight".

3. ID selector - targets one specific element
   #header { font-size: 24px; }
   This styles the element with id="header".

Remember:
- Classes start with . (dot)
- IDs start with # (hash)
- Use classes for styles you reuse
- Use IDs for unique, one-time styles',
    'Tag selector: p { } targets all paragraphs
Class selector: .name { } targets class="name"
ID selector: #name { } targets id="name"
Classes can be reused on many elements
IDs should be unique on the page
Tag < Class < ID in priority',
    'beginner',
    2,
    'https://www.youtube.com/watch?v=l1mER1bV0N0',
    540
);

-- CSS Code Examples
INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Style a Paragraph', 'Change text color and background', 'p {
  color: blue;
  background-color: lightgray;
  padding: 10px;
}', 'css', 'Blue text on a light gray background with padding', 1
FROM topics WHERE slug = 'introduction-to-css';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Using a Class', 'Create reusable styles', '.highlight {
  background-color: yellow;
  padding: 5px;
}

.center {
  text-align: center;
}', 'css', 'Styles you can apply to multiple elements', 2
FROM topics WHERE slug = 'introduction-to-css';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Three Selector Types', 'See the difference', '/* All <p> elements */
p { color: black; }

/* Elements with class="btn" */
.btn { background: blue; }

/* Element with id="logo" */
#logo { width: 200px; }', 'css', 'Tag, class, and ID selectors', 1
FROM topics WHERE slug = 'css-selectors';

-- ============================================
-- JavaScript Topics
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, video_url, video_duration)
VALUES
(
    'javascript',
    'JavaScript Variables',
    'javascript-variables',
    'Learn how to store and use data in your programs.',
    'Variables are containers for storing information. Without variables, programs could not remember anything. They let you save names, numbers, and other data to use later in your code.',
    'Variables are like labeled boxes that store information.

In JavaScript, you create variables using let or const:

let name = "Alice";    // can change later
const age = 25;        // cannot change

Use let when the value might change:
let score = 0;
score = score + 10;  // OK!

Use const when the value stays the same:
const pi = 3.14;      // always this value

Variable names should describe what they store:
- Good: userName, totalPrice, isLoggedIn
- Bad: x, data, temp

JavaScript data types:
- "Hello" is a string (text)
- 42 is a number
- true or false is a boolean',
    'Variables store data values
Use let for values that change
Use const for values that stay the same
Variable names should be descriptive
Strings use quotes: "Hello"
Numbers do not need quotes: 42
Booleans are true or false',
    'beginner',
    1,
    'https://www.youtube.com/watch?v=XqTjhBJ3OjA',
    480
),

(
    'javascript',
    'JavaScript Functions',
    'javascript-functions',
    'Learn how to create reusable blocks of code.',
    'Functions let you write code once and use it many times. Instead of copying the same code everywhere, you put it in a function and call it when needed. This saves time and reduces mistakes.',
    'A function is a reusable block of code that does one task.

Define a function:
function sayHello() {
  console.log("Hello!");
}

Call a function:
sayHello();  // Shows "Hello!"

Functions can take inputs (called parameters):
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Alice");  // Shows "Hello, Alice!"
greet("Bob");    // Shows "Hello, Bob!"

Functions can give back results (return values):
function add(a, b) {
  return a + b;
}

let sum = add(5, 3);  // sum is 8

Functions help you:
- Avoid repeating code
- Organize your thinking
- Test small pieces separately',
    'Functions are reusable blocks of code
Define with the function keyword
Call a function by using its name with ()
Parameters are inputs the function receives
Return sends back a result
Functions save time and reduce errors',
    'beginner',
    2,
    'https://www.youtube.com/watch?v=FN6wLqPPBME',
    600
);

-- JavaScript Code Examples
INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Create Variables', 'Store different types of data', 'let name = "Alice";
const age = 25;
let isStudent = true;

console.log(name);
console.log(age);
console.log(isStudent);', 'javascript', 'Alice\n25\ntrue', 1
FROM topics WHERE slug = 'javascript-variables';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Calculate Prices', 'Use variables in math', 'let price = 10;
let quantity = 3;
let total = price * quantity;

console.log("Total: $" + total);', 'javascript', 'Total: $30', 2
FROM topics WHERE slug = 'javascript-variables';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Simple Function', 'Create and use a function', 'function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice"));
console.log(greet("Bob"));', 'javascript', 'Hello, Alice!\nHello, Bob!', 1
FROM topics WHERE slug = 'javascript-functions';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Math Functions', 'Return calculated values', 'function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

console.log(add(5, 3));
console.log(multiply(4, 7));', 'javascript', '8\n28', 2
FROM topics WHERE slug = 'javascript-functions';

-- ============================================
-- Python Topics
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, video_url, video_duration)
VALUES
(
    'python',
    'Python Variables',
    'python-variables',
    'Learn how to store and use data in Python.',
    'Variables are like labeled boxes that hold information. In Python, creating variables is simple - just write the name, an equals sign, and the value. No special commands needed!',
    'Variables in Python are easy to create:

name = "Alice"
age = 25
is_student = True
price = 19.99

Python automatically knows what type each variable is. You do not need to tell Python ahead of time.

Common data types in Python:
- Strings: "Hello" or ''Hi''
- Integers: 42, -7, 100
- Floats: 3.14, 2.5, -0.5
- Booleans: True, False

Rules for variable names:
- Start with a letter or underscore
- Can contain letters, numbers, underscores
- Cannot be Python keywords like if, for, while
- Use lowercase with underscores: user_name, total_price

Good names make code easier to read!',
    'Create variables with: name = value
No need to declare the type
Python auto-detects the type
Strings use quotes: "Hello"
Integers are whole numbers: 42
Booleans are True or False
Use underscores in names: user_name',
    'beginner',
    1,
    'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    600
),

(
    'python',
    'Python Loops',
    'python-loops',
    'Learn how to repeat actions without copying code.',
    'Loops let you repeat code without writing it multiple times. Instead of copy-pasting code, you use a loop to run the same code as many times as needed. This makes your code shorter and easier to maintain.',
    'Python has two types of loops:

FOR LOOP - Go through a list or sequence:

for i in range(5):
    print(i)
# Prints: 0, 1, 2, 3, 4

for fruit in ["apple", "banana"]:
    print(fruit)
# Prints: apple, banana

WHILE LOOP - Repeat while something is true:

count = 0
while count < 3:
    print(count)
    count = count + 1
# Prints: 0, 1, 2

Use for when you know how many times to repeat.
Use while when you want to keep going until something changes.

Loop control:
- break: exit the loop early
- continue: skip to the next iteration',
    'for loops go through a sequence
range(5) gives numbers 0 to 4
while loops repeat while true
break exits a loop early
continue skips to next iteration
Indentation defines the loop body',
    'beginner',
    2,
    'https://www.youtube.com/watch?v=OnDr4J2UtSA',
    540
);

-- Python Code Examples
INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Different Data Types', 'Store strings, numbers, booleans', 'name = "Alice"
age = 25
height = 5.6
is_student = True

print(name)
print(age)
print(height)
print(is_student)', 'python', 'Alice\n25\n5.6\nTrue', 1
FROM topics WHERE slug = 'python-variables';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Good Variable Names', 'Use descriptive names', '# Good names
user_name = "Bob"
total_price = 29.99
is_valid = True

# These would cause errors
# 2name = "Bad"
# user-name = "Bad"

print(user_name)', 'python', 'Bob', 2
FROM topics WHERE slug = 'python-variables';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'For Loop with Range', 'Print numbers 0 to 4', 'for i in range(5):
    print(f"Count: {i}")', 'python', 'Count: 0\nCount: 1\nCount: 2\nCount: 3\nCount: 4', 1
FROM topics WHERE slug = 'python-loops';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'Loop Through a List', 'Access each item', 'fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I like {fruit}")', 'python', 'I like apple\nI like banana\nI like cherry', 2
FROM topics WHERE slug = 'python-loops';

INSERT INTO topic_code_examples (topic_id, title, description, code, code_language, output, order_index)
SELECT id, 'While Loop', 'Count until condition is false', 'count = 0
while count < 3:
    print(f"Number: {count}")
    count = count + 1
print("Done!")', 'python', 'Number: 0\nNumber: 1\nNumber: 2\nDone!', 3
FROM topics WHERE slug = 'python-loops';

-- ============================================
-- Additional Python Topics (extended curriculum)
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, video_url, video_duration) VALUES
('python','Python Tutorial','python-tutorial','Learn about Python Tutorial as part of the extended Python curriculum.','Python Tutorial is an important area in Python learning.','Understand the basics of Python Tutorial.','Python Tutorial key concepts','beginner',3,NULL,NULL),
('python','Python HOME','python-home','Learn about Python HOME as part of the extended Python curriculum.','Python HOME is an important area in Python learning.','Understand the basics of Python HOME.','Python HOME key concepts','beginner',4,NULL,NULL),
('python','Python Intro','python-intro','Learn about Python Intro as part of the extended Python curriculum.','Python Intro is an important area in Python learning.','Understand the basics of Python Intro.','Python Intro key concepts','beginner',5,NULL,NULL),
('python','Python Get Started','python-get-started','Learn about Python Get Started as part of the extended Python curriculum.','Python Get Started is an important area in Python learning.','Understand the basics of Python Get Started.','Python Get Started key concepts','beginner',6,NULL,NULL),
('python','Python Syntax','python-syntax','Learn about Python Syntax as part of the extended Python curriculum.','Python Syntax is an important area in Python learning.','Understand the basics of Python Syntax.','Python Syntax key concepts','beginner',7,NULL,NULL),
('python','Python Output','python-output','Learn about Python Output as part of the extended Python curriculum.','Python Output is an important area in Python learning.','Understand the basics of Python Output.','Python Output key concepts','beginner',8,NULL,NULL),
('python','Python Comments','python-comments','Learn about Python Comments as part of the extended Python curriculum.','Python Comments is an important area in Python learning.','Understand the basics of Python Comments.','Python Comments key concepts','beginner',9,NULL,NULL),
('python','Python Data Types','python-data-types','Learn about Python Data Types as part of the extended Python curriculum.','Python Data Types is an important area in Python learning.','Understand the basics of Python Data Types.','Python Data Types key concepts','beginner',11,NULL,NULL),
('python','Python Numbers','python-numbers','Learn about Python Numbers as part of the extended Python curriculum.','Python Numbers is an important area in Python learning.','Understand the basics of Python Numbers.','Python Numbers key concepts','beginner',12,NULL,NULL),
('python','Python Casting','python-casting','Learn about Python Casting as part of the extended Python curriculum.','Python Casting is an important area in Python learning.','Understand the basics of Python Casting.','Python Casting key concepts','beginner',13,NULL,NULL),
('python','Python Strings','python-strings','Learn about Python Strings as part of the extended Python curriculum.','Python Strings is an important area in Python learning.','Understand the basics of Python Strings.','Python Strings key concepts','beginner',14,NULL,NULL),
('python','Python Booleans','python-booleans','Learn about Python Booleans as part of the extended Python curriculum.','Python Booleans is an important area in Python learning.','Understand the basics of Python Booleans.','Python Booleans key concepts','beginner',15,NULL,NULL),
('python','Python Operators','python-operators','Learn about Python Operators as part of the extended Python curriculum.','Python Operators is an important area in Python learning.','Understand the basics of Python Operators.','Python Operators key concepts','beginner',16,NULL,NULL),
('python','Python Lists','python-lists','Learn about Python Lists as part of the extended Python curriculum.','Python Lists is an important area in Python learning.','Understand the basics of Python Lists.','Python Lists key concepts','beginner',17,NULL,NULL),
('python','Python Tuples','python-tuples','Learn about Python Tuples as part of the extended Python curriculum.','Python Tuples is an important area in Python learning.','Understand the basics of Python Tuples.','Python Tuples key concepts','beginner',18,NULL,NULL),
('python','Python Sets','python-sets','Learn about Python Sets as part of the extended Python curriculum.','Python Sets is an important area in Python learning.','Understand the basics of Python Sets.','Python Sets key concepts','beginner',19,NULL,NULL),
('python','Python Dictionaries','python-dictionaries','Learn about Python Dictionaries as part of the extended Python curriculum.','Python Dictionaries is an important area in Python learning.','Understand the basics of Python Dictionaries.','Python Dictionaries key concepts','beginner',20,NULL,NULL),
('python','Python If...Else','python-ifelse','Learn about Python If...Else as part of the extended Python curriculum.','Python If...Else is an important area in Python learning.','Understand the basics of Python If...Else.','Python If...Else key concepts','beginner',21,NULL,NULL),
('python','Python Match','python-match','Learn about Python Match as part of the extended Python curriculum.','Python Match is an important area in Python learning.','Understand the basics of Python Match.','Python Match key concepts','beginner',22,NULL,NULL),
('python','Python While Loops','python-while-loops','Learn about Python While Loops as part of the extended Python curriculum.','Python While Loops is an important area in Python learning.','Understand the basics of Python While Loops.','Python While Loops key concepts','beginner',23,NULL,NULL),
('python','Python For Loops','python-for-loops','Learn about Python For Loops as part of the extended Python curriculum.','Python For Loops is an important area in Python learning.','Understand the basics of Python For Loops.','Python For Loops key concepts','beginner',24,NULL,NULL),
('python','Python Functions','python-functions','Learn about Python Functions as part of the extended Python curriculum.','Python Functions is an important area in Python learning.','Understand the basics of Python Functions.','Python Functions key concepts','beginner',25,NULL,NULL),
('python','Python Range','python-range','Learn about Python Range as part of the extended Python curriculum.','Python Range is an important area in Python learning.','Understand the basics of Python Range.','Python Range key concepts','beginner',26,NULL,NULL),
('python','Python Arrays','python-arrays','Learn about Python Arrays as part of the extended Python curriculum.','Python Arrays is an important area in Python learning.','Understand the basics of Python Arrays.','Python Arrays key concepts','beginner',27,NULL,NULL),
('python','Python Iterators','python-iterators','Learn about Python Iterators as part of the extended Python curriculum.','Python Iterators is an important area in Python learning.','Understand the basics of Python Iterators.','Python Iterators key concepts','beginner',28,NULL,NULL),
('python','Python Modules','python-modules','Learn about Python Modules as part of the extended Python curriculum.','Python Modules is an important area in Python learning.','Understand the basics of Python Modules.','Python Modules key concepts','beginner',29,NULL,NULL),
('python','Python Dates','python-dates','Learn about Python Dates as part of the extended Python curriculum.','Python Dates is an important area in Python learning.','Understand the basics of Python Dates.','Python Dates key concepts','beginner',30,NULL,NULL),
('python','Python Math','python-math','Learn about Python Math as part of the extended Python curriculum.','Python Math is an important area in Python learning.','Understand the basics of Python Math.','Python Math key concepts','beginner',31,NULL,NULL),
('python','Python JSON','python-json','Learn about Python JSON as part of the extended Python curriculum.','Python JSON is an important area in Python learning.','Understand the basics of Python JSON.','Python JSON key concepts','beginner',32,NULL,NULL),
('python','Python RegEx','python-regex','Learn about Python RegEx as part of the extended Python curriculum.','Python RegEx is an important area in Python learning.','Understand the basics of Python RegEx.','Python RegEx key concepts','beginner',33,NULL,NULL),
('python','Python PIP','python-pip','Learn about Python PIP as part of the extended Python curriculum.','Python PIP is an important area in Python learning.','Understand the basics of Python PIP.','Python PIP key concepts','beginner',34,NULL,NULL),
('python','Python Try...Except','python-tryexcept','Learn about Python Try...Except as part of the extended Python curriculum.','Python Try...Except is an important area in Python learning.','Understand the basics of Python Try...Except.','Python Try...Except key concepts','beginner',35,NULL,NULL),
('python','Python String Formatting','python-string-formatting','Learn about Python String Formatting as part of the extended Python curriculum.','Python String Formatting is an important area in Python learning.','Understand the basics of Python String Formatting.','Python String Formatting key concepts','beginner',36,NULL,NULL),
('python','Python None','python-none','Learn about Python None as part of the extended Python curriculum.','Python None is an important area in Python learning.','Understand the basics of Python None.','Python None key concepts','beginner',37,NULL,NULL),
('python','Python User Input','python-user-input','Learn about Python User Input as part of the extended Python curriculum.','Python User Input is an important area in Python learning.','Understand the basics of Python User Input.','Python User Input key concepts','beginner',38,NULL,NULL),
('python','Python VirtualEnv','python-virtualenv','Learn about Python VirtualEnv as part of the extended Python curriculum.','Python VirtualEnv is an important area in Python learning.','Understand the basics of Python VirtualEnv.','Python VirtualEnv key concepts','beginner',39,NULL,NULL),
('python','Python Classes','python-classes','Learn about Python Classes as part of the extended Python curriculum.','Python Classes is an important area in Python learning.','Understand the basics of Python Classes.','Python Classes key concepts','beginner',40,NULL,NULL),
('python','Python OOP','python-oop','Learn about Python OOP as part of the extended Python curriculum.','Python OOP is an important area in Python learning.','Understand the basics of Python OOP.','Python OOP key concepts','beginner',41,NULL,NULL),
('python','Python Classes/Objects','python-classesobjects','Learn about Python Classes/Objects as part of the extended Python curriculum.','Python Classes/Objects is an important area in Python learning.','Understand the basics of Python Classes/Objects.','Python Classes/Objects key concepts','beginner',42,NULL,NULL),
('python','Python __init__ Method','python-init-method','Learn about Python __init__ Method as part of the extended Python curriculum.','Python __init__ Method is an important area in Python learning.','Understand the basics of Python __init__ Method.','Python __init__ Method key concepts','beginner',43,NULL,NULL),
('python','Python self Parameter','python-self-parameter','Learn about Python self Parameter as part of the extended Python curriculum.','Python self Parameter is an important area in Python learning.','Understand the basics of Python self Parameter.','Python self Parameter key concepts','beginner',44,NULL,NULL),
('python','Python Class Properties','python-class-properties','Learn about Python Class Properties as part of the extended Python curriculum.','Python Class Properties is an important area in Python learning.','Understand the basics of Python Class Properties.','Python Class Properties key concepts','beginner',45,NULL,NULL),
('python','Python Class Methods','python-class-methods','Learn about Python Class Methods as part of the extended Python curriculum.','Python Class Methods is an important area in Python learning.','Understand the basics of Python Class Methods.','Python Class Methods key concepts','beginner',46,NULL,NULL),
('python','Python Inheritance','python-inheritance','Learn about Python Inheritance as part of the extended Python curriculum.','Python Inheritance is an important area in Python learning.','Understand the basics of Python Inheritance.','Python Inheritance key concepts','beginner',47,NULL,NULL),
('python','Python Polymorphism','python-polymorphism','Learn about Python Polymorphism as part of the extended Python curriculum.','Python Polymorphism is an important area in Python learning.','Understand the basics of Python Polymorphism.','Python Polymorphism key concepts','beginner',48,NULL,NULL),
('python','Python Encapsulation','python-encapsulation','Learn about Python Encapsulation as part of the extended Python curriculum.','Python Encapsulation is an important area in Python learning.','Understand the basics of Python Encapsulation.','Python Encapsulation key concepts','beginner',49,NULL,NULL),
('python','Python Inner Classes','python-inner-classes','Learn about Python Inner Classes as part of the extended Python curriculum.','Python Inner Classes is an important area in Python learning.','Understand the basics of Python Inner Classes.','Python Inner Classes key concepts','beginner',50,NULL,NULL),
('python','File Handling','file-handling','Learn about File Handling as part of the extended Python curriculum.','File Handling is an important area in Python learning.','Understand the basics of File Handling.','File Handling key concepts','beginner',51,NULL,NULL),
('python','Python File Handling','python-file-handling','Learn about Python File Handling as part of the extended Python curriculum.','Python File Handling is an important area in Python learning.','Understand the basics of Python File Handling.','Python File Handling key concepts','beginner',52,NULL,NULL),
('python','Python Read Files','python-read-files','Learn about Python Read Files as part of the extended Python curriculum.','Python Read Files is an important area in Python learning.','Understand the basics of Python Read Files.','Python Read Files key concepts','beginner',53,NULL,NULL),
('python','Python Write/Create Files','python-writefiles','Learn about Python Write/Create Files as part of the extended Python curriculum.','Python Write/Create Files is an important area in Python learning.','Understand the basics of Python Write/Create Files.','Python Write/Create Files key concepts','beginner',54,NULL,NULL),
('python','Python Delete Files','python-delete-files','Learn about Python Delete Files as part of the extended Python curriculum.','Python Delete Files is an important area in Python learning.','Understand the basics of Python Delete Files.','Python Delete Files key concepts','beginner',55,NULL,NULL),
('python','NumPy Tutorial','numpy-tutorial','Learn about NumPy Tutorial as part of the extended Python curriculum.','NumPy Tutorial is an important area in Python learning.','Understand the basics of NumPy Tutorial.','NumPy Tutorial key concepts','beginner',56,NULL,NULL),
('python','Pandas Tutorial','pandas-tutorial','Learn about Pandas Tutorial as part of the extended Python curriculum.','Pandas Tutorial is an important area in Python learning.','Understand the basics of Pandas Tutorial.','Pandas Tutorial key concepts','beginner',57,NULL,NULL),
('python','SciPy Tutorial','scipy-tutorial','Learn about SciPy Tutorial as part of the extended Python curriculum.','SciPy Tutorial is an important area in Python learning.','Understand the basics of SciPy Tutorial.','SciPy Tutorial key concepts','beginner',58,NULL,NULL),
('python','Django Tutorial','django-tutorial','Learn about Django Tutorial as part of the extended Python curriculum.','Django Tutorial is an important area in Python learning.','Understand the basics of Django Tutorial.','Django Tutorial key concepts','beginner',59,NULL,NULL),
('python','Python Matplotlib','python-matplotlib','Learn about Python Matplotlib as part of the extended Python curriculum.','Python Matplotlib is an important area in Python learning.','Understand the basics of Python Matplotlib.','Python Matplotlib key concepts','beginner',60,NULL,NULL),
('python','Matplotlib Intro','matplotlib-intro','Learn about Matplotlib Intro as part of the extended Python curriculum.','Matplotlib Intro is an important area in Python learning.','Understand the basics of Matplotlib Intro.','Matplotlib Intro key concepts','beginner',61,NULL,NULL),
('python','Matplotlib Get Started','matplotlib-get-started','Learn about Matplotlib Get Started as part of the extended Python curriculum.','Matplotlib Get Started is an important area in Python learning.','Understand the basics of Matplotlib Get Started.','Matplotlib Get Started key concepts','beginner',62,NULL,NULL),
('python','Matplotlib Pyplot','matplotlib-pyplot','Learn about Matplotlib Pyplot as part of the extended Python curriculum.','Matplotlib Pyplot is an important area in Python learning.','Understand the basics of Matplotlib Pyplot.','Matplotlib Pyplot key concepts','beginner',63,NULL,NULL),
('python','Matplotlib Plotting','matplotlib-plotting','Learn about Matplotlib Plotting as part of the extended Python curriculum.','Matplotlib Plotting is an important area in Python learning.','Understand the basics of Matplotlib Plotting.','Matplotlib Plotting key concepts','beginner',64,NULL,NULL),
('python','Matplotlib Markers','matplotlib-markers','Learn about Matplotlib Markers as part of the extended Python curriculum.','Matplotlib Markers is an important area in Python learning.','Understand the basics of Matplotlib Markers.','Matplotlib Markers key concepts','beginner',65,NULL,NULL),
('python','Matplotlib Line','matplotlib-line','Learn about Matplotlib Line as part of the extended Python curriculum.','Matplotlib Line is an important area in Python learning.','Understand the basics of Matplotlib Line.','Matplotlib Line key concepts','beginner',66,NULL,NULL),
('python','Matplotlib Labels','matplotlib-labels','Learn about Matplotlib Labels as part of the extended Python curriculum.','Matplotlib Labels is an important area in Python learning.','Understand the basics of Matplotlib Labels.','Matplotlib Labels key concepts','beginner',67,NULL,NULL),
('python','Matplotlib Grid','matplotlib-grid','Learn about Matplotlib Grid as part of the extended Python curriculum.','Matplotlib Grid is an important area in Python learning.','Understand the basics of Matplotlib Grid.','Matplotlib Grid key concepts','beginner',68,NULL,NULL),
('python','Matplotlib Subplot','matplotlib-subplot','Learn about Matplotlib Subplot as part of the extended Python curriculum.','Matplotlib Subplot is an important area in Python learning.','Understand the basics of Matplotlib Subplot.','Matplotlib Subplot key concepts','beginner',69,NULL,NULL),
('python','Matplotlib Scatter','matplotlib-scatter','Learn about Matplotlib Scatter as part of the extended Python curriculum.','Matplotlib Scatter is an important area in Python learning.','Understand the basics of Matplotlib Scatter.','Matplotlib Scatter key concepts','beginner',70,NULL,NULL),
('python','Matplotlib Bars','matplotlib-bars','Learn about Matplotlib Bars as part of the extended Python curriculum.','Matplotlib Bars is an important area in Python learning.','Understand the basics of Matplotlib Bars.','Matplotlib Bars key concepts','beginner',71,NULL,NULL),
('python','Matplotlib Histograms','matplotlib-histograms','Learn about Matplotlib Histograms as part of the extended Python curriculum.','Matplotlib Histograms is an important area in Python learning.','Understand the basics of Matplotlib Histograms.','Matplotlib Histograms key concepts','beginner',72,NULL,NULL),
('python','Matplotlib Pie Charts','matplotlib-pie-charts','Learn about Matplotlib Pie Charts as part of the extended Python curriculum.','Matplotlib Pie Charts is an important area in Python learning.','Understand the basics of Matplotlib Pie Charts.','Matplotlib Pie Charts key concepts','beginner',73,NULL,NULL),
('python','Machine Learning','machine-learning','Learn about Machine Learning as part of the extended Python curriculum.','Machine Learning is an important area in Python learning.','Understand the basics of Machine Learning.','Machine Learning key concepts','beginner',74,NULL,NULL),
('python','Getting Started','getting-started','Learn about Getting Started as part of the extended Python curriculum.','Getting Started is an important area in Python learning.','Understand the basics of Getting Started.','Getting Started key concepts','beginner',75,NULL,NULL),
('python','Mean Median Mode','mean-median-mode','Learn about Mean Median Mode as part of the extended Python curriculum.','Mean Median Mode is an important area in Python learning.','Understand the basics of Mean Median Mode.','Mean Median Mode key concepts','beginner',76,NULL,NULL),
('python','Standard Deviation','standard-deviation','Learn about Standard Deviation as part of the extended Python curriculum.','Standard Deviation is an important area in Python learning.','Understand the basics of Standard Deviation.','Standard Deviation key concepts','beginner',77,NULL,NULL),
('python','Percentile','percentile','Learn about Percentile as part of the extended Python curriculum.','Percentile is an important area in Python learning.','Understand the basics of Percentile.','Percentile key concepts','beginner',78,NULL,NULL),
('python','Data Distribution','data-distribution','Learn about Data Distribution as part of the extended Python curriculum.','Data Distribution is an important area in Python learning.','Understand the basics of Data Distribution.','Data Distribution key concepts','beginner',79,NULL,NULL),
('python','Normal Data Distribution','normal-data-distribution','Learn about Normal Data Distribution as part of the extended Python curriculum.','Normal Data Distribution is an important area in Python learning.','Understand the basics of Normal Data Distribution.','Normal Data Distribution key concepts','beginner',80,NULL,NULL),
('python','Scatter Plot','scatter-plot','Learn about Scatter Plot as part of the extended Python curriculum.','Scatter Plot is an important area in Python learning.','Understand the basics of Scatter Plot.','Scatter Plot key concepts','beginner',81,NULL,NULL),
('python','Linear Regression','linear-regression','Learn about Linear Regression as part of the extended Python curriculum.','Linear Regression is an important area in Python learning.','Understand the basics of Linear Regression.','Linear Regression key concepts','beginner',82,NULL,NULL),
('python','Polynomial Regression','polynomial-regression','Learn about Polynomial Regression as part of the extended Python curriculum.','Polynomial Regression is an important area in Python learning.','Understand the basics of Polynomial Regression.','Polynomial Regression key concepts','beginner',83,NULL,NULL),
('python','Multiple Regression','multiple-regression','Learn about Multiple Regression as part of the extended Python curriculum.','Multiple Regression is an important area in Python learning.','Understand the basics of Multiple Regression.','Multiple Regression key concepts','beginner',84,NULL,NULL),
('python','Scale','scale','Learn about Scale as part of the extended Python curriculum.','Scale is an important area in Python learning.','Understand the basics of Scale.','Scale key concepts','beginner',85,NULL,NULL),
('python','Train/Test','traintest','Learn about Train/Test as part of the extended Python curriculum.','Train/Test is an important area in Python learning.','Understand the basics of Train/Test.','Train/Test key concepts','beginner',86,NULL,NULL),
('python','Decision Tree','decision-tree','Learn about Decision Tree as part of the extended Python curriculum.','Decision Tree is an important area in Python learning.','Understand the basics of Decision Tree.','Decision Tree key concepts','beginner',87,NULL,NULL),
('python','Confusion Matrix','confusion-matrix','Learn about Confusion Matrix as part of the extended Python curriculum.','Confusion Matrix is an important area in Python learning.','Understand the basics of Confusion Matrix.','Confusion Matrix key concepts','beginner',88,NULL,NULL),
('python','Hierarchical Clustering','hierarchical-clustering','Learn about Hierarchical Clustering as part of the extended Python curriculum.','Hierarchical Clustering is an important area in Python learning.','Understand the basics of Hierarchical Clustering.','Hierarchical Clustering key concepts','beginner',89,NULL,NULL),
('python','Logistic Regression','logistic-regression','Learn about Logistic Regression as part of the extended Python curriculum.','Logistic Regression is an important area in Python learning.','Understand the basics of Logistic Regression.','Logistic Regression key concepts','beginner',90,NULL,NULL),
('python','Grid Search','grid-search','Learn about Grid Search as part of the extended Python curriculum.','Grid Search is an important area in Python learning.','Understand the basics of Grid Search.','Grid Search key concepts','beginner',91,NULL,NULL),
('python','Categorical Data','categorical-data','Learn about Categorical Data as part of the extended Python curriculum.','Categorical Data is an important area in Python learning.','Understand the basics of Categorical Data.','Categorical Data key concepts','beginner',92,NULL,NULL),
('python','K-means','k-means','Learn about K-means as part of the extended Python curriculum.','K-means is an important area in Python learning.','Understand the basics of K-means.','K-means key concepts','beginner',93,NULL,NULL),
('python','Bootstrap Aggregation','bootstrap-aggregation','Learn about Bootstrap Aggregation as part of the extended Python curriculum.','Bootstrap Aggregation is an important area in Python learning.','Understand the basics of Bootstrap Aggregation.','Bootstrap Aggregation key concepts','beginner',94,NULL,NULL),
('python','Cross Validation','cross-validation','Learn about Cross Validation as part of the extended Python curriculum.','Cross Validation is an important area in Python learning.','Understand the basics of Cross Validation.','Cross Validation key concepts','beginner',95,NULL,NULL),
('python','AUC - ROC Curve','auc-roc-curve','Learn about AUC - ROC Curve as part of the extended Python curriculum.','AUC - ROC Curve is an important area in Python learning.','Understand the basics of AUC - ROC Curve.','AUC - ROC Curve key concepts','beginner',96,NULL,NULL),
('python','K-nearest neighbors','k-nearest-neighbors','Learn about K-nearest neighbors as part of the extended Python curriculum.','K-nearest neighbors is an important area in Python learning.','Understand the basics of K-nearest neighbors.','K-nearest neighbors key concepts','beginner',97,NULL,NULL),
('python','Lists and Arrays','lists-and-arrays','Learn about Lists and Arrays as part of the extended Python curriculum.','Lists and Arrays is an important area in Python learning.','Understand the basics of Lists and Arrays.','Lists and Arrays key concepts','beginner',98,NULL,NULL),
('python','Stacks','stacks','Learn about Stacks as part of the extended Python curriculum.','Stacks is an important area in Python learning.','Understand the basics of Stacks.','Stacks key concepts','beginner',99,NULL,NULL),
('python','Queues','queues','Learn about Queues as part of the extended Python curriculum.','Queues is an important area in Python learning.','Understand the basics of Queues.','Queues key concepts','beginner',100,NULL,NULL),
('python','Linked Lists','linked-lists','Learn about Linked Lists as part of the extended Python curriculum.','Linked Lists is an important area in Python learning.','Understand the basics of Linked Lists.','Linked Lists key concepts','beginner',101,NULL,NULL),
('python','Hash Tables','hash-tables','Learn about Hash Tables as part of the extended Python curriculum.','Hash Tables is an important area in Python learning.','Understand the basics of Hash Tables.','Hash Tables key concepts','beginner',102,NULL,NULL),
('python','Trees','trees','Learn about Trees as part of the extended Python curriculum.','Trees is an important area in Python learning.','Understand the basics of Trees.','Trees key concepts','beginner',103,NULL,NULL),
('python','Binary Trees','binary-trees','Learn about Binary Trees as part of the extended Python curriculum.','Binary Trees is an important area in Python learning.','Understand the basics of Binary Trees.','Binary Trees key concepts','beginner',104,NULL,NULL),
('python','Binary Search Trees','binary-search-trees','Learn about Binary Search Trees as part of the extended Python curriculum.','Binary Search Trees is an important area in Python learning.','Understand the basics of Binary Search Trees.','Binary Search Trees key concepts','beginner',105,NULL,NULL),
('python','AVL Trees','avl-trees','Learn about AVL Trees as part of the extended Python curriculum.','AVL Trees is an important area in Python learning.','Understand the basics of AVL Trees.','AVL Trees key concepts','beginner',106,NULL,NULL),
('python','Graphs','graphs','Learn about Graphs as part of the extended Python curriculum.','Graphs is an important area in Python learning.','Understand the basics of Graphs.','Graphs key concepts','beginner',107,NULL,NULL),
('python','Linear Search','linear-search','Learn about Linear Search as part of the extended Python curriculum.','Linear Search is an important area in Python learning.','Understand the basics of Linear Search.','Linear Search key concepts','beginner',108,NULL,NULL),
('python','Binary Search','binary-search','Learn about Binary Search as part of the extended Python curriculum.','Binary Search is an important area in Python learning.','Understand the basics of Binary Search.','Binary Search key concepts','beginner',109,NULL,NULL),
('python','Bubble Sort','bubble-sort','Learn about Bubble Sort as part of the extended Python curriculum.','Bubble Sort is an important area in Python learning.','Understand the basics of Bubble Sort.','Bubble Sort key concepts','beginner',110,NULL,NULL),
('python','Selection Sort','selection-sort','Learn about Selection Sort as part of the extended Python curriculum.','Selection Sort is an important area in Python learning.','Understand the basics of Selection Sort.','Selection Sort key concepts','beginner',111,NULL,NULL),
('python','Insertion Sort','insertion-sort','Learn about Insertion Sort as part of the extended Python curriculum.','Insertion Sort is an important area in Python learning.','Understand the basics of Insertion Sort.','Insertion Sort key concepts','beginner',112,NULL,NULL),
('python','Quick Sort','quick-sort','Learn about Quick Sort as part of the extended Python curriculum.','Quick Sort is an important area in Python learning.','Understand the basics of Quick Sort.','Quick Sort key concepts','beginner',113,NULL,NULL),
('python','Counting Sort','counting-sort','Learn about Counting Sort as part of the extended Python curriculum.','Counting Sort is an important area in Python learning.','Understand the basics of Counting Sort.','Counting Sort key concepts','beginner',114,NULL,NULL),
('python','Radix Sort','radix-sort','Learn about Radix Sort as part of the extended Python curriculum.','Radix Sort is an important area in Python learning.','Understand the basics of Radix Sort.','Radix Sort key concepts','beginner',115,NULL,NULL),
('python','Merge Sort','merge-sort','Learn about Merge Sort as part of the extended Python curriculum.','Merge Sort is an important area in Python learning.','Understand the basics of Merge Sort.','Merge Sort key concepts','beginner',116,NULL,NULL),
('python','MySQL Get Started','mysql-get-started','Learn about MySQL Get Started as part of the extended Python curriculum.','MySQL Get Started is an important area in Python learning.','Understand the basics of MySQL Get Started.','MySQL Get Started key concepts','beginner',117,NULL,NULL),
('python','MySQL Create Database','mysql-create-database','Learn about MySQL Create Database as part of the extended Python curriculum.','MySQL Create Database is an important area in Python learning.','Understand the basics of MySQL Create Database.','MySQL Create Database key concepts','beginner',118,NULL,NULL),
('python','MySQL Create Table','mysql-create-table','Learn about MySQL Create Table as part of the extended Python curriculum.','MySQL Create Table is an important area in Python learning.','Understand the basics of MySQL Create Table.','MySQL Create Table key concepts','beginner',119,NULL,NULL),
('python','MySQL Insert','mysql-insert','Learn about MySQL Insert as part of the extended Python curriculum.','MySQL Insert is an important area in Python learning.','Understand the basics of MySQL Insert.','MySQL Insert key concepts','beginner',120,NULL,NULL),
('python','MySQL Select','mysql-select','Learn about MySQL Select as part of the extended Python curriculum.','MySQL Select is an important area in Python learning.','Understand the basics of MySQL Select.','MySQL Select key concepts','beginner',121,NULL,NULL),
('python','MySQL Where','mysql-where','Learn about MySQL Where as part of the extended Python curriculum.','MySQL Where is an important area in Python learning.','Understand the basics of MySQL Where.','MySQL Where key concepts','beginner',122,NULL,NULL),
('python','MySQL Order By','mysql-order-by','Learn about MySQL Order By as part of the extended Python curriculum.','MySQL Order By is an important area in Python learning.','Understand the basics of MySQL Order By.','MySQL Order By key concepts','beginner',123,NULL,NULL),
('python','MySQL Delete','mysql-delete','Learn about MySQL Delete as part of the extended Python curriculum.','MySQL Delete is an important area in Python learning.','Understand the basics of MySQL Delete.','MySQL Delete key concepts','beginner',124,NULL,NULL),
('python','MySQL Drop Table','mysql-drop-table','Learn about MySQL Drop Table as part of the extended Python curriculum.','MySQL Drop Table is an important area in Python learning.','Understand the basics of MySQL Drop Table.','MySQL Drop Table key concepts','beginner',125,NULL,NULL),
('python','MySQL Update','mysql-update','Learn about MySQL Update as part of the extended Python curriculum.','MySQL Update is an important area in Python learning.','Understand the basics of MySQL Update.','MySQL Update key concepts','beginner',126,NULL,NULL),
('python','MySQL Limit','mysql-limit','Learn about MySQL Limit as part of the extended Python curriculum.','MySQL Limit is an important area in Python learning.','Understand the basics of MySQL Limit.','MySQL Limit key concepts','beginner',127,NULL,NULL),
('python','MySQL Join','mysql-join','Learn about MySQL Join as part of the extended Python curriculum.','MySQL Join is an important area in Python learning.','Understand the basics of MySQL Join.','MySQL Join key concepts','beginner',128,NULL,NULL),
('python','MongoDB Get Started','mongodb-get-started','Learn about MongoDB Get Started as part of the extended Python curriculum.','MongoDB Get Started is an important area in Python learning.','Understand the basics of MongoDB Get Started.','MongoDB Get Started key concepts','beginner',129,NULL,NULL),
('python','MongoDB Create DB','mongodb-create-db','Learn about MongoDB Create DB as part of the extended Python curriculum.','MongoDB Create DB is an important area in Python learning.','Understand the basics of MongoDB Create DB.','MongoDB Create DB key concepts','beginner',130,NULL,NULL),
('python','MongoDB Collection','mongodb-collection','Learn about MongoDB Collection as part of the extended Python curriculum.','MongoDB Collection is an important area in Python learning.','Understand the basics of MongoDB Collection.','MongoDB Collection key concepts','beginner',131,NULL,NULL),
('python','MongoDB Insert','mongodb-insert','Learn about MongoDB Insert as part of the extended Python curriculum.','MongoDB Insert is an important area in Python learning.','Understand the basics of MongoDB Insert.','MongoDB Insert key concepts','beginner',132,NULL,NULL),
('python','MongoDB Find','mongodb-find','Learn about MongoDB Find as part of the extended Python curriculum.','MongoDB Find is an important area in Python learning.','Understand the basics of MongoDB Find.','MongoDB Find key concepts','beginner',133,NULL,NULL),
('python','MongoDB Query','mongodb-query','Learn about MongoDB Query as part of the extended Python curriculum.','MongoDB Query is an important area in Python learning.','Understand the basics of MongoDB Query.','MongoDB Query key concepts','beginner',134,NULL,NULL),
('python','MongoDB Sort','mongodb-sort','Learn about MongoDB Sort as part of the extended Python curriculum.','MongoDB Sort is an important area in Python learning.','Understand the basics of MongoDB Sort.','MongoDB Sort key concepts','beginner',135,NULL,NULL),
('python','MongoDB Delete','mongodb-delete','Learn about MongoDB Delete as part of the extended Python curriculum.','MongoDB Delete is an important area in Python learning.','Understand the basics of MongoDB Delete.','MongoDB Delete key concepts','beginner',136,NULL,NULL),
('python','MongoDB Drop Collection','mongodb-drop-collection','Learn about MongoDB Drop Collection as part of the extended Python curriculum.','MongoDB Drop Collection is an important area in Python learning.','Understand the basics of MongoDB Drop Collection.','MongoDB Drop Collection key concepts','beginner',137,NULL,NULL),
('python','MongoDB Update','mongodb-update','Learn about MongoDB Update as part of the extended Python curriculum.','MongoDB Update is an important area in Python learning.','Understand the basics of MongoDB Update.','MongoDB Update key concepts','beginner',138,NULL,NULL),
('python','MongoDB Limit','mongodb-limit','Learn about MongoDB Limit as part of the extended Python curriculum.','MongoDB Limit is an important area in Python learning.','Understand the basics of MongoDB Limit.','MongoDB Limit key concepts','beginner',139,NULL,NULL),
('python','Python Overview','python-overview','Learn about Python Overview as part of the extended Python curriculum.','Python Overview is an important area in Python learning.','Understand the basics of Python Overview.','Python Overview key concepts','beginner',140,NULL,NULL),
('python','Python Built-in Functions','python-built-in-functions','Learn about Python Built-in Functions as part of the extended Python curriculum.','Python Built-in Functions is an important area in Python learning.','Understand the basics of Python Built-in Functions.','Python Built-in Functions key concepts','beginner',141,NULL,NULL),
('python','Python String Methods','python-string-methods','Learn about Python String Methods as part of the extended Python curriculum.','Python String Methods is an important area in Python learning.','Understand the basics of Python String Methods.','Python String Methods key concepts','beginner',142,NULL,NULL),
('python','Python List Methods','python-list-methods','Learn about Python List Methods as part of the extended Python curriculum.','Python List Methods is an important area in Python learning.','Understand the basics of Python List Methods.','Python List Methods key concepts','beginner',143,NULL,NULL),
('python','Python Dictionary Methods','python-dictionary-methods','Learn about Python Dictionary Methods as part of the extended Python curriculum.','Python Dictionary Methods is an important area in Python learning.','Understand the basics of Python Dictionary Methods.','Python Dictionary Methods key concepts','beginner',144,NULL,NULL),
('python','Python Tuple Methods','python-tuple-methods','Learn about Python Tuple Methods as part of the extended Python curriculum.','Python Tuple Methods is an important area in Python learning.','Understand the basics of Python Tuple Methods.','Python Tuple Methods key concepts','beginner',145,NULL,NULL),
('python','Python Set Methods','python-set-methods','Learn about Python Set Methods as part of the extended Python curriculum.','Python Set Methods is an important area in Python learning.','Understand the basics of Python Set Methods.','Python Set Methods key concepts','beginner',146,NULL,NULL),
('python','Python File Methods','python-file-methods','Learn about Python File Methods as part of the extended Python curriculum.','Python File Methods is an important area in Python learning.','Understand the basics of Python File Methods.','Python File Methods key concepts','beginner',147,NULL,NULL),
('python','Python Keywords','python-keywords','Learn about Python Keywords as part of the extended Python curriculum.','Python Keywords is an important area in Python learning.','Understand the basics of Python Keywords.','Python Keywords key concepts','beginner',148,NULL,NULL),
('python','Python Exceptions','python-exceptions','Learn about Python Exceptions as part of the extended Python curriculum.','Python Exceptions is an important area in Python learning.','Understand the basics of Python Exceptions.','Python Exceptions key concepts','beginner',149,NULL,NULL),
('python','Python Glossary','python-glossary','Learn about Python Glossary as part of the extended Python curriculum.','Python Glossary is an important area in Python learning.','Understand the basics of Python Glossary.','Python Glossary key concepts','beginner',150,NULL,NULL),
('python','Built-in Modules','built-in-modules','Learn about Built-in Modules as part of the extended Python curriculum.','Built-in Modules is an important area in Python learning.','Understand the basics of Built-in Modules.','Built-in Modules key concepts','beginner',151,NULL,NULL),
('python','Random Module','random-module','Learn about Random Module as part of the extended Python curriculum.','Random Module is an important area in Python learning.','Understand the basics of Random Module.','Random Module key concepts','beginner',152,NULL,NULL),
('python','Requests Module','requests-module','Learn about Requests Module as part of the extended Python curriculum.','Requests Module is an important area in Python learning.','Understand the basics of Requests Module.','Requests Module key concepts','beginner',153,NULL,NULL),
('python','Statistics Module','statistics-module','Learn about Statistics Module as part of the extended Python curriculum.','Statistics Module is an important area in Python learning.','Understand the basics of Statistics Module.','Statistics Module key concepts','beginner',154,NULL,NULL),
('python','Math Module','math-module','Learn about Math Module as part of the extended Python curriculum.','Math Module is an important area in Python learning.','Understand the basics of Math Module.','Math Module key concepts','beginner',155,NULL,NULL),
('python','cMath Module','cmath-module','Learn about cMath Module as part of the extended Python curriculum.','cMath Module is an important area in Python learning.','Understand the basics of cMath Module.','cMath Module key concepts','beginner',156,NULL,NULL),
('python','Remove List Duplicates','remove-list-duplicates','Learn about Remove List Duplicates as part of the extended Python curriculum.','Remove List Duplicates is an important area in Python learning.','Understand the basics of Remove List Duplicates.','Remove List Duplicates key concepts','beginner',157,NULL,NULL),
('python','Reverse a String','reverse-a-string','Learn about Reverse a String as part of the extended Python curriculum.','Reverse a String is an important area in Python learning.','Understand the basics of Reverse a String.','Reverse a String key concepts','beginner',158,NULL,NULL),
('python','Add Two Numbers','add-two-numbers','Learn about Add Two Numbers as part of the extended Python curriculum.','Add Two Numbers is an important area in Python learning.','Understand the basics of Add Two Numbers.','Add Two Numbers key concepts','beginner',159,NULL,NULL),
('python','Python Examples','python-examples','Learn about Python Examples as part of the extended Python curriculum.','Python Examples is an important area in Python learning.','Understand the basics of Python Examples.','Python Examples key concepts','beginner',160,NULL,NULL),
('python','Python Compiler','python-compiler','Learn about Python Compiler as part of the extended Python curriculum.','Python Compiler is an important area in Python learning.','Understand the basics of Python Compiler.','Python Compiler key concepts','beginner',161,NULL,NULL),
('python','Python Exercises','python-exercises','Learn about Python Exercises as part of the extended Python curriculum.','Python Exercises is an important area in Python learning.','Understand the basics of Python Exercises.','Python Exercises key concepts','beginner',162,NULL,NULL),
('python','Python Quiz','python-quiz','Learn about Python Quiz as part of the extended Python curriculum.','Python Quiz is an important area in Python learning.','Understand the basics of Python Quiz.','Python Quiz key concepts','beginner',163,NULL,NULL),
('python','Python Challenges','python-challenges','Learn about Python Challenges as part of the extended Python curriculum.','Python Challenges is an important area in Python learning.','Understand the basics of Python Challenges.','Python Challenges key concepts','beginner',164,NULL,NULL),
('python','Python Server','python-server','Learn about Python Server as part of the extended Python curriculum.','Python Server is an important area in Python learning.','Understand the basics of Python Server.','Python Server key concepts','beginner',165,NULL,NULL),
('python','Python Syllabus','python-syllabus','Learn about Python Syllabus as part of the extended Python curriculum.','Python Syllabus is an important area in Python learning.','Understand the basics of Python Syllabus.','Python Syllabus key concepts','beginner',166,NULL,NULL),
('python','Python Study Plan','python-study-plan','Learn about Python Study Plan as part of the extended Python curriculum.','Python Study Plan is an important area in Python learning.','Understand the basics of Python Study Plan.','Python Study Plan key concepts','beginner',167,NULL,NULL),
('python','Python Interview Q&A','python-interview-qa','Learn about Python Interview Q&A as part of the extended Python curriculum.','Python Interview Q&A is an important area in Python learning.','Understand the basics of Python Interview Q&A.','Python Interview Q&A key concepts','beginner',168,NULL,NULL),
('python','Python Bootcamp','python-bootcamp','Learn about Python Bootcamp as part of the extended Python curriculum.','Python Bootcamp is an important area in Python learning.','Understand the basics of Python Bootcamp.','Python Bootcamp key concepts','beginner',169,NULL,NULL),
('python','Python Certificate','python-certificate','Learn about Python Certificate as part of the extended Python curriculum.','Python Certificate is an important area in Python learning.','Understand the basics of Python Certificate.','Python Certificate key concepts','beginner',170,NULL,NULL),
('python','Python Training','python-training','Learn about Python Training as part of the extended Python curriculum.','Python Training is an important area in Python learning.','Understand the basics of Python Training.','Python Training key concepts','beginner',171,NULL,NULL);

-- Update sequences
SELECT setval('topics_id_seq', (SELECT MAX(id) FROM topics));
SELECT setval('topic_code_examples_id_seq', (SELECT MAX(id) FROM topic_code_examples));
