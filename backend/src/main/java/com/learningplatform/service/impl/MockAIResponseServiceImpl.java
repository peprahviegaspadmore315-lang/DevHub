package com.learningplatform.service.impl;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import com.learningplatform.service.MockAIResponseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class MockAIResponseServiceImpl implements MockAIResponseService {

    private static final Map<Pattern, String> GREETING_PATTERNS = new LinkedHashMap<>();
    private static final Map<Pattern, String> CODE_HELP_PATTERNS = new LinkedHashMap<>();
    private static final Map<Pattern, String> CONCEPT_PATTERNS = new LinkedHashMap<>();
    private static final Map<Pattern, String> GENERAL_PATTERNS = new LinkedHashMap<>();
    private static final Map<Pattern, String> DEBUG_PATTERNS = new LinkedHashMap<>();
    private static final Map<Pattern, String> STEP_BY_STEP_PATTERNS = new LinkedHashMap<>();
    private static final Pattern TECHNICAL_HINT_PATTERN = Pattern.compile("(?i).*(code|coding|program|debug|bug|error|variable|function|loop|array|object|class|algorithm|data structure|html|css|javascript|python|react|sql|git|api|framework|library|frontend|backend|compiler|database|query|jsx|hook|component).*");
    private static final Pattern CURRENT_INFO_PATTERN = Pattern.compile("(?i).*(today|latest|recent|current|news|weather|score|stock|price|market|president|prime minister|this week|right now).*");
    private static final Pattern HOW_TO_PATTERN = Pattern.compile("(?i).*(?:how\\s+(?:do|can)\\s+i|how\\s+to)\\s+(.+?)[?.!]*$");
    private static final List<String> ENCOURAGEMENTS = Arrays.asList(
        "Great question! Let's explore this together.",
        "That's a fantastic topic to dive into!",
        "I love helping with this! Let me explain.",
        "Excellent! Understanding this will level up your skills."
    );
    private static final List<String> FOLLOW_UP_QUESTIONS = Arrays.asList(
        "What programming language are you working with?",
        "What have you tried so far?",
        "Can you share the error message you're seeing?",
        "Which part would you like me to explain first?",
        "Would you like me to break this down step by step?"
    );

    static {
        // Greeting patterns
        GREETING_PATTERNS.put(Pattern.compile("(?i)^(hi|hello|hey|greetings)$"), 
            "Hello! I'm DevHub AI. I can help with programming, lesson support, study strategy, writing help, brainstorming, and many broader general questions. What would you like to explore?");
        GREETING_PATTERNS.put(Pattern.compile("(?i)^(how are you|howdy|sup)$"), 
            "I'm doing great and ready to help you learn! What would you like to explore today?");
        GREETING_PATTERNS.put(Pattern.compile("(?i)^(help|commands|what can you do)$"), 
            "I can help with a mix of technical and general support. For example:\n\n• Programming concepts, debugging, and code explanations\n• Study plans, focus strategies, and learning advice\n• Resume, email, and message drafting\n• Brainstorming project or portfolio ideas\n• General explanations and comparisons\n\nFor very current facts like news, weather, prices, or live events, the connected live AI provider is still the better path.");
        
        // Step-by-step patterns
        STEP_BY_STEP_PATTERNS.put(Pattern.compile("(?i).*(step.?by.?step|how do i|how to|walk me through).*"), 
            "I'll walk you through this step by step!\n\n**Step 1:** Understand the problem\nTake a moment to break down what you're trying to achieve.\n\n**Step 2:** Plan your approach\nThink about what tools or concepts you'll need.\n\n**Step 3:** Write the code\nStart simple and build from there.\n\n**Step 4:** Test and debug\nRun your code and fix any issues.\n\nWhich step would you like me to help with?");

        GENERAL_PATTERNS.put(Pattern.compile("(?i).*(focus|productive|productivity|time management|procrastinat|discipline|habit|motivat|burnout).*"),
            "A practical way to improve focus and productivity is to reduce friction and make the next action obvious.\n\n**Try this simple system:**\n1. Pick one priority for the next work session\n2. Break it into a 20 to 30 minute starting task\n3. Remove distractions before you begin\n4. Stop to review what worked and what slowed you down\n\n**Good habits that help:**\n- Keep a short daily list\n- Start with the hardest meaningful task early\n- Use visible checkpoints instead of vague goals\n- Protect recovery time so you do not burn out\n\nIf you want, I can turn that into a daily routine for your exact situation.");

        GENERAL_PATTERNS.put(Pattern.compile("(?i).*(study|learn faster|remember|memor|revision|revise|exam prep|practice plan).*"),
            "A strong study approach is built on small review cycles, active recall, and consistent practice.\n\n**A simple study plan:**\n1. Learn one concept at a time\n2. Summarize it in your own words\n3. Test yourself without looking at notes\n4. Revisit it again later the same day or week\n\n**To remember more:**\n- Use questions instead of rereading\n- Mix review with doing\n- Keep sessions short and regular\n- Write down the one thing you still find confusing\n\nIf you want, I can help you build a study plan for a week, a course, or a specific topic.");

        GENERAL_PATTERNS.put(Pattern.compile("(?i).*(resume|cv|cover letter|linkedin|bio|email|message|write|rewrite|draft).*"),
            "I can help with writing and rewriting too.\n\nA strong draft usually works best when it is:\n- Clear about the goal\n- Specific instead of generic\n- Short enough to scan quickly\n- Written for the person reading it\n\nIf you share the situation and tone you want, I can help draft:\n- A resume summary\n- A cover letter outline\n- A professional email\n- A short introduction or bio\n- A polished rewrite of something you already wrote.");

        GENERAL_PATTERNS.put(Pattern.compile("(?i).*(interview|career|job|portfolio|internship|networking|promotion).*"),
            "For career questions, it usually helps to think in three layers:\n\n1. **Positioning**\nMake it easy for people to understand what you are good at and what roles fit you.\n\n2. **Proof**\nShow projects, results, examples, and concrete outcomes instead of only claims.\n\n3. **Progression**\nPick the next step that gives you the most leverage, such as one stronger project, one cleaner resume, or one better interview story.\n\nIf you want, I can help with interview prep, portfolio ideas, resume direction, or choosing what skill to improve next.");

        GENERAL_PATTERNS.put(Pattern.compile("(?i).*(idea|brainstorm|project idea|portfolio idea|startup idea|side project).*"),
            "A good brainstorming process starts by choosing one constraint instead of searching everything at once.\n\n**Useful starting points:**\n- Pick a problem you understand\n- Choose a user or audience\n- Limit the scope to something you could finish in a week or two\n- Prefer ideas that create visible results you can show\n\nIf you want, I can brainstorm ideas for:\n- Beginner coding projects\n- Portfolio projects\n- Learning tools\n- Productivity tools\n- Small business or startup concepts");

        GENERAL_PATTERNS.put(Pattern.compile("(?i).*(artificial intelligence|\\bai\\b|machine learning|large language model|\\bllm\\b).*"),
            "Artificial intelligence is the broader field of building systems that perform tasks that usually require human-like decision making or pattern recognition.\n\n**A simple breakdown:**\n- **AI** is the big umbrella\n- **Machine learning** is one approach where systems learn patterns from data\n- **Large language models** are AI systems trained on massive text data to generate and understand language\n\nA useful way to think about modern AI is that it is very strong at pattern matching and generation, but it still needs good instructions, good data, and human judgment.\n\nIf you want, I can explain AI from a beginner, practical, or career perspective next.");

        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(what is programming|what is coding|what is software development|\\bprogramming\\b|\\bcoding\\b).*"),
            "Programming is the process of writing clear instructions that tell a computer what to do.\n\n**Think of it like this:**\n- The computer is extremely fast, but it only follows precise instructions.\n- A program is the step-by-step recipe we give it.\n- A programming language like JavaScript or Python is the language we use to write that recipe.\n\n**Simple example:**\n```javascript\nlet name = 'Ada';\nconsole.log('Hello, ' + name);\n```\n\n**What this does:**\n1. Stores `'Ada'` in a variable called `name`\n2. Combines it with `'Hello, '` \n3. Prints `Hello, Ada` to the screen\n\n**Core idea:** programming is really about breaking a problem into small instructions, then testing whether the computer does exactly what you meant.\n\nIf you want, I can also explain programming from a **beginner**, **web development**, or **Python** angle.");
        
        // Hello World
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*hello\\s*world.*"), 
            "Hello World is the traditional first program! Let's write it together:\n\n**Step 1:** Choose your language\n\n**JavaScript (in browser console):**\n```javascript\nconsole.log('Hello, World!');\n```\n\n**Python:**\n```python\nprint('Hello, World!')\n```\n\n**Step 2:** Run it!\n- JavaScript: Press F12, go to Console, paste and press Enter\n- Python: Type `python` in terminal, then paste and press Enter\n\nWhat would you like to try?");
        
        // Variables
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(variable|declare|let|const|var|assign).*"), 
            "Great question! Variables are like labeled containers for storing data.\n\n**Step 1: Choose a name**\nGive your variable a meaningful name.\n\n**Step 2: Store a value**\n```javascript\n// JavaScript\nlet name = 'Alice';     // Can change later\nconst age = 25;         // Cannot change\nvar score = 100;        // Old style (avoid)\n```\n\n```python\n# Python\nname = 'Alice'  # No keyword needed!\nage = 25\n```\n\n**Step 3: Use it**\n```javascript\nconsole.log('Hello, ' + name);\n```\n\nThink of variables as boxes with labels. The label is the variable name!\n\nWould you like to practice with an exercise?");
        
        // Functions
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(function|def|method|return|call|invoke).*"), 
            "Functions are reusable blocks of code! Let me explain step by step:\n\n**Step 1: Define the function**\nGive it a name and write the code.\n\n```javascript\n// JavaScript\nfunction greet(name) {\n    return 'Hello, ' + name + '!';\n}\n```\n\n```python\n# Python\ndef greet(name):\n    return f'Hello, {name}!'\n```\n\n**Step 2: Call the function**\n```javascript\ngreet('Alice');  // Returns 'Hello, Alice!'\n```\n\n**Step 3: Get the result**\nThe `return` keyword sends back the result.\n\nFunctions are like recipes - you write them once and use them many times!\n\nWould you like to create one together?");
        
        // Loops
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(loop|for|while|iterate|repeat).*"), 
            "Loops let you repeat code! Here's how they work:\n\n**Step 1: Choose your loop type**\n- `for` loops: When you know how many times\n- `while` loops: When you don't know\n\n**JavaScript - For Loop:**\n```javascript\nfor (let i = 0; i < 5; i++) {\n    console.log('Count:', i);\n}\n```\n\n**Python - For Loop:**\n```python\nfor i in range(5):\n    print(f'Count: {i}')\n```\n\n**Step 2: The parts explained:**\n1. `let i = 0` - Start at 0\n2. `i < 5` - Keep going while true\n3. `i++` - Add 1 each time\n\n**Step 3: Run and see!**\n\nWhich type would you like to practice with?");
        
        // Arrays/Lists
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(array|list|object|dict|index|element).*"), 
            "Arrays and objects store multiple values! Let me break it down:\n\n**Step 1: Create an array**\n```javascript\nconst fruits = ['apple', 'banana', 'orange'];\n```\n\n```python\nfruits = ['apple', 'banana', 'orange']\n```\n\n**Step 2: Access items (they start at 0!)**\n```javascript\nconsole.log(fruits[0]);  // 'apple'\nconsole.log(fruits[1]);  // 'banana'\n```\n\n**Step 3: Add or remove items**\n```javascript\nfruits.push('grape');      // Add to end\nfruits.pop();               // Remove from end\n```\n\nThink of arrays as numbered boxes!\n\nWant to learn about objects too?");
        
        // Conditionals
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(if|else|switch|condition|boolean|true|false).*"), 
            "Conditionals let your code make decisions! Here's the breakdown:\n\n**Step 1: The if statement**\n```javascript\nif (age >= 18) {\n    console.log('Adult');\n}\n```\n\n**Step 2: Add else for the other case**\n```javascript\nif (age >= 18) {\n    console.log('Adult');\n} else {\n    console.log('Minor');\n}\n```\n\n**Step 3: Multiple conditions with else if**\n```javascript\nif (score >= 90) {\n    console.log('A');\n} else if (score >= 80) {\n    console.log('B');\n} else {\n    console.log('C');\n}\n```\n\nThe `if` checks if something is true, then runs the code inside!\n\nWant to try a practice exercise?");
        
        // Classes/OOP
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(class|oop|object|inherit|constructor|new).*"), 
            "Object-Oriented Programming (OOP) organizes code around objects!\n\n**Step 1: Create a class (blueprint)**\n```javascript\nclass Dog {\n    constructor(name) {\n        this.name = name;  // Property\n    }\n    bark() {              // Method\n        return this.name + ' says woof!';\n    }\n}\n```\n\n**Step 2: Create an object (instance)**\n```javascript\nconst buddy = new Dog('Buddy');\nbuddy.bark();  // 'Buddy says woof!'\n```\n\n**Key concepts:**\n• Classes are blueprints\n• Objects are instances (real things)\n• Properties store data\n• Methods are functions\n\nReady to learn about inheritance next?");
        
        // Debug patterns
        DEBUG_PATTERNS.put(Pattern.compile("(?i).*(error|bug|fix|issue|problem|wrong|not working|exception).*"), 
            "Let's debug this together! Here's my step-by-step approach:\n\n**Step 1: Read the error**\nThe error message tells you:\n• What went wrong (the type of error)\n• Where it happened (file and line number)\n\n**Step 2: Common causes:**\n• Typos in variable names\n• Missing brackets or quotes\n• Using `=` instead of `==`\n• Accessing properties of undefined\n\n**Step 3: Fix it**\n1. Read the error carefully\n2. Check the line number\n3. Look for common mistakes\n4. Test again\n\n**Step 4: If stuck, ask me!**\nPaste your error message and I'll help!\n\nWhat error are you seeing?");
        
        DEBUG_PATTERNS.put(Pattern.compile("(?i).*(undefined|null|NaN|cannot read).*"), 
            "This is a common JavaScript error! Let me explain:\n\n**What it means:**\n• `undefined` - Variable exists but has no value\n• `null` - Variable is explicitly empty\n• `NaN` - Not a Number (usually from bad math)\n\n**How to fix it:**\n\n1. **Check if it exists first:**\n```javascript\nif (myVariable !== undefined) {\n    console.log(myVariable);\n}\n```\n\n2. **Set a default value:**\n```javascript\nconst name = userName || 'Guest';\n```\n\n3. **For NaN, check your math:**\n```javascript\nconst result = Number('hello');  // NaN!\nconsole.log(isNaN(result));      // true\n```\n\nCan you share the code that's causing this?");
        
        // Concept patterns
        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(html|tag|element|div|span|heading|paragraph).*"), 
            "HTML is the structure of web pages! Let's learn step by step:\n\n**Step 1: Basic structure**\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n    <p>This is a paragraph.</p>\n</body>\n</html>\n```\n\n**Step 2: Common tags:**\n• `<h1>` to `<h6>` - Headings (h1 is biggest)\n• `<p>` - Paragraph text\n• `<div>` - Container (box)\n• `<button>` - Clickable button\n• `<a>` - Links\n\n**Step 3: Tags have opening and closing parts**\n```html\n<p>This is a paragraph</p>\n```\n\nWant to build a simple webpage together?");
        
        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(css|style|color|font|style|class|id|selector).*"), 
            "CSS makes websites beautiful! Here's how it works:\n\n**Step 1: Basic syntax**\n```css\nselector {\n    property: value;\n}\n```\n\n**Step 2: Connect HTML and CSS**\n```html\n<h1 class=\"title\">Hello</h1>\n```\n```css\n.title {\n    color: blue;\n    font-size: 24px;\n}\n```\n\n**Step 3: Common properties:**\n• `color` - Text color\n• `background-color` - Background\n• `font-size` - Text size\n• `margin` - Space outside\n• `padding` - Space inside\n\n**Step 4: Use Flexbox for layout**\n```css\n.container {\n    display: flex;\n    justify-content: center;\n}\n```\n\nReady to style something?");
        
        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(api|fetch|request|http|async|await|promise).*"), 
            "APIs let your code talk to other services! Here's how:\n\n**Step 1: What is an API?**\nThink of it as a waiter - you ask for something, they bring it back.\n\n**Step 2: Fetch data from an API**\n```javascript\nfetch('https://jsonplaceholder.typicode.com/posts/1')\n    .then(response => response.json())\n    .then(data => console.log(data))\n    .catch(error => console.error(error));\n```\n\n**Step 3: Modern way with async/await**\n```javascript\nasync function getData() {\n    try {\n        const response = await fetch(url);\n        const data = await response.json();\n        console.log(data);\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}\n```\n\n**Step 4: What happens:**\n1. Send request → 2. Wait for response → 3. Parse JSON → 4. Use data\n\nWant to practice with a real API?");

        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(algorithm|data structure|big o|time complexity|space complexity).*"),
            "Algorithms and data structures are the backbone of problem-solving in programming.\n\n**Algorithms** are step-by-step procedures for solving a problem.\n**Data structures** are ways to organize data so those steps can run efficiently.\n\n**Example algorithm idea:** find the largest number in a list.\n```javascript\nconst numbers = [4, 8, 2, 9, 1];\nlet largest = numbers[0];\n\nfor (const number of numbers) {\n  if (number > largest) {\n    largest = number;\n  }\n}\n\nconsole.log(largest); // 9\n```\n\n**Big O** describes how performance changes as input grows.\n- `O(1)` constant time\n- `O(n)` linear time\n- `O(n log n)` common for efficient sorting\n- `O(n^2)` often slower nested loops\n\nIf you want, I can explain Big O with simple visual intuition next.");

        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(react|component|props|state|hook|useeffect|jsx).*"),
            "React helps us build user interfaces from reusable pieces called **components**.\n\n**Core ideas:**\n- **Component:** a reusable UI building block\n- **Props:** data passed into a component\n- **State:** data the component manages itself\n- **Hooks:** functions like `useState` and `useEffect` that add behavior\n\n**Simple example:**\n```jsx\nfunction WelcomeCard({ name }) {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <h1>Hello, {name}</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Clicked {count} times\n      </button>\n    </div>\n  );\n}\n```\n\n**What each part does:**\n- `name` comes in through props\n- `count` is local state\n- clicking the button updates the UI automatically\n\nIf you want, I can explain React from a **beginner**, **state management**, or **component design** perspective.");

        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(sql|database|query|table|join|select|insert|update|delete).*"),
            "Databases store structured information, and SQL is the language we use to work with that data.\n\n**Think of it like this:**\n- A **table** is like a spreadsheet\n- A **row** is one record\n- A **column** is one field, such as `name` or `email`\n\n**Basic query example:**\n```sql\nSELECT name, email\nFROM users\nWHERE active = true;\n```\n\n**What this does:**\n1. Looks in the `users` table\n2. Picks only the `name` and `email` columns\n3. Returns rows where `active` is true\n\n**Common SQL actions:**\n- `SELECT` read data\n- `INSERT` add data\n- `UPDATE` change data\n- `DELETE` remove data\n- `JOIN` combine related tables\n\nIf you want, I can next explain **joins**, **normalization**, or how SQL connects to backend code.");

        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(git|github|commit|branch|merge|pull request|version control).*"),
            "Git is a version control system that helps us track changes in code over time.\n\n**Key ideas:**\n- `git init` starts a repository\n- `git add` stages changes\n- `git commit` saves a snapshot\n- `git branch` creates a new line of work\n- `git merge` combines work\n\n**Typical workflow:**\n```bash\ngit checkout -b feature/login-form\ngit add .\ngit commit -m \"Add login form validation\"\ngit push origin feature/login-form\n```\n\n**Why Git matters:**\n- You can undo mistakes\n- You can work safely on features\n- Teams can collaborate without overwriting each other\n\nIf you want, I can explain branching, rebasing, merge conflicts, or GitHub pull requests next.");
    }

    @Override
    public AIChatResponse generateResponse(AIChatRequest request) {
        String message = request.getMessage().toLowerCase().trim();
        String contextHint = buildContextHint(request.getContext());
        
        if (message.isEmpty()) {
            return successResponse("Please ask me something! I'm strongest at programming help, debugging, and lesson support right now. What would you like to learn about?");
        }
        
        // Check for greetings first
        for (Map.Entry<Pattern, String> entry : GREETING_PATTERNS.entrySet()) {
            if (entry.getKey().matcher(message).matches()) {
                return successResponse(withContextHint(contextHint, entry.getValue()));
            }
        }

        if (isLikelyCurrentInfoRequest(message)) {
            return successResponse(withContextHint(
                contextHint,
                "I can still help with timeless explanations, planning, writing, study strategy, and general guidance locally. If you need very current information like news, weather, live scores, or recent market facts, the connected live AI provider is the better path."
            ));
        }

        boolean likelyTechnical = isLikelyTechnicalMessage(message);

        if (!likelyTechnical) {
            for (Map.Entry<Pattern, String> entry : GENERAL_PATTERNS.entrySet()) {
                if (entry.getKey().matcher(message).find()) {
                    return successResponse(withContextHint(contextHint, entry.getValue()));
                }
            }

            if (HOW_TO_PATTERN.matcher(message).matches()) {
                return successResponse(withContextHint(contextHint, buildGeneralHowToReply(message)));
            }
        }
        
        // Check step-by-step patterns first
        if (likelyTechnical) {
            for (Map.Entry<Pattern, String> entry : STEP_BY_STEP_PATTERNS.entrySet()) {
                if (entry.getKey().matcher(message).find()) {
                    return successResponse(withContextHint(contextHint, entry.getValue()));
                }
            }
        }
        
        // Check debug patterns
        if (likelyTechnical) {
            for (Map.Entry<Pattern, String> entry : DEBUG_PATTERNS.entrySet()) {
                if (entry.getKey().matcher(message).find()) {
                    return successResponse(withContextHint(contextHint, entry.getValue()));
                }
            }
        }
        
        // Check code help patterns
        if (likelyTechnical) {
            for (Map.Entry<Pattern, String> entry : CODE_HELP_PATTERNS.entrySet()) {
                if (entry.getKey().matcher(message).find()) {
                    return successResponse(withContextHint(contextHint, entry.getValue()));
                }
            }
        }
        
        // Check concept patterns
        for (Map.Entry<Pattern, String> entry : CONCEPT_PATTERNS.entrySet()) {
            if (entry.getKey().matcher(message).find()) {
                return successResponse(withContextHint(contextHint, entry.getValue()));
            }
        }
        
        // Check for thanks/bye
        if (message.contains("thanks") || message.contains("thank you")) {
            return successResponse(withContextHint(contextHint, "You're welcome! Feel free to ask more questions anytime. Happy coding! 🚀"));
        }
        
        if (message.contains("bye") || message.contains("goodbye")) {
            return successResponse(withContextHint(contextHint, "Goodbye! Keep coding and have fun! See you next time! 👋"));
        }
        
        // Check for vague questions - ask follow-up
        if (message.contains("?")) {
            if (likelyTechnical) {
                String encouragement = getRandomItem(ENCOURAGEMENTS);
                String followUp = getRandomItem(FOLLOW_UP_QUESTIONS);
                return successResponse(withContextHint(
                    contextHint,
                    encouragement + "\n\n" + followUp + "\n\nAlso, it helps if you tell me:\n• What language you're using\n• What you've already tried\n• What you expect to happen"
                ));
            }

            return successResponse(withContextHint(contextHint, buildGeneralClarifyingReply(message)));
        }
        
        // Check if it's a statement about learning
        if (message.contains("learn") || message.contains("study") || message.contains("practice")) {
            return successResponse(withContextHint(
                contextHint,
                "That's great! Here's how I can help you learn:\n\n📚 **I can explain** concepts in simple terms\n💻 **I can show** working code examples\n🔧 **I can help** debug your code\n📝 **I can give** you practice exercises\n\nWhat would you like to learn about today?"
            ));
        }
        
        // Default response with helpful suggestions
        String[] suggestions = {
            "I'd love to help! Here are some things I can explain:\n\n📚 **Programming Basics:**\n• Variables and data types\n• Functions and methods\n• Loops (for, while)\n• If/else conditions\n\n📦 **Data Structures:**\n• Arrays and lists\n• Objects and dictionaries\n\n🌐 **Web Development:**\n• HTML structure\n• CSS styling\n• JavaScript interactivity\n\n🔧 **Debugging:**\n• Common errors and fixes\n\nWhat interests you? Type a topic above!",
            
            "Let me help you get started! Here are some popular topics:\n\n**Beginner:**\n• How to create a variable\n• How to write a function\n• How to use loops\n\n**Intermediate:**\n• How to work with arrays\n• How to use conditionals\n• How to debug errors\n\n**Web Dev:**\n• HTML basics\n• CSS styling\n• JavaScript fundamentals\n\nJust type your question! For example: \"How do I create a variable?\""
        };

        String[] generalSuggestions = {
            "I can help with broader questions too. For example:\n\n• Build a study or focus plan\n• Draft or rewrite an email or summary\n• Brainstorm project or portfolio ideas\n• Compare options and talk through tradeoffs\n• Explain a concept in simple terms\n\nIf you want a stronger answer, tell me your goal, context, and any constraint you care about.",

            "A good next step is to ask in one of these forms:\n\n• `How can I improve my focus while studying?`\n• `Help me draft a professional email.`\n• `Brainstorm three project ideas for my portfolio.`\n• `Explain AI in simple terms.`\n• `Help me compare two options.`\n\nI’ll give a practical answer and keep it concise."
        };

        return successResponse(withContextHint(
            contextHint,
            likelyTechnical
                ? getRandomItem(Arrays.asList(suggestions))
                : getRandomItem(Arrays.asList(generalSuggestions))
        ));
    }
    
    private AIChatResponse successResponse(String message) {
        return AIChatResponse.builder()
                .success(true)
                .message(message)
                .aiName("DevHub AI")
                .model("mock-tutor")
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    private AIChatResponse errorResponse(String error) {
        return AIChatResponse.builder()
                .success(false)
                .error(error)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    private String getRandomItem(List<String> list) {
        return list.get(new Random().nextInt(list.size()));
    }

    private String buildContextHint(String context) {
        if (context == null || context.isBlank()) {
            return "";
        }

        String normalized = context.replaceAll("\\s+", " ").trim();
        if (normalized.length() > 220) {
            normalized = normalized.substring(0, 220) + "...";
        }

        return "I'll keep the answer centered on your current learning context when it helps.\n\n**Current context:** " + normalized;
    }

    private String withContextHint(String contextHint, String response) {
        if (contextHint == null || contextHint.isBlank()) {
            return response;
        }

        return contextHint + "\n\n" + response;
    }

    private boolean isLikelyTechnicalMessage(String message) {
        return TECHNICAL_HINT_PATTERN.matcher(message).find();
    }

    private boolean isLikelyCurrentInfoRequest(String message) {
        return CURRENT_INFO_PATTERN.matcher(message).find();
    }

    private String buildGeneralHowToReply(String message) {
        Matcher matcher = HOW_TO_PATTERN.matcher(message);
        String goal = matcher.matches() ? matcher.group(1).trim() : "move forward";

        return "A practical way to **" + goal + "** is to turn it into a small plan you can actually follow.\n\n"
            + "**Try this approach:**\n"
            + "1. Define what a good outcome looks like\n"
            + "2. Start with the smallest meaningful first step\n"
            + "3. Remove the biggest source of friction\n"
            + "4. Review what worked and adjust after one short attempt\n\n"
            + "If you want, tell me your specific situation and I can turn that into a more tailored plan.";
    }

    private String buildGeneralClarifyingReply(String message) {
        String encouragement = getRandomItem(ENCOURAGEMENTS);

        return encouragement + "\n\n"
            + "I can help with broader questions too. The most useful answers usually get better when I know one or two details about your goal, situation, or constraint.\n\n"
            + "For example, you can tell me:\n"
            + "• What outcome you want\n"
            + "• What options you are considering\n"
            + "• What constraint matters most, like time, difficulty, or audience\n\n"
            + "If you want, send the question again with a little more context and I’ll make the answer more specific.";
    }
}
