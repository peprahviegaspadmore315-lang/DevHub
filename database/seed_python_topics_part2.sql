-- ============================================
-- Python Topics (Continued) - OOP, File Handling, Modules, Visualization, ML, DSA, Databases, Reference
-- ============================================

INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, is_premium)
VALUES

-- ============================================
-- SECTION 2: Python Classes/OOP (26-37)
-- ============================================
(
    'python',
    'Python Classes',
    'python-classes',
    'Learn to create your own data types.',
    'Classes let you create custom data types that bundle data and functions together. This is the foundation of Object-Oriented Programming.',
    'A class is a blueprint for creating objects.

Simple class:
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        print(f"Hi, I am {self.name}")

# Create objects from the class
person1 = Person("Alice", 25)
person1.introduce()  # Hi, I am Alice

person2 = Person("Bob", 30)
person2.introduce()  # Hi, I am Bob

Objects have:
- Attributes (variables): person1.name, person1.age
- Methods (functions): person1.introduce()

Attributes:
class Car:
    def __init__(self, brand, color):
        self.brand = brand
        self.color = color

car = Car("Toyota", "red")
print(car.brand)  # Toyota
print(car.color)  # red

Methods:
class Car:
    def __init__(self, brand):
        self.brand = brand
    
    def drive(self):
        print(f"{self.brand} is driving")

car = Car("Toyota")
car.drive()  # Toyota is driving',
    'Class: blueprint for objects
Object: instance of a class
__init__(): constructor (initializer)
self: refers to the object itself
Attributes: data/variables
Methods: functions in class
Create object: obj = ClassName()',
    'intermediate',
    26,
    false
),

(
    'python',
    'Python Inheritance',
    'python-inheritance',
    'Learn to create classes from other classes.',
    'Inheritance lets one class extend another. You can create a parent class and have other classes inherit its properties and methods.',
    'Inheritance lets classes share code from parent classes.

Parent class:
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print(f"{self.name} makes a sound")

Child class (inherits from Animal):
class Dog(Animal):
    def speak(self):
        print(f"{self.name} barks")

class Cat(Animal):
    def speak(self):
        print(f"{self.name} meows")

Using inheritance:
dog = Dog("Rex")
dog.speak()  # Rex barks

cat = Cat("Whiskers")
cat.speak()  # Whiskers meows

Both have the name attribute from Animal.

Calling parent method:
class Dog(Animal):
    def speak(self):
        super().speak()  # Call parent speak()
        print("...and wags tail!")

dog = Dog("Rex")
dog.speak()
# Rex makes a sound
# ...and wags tail!',
    'Inheritance: class Child(Parent):
Child inherits Parent methods
super(): call parent method
Override: redefine parent method
Code reuse and organization
Can have multiple levels of inheritance',
    'intermediate',
    27,
    false
),

(
    'python',
    'Python File Handling',
    'python-file-handling',
    'Learn to read and write files.',
    'Most programs need to save and load data from files. File handling in Python is simple and powerful.',
    'Working with files:

Open file:
file = open("myfile.txt")  # Read mode (default)
file = open("myfile.txt", "r")  # Explicit read
file = open("myfile.txt", "w")  # Write (overwrites)
file = open("myfile.txt", "a")  # Append (add to end)
file = open("myfile.txt", "x")  # Create new

Read entire file:
file = open("myfile.txt")
content = file.read()
file.close()

Read line by line:
file = open("myfile.txt")
for line in file:
    print(line)
file.close()

Write to file:
file = open("myfile.txt", "w")
file.write("Hello, World!")
file.close()

Use with statement (closes automatically):
with open("myfile.txt") as f:
    content = f.read()
# File closes automatically

Append to file:
with open("myfile.txt", "a") as f:
    f.write("\nNew line")

Check if file exists:
import os
if os.path.exists("myfile.txt"):
    print("File exists")

Delete file:
import os
os.remove("myfile.txt")',
    'open(): open a file
Read modes: "r", "w", "a", "x"
read(): entire content
readline(): one line
readlines(): all lines as list
write(): write text
.close(): close file
with: auto-close file
Modes: r=read, w=write, a=append, x=create',
    'intermediate',
    28,
    false
),

