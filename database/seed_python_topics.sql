-- ============================================
-- Python Topics - Comprehensive Organized Structure
-- Tutorial -> OOP -> File Handling -> Modules -> Matplotlib -> ML -> DSA -> Databases -> Reference
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, is_premium)
VALUES

-- ============================================
-- SECTION 1: Python Tutorial - Basics (1-37)
-- ============================================
(
    'python',
    'Python HOME',
    'python-home',
    'Start your Python learning journey.',
    'Python is one of the most popular programming languages in the world. It is easy to learn and perfect for beginners.',
    'Python is a programming language that is easy to read and write. It is used for web development, data science, artificial intelligence, automation, and much more. Python values simplicity and readability.',
    'Python is beginner-friendly
Python is very readable and easy to learn
Python can do many things: web, data, AI, automation
Python is free and open source',
    'beginner',
    1,
    false
),

(
    'python',
    'Python Intro',
    'python-intro',
    'Understand what Python is and its applications.',
    'Learning what Python is used for will help you see why it is a great choice for your programming journey.',
    'Python was created by Guido van Rossum in 1991. The name comes from the TV series "Monty Python". Python is known for being readable and having a clean syntax. Indentation (whitespace) is important in Python - it defines code blocks instead of curly braces.

Python is used for:
- Web development (Django, Flask)
- Data analysis (Pandas, NumPy)
- Machine Learning (TensorFlow, scikit-learn)
- Automation and scripting
- Game development
- Scientific computing',
    'Python created in 1991 by Guido van Rossum
Uses indentation for code blocks
Known for clean, readable syntax
Used in many fields: web, data, AI, games
Free and open source
Large community and many libraries',
    'beginner',
    2,
    false
),

(
    'python',
    'Python Get Started',
    'python-get-started',
    'Install Python and write your first program.',
    'Before you can program in Python, you need to install it and set up your environment. This is quick and easy.',
    'To get started with Python:

1. Download Python from python.org
2. Run the installer
3. Check the box to add Python to PATH
4. Click Install
5. Verify installation by opening terminal and typing: python --version

You can write Python in:
- Text editors (VS Code, Sublime Text)
- IDEs (PyCharm, Thonny - great for beginners)
- Online editors (replit.com, trinket.io)
- Interactive Python shell (just type "python")

Your first program:
print("Hello, World!")

That''s it! Press Enter and you will see output.',
    'Download from python.org
Add Python to PATH during install
Check installation with python --version
Use text editors or IDEs to write code
Online editors also available
print() outputs text to the screen',
    'beginner',
    3,
    false
),

(
    'python',
    'Python Syntax',
    'python-syntax',
    'Learn the basic rules of Python language.',
    'Every language has rules for how to write code. Understanding Python syntax helps you avoid errors and write clean code.',
    'Python Syntax refers to the rules for writing Python code correctly.

Important syntax concepts:

1. Indentation: Python uses spaces (not curly braces) to define code blocks
   if x > 5:
       print("x is big")  # indented means inside the if
       
2. Comments: Start with # and are ignored by Python
   # This is a comment
   x = 5  # This is also a comment
   
3. Variables: No need to declare type
   name = "Alice"
   age = 25
   
4. Print statement: Output text
   print("Hello")
   print(x)
   
5. Line endings: Use Enter/Return (Python knows where statements end)
   No semicolons needed (but they work)
   
6. Case sensitive: Python sees a and A as different',
    'Indentation is important (4 spaces per level)
Start comments with #
Variables auto-detect type
Use print() to show output
Python is case-sensitive
No semicolons needed',
    'beginner',
    4,
    false
),

