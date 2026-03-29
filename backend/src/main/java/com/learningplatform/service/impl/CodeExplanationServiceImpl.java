package com.learningplatform.service.impl;

import com.learningplatform.service.CodeExplanationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class CodeExplanationServiceImpl implements CodeExplanationService {

    private static final String SYSTEM_PROMPT = """
        You are LearnBot, a friendly programming tutor. Explain the following code in a simple, beginner-friendly way.
        
        Rules:
        1. Break down each line or logical block
        2. Use simple language (no jargon)
        3. Explain WHAT the code does, not just technical terms
        4. Give analogies when helpful
        5. Keep explanations concise but complete
        6. Use bullet points for clarity
        
        Format your explanation like this:
        
        **What this code does:**
        [Brief overview of the overall purpose]
        
        **Line by line breakdown:**
        • `Line X` - [Simple explanation]
        • `Line Y` - [Simple explanation]
        
        **Key concepts:**
        • [Concept 1] - [Brief definition]
        • [Concept 2] - [Brief definition]
        
        **Try it yourself:**
        [A simple exercise or variation]
        """;

    @Override
    public String explainCode(String code, String language) {
        log.info("Explaining code in language: {}", language);
        
        if (code == null || code.isBlank()) {
            return "Please provide some code to explain!";
        }

        String detectedLanguage = detectLanguage(code, language);
        String explanation = generateExplanation(code, detectedLanguage);
        
        return explanation;
    }

    private String detectLanguage(String code, String providedLanguage) {
        if (providedLanguage != null && !providedLanguage.isBlank()) {
            return providedLanguage;
        }

        String lowerCode = code.toLowerCase();

        if (lowerCode.contains("def ") && lowerCode.contains(":") && !lowerCode.contains("function")) {
            return "Python";
        }
        if (lowerCode.contains("function") || lowerCode.contains("const ") || 
            lowerCode.contains("let ") || lowerCode.contains("var ") ||
            lowerCode.contains("=>") || lowerCode.contains("console.log")) {
            return "JavaScript";
        }
        if (lowerCode.contains("public class") || lowerCode.contains("public static void main")) {
            return "Java";
        }
        if (lowerCode.contains("#include") || lowerCode.contains("int main(")) {
            return "C++";
        }
        if (lowerCode.contains("<!doctype") || lowerCode.contains("<html") || 
            lowerCode.contains("<div") || lowerCode.contains("<span")) {
            return "HTML";
        }
        if (lowerCode.contains("{") && (lowerCode.contains("color:") || lowerCode.contains("margin:") ||
            lowerCode.contains("padding:") || lowerCode.contains("background:"))) {
            return "CSS";
        }
        if (lowerCode.contains("import ") && lowerCode.contains("from ")) {
            if (lowerCode.contains("react")) return "React";
            return "JavaScript";
        }
        if (lowerCode.contains("package ") && lowerCode.contains(";")) {
            return "Go";
        }
        if (lowerCode.contains("fn ") && lowerCode.contains("->")) {
            return "Rust";
        }
        if (lowerCode.contains("print(") && !lowerCode.contains("console.log")) {
            return "Python";
        }

        return "Unknown";
    }

    private String generateExplanation(String code, String language) {
        List<String> lines = new ArrayList<>(List.of(code.split("\n")));
        StringBuilder explanation = new StringBuilder();

        explanation.append("## What This Code Does\n\n");
        explanation.append(getOverallPurpose(code, language)).append("\n\n");

        explanation.append("## Line by Line Breakdown\n\n");

        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i).trim();
            if (line.isEmpty()) continue;

            int lineNum = i + 1;
            String lineExplanation = explainLine(line, lineNum, language, lines);
            explanation.append("• **Line ").append(lineNum).append(":** ").append(lineExplanation).append("\n\n");
        }

        explanation.append("## Key Concepts\n\n");
        explanation.append(getKeyConcepts(code, language));

        explanation.append("\n## Try It Yourself\n\n");
        explanation.append(getExercise(code, language));

        return explanation.toString();
    }

    private String getOverallPurpose(String code, String language) {
        String lower = code.toLowerCase();

        if (lower.contains("console.log") || lower.contains("print(")) {
            return "This code prints output to the screen - it's like telling the computer to show something!";
        }
        if (lower.contains("function") || lower.contains("def ")) {
            return "This code defines a function - a reusable block of code that performs a specific task.";
        }
        if (lower.contains("if") && lower.contains("else")) {
            return "This code makes decisions - it checks a condition and does different things based on whether it's true or false.";
        }
        if (lower.contains("for") || lower.contains("while")) {
            return "This code repeats actions - it runs the same block of code multiple times.";
        }
        if (lower.contains("class")) {
            return "This code defines a blueprint for creating objects - think of it like a recipe for building things.";
        }
        if (lower.contains("fetch") || lower.contains("axios") || lower.contains("http")) {
            return "This code communicates with the internet - it sends or receives data from another place.";
        }
        if (lower.contains("addEventListener")) {
            return "This code waits for user interaction - it responds when someone clicks or types.";
        }
        if (lower.contains("<div") || lower.contains("<button") || lower.contains("<input")) {
            return "This code creates interactive elements for a webpage.";
        }

        return "This code performs a specific task. Let's break it down line by line!";
    }

    private String explainLine(String line, int lineNum, String language, List<String> allLines) {
        String trimmed = line.trim();

        if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
            return "This is a comment - notes for humans reading the code, ignored by the computer.";
        }

        if (trimmed.startsWith("function ") || trimmed.startsWith("def ")) {
            String funcName = extractFunctionName(trimmed, language);
            return "Defines a function called '" + funcName + "' - a reusable block of code.";
        }

        if (trimmed.contains("=") && !trimmed.contains("==") && !trimmed.contains("!=")) {
            String varName = extractVariableName(trimmed);
            if (varName != null) {
                if (trimmed.contains("[]") || trimmed.contains("{}") || trimmed.contains("Array") || trimmed.contains("List")) {
                    return "Creates a variable '" + varName + "' that stores a collection of items.";
                }
                return "Creates or updates a variable called '" + varName + "' with a value.";
            }
        }

        if (trimmed.startsWith("return")) {
            return "Sends a value back to wherever the function was called.";
        }

        if (trimmed.startsWith("if") || trimmed.contains("? ")) {
            return "Checks if a condition is true - like asking a yes/no question.";
        }

        if (trimmed.startsWith("for") || trimmed.startsWith("while")) {
            return "Starts a loop - repeats the code inside multiple times.";
        }

        if (trimmed.startsWith("console.log") || trimmed.startsWith("print(")) {
            return "Prints/display information so you can see it.";
        }

        if (trimmed.contains(".push(") || trimmed.contains(".pop(")) {
            return "Adds or removes an item from a list.";
        }

        if (trimmed.contains(".map(")) {
            return "Transforms each item in a list into something else.";
        }

        if (trimmed.contains(".filter(")) {
            return "Keeps only the items that match a condition.";
        }

        if (trimmed.contains("addEventListener")) {
            return "Sets up a listener - waits for an action like a click.";
        }

        if (trimmed.startsWith("import ") || trimmed.startsWith("require(")) {
            return "Brings in code from another file or library.";
        }

        if (trimmed.startsWith("export") || trimmed.startsWith("module.exports")) {
            return "Makes this code available for other files to use.";
        }

        if (trimmed.startsWith("class ")) {
            String className = trimmed.replaceAll("class\\s+", "").split("[{<]")[0].trim();
            return "Defines a class called '" + className + "' - a blueprint for creating objects.";
        }

        if (trimmed.contains("constructor")) {
            return "The special function that runs when creating a new object from a class.";
        }

        if (trimmed.startsWith("async") || trimmed.contains("await")) {
            return "Handles operations that take time (like waiting for the internet) without freezing the program.";
        }

        if (trimmed.contains("try {")) {
            return "Starts a block that might have errors - we'll try this code.";
        }

        if (trimmed.contains("catch")) {
            return "Handles any errors that happened in the try block.";
        }

        if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
            return "This is an HTML tag - it creates a webpage element.";
        }

        return "This line performs a specific action in the code.";
    }

    private String extractVariableName(String line) {
        String[] parts = line.split("=");
        if (parts.length > 0) {
            String leftSide = parts[0].trim();
            leftSide = leftSide.replaceAll("^(const|let|var|final)\\s+", "");
            leftSide = leftSide.replaceAll("^\\w+\\s*\\[?\\]?\\s*", "");
            return leftSide.trim();
        }
        return null;
    }

    private String extractFunctionName(String line, String language) {
        if (language.equals("Python")) {
            Pattern p = Pattern.compile("def\\s+(\\w+)");
            Matcher m = p.matcher(line);
            if (m.find()) return m.group(1);
        } else {
            Pattern p = Pattern.compile("(?:function|const|let|var)\\s+(\\w+)");
            Matcher m = p.matcher(line);
            if (m.find()) return m.group(1);
        }
        return "this function";
    }

    private String getKeyConcepts(String code, String language) {
        StringBuilder concepts = new StringBuilder();
        String lower = code.toLowerCase();

        if (code.contains("function") || code.contains("def ")) {
            concepts.append("• **Functions** - Reusable blocks of code that perform specific tasks\n");
        }
        if (code.contains("const ") || code.contains("let ") || code.contains("var ")) {
            concepts.append("• **Variables** - Named containers that store data\n");
        }
        if (code.contains("if") || code.contains("else")) {
            concepts.append("• **Conditionals** - Code that makes decisions based on conditions\n");
        }
        if (code.contains("for") || code.contains("while")) {
            concepts.append("• **Loops** - Code that repeats multiple times\n");
        }
        if (code.contains("class")) {
            concepts.append("• **Classes/Objects** - Blueprints for creating things with properties and behaviors\n");
        }
        if (code.contains("[]") || code.contains("{}") || code.contains("Array") || code.contains("List")) {
            concepts.append("• **Arrays/Lists** - Collections of items stored together\n");
        }
        if (code.contains("=>")) {
            concepts.append("• **Arrow Functions** - A shorter way to write functions in JavaScript\n");
        }
        if (code.contains("async") || code.contains("await")) {
            concepts.append("• **Async/Await** - Ways to handle operations that take time\n");
        }
        if (code.contains("fetch") || code.contains("axios")) {
            concepts.append("• **API Calls** - Requests to get or send data over the internet\n");
        }
        if (code.contains("return")) {
            concepts.append("• **Return** - Sends a value back from a function\n");
        }

        if (concepts.length() == 0) {
            concepts.append("• **Syntax** - The rules for writing valid code in this language\n");
        }

        return concepts.toString();
    }

    private String getExercise(String code, String language) {
        String lower = code.toLowerCase();

        if (lower.contains("console.log") || lower.contains("print(")) {
            return "Try changing the message to say something different!\n" +
                   "• What happens if you print a number?\n" +
                   "• Can you print multiple things at once?";
        }

        if (lower.contains("function") || lower.contains("def ")) {
            return "Try modifying the function:\n" +
                   "• Change what it returns\n" +
                   "• Add a new parameter\n" +
                   "• Call it with different values";
        }

        if (lower.contains("for") || lower.contains("while")) {
            return "Try experimenting with the loop:\n" +
                   "• Change how many times it runs\n" +
                   "• Modify what happens each iteration\n" +
                   "• What if you start from a different number?";
        }

        if (lower.contains("if") && lower.contains("else")) {
            return "Try changing the condition:\n" +
                   "• What if you flip > to < ?\n" +
                   "• Add another condition with && or ||\n" +
                   "• What happens with edge cases?";
        }

        if (lower.contains("class")) {
            return "Try extending the class:\n" +
                   "• Add a new method\n" +
                   "• Create another instance\n" +
                   "• Add a new property";
        }

        return "Try small variations:\n" +
               "• Change one thing at a time\n" +
               "• Predict what will happen\n" +
               "• Run the code and see!";
    }
}
