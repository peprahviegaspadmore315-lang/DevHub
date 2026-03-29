-- ============================================
-- Seed Data: Python Programming Language
-- ============================================

-- Insert Python language
INSERT INTO programming_languages (name, slug, description, icon_url, color, difficulty_level, order_index)
VALUES (
    'Python',
    'python',
    'Python is a powerful, easy-to-learn programming language. Perfect for beginners with its simple syntax and readability.',
    '/icons/python.svg',
    '#3776ab',
    'beginner',
    1
);

-- ============================================
-- Python Topics and Lessons
-- ============================================

-- Topic: Getting Started
INSERT INTO topics (language_id, name, slug, description, icon, order_index)
VALUES (1, 'Getting Started', 'getting-started', 'Learn the basics of Python programming', 'rocket', 1);

-- Lessons for Getting Started
INSERT INTO lessons (topic_id, title, slug, content, notes, order_index, duration_minutes)
VALUES 
(1, 'What is Python?', 'what-is-python', 
'# What is Python?

Python is a **high-level programming language** that was created by Guido van Rossum and first released in 1991.

## Why Learn Python?

Python is one of the most popular programming languages in the world because it is:

- **Easy to learn** - Python has a simple syntax that resembles plain English
- **Versatile** - Used in web development, data science, AI, automation, and more
- **Powerful** - Has a vast ecosystem of libraries and frameworks
- **Beginner-friendly** - Perfect first language for new programmers

## What Can You Build with Python?

| Application | Examples |
|------------|----------|
| Web Apps | Instagram, Pinterest, Spotify |
| Data Science | Analytics, Machine Learning |
| Automation | Scripts, Bots, Tasks |
| Games | Simple 2D games |
| GUI Apps | Desktop applications |

Python is used by companies like Google, NASA, Netflix, and Spotify!',
'## Key Takeaways

- Python was created by Guido van Rossum in 1991
- It is an interpreted language (runs line by line)
- Python uses indentation to define code blocks
- It is one of the most popular languages in the world',
1, 5),