(
    'python',
    'Python OOP',
    'python-oop',
    'Understand Object-Oriented Programming principles.',
    'OOP is a programming style that organizes code around objects. It makes code modular, reusable, and easier to maintain.',
    'Object-Oriented Programming (OOP) principles:

1. Encapsulation: Hide internal details
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private
    
    def get_balance(self):
        return self.__balance

acc = BankAccount(1000)
print(acc.get_balance())  # 1000
print(acc.__balance)  # ERROR! Private

2. Inheritance: Reuse code from parent class
class Vehicle:
    def start(self):
        print("Starting...")

class Car(Vehicle):
    pass

3. Polymorphism: Different classes, same method
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

animals = [Dog(), Cat()]
for animal in animals:
    print(animal.speak())

4. Abstraction: Hide complexity
class Calculator:
    def add(self, a, b):
        return a + b
    
    def _internal_helper(self):  # Private
        pass',
    'Encapsulation: hide internal data
Inheritance: reuse parent code
Polymorphism: same interface, different behavior
Abstraction: hide complexity
Makes code modular and maintainable
Private attributes: __name',
    'intermediate',
    29,
    false
),

-- ============================================
-- SECTION 3: File Handling (38-40)
-- ============================================
(
    'python',
    'Python Read Files',
    'python-read-files',
    'Learn different ways to read file content.',
    'There are multiple ways to read files depending on what you need - all content, line by line, or specific lines.',
    'Reading files in different ways:

Read entire file:
with open("file.txt") as f:
    content = f.read()  # Single string

Read as list of lines:
with open("file.txt") as f:
    lines = f.readlines()  # List with newlines
    # lines = [''line1\n'', ''line2\n'', ...]

Read one line:
with open("file.txt") as f:
    first_line = f.readline()

Loop through lines:
with open("file.txt") as f:
    for line in f:
        print(line.strip())  # Remove newline

Read line by line:
with open("file.txt") as f:
    while True:
        line = f.readline()
        if not line:
            break
        print(line)

Process lines:
with open("file.txt") as f:
    for line in f:
        words = line.split()
        print(words)',
    'read(): entire file as string
readlines(): all lines as list
readline(): one line at a time
for line in file: loop through
strip(): remove whitespace
split(): break line into words
close(): optional with ''with'' statement',
    'intermediate',
    30,
    false
),

(
    'python',
    'Python Write Files',
    'python-write-files',
    'Learn to create and write to files.',
    'Writing to files lets your program save data permanently. You can create new files or append to existing ones.',
    'Writing to files:

Write new file (overwrites):
with open("file.txt", "w") as f:
    f.write("Hello, World!")

Write multiple lines:
with open("file.txt", "w") as f:
    f.write("Line 1\n")
    f.write("Line 2\n")
    f.write("Line 3\n")

Write list of lines:
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
with open("file.txt", "w") as f:
    f.writelines(lines)

Append to existing file:
with open("file.txt", "a") as f:
    f.write("New line\n")

Create new file:
with open("newfile.txt", "x") as f:
    f.write("Created!")

Write numbers and variables:
with open("data.txt", "w") as f:
    name = "Alice"
    age = 25
    f.write(f"{name} is {age}\n")

Multiple writes:
with open("file.txt", "w") as f:
    f.write("First\n")
    f.write("Second\n")
    f.write("Third\n")',
    'Mode "w": write (create/overwrite)
Mode "a": append (add to end)
Mode "x": exclusive create (error if exists)
write(): write string
writelines(): write list of strings
f-strings: f"text {variable}"
\n: newline character',
    'intermediate',
    31,
    false
),

(
    'python',
    'Python Delete Files',
    'python-delete-files',
    'Learn to remove files from the system.',
    'Sometimes you need to delete files your program has created. Python makes this easy.',
    'Deleting files:

Import os module:
import os

Delete a file:
os.remove("file.txt")

Check before deleting:
import os
if os.path.exists("file.txt"):
    os.remove("file.txt")
else:
    print("File not found")

Delete a folder:
import os
os.rmdir("myfolder")  # Must be empty

Delete folder and contents:
import shutil
shutil.rmtree("myfolder")  # Deletes all contents

Error handling:
import os
try:
    os.remove("file.txt")
except FileNotFoundError:
    print("File not found")
except PermissionError:
    print("No permission")

Delete specific file types:
import os
for file in os.listdir():
    if file.endswith(".txt"):
        os.remove(file)',
    'os.remove(): delete file
os.rmdir(): delete empty folder
shutil.rmtree(): delete folder & contents
os.path.exists(): check if exists
try-except: handle errors
FileNotFoundError: file not found
PermissionError: no permission',
    'intermediate',
    32,
    false
),

