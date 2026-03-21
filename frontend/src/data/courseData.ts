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

export const courseData: CourseData[] = [
  {
    id: 1,
    slug: 'html-tutorial',
    title: 'HTML Tutorial',
    category: 'Web Development',
    difficulty: 'BEGINNER',
    description: 'Learn the basics of HTML to build web pages.',
    image: 'html.png',
    lessons: [
      {
        id: 1,
        title: 'What is HTML?',
        summary: 'HTML is the standard markup language for creating web pages.',
        content: 'HTML consists of elements represented by tags like <html>, <head>, <body>, <h1>, <p>.',
        codeSample: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, world!</h1>\n    <p>This is beginner-friendly HTML.</p>\n  </body>\n</html>',
      },
      {
        id: 2,
        title: 'HTML Elements and Tags',
        summary: 'Learn common HTML tags and their usage.',
        content: 'Use <a>, <img>, <ul>, <ol>, <li>, and more to structure content.',
        codeSample: '<h2>HTML Tags</h2>\n<ul>\n  <li><a href="https://www.example.com">Example link</a></li>\n  <li><img src="image.png" alt="Example image" /></li>\n</ul>',
      },
    ],
  },
  {
    id: 2,
    slug: 'css-tutorial',
    title: 'CSS Tutorial',
    category: 'Web Development',
    difficulty: 'BEGINNER',
    description: 'Style your web page using CSS for color, layout, and typography.',
    image: 'css.png',
    lessons: [
      {
        id: 1,
        title: 'What is CSS?',
        summary: 'CSS controls the style of web pages: colors, fonts, spacing, and layout.',
        content: 'You can apply CSS inline, via <style>, or using external style sheets.',
        codeSample: '<style>\n  body { font-family: Arial, sans-serif; background: #f5f8fa; }\n  h1 { color: #0a74da; }\n</style>',
      },
      {
        id: 2,
        title: 'Selectors and Box Model',
        summary: 'Use selectors to target elements and understand margin, border, padding.',
        content: 'The box model defines how elements occupy space on the page.',
        codeSample: '<div class="card">\n  <h3>Card title</h3>\n  <p>Card content...</p>\n</div>\n<style>\n  .card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; margin: 10px 0; }\n</style>',
      },
    ],
  },
  {
    id: 3,
    slug: 'javascript-tutorial',
    title: 'JavaScript Tutorial',
    category: 'Programming',
    difficulty: 'BEGINNER',
    description: 'Learn JavaScript basics to make web pages interactive.',
    image: 'javascript.png',
    lessons: [
      {
        id: 1,
        title: 'JS Syntax and Variables',
        summary: 'Learn how to declare variables and print to the console.',
        content: 'Use let/const for variables, and console.log to output values.',
        codeSample: 'const name = "Learner";\nconsole.log(`Hello, ${name}!`);',
      },
      {
        id: 2,
        title: 'Functions and Events',
        summary: 'Define functions and run code in response to user actions.',
        content: 'Add event listeners for clicks, inputs, and page load.',
        codeSample: 'document.getElementById("myButton").addEventListener("click", function() {\n  alert("Button pressed!");\n});',
      },
    ],
  },
  {
    id: 4,
    slug: 'python-tutorial',
    title: 'Python Tutorial',
    category: 'Programming',
    difficulty: 'BEGINNER',
    description: 'Start programming in Python with easy-to-follow exercises.',
    image: 'python.png',
    lessons: [
      {
        id: 1,
        title: 'Python Variables and Types',
        summary: 'Learn Python variable assignment and basic types.',
        content: 'Use integers, floats, strings, and lists in Python programs.',
        codeSample: 'name = "Learner"\nage = 20\nprint(f"Hello, {name}! You are {age} years old.")',
      },
      {
        id: 2,
        title: 'Control Flow: if/for/while',
        summary: 'Implement branching and loops to repeat tasks.',
        content: 'Use if statements and loops to process data conditionally.',
        codeSample: 'for i in range(1, 6):\n  print(f"Step {i}")\n\nif age >= 18:\n  print("Adult")\n',
      },
    ],
  },
]