(
    'python',
    'Python Comments',
    'python-comments',
    'Learn how to add notes to your code.',
    'Comments help explain what your code does. They are read by humans but ignored by Python. Comments make code easier to understand and maintain.',
    'Comments are notes you add to explain your code. Python ignores them.

Single-line comment:
# This is a comment
x = 5  # This explains the variable

Multi-line comment (using multiple # symbols):
# This is a long comment
# that spans multiple lines
# to explain a complex section

You can also use multi-line strings as comments:
"""
This is a multi-line comment
stored as a string. Python ignores it
unless the string is assigned to a variable.
"""

When to use comments:
- Explain WHY, not WHAT (code shows what it does)
- Explain complex logic
- Note important information
- Mark sections of code

Bad comment: x = 5  # Set x to 5
Good comment: x = 5  # Initial user count',
    'Comments start with #
Comments are ignored by Python
Comments explain the WHY of code
Use comments to clarify complex parts
Write clear, helpful comments
Bad: repeat what code says
Good: explain why code works this way',
    'beginner',
    5,
    false
),

(
    'python',
    'Python Variables',
    'python-variables',
    'Learn to store and use data.',
    'Variables are containers for storing data. Without variables, you could not save information or work with it.',
    'A variable is a container for storing data values.

Creating variables:
name = "Alice"
age = 25
height = 5.8
is_student = True

You do NOT need to declare the type. Python figures it out automatically.

Variable names:
- Must start with a letter or underscore
- Can contain letters, numbers, underscores
- Are case-sensitive (name and Name are different)
- Should be descriptive (user_age not ua)
- Use lowercase with underscores (snake_case)

Getting variable values:
x = 10
y = x + 5  # y is now 15
print(x)   # Shows: 10

Changing variables:
x = 10
x = 20     # x is now 20
x = x + 1  # x is now 21',
    'Create: name = value
No type declaration needed
Names are case-sensitive
Use snake_case for names
Start names with letter or underscore
Can contain numbers (but not first)
Can be reassigned (changed) anytime',
    'beginner',
    6,
    false
),

(
    'python',
    'Python Data Types',
    'python-data-types',
    'Understand different types of data in Python.',
    'Python has different data types like strings (text), integers (whole numbers), floats (decimals), and booleans (true/false). Knowing types helps you work with data correctly.',
    'Python Data Types:

Strings (text):
name = "Alice"
message = "Hello World"
Can use single or double quotes

Integers (whole numbers):
age = 25
count = -5
score = 0

Floats (decimal numbers):
height = 5.8
price = 19.99
pi = 3.14159

Booleans (True or False):
is_student = True
is_adult = False

Lists (multiple items):
fruits = ["apple", "banana", "cherry"]

Dictionaries (key-value pairs):
person = {"name": "Alice", "age": 25}

Tuples (unchangeable lists):
colors = ("red", "green", "blue")

Check the type:
type(25)        # <class ''int''>
type("hello")   # <class ''str''>
type(3.14)      # <class ''float''>
type(True)      # <class ''bool''>',
    'String: text in quotes
Integer: whole numbers
Float: decimal numbers
Boolean: True or False
List: multiple items in brackets
Dictionary: key-value pairs in braces
Tuple: unchangeable list
Use type() to check',
    'beginner',
    7,
    false
),

(
    'python',
    'Python Strings',
    'python-strings',
    'Learn to work with text data.',
    'Strings are text. Knowing how to create, combine, and modify strings is essential for any programmer.',
    'Strings are sequences of characters enclosed in quotes.

Creating strings:
name = "Alice"
message = ''Hello''
sentence = """This is a longer
string that spans
multiple lines"""

String operations:
text = "Hello"
text2 = "World"
combined = text + " " + text2  # "Hello World"

Strings are indexed (0-based):
text = "Hello"
text[0]   # "H"
text[1]   # "e"
text[-1]  # "o" (last character)
text[1:4] # "ell" (characters 1 to 3)

String methods:
text = "hello"
text.upper()      # "HELLO"
text.capitalize() # "Hello"
text.replace("l", "L")  # "heLLo"
text.split()      # ["hello"]

String length:
len("Hello")      # 5

Check if substring exists:
"H" in "Hello"    # True
"x" in "Hello"    # False',
    'Strings are text in quotes
Single and double quotes work the same
Use + to combine strings
Strings are indexed (0, 1, 2...)
Use [start:end] for slicing
Methods: upper(), lower(), replace()
len() gives string length
''in'' checks if substring exists',
    'beginner',
    8,
    false
),

(
    'python',
    'Python Numbers',
    'python-numbers',
    'Learn to work with integers and floats.',
    'Numbers are fundamental to programming. Python makes it easy to do math and work with different number types.',
    'Python Numbers:

Integers (int):
age = 25
score = -10
temperature = 0

Floats (float):
height = 5.9
price = 19.99
pi = 3.14159

Type conversion:
int("25")        # 25 (string to int)
float(25)        # 25.0 (int to float)
str(25)          # "25" (int to string)

Basic math operations:
10 + 5    # 15 (addition)
10 - 5    # 5 (subtraction)
10 * 5    # 50 (multiplication)
10 / 5    # 2.0 (division, always float)
10 // 3   # 3 (floor division)
10 % 3    # 1 (remainder)
10 ** 2   # 100 (exponent, 10 to the power of 2)

Math with variables:
x = 10
y = 3
z = x + y * 2  # 16 (multiplication first)
z = (x + y) * 2  # 26 (parentheses first)',
    'int: whole numbers
float: decimal numbers
Type conversion: int(), float(), str()
Addition: +
Subtraction: -
Multiplication: *
Division: / (always float)
Floor division: //
Remainder: %
Power: **',
    'beginner',
    9,
    false
),

(
    'python',
    'Python Casting',
    'python-casting',
    'Convert between data types.',
    'Casting lets you convert data from one type to another. Sometimes you need an integer but have a string, or vice versa.',
    'Casting is converting between data types.

Convert to Integer:
int("25")        # 25
int(25.8)        # 25 (cuts off decimal)
int(True)        # 1

Convert to Float:
float(25)        # 25.0
float("25.5")    # 25.5
float(True)      # 1.0

Convert to String:
str(25)          # "25"
str(25.5)        # "25.5"
str(True)        # "True"

Examples:
user_age = input("How old are you? ")  # Gets a string
age = int(user_age)  # Convert to int
years_until_18 = 18 - age

price = 19.99
total = str(price)  # Convert to string
print("Price: $" + total)

Be careful:
int("25.5")      # ERROR! Cannot convert "25.5"
int("hello")     # ERROR! Cannot convert "hello"

Use this pattern:
int("25")        # OK
int(float("25.5"))  # OK',
    'int() converts to integer
float() converts to float
str() converts to string
int() cuts off decimals
You cannot convert invalid strings
Use int(float(x)) for decimal strings
Casting is useful with input() results',
    'beginner',
    10,
    false
),

(
    'python',
    'Python Booleans',
    'python-booleans',
    'Learn true and false logic.',
    'Booleans are the foundation of decision-making in code. They let you ask yes/no questions and make your code behave differently based on answers.',
    'A Boolean is either True or False. Nothing else.

Creating booleans:
is_student = True
is_adult = False
age_ok = age >= 18

Boolean operations (logical operators):
and: Both must be True
x > 5 and y < 10

or: At least one must be True
age >= 18 or parent_permission is True

not: Reverses the value
not False  # True
not is_student  # False if is_student is True

Comparison operators (return boolean):
x == y    # Equal
x != y    # Not equal
x > y     # Greater than
x < y     # Less than
x >= y    # Greater or equal
x <= y    # Less or equal

Examples:
age = 25
is_adult = age >= 18  # True
can_vote = is_adult and is_citizen  # True or False
can_drink = age >= 21  # False

In if statements:
if is_student:
    print("Discount available!")
    
if not is_adult:
    print("Need parental permission")',
    'Boolean: True or False
== checks equality
!= checks NOT equal
> greater than
< less than
>= greater or equal
<= less or equal
and: both True
or: at least one True
not: reverses value',
    'beginner',
    11,
    false
),

(
    'python',
    'Python Operators',
    'python-operators',
    'Learn arithmetic, comparison, and logical operators.',
    'Operators are symbols that tell Python to do something. They are the building blocks for calculations, comparisons, and decisions.',
    'Operators are special symbols that perform operations.

Arithmetic Operators:
x + y      # Addition
x - y      # Subtraction
x * y      # Multiplication
x / y      # Division (float result)
x // y     # Floor division (int result)
x % y      # Modulus (remainder)
x ** y     # Exponentiation (power)

Comparison Operators (return Boolean):
x == y     # Equal to
x != y     # Not equal to
x > y      # Greater than
x < y      # Less than
x >= y     # Greater or equal
x <= y     # Less or equal

Logical Operators:
x and y    # True if both True
x or y     # True if at least one True
not x      # True if x is False

Assignment Operators:
x = 5      # Assign
x += 3     # x = x + 3 (same as x = 8)
x -= 2     # x = x - 2
x *= 2     # x = x * 2
x /= 2     # x = x / 2

Examples:
x = 10
y = 3
print(x + y)      # 13
print(x ** y)     # 1000
print(x > y)      # True
print(x != y)     # True
print(x > 5 and y < 5)  # True',
    'Arithmetic: + - * / // % **
Comparison: == != > < >= <=
Logical: and or not
Assignment: = += -= *= /=
Operators are the foundation of logic
Comparisons return booleans
Use logical operators to combine conditions',
    'beginner',
    12,
    false
),

(
    'python',
    'Python Lists',
    'python-lists',
    'Learn to store multiple items in one variable.',
    'Lists let you store multiple items together. Instead of having x1, x2, x3, you can have one list [x1, x2, x3].',
    'A list is a collection of items in square brackets.

Creating lists:
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
empty = []

Accessing items (0-based indexing):
fruits = ["apple", "banana", "cherry"]
fruits[0]      # "apple"
fruits[1]      # "banana"
fruits[-1]     # "cherry" (last item)

Changing items:
fruits[0] = "orange"
fruits[1] = "grape"

List length:
len(fruits)    # 3

Adding items:
fruits.append("date")      # Add to end
fruits.insert(1, "mango")  # Add at position

Removing items:
fruits.remove("apple")     # Remove by value
fruits.pop()               # Remove last item
fruits.pop(0)              # Remove by index

Looping through lists:
for fruit in fruits:
    print(fruit)
    
Slicing:
numbers = [1, 2, 3, 4, 5]
numbers[1:4]   # [2, 3, 4]',
    'List: items in square brackets
Index: first item is 0
Access: list[index]
Modify: list[0] = new_value
Add: append(), insert()
Remove: remove(), pop()
Loop: for item in list
Slice: list[start:end]',
    'beginner',
    13,
    false
),

(
    'python',
    'Python Tuples',
    'python-tuples',
    'Learn about unchangeable lists.',
    'Tuples are like lists, but you cannot change them after creating. They are useful when you want data to stay the same.',
    'A tuple is like a list but with parentheses and it is unchangeable.

Creating tuples:
colors = ("red", "green", "blue")
numbers = (1, 2, 3)
single = (42,)  # Single item needs comma

Accessing items:
colors[0]      # "red"
colors[-1]     # "blue"
colors[0:2]    # ("red", "green")

Important: Tuples are unchangeable (immutable):
colors[0] = "yellow"  # ERROR!
colors.append("yellow")  # ERROR!

Why use tuples:
- Protect data so it cannot be changed
- Faster than lists
- Can be used as dictionary keys
- Return multiple values from functions

Converting:
list_version = list(colors)  # Convert tuple to list
tuple_version = tuple([1, 2, 3])  # Convert list to tuple

Looping through tuples:
for color in colors:
    print(color)',
    'Tuple: items in parentheses
Created: (item1, item2, item3)
Unchangeable (immutable)
Access by index like lists
Cannot add or remove items
Single item needs trailing comma
Faster and safer than lists
Use when data should not change',
    'beginner',
    14,
    false
),

(
    'python',
    'Python Sets',
    'python-sets',
    'Learn about unique collections with no order.',
    'Sets store unique items with no particular order. They are perfect when you just care about whether an item exists, not where it is.',
    'A set is a collection with unique items and no order. Duplicates are ignored.

Creating sets:
colors = {"red", "green", "blue"}
numbers = {1, 2, 3}
mixed = {1, "hello", 3.14}

Sets remove duplicates automatically:
items = {1, 2, 2, 3, 3, 3}  # {1, 2, 3}

Accessing items (no indexing):
colors = {"red", "green", "blue"}
colors[0]  # ERROR! No indexing in sets

Adding and removing items:
colors.add("yellow")
colors.remove("red")  # Error if not found
colors.discard("red")  # No error if not found
colors.pop()  # Remove any item

Checking membership:
"red" in colors  # True
"yellow" in colors  # False

Set operations:
set1 = {1, 2, 3}
set2 = {2, 3, 4}
set1.union(set2)       # {1, 2, 3, 4}
set1.intersection(set2)  # {2, 3}

Looping:
for color in colors:
    print(color)',
    'Set: unique items in curly braces
No duplicates allowed
No order (no indexing)
Add: add()
Remove: remove(), discard(), pop()
Check: item in set
Union: set1.union(set2)
Intersection: set1.intersection(set2)',
    'beginner',
    15,
    false
),

(
    'python',
    'Python Dictionaries',
    'python-dictionaries',
    'Learn key-value pairs for structured data.',
    'Dictionaries store data as key-value pairs. This lets you look up values by name instead of by position, making your code more readable.',
    'A dictionary stores key-value pairs in curly braces.

Creating dictionaries:
person = {"name": "Alice", "age": 25, "city": "NYC"}
phone = {"brand": "Apple", "model": "iPhone", "year": 2023}

Accessing values by key:
person["name"]     # "Alice"
person["age"]      # 25
person.get("name")  # "Alice"
person.get("email", "No email")  # "No email" (default if not found)

Modifying values:
person["age"] = 26
person["email"] = "alice@example.com"

Removing items:
del person["age"]
person.pop("name")

Checking if key exists:
"name" in person  # True
"age" in person   # False

Getting all keys, values, pairs:
person.keys()    # ["name", "age", "city"]
person.values()  # ["Alice", 25, "NYC"]
person.items()   # [("name", "Alice"), ...]

Looping:
for key in person:
    print(key, person[key])

for key, value in person.items():
    print(key, value)',
    'Dictionary: key-value pairs in braces
Access: dict[key] or dict.get(key)
Modify: dict[key] = new_value
Add: dict[new_key] = value
Remove: del dict[key]
Check: key in dict
Keys: dict.keys()
Values: dict.values()
Items: dict.items()',
    'beginner',
    16,
    false
),

(
    'python',
    'Python If...Else',
    'python-if-else',
    'Learn to make decisions in your code.',
    'If statements let your code make decisions. Based on conditions, different code runs. This is how programs respond to different situations.',
    'If statements check conditions and run different code based on the result.

Simple if:
age = 18
if age >= 18:
    print("You are an adult")

If-else:
age = 15
if age >= 18:
    print("Adult")
else:
    print("Not an adult")

If-elif-else (multiple conditions):
age = 20
if age < 13:
    print("Child")
elif age < 18:
    print("Teenager")
else:
    print("Adult")

Nested if statements:
age = 20
has_license = True
if age >= 18:
    if has_license:
        print("Can drive")
    else:
        print("Too young to drive")

Operators in conditions:
x = 10
if x > 5 and x < 15:
    print("x is between 5 and 15")

if x < 5 or x > 15:
    print("x is NOT between 5 and 15")

Inline if-else (ternary):
status = "Adult" if age >= 18 else "Minor"',
    'if: runs if condition is True
else: runs if condition is False
elif: additional conditions
Conditions use: == != > < >= <=
Combine with: and or not
Indentation matters (4 spaces)
Multiple elif possible
Nested if for complex logic',
    'beginner',
    17,
    false
),

(
    'python',
    'Python While Loops',
    'python-while-loops',
    'Learn to repeat code while a condition is true.',
    'While loops repeat code as long as a condition is true. They are useful for tasks that repeat an unknown number of times.',
    'A while loop repeats code while a condition is True.

Simple while loop:
i = 0
while i < 5:
    print(i)
    i = i + 1
# Output: 0, 1, 2, 3, 4

Counting down:
i = 5
while i > 0:
    print(i)
    i = i - 1
# Output: 5, 4, 3, 2, 1

Break statement (exit loop):
i = 0
while i < 10:
    if i == 5:
        break  # Exit loop
    print(i)
    i = i + 1
# Output: 0, 1, 2, 3, 4

Continue statement (skip to next iteration):
i = 0
while i < 5:
    i = i + 1
    if i == 3:
        continue  # Skip this iteration
    print(i)
# Output: 1, 2, 4, 5

Infinite loop (use break to exit):
while True:
    user_input = input("Type ''quit'' to exit: ")
    if user_input == "quit":
        break
    print("You typed:", user_input)',
    'while: repeats while condition is True
Update variable in loop body
break: exit loop immediately
continue: skip to next iteration
Infinite loop: while True
Use break to exit infinite loop
Indentation defines loop body',
    'beginner',
    18,
    false
),

(
    'python',
    'Python For Loops',
    'python-for-loops',
    'Learn to loop through sequences.',
    'For loops repeat code for each item in a sequence. They are the most common loop type and make your code cleaner than while loops.',
    'A for loop repeats code for each item in a sequence.

Loop through list:
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# Output: apple, banana, cherry

Loop through string:
for letter in "hello":
    print(letter)
# Output: h, e, l, l, o

Loop with range():
for i in range(5):
    print(i)
# Output: 0, 1, 2, 3, 4

range() with start and end:
for i in range(2, 8):
    print(i)
# Output: 2, 3, 4, 5, 6, 7

range() with step:
for i in range(0, 10, 2):
    print(i)
# Output: 0, 2, 4, 6, 8

Break and continue:
for i in range(5):
    if i == 3:
        continue  # Skip 3
    if i == 4:
        break  # Exit at 4
    print(i)
# Output: 0, 1, 2

Loop through dictionary:
person = {"name": "Alice", "age": 25}
for key in person:
    print(key, person[key])

Enumerate (index and value):
fruits = ["apple", "banana"]
for index, fruit in enumerate(fruits):
    print(index, fruit)
# Output: 0 apple, 1 banana',
    'for item in sequence: repeats for each
Use range() for numbers
range(end) starts at 0
range(start, end, step) custom range
break: exit loop
continue: skip to next
enumerate(): get index and value
Cleaner than while for sequences',
    'beginner',
    19,
    false
),

(
    'python',
    'Python Functions',
    'python-functions',
    'Learn to create reusable blocks of code.',
    'Functions let you write code once and reuse it many times. They make code cleaner, easier to test, and reduce mistakes.',
    'A function is a reusable block of code.

Simple function:
def greet():
    print("Hello!")

greet()  # Calls function

Function with parameters (inputs):
def greet(name):
    print("Hello, " + name + "!")

greet("Alice")  # Output: Hello, Alice!
greet("Bob")    # Output: Hello, Bob!

Function with return value:
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # 8

Multiple parameters:
def describe_person(name, age, city):
    print(name + " is " + str(age) + " and lives in " + city)

describe_person("Alice", 25, "NYC")

Default parameters:
def greet(name = "Guest"):
    print("Hello, " + name + "!")

greet()        # Hello, Guest!
greet("Alice")  # Hello, Alice!

Return multiple values:
def get_coordinates():
    return 10, 20

x, y = get_coordinates()

Docstrings (describe function):
def add(a, b):
    """Add two numbers and return result"""
    return a + b',
    'def name(): creates function
Parameters: inputs in parentheses
return: output/result
Call function: name()
Default parameters possible
Can return multiple values
Return early with return
Docstrings describe function',
    'beginner',
    20,
    false
),

(
    'python',
    'Python Range',
    'python-range',
    'Learn to generate sequences of numbers.',
    'The range() function generates a sequence of numbers. It is particularly useful in for loops when you need to repeat code a specific number of times.',
    'range() generates a sequence of numbers.

range(stop):
for i in range(5):
    print(i)
# 0, 1, 2, 3, 4

range(start, stop):
for i in range(2, 8):
    print(i)
# 2, 3, 4, 5, 6, 7

range(start, stop, step):
for i in range(0, 10, 2):
    print(i)
# 0, 2, 4, 6, 8

Negative numbers:
for i in range(5, 0, -1):
    print(i)
# 5, 4, 3, 2, 1

Convert range to list:
numbers = list(range(5))  # [0, 1, 2, 3, 4]

Common patterns:
# Count from 1 to 10
for i in range(1, 11):
    print(i)

# Every other number
for i in range(0, 20, 2):
    print(i)

# Backwards
for i in range(10, 0, -1):
    print(i)',
    'range(stop): 0 to stop-1
range(start, stop): start to stop-1
range(start, stop, step): with step
step can be negative
Convert to list: list(range(5))
Often used in for loops
Generates on-the-fly (memory efficient)',
    'beginner',
    21,
    false
),

(
    'python',
    'Python Try...Except',
    'python-try-except',
    'Learn to handle errors gracefully.',
    'Errors happen. Try-except lets your program handle errors instead of crashing. Your users get a better experience.',
    'Try-except catches errors and handles them gracefully.

Basic try-except:
try:
    x = 1 / 0
except:
    print("Cannot divide by zero")

Specific error types:
try:
    age = int(input("Age: "))
except ValueError:
    print("Please enter a number")

Multiple except blocks:
try:
    result = 10 / int(user_input)
except ValueError:
    print("Please enter a number")
except ZeroDivisionError:
    print("Cannot divide by zero")

Else clause (runs if no error):
try:
    age = int(input("Age: "))
except ValueError:
    print("Invalid age")
else:
    print("Age is", age)

Finally clause (always runs):
try:
    file = open("data.txt")
    data = file.read()
except FileNotFoundError:
    print("File not found")
finally:
    file.close()

Common errors:
ZeroDivisionError: Cannot divide by zero
ValueError: Invalid value conversion
TypeError: Wrong type operation
IndexError: List index out of range
KeyError: Dictionary key not found
FileNotFoundError: File does not exist',
    'try: code that might error
except: handle the error
except SpecificError: catch specific error
else: runs if no error
finally: always runs
print error with: except as e
Don''t catch all errors silently
Specific is better than generic',
    'beginner',
    22,
    false
)
;

-- Insert additional Python topics (continuation of beginners)
INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, is_premium)
VALUES