-- ============================================
-- SECTION 4: Python Modules (41-44)
-- ============================================
(
    'python',
    'Python Modules Intro',
    'python-modules-intro',
    'Learn to use and create modules.',
    'Modules let you reuse code. Python has thousands of built-in and third-party modules that save you time.',
    'Modules are files with Python code you can use in other files.

Import entire module:
import math
print(math.sqrt(16))  # 4.0
print(math.pi)        # 3.14159

Import specific item:
from math import sqrt, pi
print(sqrt(16))       # 4.0
print(pi)             # 3.14159

Import with alias:
import math as m
print(m.sqrt(16))

Import everything:
from math import *
print(sqrt(16))  # Works - but not recommended

Common modules:
- math: mathematics
- random: random numbers
- datetime: dates and times
- os: operating system
- sys: system information
- json: JSON data
- requests: web requests
- numpy: numerical arrays

Create your own module (mymodule.py):
def greet(name):
    return f"Hello, {name}!"

Use your module:
import mymodule
print(mymodule.greet("Alice"))',
    'import module: use everything
from module import item: specific item
import module as alias: shorter name
Modules: files with reusable code
Built-in modules included with Python
Install others: pip install package
math, random, datetime, os common modules',
    'intermediate',
    33,
    false
),

(
    'python',
    'NumPy Tutorial',
    'python-numpy',
    'Learn numerical computing with NumPy.',
    'NumPy is the foundation for data science in Python. It provides efficient arrays and mathematical functions.',
    'NumPy is a library for numerical computing.

Install NumPy:
pip install numpy

Import NumPy:
import numpy as np

Create arrays:
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6]])

Array operations:
arr + 10      # Add 10 to each
arr * 2       # Multiply each by 2
arr ** 2      # Square each

Array functions:
np.sum(arr)   # Sum all
np.mean(arr)  # Average
np.max(arr)   # Maximum
np.min(arr)   # Minimum
np.std(arr)   # Standard deviation

Array slicing:
arr[0]        # First element
arr[1:3]      # Elements 1-2
arr[::2]      # Every other

Create special arrays:
np.zeros(5)              # [0, 0, 0, 0, 0]
np.ones(5)               # [1, 1, 1, 1, 1]
np.arange(0, 10, 2)      # [0, 2, 4, 6, 8]
np.linspace(0, 10, 5)    # 5 evenly spaced

Linear algebra:
np.dot(arr1, arr2)  # Matrix multiply
np.linalg.inv(matrix)  # Matrix inverse',
    'NumPy: numerical computing
Arrays: efficient data structure
np.array(): create array
Operations: +, -, *, /
Functions: sum, mean, max, min, std
Slicing: arr[start:end:step]
Matrix operations: dot, inv',
    'intermediate',
    34,
    false
),

(
    'python',
    'Pandas Tutorial',
    'python-pandas',
    'Learn data manipulation with Pandas.',
    'Pandas is the tool of choice for working with tabular data. It makes data analysis and cleaning easy.',
    'Pandas is for data analysis and manipulation.

Install:
pip install pandas

Import:
import pandas as pd

Create DataFrame:
data = {
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "City": ["NYC", "LA", "Chicago"]
}
df = pd.DataFrame(data)

Read from file:
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")

DataFrames are like tables:
df.head()       # First rows
df.tail()       # Last rows
df.shape        # Number of rows, columns
df.columns      # Column names
df.describe()   # Statistics

Access data:
df["Name"]                # Column
df["Name"][0]             # Specific cell
df.loc[0]                 # Row by index
df.iloc[0]                # Row by position

Filtering:
df[df["Age"] > 25]        # Rows where Age > 25

Adding columns:
df["Salary"] = 50000

Sorting:
df.sort_values("Age")

Save to file:
df.to_csv("output.csv")',
    'Pandas: data manipulation
DataFrame: table-like structure
read_csv(), read_excel(): load data
head(), tail(), shape, describe()
Access by column or row
Filtering: df[condition]
Sort, group, aggregate data
Save to CSV, Excel, etc.',
    'intermediate',
    35,
    false
),