(1, 'Installing Python', 'installing-python',
'# Installing Python

Before you can start coding in Python, you need to install it on your computer.

## How to Install Python

### Step 1: Download Python

1. Go to [python.org](https://python.org)
2. Click the "Downloads" button
3. Download Python 3.x (the latest version)

### Step 2: Install Python

**Windows:**
- Run the downloaded installer
- **IMPORTANT:** Check "Add Python to PATH"
- Click "Install Now"

**Mac:**
- Use the installer package from python.org
- Or use Homebrew: `brew install python3`

**Linux:**
- Use your package manager: `sudo apt install python3`

## Choosing a Code Editor

You will need a program to write your code. Popular options include:

| Editor | Best For |
|--------|----------|
| VS Code | All-purpose, free |
| PyCharm | Python development |
| Thonny | Complete beginners |
| IDLE | Included with Python |

We recommend **VS Code** for beginners!',
'## Installation Checklist

- [ ] Download Python from python.org
- [ ] Run the installer
- [ ] Add Python to PATH (Windows)
- [ ] Test installation by typing `python --version` in terminal',
2, 10),

(1, 'Your First Python Program', 'first-program',
'# Your First Python Program

Let''s write your very first Python program! We will make the computer say "Hello, World!"

## The print() Function

In Python, we use the `print()` function to display text on the screen.

```python
print("Hello, World!")
```

## How to Run Your Code

### Method 1: Interactive Mode (REPL)

1. Open terminal/command prompt
2. Type `python` or `python3`
3. Type `print("Hello, World!")`
4. Press Enter

### Method 2: Script Mode

1. Create a new file called `hello.py`
2. Type `print("Hello, World!")`
3. Run it with `python hello.py`

## Try It Yourself!

```python
# This prints a greeting
print("Hello, World!")

# You can print anything!
print("I am learning Python!")

# Numbers don't need quotes
print(42)
```',
'## Common Mistakes

- Forgetting to use quotes around text: `print(Hello)` ❌
- Using wrong type of quotes: `print("Hello)''` ❌
- Forgetting closing parenthesis: `print("Hello"` ❌

## Good Practice

Always write comments in your code to explain what it does!',
3, 8);

-- ============================================
-- Topic: Variables and Data Types
-- ============================================

INSERT INTO topics (language_id, name, slug, description, icon, order_index)
VALUES (1, 'Variables & Data Types', 'variables-data-types', 'Store and manipulate data using variables', 'database', 2);

-- Lessons for Variables & Data Types
INSERT INTO lessons (topic_id, title, slug, content, notes, order_index, duration_minutes)
VALUES 
(2, 'What are Variables?', 'what-are-variables',
'# What are Variables?

Variables are like **labeled containers** that store information in your program.

## Think of it like this:

Imagine you have several boxes:
- Box labeled "name" contains "Alice"
- Box labeled "age" contains 25
- Box labeled "is_student" contains True

In Python, these boxes are called **variables**!

## Creating Variables

In Python, you create a variable by giving it a name and a value:

```python
name = "Alice"
age = 25
is_student = True
```

## Variable Naming Rules

| Rule | Good Example | Bad Example |
|------|--------------|--------------|
| Start with letter | `name` | `2name` |
| Use underscores | `first_name` | `first-name` |
| Be descriptive | `user_age` | `x` |
| Case sensitive | `Name` vs `name` | |

## Reassigning Variables

Variables can change their value:

```python
age = 25
print(age)  # Output: 25

age = 26
print(age)  # Output: 26
```',
'## Key Points

- Variables store data that can change
- Use `=` to assign a value
- Variable names should be descriptive
- Python is case-sensitive (name ≠ Name)',
4, 10),

(2, 'Numbers and Math', 'numbers-and-math',
'# Numbers and Math in Python

Python can perform all kinds of mathematical calculations!

## Types of Numbers

Python has two main number types:

| Type | Example | Use Case |
|------|---------|----------|
| **int** (integer) | `42`, `-7`, `0` | Whole numbers |
| **float** | `3.14`, `-0.5` | Decimals |

## Basic Math Operators

```python
# Addition
print(5 + 3)    # Output: 8

# Subtraction
print(10 - 4)   # Output: 6

# Multiplication
print(6 * 7)    # Output: 42

# Division
print(15 / 3)   # Output: 5.0

# Integer Division (floor)
print(17 // 5)  # Output: 3

# Modulus (remainder)
print(17 % 5)   # Output: 2

# Exponent (power)
print(2 ** 3)   # Output: 8
```

## Order of Operations

Python follows **PEMDAS**:

1. **P**arentheses `()`
2. **E**xponents `**`
3. **M**ultiplication `*`
4. **D**ivision `/`
5. **A**ddition `+`
6. **S**ubtraction `-`

```python
print(2 + 3 * 4)      # Output: 14 (not 20)
print((2 + 3) * 4)    # Output: 20
```',
'## Math Shortcuts

Python has shortcuts for updating numbers:

```python
x = 5
x += 3   # Same as x = x + 3, now x is 8
x -= 2   # Same as x = x - 2, now x is 6
x *= 2   # Same as x = x * 2, now x is 12
```',
5, 12),

(2, 'Strings (Text)', 'strings-text',
'# Working with Strings

Strings are how we store and work with **text** in Python.

## Creating Strings

Use single quotes or double quotes:

```python
name = "Alice"
greeting = ''Hello there!''

# Both work the same way
print(name)      # Alice
print(greeting)  # Hello there!
```

## Multi-line Strings

Use triple quotes for longer text:

```python
story = """Once upon a time,
there was a programmer
who loved Python."""

print(story)
```

## String Operations

### Concatenation (joining strings)

```python
first = "Hello"
second = "World"
combined = first + " " + second
print(combined)  # Hello World
```

### Repetition

```python
laugh = "Ha" * 3
print(laugh)  # HaHaHa
```

### Length

```python
text = "Python"
print(len(text))  # 6
```

## String Methods

```python
text = "Hello World"

print(text.upper())      # HELLO WORLD
print(text.lower())      # hello world
print(text.replace("World", "Python"))  # Hello Python
print(text.split(" "))   # ["Hello", "World"]
```',
'## f-Strings (Formatted Strings)

The easiest way to combine text and variables:

```python
name = "Alice"
age = 25

# Old way (still works)
print("My name is " + name)

# New way (recommended)
print(f"My name is {name} and I am {age} years old")
```',
6, 15);

-- ============================================
-- Topic: Control Flow
-- ============================================

INSERT INTO topics (language_id, name, slug, description, icon, order_index)
VALUES (1, 'Control Flow', 'control-flow', 'Learn to make decisions and repeat actions', 'git-branch', 3);

-- Lessons for Control Flow
INSERT INTO lessons (topic_id, title, slug, content, notes, order_index, duration_minutes)
VALUES 
(3, 'If Statements', 'if-statements',
'# Making Decisions with If Statements

If statements let your program **make decisions** based on conditions.

## Basic If Statement

```python
age = 18

if age >= 18:
    print("You are an adult!")
```

**Important:** The code inside `if` must be indented (4 spaces)!

## If-Else Statement

```python
age = 15

if age >= 18:
    print("You can vote")
else:
    print("Too young to vote")
```

## If-Elif-Else

For multiple conditions:

```python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
```

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| `==` | Equal to |
| `!=` | Not equal to |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater or equal |
| `<=` | Less or equal |

## Logical Operators

```python
age = 25
has_license = True

if age >= 18 and has_license:
    print("Can drive!")

if age < 13 or age > 65:
    print("Discount available")
```',
'## Common Mistakes

- Using `=` instead of `==` for comparison
- Forgetting the colon `:`
- Not indenting the code inside the block',
7, 12),

(3, 'For Loops', 'for-loops',
'# Repeating with For Loops

For loops let you **repeat code** a specific number of times or over a sequence.

## Basic For Loop

```python
# Print numbers 1 to 5
for i in range(1, 6):
    print(i)
# Output: 1, 2, 3, 4, 5
```

## Looping Through Lists

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
# Output: apple, banana, cherry
```

## Using range()

| Code | What it does |
|-------|--------------|
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(2, 6)` | 2, 3, 4, 5 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 |

## Loop with Index

```python
fruits = ["apple", "banana", "cherry"]

for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
```

## Nested Loops

```python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})")
```',
'## Break and Continue

```python
# Break - exit the loop early
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# Continue - skip to next iteration
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4
```',
8, 15);

-- ============================================
-- Code Examples for Lessons
-- ============================================

-- Code examples for "What is Python?"
INSERT INTO code_examples (lesson_id, title, description, code, language, code_type, output, order_index)
VALUES
(1, 'Hello World', 'Your first Python program', 'print("Hello, World!")', 'python', 'example', 'Hello, World!', 1),

(1, 'Why Python?', 'Simple syntax example', '# Python code is easy to read
name = "Alice"
print(f"Hello, {name}!")

# Compare to other languages
# Java: System.out.println("Hello, " + name + "!");', 'python', 'comparison', 'Hello, Alice!', 2),

-- Code examples for "Your First Python Program"
(3, 'Basic Print', 'Using the print function', 'print("Hello, World!")
print("Learning Python is fun!")
print(42)', 'python', 'example', 'Hello, World!
Learning Python is fun!
42', 1),

(3, 'Print with Variables', 'Using variables with print', 'message = "Python is awesome!"
print(message)

name = "World"
print(f"Hello, {name}!")', 'python', 'example', 'Python is awesome!
Hello, World!', 2),

-- Code examples for "What are Variables?"
(4, 'Creating Variables', 'Basic variable assignment', '# String variable
name = "Alice"

# Number variable
age = 25

# Boolean variable
is_student = True

# Print them
print(name)
print(age)
print(is_student)', 'python', 'example', 'Alice
25
True', 1),

(4, 'Variable Types', 'Checking variable types', 'x = 10
y = 3.14
name = "Alice"
is_valid = True

print(type(x))       # <class "int">
print(type(y))       # <class "float">
print(type(name))    # <class "str">
print(type(is_valid)) # <class "bool">', 'python', 'example', '<class "int">
<class "float">
<class "str">
<class "bool">', 2),

-- Code examples for "Numbers and Math"
(5, 'Basic Math', 'Simple calculations', '# Addition
print(10 + 5)   # 15

# Subtraction
print(10 - 5)   # 5

# Multiplication
print(10 * 5)   # 50

# Division
print(10 / 5)   # 2.0', 'python', 'example', '15
5
50
2.0', 1),

(5, 'Advanced Math', 'More mathematical operations', '# Integer division (floor)
print(17 // 5)  # 3

# Modulus (remainder)
print(17 % 5)   # 2

# Exponent (power)
print(2 ** 10)  # 1024

# Order of operations
print(2 + 3 * 4)      # 14
print((2 + 3) * 4)    # 20', 'python', 'example', '3
2
1024
14
20', 2),

-- Code examples for "Strings"
(6, 'String Basics', 'Creating and using strings', '# Creating strings
name = "Alice"
greeting = "Hello"

# Concatenation
print(greeting + ", " + name + "!")

# Repetition
print("Ha" * 3)

# Length
print(len(name))', 'python', 'example', 'Hello, Alice!
HaHaHa
5', 1),

(6, 'String Methods', 'Common string operations', 'text = "Hello World"

# Upper and lower case
print(text.upper())      # HELLO WORLD
print(text.lower())     # hello world

# Find and replace
print(text.replace("World", "Python"))

# Split
print(text.split(" "))  # ["Hello", "World"]', 'python', 'example', 'HELLO WORLD
hello world
Hello Python
["Hello", "World"]', 2),

-- Code examples for "If Statements"
(7, 'Basic If', 'Simple conditional', 'age = 18

if age >= 18:
    print("You are an adult!")', 'python', 'example', 'You are an adult!', 1),

(7, 'If-Else', 'Two-way decision', 'age = 15

if age >= 18:
    print("You can vote")
else:
    print("Too young to vote")', 'python', 'example', 'Too young to vote', 2),

(7, 'If-Elif-Else', 'Multiple conditions', 'score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Your grade is: {grade}")', 'python', 'example', 'Your grade is: B', 3),

-- Code examples for "For Loops"
(8, 'Range Loop', 'Looping with range', 'for i in range(1, 6):
    print(f"Number: {i}")', 'python', 'example', 'Number: 1
Number: 2
Number: 3
Number: 4
Number: 5', 1),

(8, 'List Loop', 'Looping through a list', 'fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I like {fruit}")', 'python', 'example', 'I like apple
I like banana
I like cherry', 2);

-- ============================================
-- YouTube Videos for Lessons
-- ============================================

INSERT INTO youtube_videos (lesson_id, title, description, youtube_video_id, duration_seconds, order_index)
VALUES
(1, 'Python Tutorial for Beginners', 'Complete introduction to Python programming', 'kqtD5bpCQ30', 1800, 1),
(2, 'How to Install Python', 'Step-by-step Python installation guide', 'YYXdXT2l-Gg', 600, 1),
(3, 'Your First Python Program', 'Writing and running your first code', 'D6V6M42E5k8', 480, 1),
(4, 'Python Variables Explained', 'Understanding variables and data types', 'c5QcN0p2Je0', 900, 1),
(5, 'Python Numbers and Math', 'Math operations in Python', 'fVH6_b6sK9c', 720, 1),
(6, 'Python Strings Tutorial', 'Working with text in Python', 'bO5Tk9JGpmw', 840, 1),
(7, 'Python If Statements', 'Conditional logic in Python', '3a5P-P2eJMQ', 960, 1),
(8, 'Python For Loops', 'Loops and iteration explained', 'FNQxxvG0M6A', 1080, 1);

-- ============================================
-- Update sequence for lessons
-- ============================================

SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));
SELECT setval('topics_id_seq', (SELECT MAX(id) FROM topics));
SELECT setval('programming_languages_id_seq', (SELECT MAX(id) FROM programming_languages));