(
    'python',
    'Python Match',
    'python-match',
    'Use match statements for clean comparisons.',
    'Match statements (Python 3.10+) provide a cleaner way to handle multiple conditions compared to long if-elif-else chains.',
    'Match statements work like switch statements in other languages.

Basic match:
day = 3
match day:
    case 1:
        print("Monday")
    case 2:
        print("Tuesday")
    case 3:
        print("Wednesday")
    case _:
        print("Other day")

The _ is a catch-all (like default).

Match with multiple conditions:
status_code = 404
match status_code:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case 500:
        print("Server Error")
    case _:
        print("Unknown code")

Pattern matching:
point = (0, 0)
match point:
    case (0, 0):
        print("Origin")
    case (0, y):
        print(f"On Y-axis at {y}")
    case (x, 0):
        print(f"On X-axis at {x}")
    case (x, y):
        print(f"At ({x}, {y})")

Important: Match is for Python 3.10+
Earlier versions use if-elif-else instead.',
    'match: cleaner than long if-elif-else
case: each condition
_: catch-all default case
Pattern matching for tuples
Python 3.10+ feature
More readable than if-elif-else chains',
    'beginner',
    23,
    false
),

(
    'python',
    'Python String Formatting',
    'python-string-formatting',
    'Learn to create formatted text easily.',
    'String formatting lets you insert variables into text cleanly. Instead of concatenating, you insert values into a template string.',
    'String formatting creates text with variables inserted.

Concatenation (old way):
name = "Alice"
age = 25
print("Name: " + name + ", Age: " + str(age))

Format with %:
print("Name: %s, Age: %d" % (name, age))

Format with .format():
print("Name: {}, Age: {}".format(name, age))
print("Name: {0}, Age: {1}".format(name, age))
print("Name: {n}, Age: {a}".format(n=name, a=age))

F-strings (best way - Python 3.6+):
print(f"Name: {name}, Age: {age}")

With expressions in f-strings:
price = 19.99
print(f"Total: ${price * 2}")

Formatting numbers:
pi = 3.14159
print(f"Pi: {pi:.2f}")  # 3.14 (2 decimal places)

Alignment:
print(f"{name:>10}")  # Right-aligned
print(f"{name:<10}")  # Left-aligned
print(f"{name:^10}")  # Center-aligned

Multiple lines:
message = f"""
Hello {name}
You are {age} years old
Welcome!
"""
print(message)',
    'f-strings: f"text {variable}" (best)
.format(): "text {0}".format(variable)
% formatting: older style
Expressions in f-strings: f"{x * 2}"
Number formatting: f"{x:.2f}"
Alignment: >left, <right, ^center
f-strings are Python 3.6+',
    'beginner',
    24,
    false
),