(
    'python',
    'Django Tutorial',
    'python-django',
    'Learn web development with Django.',
    'Django is a powerful framework for building web applications quickly. It handles databases, URL routing, and more.',
    'Django is a web framework for building websites.

Install:
pip install django

Create project:
django-admin startproject myproject
cd myproject

Create app:
python manage.py startapp myapp

Folder structure:
myproject/
  manage.py
  myproject/
    settings.py  # Configuration
    urls.py      # URL routes
  myapp/
    models.py    # Database
    views.py     # Business logic
    urls.py      # App URLs

Simple view:
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello, World!")

URL routing (myapp/urls.py):
from django.urls import path
from . import views

urlpatterns = [
    path($tag$''$tag$, views.hello, name=$tag$''hello''$tag$),
]

Database models:
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()

Run server:
python manage.py runserver

Your site: http://localhost:8000/',
    'Django: web framework
Models: database
Views: business logic
URLs: routing
Templates: HTML
Forms: user input
ORM: database queries
Powerful and batteries-included',
    'intermediate',
    36,
    false
)
;

-- ============================================
-- SECTION 5: Python Matplotlib (45-58)
-- ============================================
INSERT INTO topics (language, title, slug, description, why_learn, simple_explanation, key_points, difficulty, order_index, is_premium)
VALUES

(
    'python',
    'Matplotlib Intro',
    'python-matplotlib-intro',
    'Learn data visualization basics.',
    'Matplotlib turns numbers into visualizations. Charts and graphs help people understand data quickly.',
    'Matplotlib is a library for creating charts and graphs.

Install:
pip install matplotlib

Simple plot:
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [1, 4, 9, 16]

plt.plot(x, y)
plt.show()

Add labels:
plt.xlabel("X-axis label")
plt.ylabel("Y-axis label")
plt.title("My First Plot")

Line styles:
plt.plot(x, y, "o-")  # Circle markers, solid line
plt.plot(x, y, "s--")  # Square markers, dashed line
plt.plot(x, y, "^-.")  # Triangle markers, dash-dot

Colors:
plt.plot(x, y, "r-")   # Red
plt.plot(x, y, "b-")   # Blue
plt.plot(x, y, color="green")

Multiple plots:
plt.plot(x1, y1, label="Series 1")
plt.plot(x2, y2, label="Series 2")
plt.legend()  # Show legend',
    'Matplotlib: visualization library
plt.plot(): line chart
plt.xlabel(), ylabel(), title(): labels
plt.show(): display
Colors and styles: ''r-'', ''b--'', etc.
Multiple plots in one figure
plt.legend(): show legend',
    'intermediate',
    37,
    false
),

(
    'python',
    'Matplotlib Bar Charts',
    'python-matplotlib-bars',
    'Learn to create bar charts.',
    'Bar charts are perfect for comparing values across categories. They are one of the most used chart types.',
    'Bar charts show categories and values:

Simple bar chart:
import matplotlib.pyplot as plt

categories = ["A", "B", "C", "D"]
values = [10, 24, 36, 18]

plt.bar(categories, values)
plt.show()

Horizontal bars:
plt.barh(categories, values)

Colors:
plt.bar(categories, values, color="skyblue")
plt.bar(categories, values, color=["red", "blue", "green", "orange"])

Stacked bar chart:
categories = ["Q1", "Q2", "Q3", "Q4"]
series1 = [10, 20, 30, 25]
series2 = [15, 25, 20, 30]

plt.bar(categories, series1, label="Product A")
plt.bar(categories, series2, bottom=series1, label="Product B")
plt.legend()

Add values on bars:
for i, v in enumerate(values):
    plt.text(i, v + 1, str(v))

Labels and title:
plt.xlabel("Categories")
plt.ylabel("Values")
plt.title("Sales by Category")',
    'plt.bar(): vertical bar chart
plt.barh(): horizontal bar chart
color=: bar color
label=: legend label
bottom=: stacked bars
plt.text(): add values
Clean and easy to read',
    'intermediate',
    38,
    false
),

