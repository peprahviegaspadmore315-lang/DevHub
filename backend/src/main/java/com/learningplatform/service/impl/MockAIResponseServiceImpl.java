package com.learningplatform.service.impl;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import com.learningplatform.service.MockAIResponseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
@Slf4j
public class MockAIResponseServiceImpl implements MockAIResponseService {

    private static final Map<Pattern, String> GREETING_PATTERNS = new LinkedHashMap<>();
    private static final Map<Pattern, String> CODE_HELP_PATTERNS = new LinkedHashMap<>();
    private static final Map<Pattern, String> CONCEPT_PATTERNS = new LinkedHashMap<>();
    private static final List<String> ENCOURAGEMENTS = Arrays.asList(
        "Great question! Let's explore this together.",
        "That's a fantastic topic to dive into!",
        "I love helping with this! Let me explain.",
        "Excellent! Understanding this will level up your skills."
    );

    static {
        // Greeting patterns
        GREETING_PATTERNS.put(Pattern.compile("(?i)^(hi|hello|hey|greetings)$"), 
            "Hello! I'm LearnBot, your coding tutor! How can I help you today?");
        GREETING_PATTERNS.put(Pattern.compile("(?i)^(how are you|howdy|sup)$"), 
            "I'm doing great and ready to help you learn! What would you like to explore today?");
        GREETING_PATTERNS.put(Pattern.compile("(?i)^(help|commands|what can you do)$"), 
            "I can help you learn programming! Ask me about:\n• HTML, CSS, JavaScript concepts\n• Python basics\n• Code examples and explanations\n• Debugging tips\n• Best practices\n\nJust type your question!");
        
        // Code help patterns
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*hello\\s*world.*"), 
            "Hello World is the traditional first program! Here's how you write it in different languages:\n\n**JavaScript:**\n```javascript\nconsole.log('Hello, World!');\n```\n\n**Python:**\n```python\nprint('Hello, World!')\n```\n\n**Java:**\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}\n```\n\nWant to try running some code?");
        
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(variable|declare|let|const|var).*"), 
            "Variables are like labeled containers for storing data! Here's how they work:\n\n**JavaScript:**\n```javascript\nlet name = 'Alice';     // Can change\nconst age = 25;         // Cannot change\nvar score = 100;        // Old way (avoid)\n```\n\n**Python:**\n```python\nname = 'Alice'  # No keyword needed\nage = 25\n```\n\nThink of variables as boxes with labels. The label is the variable name, and the contents are the value!\n\nWould you like an exercise to practice?");
        
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(function|def|method|return).*"), 
            "Functions are reusable blocks of code! They help you organize and reuse your logic.\n\n**JavaScript:**\n```javascript\nfunction greet(name) {\n    return 'Hello, ' + name + '!';\n}\n\n// Arrow function\nconst add = (a, b) => a + b;\n```\n\n**Python:**\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\n# Lambda\nadd = lambda a, b: a + b\n```\n\nFunctions can take inputs (parameters) and give back outputs (return values). Try creating one!");
        
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(loop|for|while|iterate).*"), 
            "Loops let you repeat code multiple times. Here are the main types:\n\n**JavaScript - For Loop:**\n```javascript\nfor (let i = 0; i < 5; i++) {\n    console.log('Count:', i);\n}\n```\n\n**Python - For Loop:**\n```python\nfor i in range(5):\n    print('Count:', i)\n```\n\n**JavaScript - While Loop:**\n```javascript\nlet count = 0;\nwhile (count < 5) {\n    console.log(count);\n    count++;\n}\n```\n\nWhich type would you like to practice with?");
        
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(array|list|object|dict).*"), 
            "Arrays and objects are ways to store multiple values!\n\n**JavaScript Arrays:**\n```javascript\nconst fruits = ['apple', 'banana', 'orange'];\nconsole.log(fruits[0]); // 'apple'\n```\n\n**Python Lists:**\n```python\nfruits = ['apple', 'banana', 'orange']\nprint(fruits[0])  # 'apple'\n```\n\n**JavaScript Objects:**\n```javascript\nconst person = {\n    name: 'Alice',\n    age: 25\n};\nconsole.log(person.name); // 'Alice'\n```\n\n**Python Dictionaries:**\n```python\nperson = {'name': 'Alice', 'age': 25}\nprint(person['name'])  # 'Alice'\n```\n\nWant to learn more about manipulating these?");
        
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(if|else|switch|condition).*"), 
            "Conditionals let your code make decisions!\n\n**JavaScript:**\n```javascript\nif (age >= 18) {\n    console.log('Adult');\n} else {\n    console.log('Minor');\n}\n```\n\n**Python:**\n```python\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')\n```\n\n**JavaScript Switch:**\n```javascript\nswitch (day) {\n    case 'Monday':\n        console.log('Start of week');\n        break;\n    default:\n        console.log('Another day');\n}\n```\n\nWant to try a conditional exercise?");
        
        CODE_HELP_PATTERNS.put(Pattern.compile("(?i).*(class|oop|object|inherit).*"), 
            "Object-Oriented Programming (OOP) helps organize code around objects!\n\n**JavaScript Class:**\n```javascript\nclass Dog {\n    constructor(name) {\n        this.name = name;\n    }\n    bark() {\n        return `${this.name} says woof!`;\n    }\n}\nconst buddy = new Dog('Buddy');\n```\n\n**Python Class:**\n```python\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    \n    def bark(self):\n        return f'{self.name} says woof!'\n\nbuddy = Dog('Buddy')\n```\n\nKey concepts: Classes are blueprints, objects are instances!\n\nInterested in learning about inheritance too?");
        
        // Concept patterns
        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(html|tag|element).*"), 
            "HTML is the structure of web pages! Think of it as the skeleton.\n\n**Basic Structure:**\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n    <p>This is a paragraph.</p>\n</body>\n</html>\n```\n\n**Common Tags:**\n- `<h1>` to `<h6>` - Headings\n- `<p>` - Paragraph\n- `<div>` - Container\n- `<button>` - Button\n\nWant to build a simple webpage?");
        
        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(css|style|color|font).*"), 
            "CSS makes your website beautiful! It styles the HTML structure.\n\n**Basic Syntax:**\n```css\nselector {\n    property: value;\n}\n\n/* Example */\nh1 {\n    color: blue;\n    font-size: 24px;\n}\n```\n\n**Styling Methods:**\n1. Inline: `<h1 style=\"color: blue;\">`\n2. Internal: `<style>` in `<head>`\n3. External: Separate `.css` file\n\n**Flexbox for Layout:**\n```css\n.container {\n    display: flex;\n    justify-content: center;\n}\n```\n\nReady to create some stylish designs?");
        
        CONCEPT_PATTERNS.put(Pattern.compile("(?i).*(api|fetch|request|http).*"), 
            "APIs (Application Programming Interfaces) let your code talk to other services!\n\n**JavaScript Fetch Example:**\n```javascript\nfetch('https://api.example.com/data')\n    .then(response => response.json())\n    .then(data => console.log(data))\n    .catch(error => console.error(error));\n```\n\n**Modern Async/Await:**\n```javascript\nasync function getData() {\n    try {\n        const response = await fetch(url);\n        const data = await response.json();\n        return data;\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}\n```\n\nAPIs return data in formats like JSON. Want to practice with a real API?");
    }

    @Override
    public AIChatResponse generateResponse(AIChatRequest request) {
        String message = request.getMessage().toLowerCase().trim();
        
        if (message.isEmpty()) {
            return errorResponse("Please ask me something! I'm here to help with programming questions.");
        }
        
        // Check for greetings first
        for (Map.Entry<Pattern, String> entry : GREETING_PATTERNS.entrySet()) {
            if (entry.getKey().matcher(message).matches()) {
                return successResponse(entry.getValue());
            }
        }
        
        // Check code help patterns
        for (Map.Entry<Pattern, String> entry : CODE_HELP_PATTERNS.entrySet()) {
            if (entry.getKey().matcher(message).find()) {
                return successResponse(entry.getValue());
            }
        }
        
        // Check concept patterns
        for (Map.Entry<Pattern, String> entry : CONCEPT_PATTERNS.entrySet()) {
            if (entry.getKey().matcher(message).find()) {
                return successResponse(entry.getValue());
            }
        }
        
        // Check for thanks/bye
        if (message.contains("thanks") || message.contains("thank you") || message.contains("bye")) {
            return successResponse("You're welcome! Feel free to ask more questions anytime. Happy coding! 🚀");
        }
        
        // Check for questions
        if (message.contains("?")) {
            String encouragement = getRandomItem(ENCOURAGEMENTS);
            return successResponse(encouragement + "\n\nI notice you're asking about something specific. Could you give me more details? For example:\n\n• What programming language are you using?\n• What have you tried so far?\n• What error are you seeing?\n\nWith more context, I can give you a better answer!");
        }
        
        // Default response
        String[] suggestions = {
            "I'd love to help! Try asking about:\n• Variables and data types\n• Functions and methods\n• Loops (for, while)\n• Arrays and objects\n• HTML/CSS basics\n• JavaScript, Python, or Java\n\nWhat interests you?",
            "Let me help you learn! Here are some topics I can explain:\n\n📚 **Basics:** Variables, Data Types, Operators\n🔄 **Control Flow:** If/Else, Loops, Switch\n📦 **Data Structures:** Arrays, Objects, Lists\n⚙️ **Functions:** Declaration, Parameters, Return\n🌐 **Web Dev:** HTML, CSS, JavaScript\n\nWhat would you like to explore?"
        };
        
        return successResponse(getRandomItem(Arrays.asList(suggestions)));
    }
    
    private AIChatResponse successResponse(String message) {
        return AIChatResponse.builder()
                .success(true)
                .message(message)
                .aiName("LearnBot")
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
}