(
    'python',
    'Python JSON',
    'python-json',
    'Learn to work with JSON data format.',
    'JSON is a standard format for exchanging data. Web APIs, configuration files, and more use JSON. Python has great support for JSON.',
    'JSON (JavaScript Object Notation) is a text format for data.

JSON structure (like Python dicts/lists):
{"name": "Alice", "age": 25}
["apple", "banana", "cherry"]

Convert Python to JSON:
import json
person = {"name": "Alice", "age": 25}
json_str = json.dumps(person)
# Result: ''{"name": "Alice", "age": 25}''

Convert JSON to Python:
import json
json_str = ''{"name": "Alice", "age": 25}''
person = json.loads(json_str)
# Result: {''name'': ''Alice'', ''age'': 25}

Save to file:
import json
data = {"name": "Alice", "age": 25}
with open("data.json", "w") as f:
    json.dump(data, f)

Load from file:
import json
with open("data.json", "r") as f:
    data = json.load(f)

JSON data types:
- Strings: "hello"
- Numbers: 42, 3.14
- Booleans: true, false
- Null: null (like Python None)
- Arrays: [1, 2, 3] (like lists)
- Objects: {"key": "value"} (like dicts)',
    'JSON: standard data format
json.dumps(): Python to string
json.loads(): string to Python
json.dump(): Python to file
json.load(): file to Python
Strings use double quotes
No trailing commas in JSON
null, true, false lowercase',
    'beginner',
    25,
    false
)
;