(
    'python',
    'Matplotlib Scatter Plots',
    'python-matplotlib-scatter',
    'Learn to create scatter plots.',
    'Scatter plots show relationships between two variables. They are great for finding patterns and correlations.',
    'Scatter plots show individual data points:

Simple scatter plot:
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 6]

plt.scatter(x, y)
plt.show()

With colors and sizes:
sizes = [100, 200, 150, 300, 250]
colors = [''red'', ''blue'', ''green'', ''yellow'', ''purple'']

plt.scatter(x, y, s=sizes, c=colors)

Color by value:
colors = y  # Use y-values for color

plt.scatter(x, y, c=colors, cmap="viridis")  # viridis colormap
plt.colorbar()  # Show color scale

Add trend line:
import numpy as np

z = np.polyfit(x, y, 1)  # Linear fit
p = np.poly1d(z)
plt.plot(x, p(x), "r-")  # Red line

Labels:
plt.xlabel("Variable X")
plt.ylabel("Variable Y")
plt.title("Relationship between X and Y")',
    'plt.scatter(): scatter plot
s=: point size
c=: color or value for color map
cmap=: colormap
plt.colorbar(): color scale legend
Trend lines show relationships
Find correlations in data',
    'intermediate',
    39,
    false
),

(
    'python',
    'Matplotlib Histograms',
    'python-matplotlib-histograms',
    'Learn to create histograms.',
    'Histograms show the distribution of data. They answer the question: how many items fall into each range?',
    'Histograms show data distribution:

Simple histogram:
import matplotlib.pyplot as plt

data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]

plt.hist(data, bins=5)
plt.show()

Customize bins:
plt.hist(data, bins=[1, 2, 3, 4, 5, 6])  # Specific ranges

Color and labels:
plt.hist(data, bins=10, color="skyblue", edgecolor="black")
plt.xlabel("Values")
plt.ylabel("Frequency")
plt.title("Distribution")

Multiple histograms:
data1 = [1, 2, 2, 3, 3, 3, 4]
data2 = [2, 3, 3, 4, 4, 5, 5, 5]

plt.hist(data1, bins=5, alpha=0.5, label="Dataset 1")
plt.hist(data2, bins=5, alpha=0.5, label="Dataset 2")
plt.legend()

Density:
plt.hist(data, bins=10, density=True)  # Normalized

Cumulative:
plt.hist(data, bins=10, cumulative=True)',
    'plt.hist(): histogram
bins=: number of ranges or specific bins
color=: bar color
edgecolor=: border color
alpha=: transparency
density=: normalize
cumulative=: cumulative distribution
Shows data distribution',
    'intermediate',
    40,
    false
),

(
    'python',
    'Matplotlib Pie Charts',
    'python-matplotlib-pie',
    'Learn to create pie charts.',
    'Pie charts show parts of a whole. They are perfect for showing percentages or divisions of a total.',
    'Pie charts show composition:

Simple pie chart:
import matplotlib.pyplot as plt

labels = ["Rent", "Food", "Transport", "Entertainment"]
sizes = [1200, 600, 400, 300]

plt.pie(sizes, labels=labels)
plt.show()

With percentages:
plt.pie(sizes, labels=labels, autopct="%1.1f%%")

Colors:
colors = ["red", "blue", "green", "yellow"]
plt.pie(sizes, labels=labels, colors=colors)

Explode (separate slice):
explode = (0.1, 0, 0, 0)  # Separate first slice
plt.pie(sizes, labels=labels, explode=explode)

Legend:
plt.pie(sizes, labels=labels, autopct="%1.1f%%")
plt.legend(labels, loc="upper left")

Save as donut chart (with circle):
circle = plt.Circle((0, 0), 0.70, fc="white")
fig = plt.gcf()
fig.gca().add_artist(circle)',
    'plt.pie(): pie chart
labels=: labels
sizes=: values
autopct=: show percentages
colors=: slice colors
explode=: separate slice
Shows part-to-whole relationships',
    'intermediate',
    41,
    false
)
;

-- Save to database
