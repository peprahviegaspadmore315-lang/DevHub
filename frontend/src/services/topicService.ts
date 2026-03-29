import api from './api';
import { courseData, type CourseData, type Lesson } from '../data/courseData';
import { createCourseTopicSlugMap } from '../lib/course-topic-slugs';

export interface CodeExample {
  id: number;
  title: string;
  description: string;
  code: string;
  codeLanguage: string;
  output: string;
  orderIndex: number;
}

export interface VideoInfo {
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export interface Topic {
  id: number;
  language: string;
  title: string;
  slug: string;
  description: string;
  contentMarkdown?: string;
  whyLearn: string;
  simpleExplanation: string;
  keyPoints: string[];
  difficulty: string;
  orderIndex: number;
  isPremium: boolean;
  video: VideoInfo | null;
  codeExamples: CodeExample[];
}

const LANGUAGE_ALIASES: Record<string, string> = {
  javascript: 'java',
};

const LOCAL_COURSE_SLUGS: Record<string, string> = {
  html: 'html-tutorial',
  css: 'css-tutorial',
  java: 'java-tutorial',
  python: 'python-tutorial',
};

const normalizeTopicLanguage = (language: string) =>
  LANGUAGE_ALIASES[language.trim().toLowerCase()] || language.trim().toLowerCase();

const formatLanguageLabel = (language: string) => {
  const normalized = normalizeTopicLanguage(language);

  if (normalized === 'html') return 'HTML';
  if (normalized === 'css') return 'CSS';
  if (normalized === 'java') return 'Java';
  if (normalized === 'python') return 'Python';

  return normalized.toUpperCase();
};

const stripMarkdown = (content: string) =>
  content
    .replace(/^#+\s*/gm, '')
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^\s*-\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();

const buildSimpleExplanation = (lesson: Lesson) => {
  const cleaned = stripMarkdown(lesson.content || '');
  if (!cleaned) {
    return lesson.summary;
  }

  const excerpt = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' ');

  return excerpt || lesson.summary;
};

const getCustomTopicCopy = (
  course: CourseData,
  lesson: Lesson,
  language: string
): {
  simpleExplanation: string;
  whyLearn: string;
  keyPoints: string[];
} | null => {
  const normalizedLanguage = normalizeTopicLanguage(language);
  const normalizedTitle = lesson.title.trim().toLowerCase();

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java home') {
    return {
      simpleExplanation: stripMarkdown(lesson.content || ''),
      whyLearn:
        'Java gives you a strong foundation for real-world programming because it combines platform independence, object-oriented structure, security, and a mature ecosystem used in professional applications.',
      keyPoints: [
        'Java is a high-level language used for web systems, Android apps, desktop software, games, and enterprise platforms.',
        'Java code is compiled into bytecode and then runs through the JVM, which makes cross-platform execution possible.',
        'Java is popular because of OOP support, strong security features, and a large developer community.',
        'A simple Java program starts with a class and a main method, then uses System.out.println() to display output.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java get started') {
    return {
      simpleExplanation: stripMarkdown(lesson.content || ''),
      whyLearn:
        'Java Get Started teaches the exact workflow every beginner needs first: install the JDK, write code, compile it with javac, and run it with the JVM.',
      keyPoints: [
        'You need the JDK plus a code editor or IDE before you can start building Java programs.',
        'A Java source file such as Main.java is compiled into Main.class using javac.',
        'The java command runs the compiled bytecode through the JVM.',
        'Common beginner mistakes include mismatched file and class names, missing semicolons, and incorrect capitalization.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java syntax') {
    return {
      simpleExplanation: stripMarkdown(lesson.content || ''),
      whyLearn:
        'Java Syntax helps you write code the compiler can understand by teaching the structure of classes, the main method, statements, blocks, and naming rules.',
      keyPoints: [
        'A basic Java program contains a class and a main() method where execution starts.',
        'Java is case-sensitive, so names like Main and main are treated differently.',
        'Statements usually end with semicolons, and blocks of code are grouped with curly braces.',
        'Comments, identifiers, keywords, and spacing all follow specific syntax rules in Java.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java output') {
    return {
      simpleExplanation: stripMarkdown(lesson.content || ''),
      whyLearn:
        'Java Output is one of the first practical skills in programming because it helps you display results, check your logic, and understand what your code is doing while you learn.',
      keyPoints: [
        'Use println() when you want output followed by a new line, and use print() when you want to continue on the same line.',
        'Use printf() when you need formatted output with placeholders such as %d, %s, %f, and %c.',
        'You can print variables directly or combine text and values using the + operator.',
        'Escape characters like \\n, \\t, \\\\, and \\" help you control how output appears on the screen.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java comments') {
    return {
      simpleExplanation: stripMarkdown(lesson.content || ''),
      whyLearn:
        'Java Comments improve readability and collaboration because they help you document intent, explain tricky decisions, and temporarily disable code while debugging.',
      keyPoints: [
        'Single-line comments use // and are best for short notes beside or above code.',
        'Multi-line comments use /* */ and are useful for longer explanations or temporarily disabling blocks of code.',
        'Documentation comments use /** */ and are designed for Javadoc-generated API documentation.',
        'Good comments explain why something matters instead of repeating what the code already says clearly.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java variables') {
    return {
      simpleExplanation:
        'Java variables store data using a declared type, a meaningful name, and a value. They can hold numbers, text, characters, and true or false values, and they can be updated unless marked final.',
      whyLearn:
        'Variables are one of the first building blocks in Java because almost every program depends on storing, updating, and reusing data correctly.',
      keyPoints: [
        'Every Java variable has a type, a name, and a value.',
        'Java is strongly typed, so you must declare the type before using a variable.',
        'Variables can be changed later unless they are declared with final.',
        'Good variable names follow Java naming rules and usually use camelCase.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java operators') {
    return {
      simpleExplanation:
        'Java operators are symbols that let you do math, assign values, compare results, combine conditions, and increase or decrease numbers while your program runs.',
      whyLearn:
        'Java Operators are used constantly in real programs because they power calculations, decision-making, conditions, loops, and everyday updates to data.',
      keyPoints: [
        'Arithmetic operators like +, -, *, /, and % handle calculations.',
        'Assignment operators such as = and += store values or update variables more quickly.',
        'Comparison and logical operators help Java decide whether conditions are true or false.',
        'Increment and decrement operators change a value by one, and pre-increment and post-increment behave slightly differently.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java data types') {
    return {
      simpleExplanation:
        'Java data types define what kind of value a variable can store, such as whole numbers, decimals, characters, true or false values, or reference types like String and arrays.',
      whyLearn:
        'Java Data Types matter because every variable in Java needs a type, and choosing the right one affects memory use, precision, allowed operations, and how safely your code behaves.',
      keyPoints: [
        'Java has 8 primitive data types including int, double, char, and boolean.',
        'Non-primitive types such as String, arrays, classes, and interfaces usually store references to more complex data.',
        'Primitive and non-primitive types differ in size, nullability, and whether methods are available directly.',
        'Class fields can receive default values automatically, but local variables inside methods must be initialized first.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java type casting') {
    return {
      simpleExplanation:
        'Java type casting converts a value from one data type to another, either automatically when the target type is larger or manually when the target type is smaller.',
      whyLearn:
        'Java Type Casting is important because real programs often mix data types in calculations, input handling, and formatting, and casting helps you control how Java treats those values.',
      keyPoints: [
        'Widening casting happens automatically when moving from a smaller type to a larger one, such as int to double.',
        'Narrowing casting must be written manually with parentheses, such as double to int.',
        'Narrowing can lose information because decimals are truncated and large values may not fit cleanly in the new type.',
        'Casting is especially useful when you want more accurate division or need to convert values for storage and output.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java math') {
    return {
      simpleExplanation:
        'Java Math gives you built-in static methods for common calculations such as maximums, minimums, square roots, powers, rounding, and random values.',
      whyLearn:
        'Java Math is useful because it saves you from writing common calculations by hand and gives you reliable built-in tools for games, simulations, data work, and everyday programming tasks.',
      keyPoints: [
        'Use Math.max() and Math.min() to compare values quickly.',
        'Methods like Math.sqrt(), Math.pow(), and Math.abs() help with common number operations.',
        'Math.round(), Math.ceil(), and Math.floor() are useful when you need to control how decimals are rounded.',
        'Math.random() gives a decimal from 0.0 up to but not including 1.0, and you can scale it into a range.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java string') {
    return {
      simpleExplanation:
        'A Java String stores text as a sequence of characters, and you can use String methods to measure, compare, search, combine, and transform that text.',
      whyLearn:
        'Java String is essential because text appears in almost every real program, from names and messages to user input, file content, search, validation, and display logic.',
      keyPoints: [
        'String stores text, while char stores only one character.',
        'Useful String methods include length(), toUpperCase(), toLowerCase(), charAt(), substring(), indexOf(), and concat().',
        'Use equals() to compare text values, because == checks object references instead of the actual content.',
        'Strings are immutable, so operations that seem to change them actually create a new String.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java if...else') {
    return {
      simpleExplanation:
        'Java if...else statements let your program choose different actions depending on whether conditions are true or false.',
      whyLearn:
        'Java If...Else is one of the most important building blocks in programming because it lets your code react to scores, input, permissions, errors, and many other real-world situations.',
      keyPoints: [
        'Use if when you want code to run only when a condition is true.',
        'Use else when you want a fallback action, and use else if when you need to check several conditions in order.',
        'Nested if statements let you place one decision inside another for more detailed logic.',
        'The ternary operator is a compact shortcut for simple if...else expressions.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java booleans') {
    return {
      simpleExplanation:
        'Java booleans store only true or false, and they are used to represent logic, compare values, and control decisions in your program.',
      whyLearn:
        'Java Booleans are essential because conditions, comparisons, loops, and branching all depend on values that evaluate to true or false.',
      keyPoints: [
        'A boolean can only hold true or false.',
        'Comparison expressions like age >= 18 produce boolean results.',
        'Booleans are commonly used in if statements and other control-flow structures.',
        'Logical operators such as &&, ||, and ! help combine or reverse boolean conditions.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java switch' || normalizedTitle === 'java switch statement')
  ) {
    return {
      simpleExplanation:
        'Java switch statements let your program choose one branch from several exact values by matching a single expression against different cases.',
      whyLearn:
        'Java Switch is useful because it can make multi-option decision logic cleaner and easier to read when you are checking one variable against many known values.',
      keyPoints: [
        'Use switch when you want to compare one expression against multiple exact case values.',
        'The break keyword stops execution so Java does not continue into the next case by accident.',
        'The default case handles values that do not match any listed case.',
        'Switch is often cleaner than a long if...else chain when the values are fixed and known ahead of time.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java for loop') {
    return {
      simpleExplanation:
        'A Java for loop repeats code while a counter or condition is updated each time, making it ideal for counting-based repetition.',
      whyLearn:
        'Java For Loop is important because it lets you repeat work in a controlled way, which is useful for counting, arrays, lists, tables, and many everyday programming tasks.',
      keyPoints: [
        'A for loop combines initialization, condition, and update in one line.',
        'It works best when you already know how many times the loop should run.',
        'For loops can run forward, backward, or inside other loops as nested loops.',
        'Common mistakes include off-by-one errors and forgetting the update step.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java break/continue' || normalizedTitle === 'java break and continue')
  ) {
    return {
      simpleExplanation:
        'Java break and continue are loop-control statements: break stops the loop completely, while continue skips only the current iteration.',
      whyLearn:
        'Java Break and Continue are useful when you need more control inside loops, such as stopping early after finding a result or skipping values you do not want to process.',
      keyPoints: [
        'Use break when you want to exit a loop immediately.',
        'Use continue when you want to skip the current iteration and keep looping.',
        'Both statements work in for and while loops.',
        'Be careful with continue in while loops so your update step still runs and the loop does not become infinite.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java while loop') {
    return {
      simpleExplanation:
        'A Java while loop keeps running as long as its condition stays true, which makes it useful for repetition that depends on changing state.',
      whyLearn:
        'Java While Loop is important because many real programs repeat work until something changes, such as valid input arriving, a timer finishing, or a search condition being met.',
      keyPoints: [
        'A while loop checks its condition before each iteration.',
        'It works best when you do not know in advance how many times the loop should run.',
        'You must update the loop variable or some related state so the condition can eventually become false.',
        'A common mistake is creating an infinite loop by forgetting the update step or using the wrong condition.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java arrays' || normalizedTitle === 'java array')
  ) {
    return {
      simpleExplanation:
        'A Java array stores multiple values of the same type in one variable, and you access each value by its index.',
      whyLearn:
        'Java Arrays are important because they help you organize groups of related values and are used constantly with loops, tables, data processing, and many core programming patterns.',
      keyPoints: [
        'Arrays store multiple values in one variable, and all values in the array share the same type.',
        'Array indexing starts from 0, and arrays have a fixed size after they are created.',
        'Use numbers.length to get the size of an array.',
        'Arrays work especially well with for loops, for-each loops, and multidimensional data.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java methods') {
    return {
      simpleExplanation:
        'A Java method is a reusable block of code that performs a specific task, and it can accept inputs, return outputs, or simply run an action.',
      whyLearn:
        'Java Methods are one of the most important tools in programming because they help you break large problems into smaller reusable parts and make your code easier to read, test, and maintain.',
      keyPoints: [
        'Methods are declared inside classes and run only when they are called.',
        'Methods can take parameters, return values, or use void when nothing is returned.',
        'Built-in methods come from Java, while user-defined methods are created by the programmer.',
        'Method overloading lets multiple methods share the same name when their parameter lists are different.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java method challenge') {
    return {
      simpleExplanation:
        'Java Method Challenge gives you short practice tasks that apply methods, parameters, return values, and condition-based logic in realistic mini-problems.',
      whyLearn:
        'Java Method Challenge matters because practice is how method concepts become natural, and these exercises help you move from reading method syntax to actually using it to solve problems.',
      keyPoints: [
        'The challenges practice core method skills like passing arguments and returning results.',
        'Some tasks focus on logic decisions, such as checking even or odd values or finding the larger number.',
        'Small method exercises make it easier to build confidence before moving into larger programs.',
        'Challenge-based practice is a strong way to reinforce reusable code habits in Java.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java method parameters') {
    return {
      simpleExplanation:
        'Java method parameters are named inputs inside a method definition, and they let the same method work with different values each time it is called.',
      whyLearn:
        'Java Method Parameters are important because they make methods flexible and reusable, which is how real programs pass names, numbers, settings, and other data into reusable logic.',
      keyPoints: [
        'Parameters are listed in the method definition, while arguments are the actual values passed during the call.',
        'Methods can accept one parameter or several parameters of different data types.',
        'The number, order, and types of arguments should match the method parameters.',
        'Java does not support default parameter values in the same way some other languages do, so required arguments must be supplied.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java method overloading') {
    return {
      simpleExplanation:
        'Java method overloading lets multiple methods share the same name when their parameter lists are different.',
      whyLearn:
        'Java Method Overloading is useful because it keeps related actions under one clear method name while still allowing different inputs and behaviors.',
      keyPoints: [
        'Overloaded methods share the same name but differ by parameter count, type, or order.',
        'Java chooses the correct overloaded method based on the arguments at compile time.',
        'Changing only the return type is not enough to create a valid overload.',
        'Overloading improves readability by grouping similar actions under one method name.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java scope') {
    return {
      simpleExplanation:
        'Java scope defines where a variable can be seen and used, whether it is inside a method, inside a smaller block, or across a class.',
      whyLearn:
        'Java Scope matters because it helps you control where data lives, prevents variable misuse, and makes larger programs easier to understand and debug.',
      keyPoints: [
        'Method-scope variables exist only inside the method where they are declared.',
        'Block-scope variables exist only inside the braces of loops, if statements, and similar blocks.',
        'Class-level variables belong to the class and can be used by methods in that class.',
        'Local variables must be initialized before use, and scope rules help prevent naming confusion.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java recursion') {
    return {
      simpleExplanation:
        'Java recursion is when a method calls itself to solve a problem step by step until it reaches a stopping condition.',
      whyLearn:
        'Java Recursion matters because it helps you solve certain problems more naturally, especially when the problem keeps repeating in smaller versions like trees, factorials, and divide-and-conquer algorithms.',
      keyPoints: [
        'Every recursive method needs a base case to stop the repeated method calls.',
        'Each recursive call should move the problem closer to the base case.',
        'Recursion can make some solutions easier to understand, but it can also use more memory than loops.',
        'If recursion never stops, it can lead to a stack overflow error.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java classes') {
    return {
      simpleExplanation:
        'A Java class is a blueprint that groups related variables and methods together, while objects are the actual instances created from that blueprint.',
      whyLearn:
        'Java Classes matter because they are the starting point of object-oriented programming, helping you model real-world things, organize code clearly, and build reusable programs.',
      keyPoints: [
        'A class defines data and behavior, and an object is a real instance created from that class.',
        'Use the new keyword to create objects from a class.',
        'Instance fields and methods are usually accessed through an object using the dot operator.',
        'Classes are one of the core building blocks of Java OOP.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java oop' ||
      normalizedTitle === 'java oop (object-oriented programming)' ||
      normalizedTitle === 'java object-oriented programming')
  ) {
    return {
      simpleExplanation:
        'Java OOP is a way of structuring programs around classes and objects so related data and behavior stay together.',
      whyLearn:
        'Java OOP matters because it helps you build larger programs that are easier to organize, reuse, maintain, and connect to real-world ideas.',
      keyPoints: [
        'Java OOP starts with classes and objects, which form the base of object-oriented design.',
        'The four main OOP pillars are encapsulation, inheritance, polymorphism, and abstraction.',
        'Encapsulation protects data, inheritance reuses code, polymorphism allows flexible behavior, and abstraction hides complexity.',
        'Understanding OOP makes later Java topics like classes, constructors, inheritance, and interfaces much easier to grasp.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java classes and objects') {
    return {
      simpleExplanation:
        'Java classes and objects work together so that a class defines the structure and behavior, while objects are the real instances created from that design.',
      whyLearn:
        'Java Classes and Objects matter because they are the starting point of object-oriented programming and help you organize code around real, reusable things.',
      keyPoints: [
        'A class is a blueprint, and an object is an instance created from that blueprint.',
        'Use the new keyword to create objects from a class.',
        'The dot operator is used to access object properties and methods.',
        'Multiple objects can come from one class and still hold different values.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java class attributes') {
    return {
      simpleExplanation:
        'Java class attributes are variables inside a class that store the data or properties of objects created from that class.',
      whyLearn:
        'Java Class Attributes matter because they let you describe objects with real data, which is how classes represent people, cars, products, accounts, and many other real-world things.',
      keyPoints: [
        'Attributes are also called fields or member variables.',
        'Instance attributes belong to each object, while static attributes are shared by the class.',
        'Object attributes are usually accessed with the dot operator after creating an object.',
        'Default values apply to class attributes, but not to local variables inside methods.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java class methods') {
    return {
      simpleExplanation:
        'Java class methods are functions inside a class that define what objects can do and how class behavior is organized.',
      whyLearn:
        'Java Class Methods matter because they let your classes do useful work, combine logic with stored data, and turn simple object data into interactive behavior.',
      keyPoints: [
        'Methods define actions, while attributes store data.',
        'Instance methods are usually called through objects, while static methods belong to the class itself.',
        'Methods can use attributes, accept parameters, and return values.',
        'Forgetting parentheses or calling a non-static method without an object are very common beginner mistakes.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java class challenge') {
    return {
      simpleExplanation:
        'Java Class Challenge gives learners short practical exercises that combine classes, objects, attributes, and methods into simple hands-on tasks.',
      whyLearn:
        'Java Class Challenge matters because practice is how class concepts become real, and these exercises help learners move from reading about objects to actually creating and using them.',
      keyPoints: [
        'The challenges practice creating classes, building objects, and reading or updating attributes.',
        'Some tasks focus on object behavior by adding methods, parameters, and return values.',
        'Challenge-based practice helps connect Java class theory to real code-writing habits.',
        'Working through small class exercises builds confidence before more advanced OOP topics.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java constructors') {
    return {
      simpleExplanation:
        'Java constructors are special class members that run automatically when an object is created so the object starts with the right initial setup.',
      whyLearn:
        'Java Constructors matter because they make object creation cleaner, safer, and more consistent by setting values at the exact moment an object is made.',
      keyPoints: [
        'A constructor has the same name as the class and does not use a return type.',
        'Constructors run automatically when you create an object with new.',
        'Parameterized constructors let you pass values during object creation, and overloaded constructors support different setups.',
        'Java only provides a default constructor automatically when you have not written any constructor yourself.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java this keyword') {
    return {
      simpleExplanation:
        'Java this is a reference to the current object, and it is used inside a class to point to that object’s own fields, methods, or constructors.',
      whyLearn:
        'Java this Keyword matters because it helps you write clearer class code, avoid naming confusion, and connect constructors or methods to the current object correctly.',
      keyPoints: [
        'this.name refers to the current object’s instance variable when a parameter has the same name.',
        'this.method() can call another method on the same object, and this() can call another constructor in the same class.',
        'this() must be the first statement inside a constructor.',
        'this cannot be used inside a static method because static methods do not belong to a specific object.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java modifiers') {
    return {
      simpleExplanation:
        'Java modifiers are keywords that control who can access classes, methods, and variables, and also control how those parts of the program behave.',
      whyLearn:
        'Java Modifiers matter because they help you protect data, organize code clearly, and define whether something is shared, changeable, inherited, or incomplete by design.',
      keyPoints: [
        'Access modifiers like public, private, protected, and default control visibility.',
        'Non-access modifiers like static, final, and abstract control behavior and structure.',
        'Static members belong to the class, final members cannot be changed further, and abstract members must be completed in subclasses.',
        'Using the right modifiers makes Java programs safer, clearer, and easier to maintain.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java encapsulation') {
    return {
      simpleExplanation:
        'Java encapsulation hides class data behind private fields and exposes safe access through public methods such as getters and setters.',
      whyLearn:
        'Java Encapsulation matters because it helps you protect important data, control how values are updated, and design classes that are safer and easier to maintain over time.',
      keyPoints: [
        'Encapsulation is commonly built with private variables and public getter and setter methods.',
        'It prevents direct uncontrolled access to internal class data.',
        'Setters can include validation so invalid values are rejected before being stored.',
        'Encapsulation is one of the core ideas behind strong object-oriented class design in Java.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java packages / api' || normalizedTitle === 'java packages / apis')
  ) {
    return {
      simpleExplanation:
        'Java packages group related classes together, while Java APIs give you ready-made classes and methods that you can import and use in your own programs.',
      whyLearn:
        'Java Packages and APIs matter because they help you organize your own code and take advantage of powerful built-in Java tools instead of rebuilding common features from scratch.',
      keyPoints: [
        'Packages organize related classes and help prevent naming conflicts.',
        'Built-in packages like java.util, java.io, and java.time provide useful ready-made tools.',
        'Java APIs are collections of classes and methods you can import and use directly.',
        'You can also create your own packages to keep larger Java projects clean and maintainable.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java inheritance') {
    return {
      simpleExplanation:
        'Java inheritance lets one class reuse and extend another class so related objects can share behavior without repeating the same code.',
      whyLearn:
        'Java Inheritance matters because it helps you reduce duplication, model parent-child relationships clearly, and build object-oriented programs that are easier to maintain and extend.',
      keyPoints: [
        'A child class inherits accessible fields and methods from a parent class.',
        'Java uses the extends keyword to create inheritance relationships.',
        'Child classes can add new behavior or override inherited methods.',
        'Java does not allow multiple inheritance with classes, which helps avoid class-design confusion.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java polymorphism') {
    return {
      simpleExplanation:
        'Java polymorphism lets the same method name or parent-type reference behave differently depending on the parameters used or the real object involved.',
      whyLearn:
        'Java Polymorphism matters because it helps you write flexible object-oriented code that is easier to reuse, extend, and manage as programs become larger.',
      keyPoints: [
        'Method overloading is compile-time polymorphism and uses the same method name with different parameters.',
        'Method overriding is runtime polymorphism and happens when a child class replaces a parent method with its own version.',
        'A parent reference can point to a child object and still call the child implementation of an overridden method.',
        'Polymorphism makes Java systems more flexible because one interface can support many concrete behaviors.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java super keyword') {
    return {
      simpleExplanation:
        'The Java super keyword gives a child class a direct way to reach parent class variables, methods, and constructors.',
      whyLearn:
        'Java super Keyword matters because it helps you reuse parent behavior clearly, avoid confusion between child and parent members, and write cleaner inheritance-based code.',
      keyPoints: [
        'super.variable accesses a parent class variable when a child has a member with the same name.',
        'super.method() calls the parent version of a method, even when the child overrides it.',
        'super() calls the parent constructor and must be the first statement inside a child constructor.',
        'The super keyword only works in inheritance relationships and is not used in static methods.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java inner classes' || normalizedTitle === 'java inner class')
  ) {
    return {
      simpleExplanation:
        'Java inner classes are classes declared inside other classes so closely related logic can stay grouped together.',
      whyLearn:
        'Java Inner Classes matter because they help you organize helper code, improve encapsulation, and understand advanced Java patterns such as local and anonymous classes.',
      keyPoints: [
        'Non-static inner classes need an outer object before they can be created.',
        'Static nested classes belong to the outer class and can be created without an outer object.',
        'Local inner classes are declared inside methods, while anonymous inner classes are created for one-time use.',
        'Inner classes are useful when helper behavior belongs closely to one outer class.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java abstraction') {
    return {
      simpleExplanation:
        'Java abstraction hides implementation details and exposes only the essential behavior that other parts of the program need to use.',
      whyLearn:
        'Java Abstraction matters because it helps you design cleaner systems, reduce complexity, and separate what a class should do from how it does it internally.',
      keyPoints: [
        'Abstract classes allow shared code plus abstract methods that child classes must complete.',
        'Interfaces define behavior contracts that classes agree to implement.',
        'A class extends an abstract class but implements an interface.',
        'Abstraction helps Java programs stay flexible, easier to maintain, and easier to scale.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java enum') {
    return {
      simpleExplanation:
        'A Java enum is a special type used for a fixed set of named constant values, such as days, directions, or statuses.',
      whyLearn:
        'Java Enum matters because it makes code safer and clearer when only a known set of values should be allowed, instead of relying on loose strings or numbers.',
      keyPoints: [
        'Enums group related constant values into one strongly typed definition.',
        'They work especially well with switch statements and loops through values().',
        'Enum values are fixed, so they help prevent invalid or misspelled values in code.',
        'Enums can also include fields and methods when you need more structure than plain constants.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java anonymous' || normalizedTitle === 'java anonymous class')
  ) {
    return {
      simpleExplanation:
        'A Java anonymous class is a one-time class implementation created inline without giving the class a separate name.',
      whyLearn:
        'Java Anonymous Class matters because it helps you write short one-time custom behavior for interfaces, event handlers, and quick overrides without creating a full extra class file.',
      keyPoints: [
        'Anonymous classes are created and used at the same time in one expression.',
        'They are useful for one-time implementations of classes or interfaces.',
        'They are common in GUI events, Runnable-style tasks, and quick custom behavior.',
        'Anonymous classes are best for small inline logic, not for larger reusable designs.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java user input') {
    return {
      simpleExplanation:
        'Java user input lets a running program read values from the user, most commonly through the Scanner class.',
      whyLearn:
        'Java User Input matters because it turns fixed demo programs into interactive programs that can respond to names, numbers, choices, and other values entered by the user.',
      keyPoints: [
        'Scanner is imported from java.util and commonly reads from System.in.',
        'Methods like nextLine(), nextInt(), nextDouble(), and nextBoolean() read different kinds of input.',
        'Mixing nextInt() and nextLine() can cause skipped input if the leftover newline is not handled.',
        'User input is one of the first steps toward building dynamic Java applications.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java date') {
    return {
      simpleExplanation:
        'Java Date lessons usually use the modern java.time API to work with dates, times, and formatting in a clean and reliable way.',
      whyLearn:
        'Java Date matters because many real programs need to show dates, track time, format schedules, and work with time-related data in a safe modern way.',
      keyPoints: [
        'LocalDate stores only the date, LocalTime stores only the time, and LocalDateTime stores both.',
        'DateTimeFormatter formats date and time values into readable output patterns.',
        'The modern java.time package is preferred over the older Date and Calendar APIs for new code.',
        'Date and time output changes depending on when the program is run, so example values are only sample results.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java errors') {
    return {
      simpleExplanation:
        'Java Errors lessons explain the main kinds of program problems, including syntax errors, runtime errors, and logical errors.',
      whyLearn:
        'Java Errors matters because understanding why code fails is one of the fastest ways to become a better programmer and debug problems with confidence.',
      keyPoints: [
        'Syntax errors break Java rules and stop the program from compiling.',
        'Runtime errors happen while the program is running and often appear as exceptions.',
        'Logical errors do not crash the program, but they produce the wrong result.',
        'Learning to spot these categories makes debugging faster and more systematic.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java debugging') {
    return {
      simpleExplanation:
        'Java debugging is the process of investigating code problems by checking values, following program flow, and testing fixes carefully.',
      whyLearn:
        'Java Debugging matters because writing code is only half the job. You also need to understand how to track down bugs quickly and fix them with confidence.',
      keyPoints: [
        'Print statements help you inspect variable values and program flow in simple cases.',
        'Breakpoints pause execution so you can inspect the program at the exact moment something happens.',
        'Step Over, Step Into, and Step Out help you move through code in a controlled way.',
        'Good debugging is systematic: reproduce the bug, isolate the cause, fix it, and test again.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java exceptions') {
    return {
      simpleExplanation:
        'Java exceptions are problems that disrupt normal program flow, but many of them can be caught and handled so the program responds more safely.',
      whyLearn:
        'Java Exceptions matter because real programs often face bad input, missing resources, and runtime failures, and exception handling helps your code stay more reliable and controlled.',
      keyPoints: [
        'Checked exceptions must usually be handled or declared because the compiler knows about them.',
        'Unchecked exceptions happen at runtime and include issues like ArithmeticException and NullPointerException.',
        'try and catch let you respond to exceptions instead of crashing immediately.',
        'finally runs whether an exception happens or not, which is useful for cleanup and final steps.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java multiple exceptions') {
    return {
      simpleExplanation:
        'Java multiple exceptions handling means using more than one catch block so different kinds of runtime problems can be handled in different ways.',
      whyLearn:
        'Java Multiple Exceptions matters because real programs can fail for different reasons, and handling each problem clearly makes your code safer, easier to debug, and more user-friendly.',
      keyPoints: [
        'Multiple catch blocks let you respond differently to different exception types.',
        'A general Exception catch can handle many problems, but it should usually come after specific catches.',
        'Specific exception handlers must be placed before broader ones like Exception.',
        'Good exception ordering improves both program behavior and code clarity.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java try-with-resources' || normalizedTitle === 'java try with resources')
  ) {
    return {
      simpleExplanation:
        'Java try-with-resources automatically closes files, streams, and other closeable resources after use, even when an exception occurs.',
      whyLearn:
        'Java Try-with-Resources matters because resource cleanup is easy to forget, and this feature makes file and stream handling cleaner, safer, and less error-prone.',
      keyPoints: [
        'Resources declared inside try-with-resources are closed automatically after the block finishes.',
        'The resource must implement AutoCloseable to be used in this pattern.',
        'This feature is cleaner and safer than manually closing resources in finally blocks.',
        'When multiple resources are declared, Java closes them in reverse order.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java file handling') {
    return {
      simpleExplanation:
        'Java file handling lets a program create, read, write, and delete files so data can be stored permanently on the computer.',
      whyLearn:
        'Java File Handling matters because real applications often need to save data, load saved content, and work with files safely instead of keeping everything only in memory.',
      keyPoints: [
        'The File class helps represent file paths and basic file operations like creation and deletion.',
        'FileWriter can write text to files, while Scanner or FileReader can read file contents.',
        'File operations should be protected with exception handling because paths and access can fail.',
        'Closing resources properly is important, and try-with-resources is often the cleanest way to do that.',
      ],
    };
  }

  if (course.slug === 'java-tutorial' && normalizedLanguage === 'java' && normalizedTitle === 'java files') {
    return {
      simpleExplanation:
        'Java Files lessons focus on the File class, which represents files and folders and helps manage paths and file-system information.',
      whyLearn:
        'Java Files matters because understanding the File class helps you work with paths, check file information, create folders, and prepare files for reading or writing in larger programs.',
      keyPoints: [
        'The File class represents a path to a file or folder in the file system.',
        'It can check existence, return file information, create files, delete files, and list folders.',
        'Creating a File object does not automatically create the real file on disk.',
        'To read or write actual content, File is usually combined with Scanner, FileReader, or FileWriter.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java create files' || normalizedTitle === 'java create file')
  ) {
    return {
      simpleExplanation:
        'Java Create Files lessons show how the File class and createNewFile() make new empty files on disk when they do not already exist.',
      whyLearn:
        'Java Create Files matters because many programs need to prepare files before saving data, logging information, or generating documents for later use.',
      keyPoints: [
        'The File class is used together with createNewFile() to create a new empty file.',
        'createNewFile() returns true only when a new file is actually created.',
        'If the file already exists, Java does not create a duplicate and the method returns false.',
        'File creation can fail, so IOException handling is important.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java write files' || normalizedTitle === 'java write file')
  ) {
    return {
      simpleExplanation:
        'Java Write Files lessons show how FileWriter saves text into files, either by overwriting old content or appending new content.',
      whyLearn:
        'Java Write Files matters because many programs need to save logs, notes, reports, or other text data permanently instead of only printing it on screen.',
      keyPoints: [
        'FileWriter is commonly used to write text into files.',
        'By default, FileWriter overwrites existing file content.',
        'Passing true enables append mode so new text is added instead of replacing old text.',
        'Writers should be closed properly, and try-with-resources is often the cleanest way to do that.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java read files' || normalizedTitle === 'java read file')
  ) {
    return {
      simpleExplanation:
        'Java Read Files lessons show how saved file content can be loaded back into a program using tools like Scanner, FileReader, and BufferedReader.',
      whyLearn:
        'Java Read Files matters because many programs need to load saved notes, logs, settings, or other stored text data from disk instead of always starting from scratch.',
      keyPoints: [
        'Scanner is beginner-friendly for simple file reading.',
        'FileReader reads character by character, while BufferedReader is usually better for fast line-by-line reading.',
        'The file must already exist before it can be read successfully.',
        'Readers should be closed properly, and try-with-resources is often the cleanest approach.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java delete files' || normalizedTitle === 'java delete file')
  ) {
    return {
      simpleExplanation:
        'Java Delete Files lessons show how the File class removes files and empty folders from disk using the delete() method.',
      whyLearn:
        'Java Delete Files matters because programs often need to clean up old data, remove temporary files, or manage storage safely instead of leaving unused files behind.',
      keyPoints: [
        'The delete() method attempts to remove a file or empty folder and returns true when it succeeds.',
        'Checking exists() first makes deletion logic clearer and safer.',
        'Folders usually must be empty before Java can delete them with delete().',
        'Because deletion is often permanent, it is important to verify the path and check the result carefully.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java i/o streams' || normalizedTitle === 'java io streams')
  ) {
    return {
      simpleExplanation:
        'Java I/O Streams lessons explain how data flows into and out of a program using byte-based and character-based stream classes.',
      whyLearn:
        'Java I/O Streams matters because streams are the foundation of file reading, file writing, and many other forms of input and output in real Java programs.',
      keyPoints: [
        'Byte streams are designed for binary data, while character streams are designed for text.',
        'InputStream and OutputStream work with bytes, while Reader and Writer work with characters.',
        'Choosing the correct stream type makes file handling clearer and more reliable.',
        'Streams should be closed properly, and try-with-resources is often the cleanest approach.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java fileinputstream' || normalizedTitle === 'java file input stream')
  ) {
    return {
      simpleExplanation:
        'Java FileInputStream reads file data as raw bytes, which makes it useful for lower-level file access and binary data handling.',
      whyLearn:
        'Java FileInputStream matters because many file operations at a lower level depend on byte-based reading, especially when working with binary files or stream-oriented input.',
      keyPoints: [
        'FileInputStream reads one byte at a time and returns -1 when the file ends.',
        'It is commonly used for binary data, though it can also read text files.',
        'Methods like read(), available(), and close() are central to how it works.',
        'Try-with-resources is often the cleanest way to manage FileInputStream safely.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java fileoutputstream' || normalizedTitle === 'java file output stream')
  ) {
    return {
      simpleExplanation:
        'Java FileOutputStream writes file data as raw bytes, which makes it useful for low-level output and binary file writing.',
      whyLearn:
        'Java FileOutputStream matters because many file-writing tasks at a lower level depend on byte-based output, especially when dealing with binary files or stream-based data writing.',
      keyPoints: [
        'FileOutputStream writes bytes into a file and can create the file if it does not exist.',
        'By default it overwrites the file, but passing true enables append mode.',
        'Methods like write(), flush(), and close() control how output is sent and finalized.',
        'Try-with-resources is often the cleanest way to manage FileOutputStream safely.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java bufferedreader' || normalizedTitle === 'java buffered reader')
  ) {
    return {
      simpleExplanation:
        'Java BufferedReader reads text efficiently by buffering characters, which makes line-by-line reading much smoother for text input.',
      whyLearn:
        'Java BufferedReader matters because many programs need fast text reading from files or input streams, and buffering helps make that process more efficient and practical.',
      keyPoints: [
        'BufferedReader is designed for text, not binary data.',
        'readLine() is one of its most useful methods for line-by-line reading.',
        'It can work with FileReader for files or InputStreamReader for keyboard input.',
        'Try-with-resources is often the cleanest way to manage BufferedReader safely.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java bufferedwriter' || normalizedTitle === 'java buffered writer')
  ) {
    return {
      simpleExplanation:
        'Java BufferedWriter writes text efficiently by buffering characters before sending them to the file or output destination.',
      whyLearn:
        'Java BufferedWriter matters because many programs write a lot of text, and buffering helps make that process faster, cleaner, and easier to manage than basic unbuffered writing alone.',
      keyPoints: [
        'BufferedWriter is designed for text output, not binary data.',
        'Methods like write(), newLine(), flush(), and close() control how text is buffered and written.',
        'It often wraps FileWriter, so append mode depends on FileWriter(..., true).',
        'Try-with-resources is often the cleanest way to manage BufferedWriter safely.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java data structures' || normalizedTitle === 'java data structure')
  ) {
    return {
      simpleExplanation:
        'Java data structures are organized ways to store and manage data, usually through collection types like lists, sets, maps, and queues.',
      whyLearn:
        'Java data structures matter because real programs often handle large amounts of data, and choosing the right structure helps make searching, storing, and processing that data more efficient.',
      keyPoints: [
        'Lists keep order and can contain duplicates.',
        'Sets focus on uniqueness and usually do not keep duplicate values.',
        'Maps store key-value pairs for fast lookup by key.',
        'Queues process items in order, often using first-in, first-out behavior.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java collections' || normalizedTitle === 'java collections framework')
  ) {
    return {
      simpleExplanation:
        'The Java Collections Framework is a set of ready-made interfaces and classes for storing and managing groups of objects efficiently.',
      whyLearn:
        'Java Collections matters because most real programs need to handle groups of data, and collections give you flexible, optimized ways to add, search, remove, and organize that data.',
      keyPoints: [
        'List keeps order and can contain duplicates.',
        'Set focuses on unique values and usually avoids duplicates.',
        'Map stores key-value pairs for fast lookup by key.',
        'Queue processes elements in order, often using first-in, first-out behavior.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    normalizedTitle === 'java list'
  ) {
    return {
      simpleExplanation:
        'A Java List is an ordered collection that can grow dynamically, allow duplicates, and let you access items by index.',
      whyLearn:
        'Java List matters because many programs need ordered groups of data that can be added to, updated, searched, and looped through easily.',
      keyPoints: [
        'List keeps items in order and allows duplicate values.',
        'ArrayList is the most common List implementation for beginners.',
        'Indexes start at 0, so get(0) reads the first item.',
        'Methods like add(), get(), set(), remove(), and size() are used constantly.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java arraylist' || normalizedTitle === 'java array list')
  ) {
    return {
      simpleExplanation:
        'Java ArrayList is a resizable array that stores ordered data, allows duplicates, and gives you index-based access with built-in helper methods.',
      whyLearn:
        'Java ArrayList matters because it is one of the most commonly used collection classes for storing changing lists of data without worrying about fixed array sizes.',
      keyPoints: [
        'ArrayList grows and shrinks dynamically as elements are added or removed.',
        'It keeps items in order and allows duplicates.',
        'Methods like add(), get(), set(), remove(), and size() are used constantly.',
        'Primitive values use wrapper classes such as Integer instead of int.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java linkedlist' || normalizedTitle === 'java linked list')
  ) {
    return {
      simpleExplanation:
        'Java LinkedList stores items as connected nodes, which makes adding and removing elements flexible, especially near the beginning or end.',
      whyLearn:
        'Java LinkedList matters because some programs need frequent insertions, deletions, or queue-like operations, and linked structures can handle those patterns better than array-based collections.',
      keyPoints: [
        'LinkedList stores elements as linked nodes instead of one resizable array block.',
        'Methods like addFirst(), addLast(), getFirst(), and removeFirst() are especially useful.',
        'Random access by index is usually slower than with ArrayList.',
        'LinkedList is often useful when you want list, queue, or deque-style behavior.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    normalizedTitle === 'java list sorting'
  ) {
    return {
      simpleExplanation:
        'Java List Sorting arranges list elements in ascending or descending order using built-in helpers like Collections.sort().',
      whyLearn:
        'Java List Sorting matters because many real programs need ordered data for display, searching, reporting, ranking, and cleaner user experiences.',
      keyPoints: [
        'Collections.sort() sorts lists in ascending order.',
        'Collections.reverseOrder() helps sort in descending order.',
        'Sorting works well with strings, numbers, and other naturally ordered types.',
        'You can sort both ArrayList variables and values referenced through the List interface.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    normalizedTitle === 'java set'
  ) {
    return {
      simpleExplanation:
        'A Java Set is a collection built for unique values, so duplicate elements are automatically ignored.',
      whyLearn:
        'Java Set matters because many programs need to prevent duplicates, check membership quickly, and choose between unordered, insertion-ordered, or sorted unique collections.',
      keyPoints: [
        'Set does not allow duplicate values.',
        'HashSet is usually fast but does not guarantee order.',
        'LinkedHashSet keeps insertion order, while TreeSet keeps sorted order.',
        'Set does not support index-based access like a List.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java hashset' || normalizedTitle === 'java hash set')
  ) {
    return {
      simpleExplanation:
        'Java HashSet is a Set implementation that stores unique values and uses hashing to make common operations fast.',
      whyLearn:
        'Java HashSet matters because many programs need quick duplicate prevention and fast membership checks without caring about insertion order.',
      keyPoints: [
        'HashSet automatically ignores duplicate values.',
        'It does not guarantee insertion order.',
        'Methods like add(), contains(), remove(), and size() are used constantly.',
        'HashSet does not support index-based access like a List.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java treeset' || normalizedTitle === 'java tree set')
  ) {
    return {
      simpleExplanation:
        'Java TreeSet is a Set implementation that stores unique values and keeps them automatically sorted.',
      whyLearn:
        'Java TreeSet matters because some programs need unique values in sorted order without manually sorting the collection after every update.',
      keyPoints: [
        'TreeSet automatically keeps elements in sorted order.',
        'It does not allow duplicates, just like other Set implementations.',
        'Methods like first() and last() make it easy to read the smallest and largest values.',
        'TreeSet is usually slower than HashSet because it maintains sorted structure.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java linkedhashset' || normalizedTitle === 'java linked hash set')
  ) {
    return {
      simpleExplanation:
        'Java LinkedHashSet is a Set implementation that stores unique values while preserving the order they were inserted.',
      whyLearn:
        'Java LinkedHashSet matters because some programs need both uniqueness and predictable insertion order without the overhead of automatic sorting.',
      keyPoints: [
        'LinkedHashSet automatically ignores duplicates.',
        'It preserves insertion order, unlike HashSet.',
        'It is usually faster than TreeSet because it does not keep elements sorted.',
        'It does not support index-based access like a List.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    normalizedTitle === 'java map'
  ) {
    return {
      simpleExplanation:
        'A Java Map stores data as key-value pairs, where each unique key points to a corresponding value.',
      whyLearn:
        'Java Map matters because many real applications need fast lookup by identifiers such as names, ids, codes, or settings keys.',
      keyPoints: [
        'Keys must be unique, but values can repeat.',
        'HashMap is fast, LinkedHashMap preserves insertion order, and TreeMap keeps keys sorted.',
        'Methods like put(), get(), containsKey(), and remove() are used constantly.',
        'Map is part of the Collections Framework but separate from the Collection interface.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java hashmap' || normalizedTitle === 'java hash map')
  ) {
    return {
      simpleExplanation:
        'Java HashMap is a Map implementation that stores key-value pairs and uses hashing to make lookup operations very fast.',
      whyLearn:
        'Java HashMap matters because many applications need quick access to values by key without caring about insertion order.',
      keyPoints: [
        'Keys must be unique, but values can repeat.',
        'Putting the same key again overwrites the old value.',
        'HashMap usually performs very fast for put(), get(), and containsKey().',
        'It does not guarantee order, so display order may vary.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java treemap' || normalizedTitle === 'java tree map')
  ) {
    return {
      simpleExplanation:
        'Java TreeMap is a Map implementation that stores key-value pairs while keeping keys automatically sorted.',
      whyLearn:
        'Java TreeMap matters because some programs need key-based lookup together with always-sorted keys, without manually sorting entries after each update.',
      keyPoints: [
        'TreeMap keeps keys in sorted order automatically.',
        'It supports methods like firstKey() and lastKey() for boundary lookups.',
        'It is slower than HashMap because it maintains sorted structure.',
        'TreeMap works best with keys that can be compared naturally or with defined comparison logic.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java linkedhashmap' || normalizedTitle === 'java linked hash map')
  ) {
    return {
      simpleExplanation:
        'Java LinkedHashMap is a Map implementation that stores key-value pairs while preserving the order entries were inserted.',
      whyLearn:
        'Java LinkedHashMap matters because many programs need fast key-based lookup together with stable, predictable display order, without requiring sorted keys.',
      keyPoints: [
        'LinkedHashMap preserves insertion order, unlike HashMap.',
        'Duplicate keys overwrite previous values, just like other maps.',
        'It is usually a little slower than HashMap because it tracks order.',
        'It does not sort keys; TreeMap is the choice for sorted order.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    normalizedTitle === 'java iterator'
  ) {
    return {
      simpleExplanation:
        'A Java Iterator is an object that moves through a collection one element at a time in a controlled and safe way.',
      whyLearn:
        'Java Iterator matters because it gives you a reliable way to traverse collections and safely remove items during iteration without causing modification errors.',
      keyPoints: [
        'Iterator commonly works with lists, sets, and collection views from maps.',
        'hasNext() checks whether another element exists before calling next().',
        'remove() is the safe way to delete the current element during iteration.',
        'Iterators help avoid ConcurrentModificationException in common removal scenarios.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java algorithms' || normalizedTitle === 'java algorithm')
  ) {
    return {
      simpleExplanation:
        'Java algorithms are step-by-step problem-solving procedures used for tasks like sorting, searching, and recursive computation.',
      whyLearn:
        'Java algorithms matter because better algorithms make programs faster, more scalable, and better able to handle real-world data and logic problems.',
      keyPoints: [
        'Sorting algorithms arrange data into useful order.',
        'Searching algorithms help find values efficiently in arrays and collections.',
        'Recursion solves problems by reducing them into smaller similar problems.',
        'Time complexity helps compare how efficient one algorithm is against another.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    normalizedTitle === 'java advanced'
  ) {
    return {
      simpleExplanation:
        'Advanced Java brings together the bigger features used to build professional applications, including generics, streams, lambdas, threads, JDBC, and architecture-focused patterns.',
      whyLearn:
        'Java Advanced matters because it connects beginner syntax knowledge to the tools and concepts used in backend systems, scalable software, and enterprise development.',
      keyPoints: [
        'Generics, streams, and lambdas support cleaner and safer modern Java code.',
        'Threads, networking, and JDBC are important for real-world application behavior.',
        'Advanced collections and exception handling improve scalability and reliability.',
        'This stage is about moving from language basics to professional application design.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java wrapper classes' || normalizedTitle === 'java wrapper class')
  ) {
    return {
      simpleExplanation:
        'Java wrapper classes convert primitive values into objects so they can work with collections, generics, and object-based Java APIs.',
      whyLearn:
        'Java wrapper classes matter because modern Java often works with objects, and wrappers make primitive values usable in collections, parsing, comparisons, and utility methods.',
      keyPoints: [
        'Each primitive type has a matching wrapper class such as int to Integer.',
        'Autoboxing converts primitives to wrapper objects automatically.',
        'Unboxing converts wrapper objects back to primitive values.',
        'Wrapper classes provide helpful methods like parseInt(), doubleValue(), and toString().',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java generics' || normalizedTitle === 'java generic')
  ) {
    return {
      simpleExplanation:
        'Java generics let classes, methods, and collections work with specific data types safely instead of falling back to raw Object usage.',
      whyLearn:
        'Java generics matter because they improve type safety, reduce casting, and make reusable code easier to build and maintain across collections and custom classes.',
      keyPoints: [
        'Generics catch many type mistakes at compile time instead of runtime.',
        'Generic classes and methods can be reused with different types cleanly.',
        'Bounds such as extends Number restrict which types are allowed.',
        'Wildcards like ? add flexibility when the exact generic type is not important.',
      ],
    };
  }

  if (
    course.slug === 'java-tutorial' &&
    normalizedLanguage === 'java' &&
    (normalizedTitle === 'java annotations' || normalizedTitle === 'java annotation')
  ) {
    return {
      simpleExplanation:
        'Java annotations are metadata labels added to code so the compiler, runtime, and tools can understand extra information about classes, methods, fields, and parameters.',
      whyLearn:
        'Java annotations matter because they improve readability, help catch mistakes such as bad overrides, and are used heavily by frameworks and modern Java tooling.',
      keyPoints: [
        'Built-in annotations such as @Override and @Deprecated provide compiler and tooling guidance.',
        'Custom annotations let you attach your own metadata to code.',
        'Meta-annotations like @Retention and @Target control when and where an annotation can be used.',
        'Annotations add information to code, but they do not replace the actual program logic by themselves.',
      ],
    };
  }

  return null;
};

const buildWhyLearn = (course: CourseData, lesson: Lesson, language: string) => {
  const languageLabel = formatLanguageLabel(language);
  return `${lesson.title} helps you build real confidence in the ${course.title} path. It gives you a focused ${languageLabel} concept you can reuse in the next DevHub lessons, examples, quizzes, and practice sessions.`;
};

const buildKeyPoints = (course: CourseData, lesson: Lesson, language: string) => {
  const languageLabel = formatLanguageLabel(language);
  return [
    `${lesson.title} is a core step inside the ${course.title} learning path.`,
    `This lesson explains the main ${languageLabel} idea in a simpler way before you move to the next topic.`,
    `Use the code example and summary together so you can apply ${lesson.title} in practice work quickly.`,
  ];
};

const mapCourseToTopics = (course: CourseData, language: string): Topic[] => {
  const normalizedLanguage = normalizeTopicLanguage(language);
  const lessonSlugs = createCourseTopicSlugMap(course.lessons);

  return course.lessons.map((lesson, index) => {
    const customCopy = getCustomTopicCopy(course, lesson, normalizedLanguage);

    return {
      id: lesson.id,
      language: normalizedLanguage,
      title: lesson.title,
      slug: lessonSlugs[lesson.id],
      description: lesson.summary,
      contentMarkdown: lesson.content,
      whyLearn: customCopy?.whyLearn || buildWhyLearn(course, lesson, normalizedLanguage),
      simpleExplanation: customCopy?.simpleExplanation || buildSimpleExplanation(lesson),
      keyPoints: customCopy?.keyPoints || buildKeyPoints(course, lesson, normalizedLanguage),
      difficulty: course.difficulty,
      orderIndex: index + 1,
      isPremium: false,
      video: null,
      codeExamples: lesson.codeSample
        ? [
            {
              id: lesson.id,
              title: `${lesson.title} Example`,
              description: `Practice example for ${lesson.title}`,
              code: lesson.codeSample,
              codeLanguage: normalizedLanguage,
              output: '',
              orderIndex: 1,
            },
          ]
        : [],
    };
  });
};

const getLocalCourse = (language: string) => {
  const normalizedLanguage = normalizeTopicLanguage(language);
  const slug = LOCAL_COURSE_SLUGS[normalizedLanguage];
  return courseData.find((course) => course.slug === slug) || null;
};

const getLocalTopics = (language: string) => {
  const localCourse = getLocalCourse(language);
  if (!localCourse) {
    return [];
  }

  return mapCourseToTopics(localCourse, language);
};

const getLocalLanguages = () => ['html', 'css', 'java', 'python'];

const mergeLanguages = (languages: string[]) => {
  const merged = new Set([...getLocalLanguages(), ...languages.map(normalizeTopicLanguage)]);
  const preferredOrder = getLocalLanguages();
  const ordered = preferredOrder.filter((language) => merged.has(language));
  const extras = Array.from(merged).filter((language) => !preferredOrder.includes(language));
  return [...ordered, ...extras];
};

export const topicApi = {
  getLanguages: async (): Promise<string[]> => {
    try {
      const response = await api.get<string[]>('/topics/languages');
      return mergeLanguages(response.data);
    } catch {
      return getLocalLanguages();
    }
  },

  getTopics: async (language: string): Promise<Topic[]> => {
    const localTopics = getLocalTopics(language);
    if (localTopics.length > 0) {
      return localTopics;
    }

    const response = await api.get<Topic[]>(`/topics/${normalizeTopicLanguage(language)}`);
    return response.data;
  },

  getTopic: async (language: string, slug: string): Promise<Topic> => {
    const localTopics = getLocalTopics(language);
    const localTopic = localTopics.find((topic) => topic.slug === slug);
    if (localTopic) {
      return localTopic;
    }

    const response = await api.get<Topic>(`/topics/${normalizeTopicLanguage(language)}/${slug}`);
    return response.data;
  },
};
