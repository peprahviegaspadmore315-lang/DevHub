package com.learningplatform.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningplatform.model.dto.QuizGenerationRequest;
import com.learningplatform.model.dto.QuizGenerationResponse;
import com.learningplatform.model.dto.QuizGenerationResponse.QuizQuestion;
import com.learningplatform.service.QuizGenerationService;
import com.learningplatform.service.ai.AIProvider;
import com.learningplatform.service.ai.AIProviderReply;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class QuizGenerationServiceImpl implements QuizGenerationService {

    private static final int DEFAULT_QUESTION_COUNT = 5;
    private static final int MAX_QUESTION_COUNT = 10;
    private static final int MIN_TIME_LIMIT_SECONDS = 120;
    private static final int SECONDS_PER_QUESTION = 60;
    private static final Random RANDOM = new Random();

    private final AIProvider aiProvider;
    private final ObjectMapper objectMapper;

    public QuizGenerationServiceImpl(AIProvider aiProvider, ObjectMapper objectMapper) {
        this.aiProvider = aiProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    public QuizGenerationResponse generateQuiz(QuizGenerationRequest request) {
        log.info("Generating quiz for topic: {}", request.getTopic());

        String topic = request.getTopic();
        String content = request.getTopic();
        if (request.getContent() != null && !request.getContent().isBlank()) {
            content = request.getContent();
        }

        int questionCount = Math.min(request.getQuestionCount(), MAX_QUESTION_COUNT);
        if (questionCount <= 0) {
            questionCount = DEFAULT_QUESTION_COUNT;
        }

        Set<String> excludedQuestions = normalizeQuestionKeys(request.getExcludeQuestions());
        int preferredTimeLimitSeconds = resolveTimeLimitSeconds(
            request.getPreferredTimeLimitSeconds(),
            questionCount
        );
        String generationNonce = request.getGenerationNonce() != null && !request.getGenerationNonce().isBlank()
            ? request.getGenerationNonce().trim()
            : UUID.randomUUID().toString();

        QuizGenerationResponse liveQuiz = tryGenerateLiveQuiz(
            request,
            topic,
            content,
            questionCount,
            preferredTimeLimitSeconds,
            excludedQuestions,
            generationNonce
        );
        if (liveQuiz != null) {
            return liveQuiz;
        }

        List<QuizQuestion> questionPool = buildQuestionPoolForTopic(topic, content);
        List<QuizQuestion> questions = selectQuestions(questionPool, questionCount, excludedQuestions);

        return QuizGenerationResponse.builder()
            .topic(request.getTopic())
            .language(request.getLanguage())
            .questions(questions)
            .timeLimitSeconds(preferredTimeLimitSeconds)
            .live(false)
            .sourceLabel("Local quiz fallback")
            .statusMessage("DevHub used the local quiz set because live quiz generation was unavailable.")
            .build();
    }

    private QuizGenerationResponse tryGenerateLiveQuiz(
        QuizGenerationRequest request,
        String topic,
        String content,
        int questionCount,
        int preferredTimeLimitSeconds,
        Set<String> excludedQuestions,
        String generationNonce
    ) {
        if (!aiProvider.getStatus().isLive()) {
            return null;
        }

        try {
            Map<String, Object> context = new LinkedHashMap<>();
            context.put("tool", "quiz-generation");
            context.put("topic", topic);
            context.put("language", request.getLanguage());
            context.put("questionCount", questionCount);
            context.put("generationNonce", generationNonce);

            AIProviderReply reply = aiProvider.chat(
                buildLiveQuizPrompt(
                    topic,
                    content,
                    request.getLanguage(),
                    questionCount,
                    preferredTimeLimitSeconds,
                    excludedQuestions,
                    generationNonce
                ),
                context
            );

            if (!reply.isLive()) {
                return null;
            }

            LiveQuizPayload payload = parseLiveQuizPayload(reply.getContent());
            if (payload == null || payload.getQuestions() == null || payload.getQuestions().isEmpty()) {
                return null;
            }

            List<QuizQuestion> questions = sanitizeGeneratedQuestions(
                payload.getQuestions(),
                questionCount,
                excludedQuestions
            );

            if (questions.size() < questionCount) {
                Set<String> fillExclusions = new LinkedHashSet<>(excludedQuestions);
                for (QuizQuestion question : questions) {
                    fillExclusions.add(normalizeQuestionKey(question.getQuestion()));
                }

                questions.addAll(
                    selectQuestions(
                        buildQuestionPoolForTopic(topic, content),
                        questionCount - questions.size(),
                        fillExclusions
                    )
                );
            }

            if (questions.isEmpty()) {
                return null;
            }

            return QuizGenerationResponse.builder()
                .topic(request.getTopic())
                .language(request.getLanguage())
                .questions(questions)
                .timeLimitSeconds(resolveTimeLimitSeconds(payload.getTimeLimitSeconds(), questionCount))
                .live(true)
                .sourceLabel(reply.getSourceLabel())
                .statusMessage(reply.getStatusMessage())
                .build();
        } catch (Exception ex) {
            log.warn("Live quiz generation failed, using local fallback: {}", ex.getMessage());
            return null;
        }
    }

    private String buildLiveQuizPrompt(
        String topic,
        String content,
        String language,
        int questionCount,
        int preferredTimeLimitSeconds,
        Set<String> excludedQuestions,
        String generationNonce
    ) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append(
            "Generate a fresh multiple-choice quiz and return ONLY valid JSON with no markdown fences, intro text, or trailing notes.\n"
        );
        promptBuilder.append(
            "Return an object with this exact shape: {\"questions\":[{\"question\":\"...\",\"options\":[\"...\",\"...\",\"...\",\"...\"],\"correctIndex\":0,\"explanation\":\"...\"}],\"timeLimitSeconds\":300}.\n"
        );
        promptBuilder.append("Requirements:\n");
        promptBuilder.append("- Topic: ").append(topic).append("\n");
        if (language != null && !language.isBlank()) {
            promptBuilder.append("- Language context: ").append(language.trim()).append("\n");
        }
        promptBuilder.append("- Generate exactly ").append(questionCount).append(" questions.\n");
        promptBuilder.append("- Every question must have exactly 4 answer options.\n");
        promptBuilder.append("- Use a diverse mix of question styles when the topic allows it: concept, code reading, debugging, output prediction, and practical application.\n");
        promptBuilder.append("- Avoid repeating the same wording, order, or idea from previous runs.\n");
        promptBuilder.append("- Variation seed for this run: ").append(generationNonce).append("\n");
        promptBuilder.append("- Suggested total timer: ").append(preferredTimeLimitSeconds).append(" seconds.\n");
        if (!excludedQuestions.isEmpty()) {
            promptBuilder.append("- Do not reuse or closely paraphrase these question stems: ")
                .append(String.join(" | ", excludedQuestions))
                .append("\n");
        }
        promptBuilder.append("- Keep explanations concise and learner-friendly.\n");
        promptBuilder.append("- Base the quiz on the provided lesson content when relevant.\n");
        promptBuilder.append("Lesson context:\n");
        promptBuilder.append(content == null ? topic : content.trim());
        return promptBuilder.toString();
    }

    private LiveQuizPayload parseLiveQuizPayload(String rawContent) {
        if (rawContent == null || rawContent.isBlank()) {
            return null;
        }

        String json = rawContent.trim();
        if (json.startsWith("```")) {
            int firstNewLine = json.indexOf('\n');
            int lastFence = json.lastIndexOf("```");
            if (firstNewLine >= 0 && lastFence > firstNewLine) {
                json = json.substring(firstNewLine + 1, lastFence).trim();
            }
        }

        int firstBrace = json.indexOf('{');
        int lastBrace = json.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            json = json.substring(firstBrace, lastBrace + 1);
        }

        try {
            return objectMapper.readValue(json, LiveQuizPayload.class);
        } catch (Exception ex) {
            log.warn("Could not parse live quiz payload: {}", ex.getMessage());
            return null;
        }
    }

    private List<QuizQuestion> sanitizeGeneratedQuestions(
        List<QuizQuestion> inputQuestions,
        int count,
        Set<String> excludedQuestions
    ) {
        List<QuizQuestion> sanitized = new ArrayList<>();
        Set<String> usedQuestionKeys = new LinkedHashSet<>();

        for (QuizQuestion question : inputQuestions) {
            if (question == null || question.getQuestion() == null) {
                continue;
            }

            String normalizedQuestionKey = normalizeQuestionKey(question.getQuestion());
            if (normalizedQuestionKey.isBlank()
                || excludedQuestions.contains(normalizedQuestionKey)
                || !usedQuestionKeys.add(normalizedQuestionKey)) {
                continue;
            }

            List<String> normalizedOptions = normalizeOptions(question.getOptions());
            if (normalizedOptions.size() < 4) {
                continue;
            }

            int safeCorrectIndex = question.getCorrectIndex();
            if (safeCorrectIndex < 0 || safeCorrectIndex >= normalizedOptions.size()) {
                safeCorrectIndex = 0;
            }

            sanitized.add(
                randomizeOptions(
                    QuizQuestion.builder()
                        .question(question.getQuestion().trim())
                        .options(normalizedOptions)
                        .correctIndex(safeCorrectIndex)
                        .explanation(question.getExplanation() == null ? "" : question.getExplanation().trim())
                        .build()
                )
            );

            if (sanitized.size() >= count) {
                break;
            }
        }

        return sanitized;
    }

    private List<String> normalizeOptions(List<String> options) {
        List<String> normalizedOptions = new ArrayList<>();
        Set<String> seenOptions = new LinkedHashSet<>();

        if (options == null) {
            return normalizedOptions;
        }

        for (String option : options) {
            if (option == null) {
                continue;
            }

            String normalizedOption = option.trim();
            String optionKey = normalizedOption.toLowerCase(Locale.ROOT);
            if (normalizedOption.isEmpty() || !seenOptions.add(optionKey)) {
                continue;
            }

            normalizedOptions.add(normalizedOption);
        }

        return normalizedOptions;
    }

    private int resolveTimeLimitSeconds(Integer preferredTimeLimitSeconds, int questionCount) {
        int fallbackTimeLimit = Math.max(MIN_TIME_LIMIT_SECONDS, questionCount * SECONDS_PER_QUESTION);
        if (preferredTimeLimitSeconds == null || preferredTimeLimitSeconds <= 0) {
            return fallbackTimeLimit;
        }

        return Math.max(MIN_TIME_LIMIT_SECONDS, preferredTimeLimitSeconds);
    }

    private List<QuizQuestion> buildQuestionPoolForTopic(String topic, String content) {
        String combined = (topic + " " + content).toLowerCase(Locale.ROOT);

        if (combined.contains("javascript")
                || combined.contains("variable")
                || combined.contains("array")
                || combined.contains("closure")) {
            return buildJavaScriptQuestionPool();
        }

        if (combined.contains("python")
                || combined.contains("tuple")
                || combined.contains("dictionary")) {
            return buildPythonQuestionPool();
        }

        if (combined.contains("html")
                || combined.contains("<")
                || combined.contains("markup")
                || combined.contains("semantic")) {
            return buildHTMLQuestionPool();
        }

        if (combined.contains("css")
                || combined.contains("flex")
                || combined.contains("grid")
                || combined.contains("selector")) {
            return buildCSSQuestionPool();
        }

        return buildGenericProgrammingQuestionPool();
    }

    private List<QuizQuestion> selectQuestions(
            List<QuizQuestion> questionPool,
            int count,
            Set<String> excludedQuestions
    ) {
        if (questionPool.isEmpty()) {
            return List.of();
        }

        List<QuizQuestion> shuffledPool = new ArrayList<>(questionPool);
        Collections.shuffle(shuffledPool, RANDOM);

        List<QuizQuestion> selected = new ArrayList<>();
        Set<String> pickedQuestions = new LinkedHashSet<>();

        addFreshQuestions(shuffledPool, excludedQuestions, count, selected, pickedQuestions);

        if (selected.size() < count) {
            addRemainingQuestions(shuffledPool, count, selected, pickedQuestions);
        }

        return selected;
    }

    private void addFreshQuestions(
            List<QuizQuestion> questionPool,
            Set<String> excludedQuestions,
            int count,
            List<QuizQuestion> selected,
            Set<String> pickedQuestions
    ) {
        for (QuizQuestion question : questionPool) {
            String questionKey = normalizeQuestionKey(question.getQuestion());
            if (excludedQuestions.contains(questionKey) || !pickedQuestions.add(questionKey)) {
                continue;
            }

            selected.add(randomizeOptions(question));
            if (selected.size() >= count) {
                return;
            }
        }
    }

    private void addRemainingQuestions(
            List<QuizQuestion> questionPool,
            int count,
            List<QuizQuestion> selected,
            Set<String> pickedQuestions
    ) {
        for (QuizQuestion question : questionPool) {
            String questionKey = normalizeQuestionKey(question.getQuestion());
            if (!pickedQuestions.add(questionKey)) {
                continue;
            }

            selected.add(randomizeOptions(question));
            if (selected.size() >= count) {
                return;
            }
        }
    }

    private QuizQuestion randomizeOptions(QuizQuestion question) {
        List<String> shuffledOptions = new ArrayList<>(question.getOptions());
        String correctOption = shuffledOptions.get(question.getCorrectIndex());
        Collections.shuffle(shuffledOptions, RANDOM);

        return QuizQuestion.builder()
                .question(question.getQuestion())
                .options(shuffledOptions)
                .correctIndex(shuffledOptions.indexOf(correctOption))
                .explanation(question.getExplanation())
                .build();
    }

    private Set<String> normalizeQuestionKeys(List<String> questions) {
        Set<String> normalizedQuestions = new LinkedHashSet<>();
        if (questions == null) {
            return normalizedQuestions;
        }

        for (String question : questions) {
            String normalizedQuestion = normalizeQuestionKey(question);
            if (!normalizedQuestion.isBlank()) {
                normalizedQuestions.add(normalizedQuestion);
            }
        }

        return normalizedQuestions;
    }

    private String normalizeQuestionKey(String question) {
        if (question == null) {
            return "";
        }

        return question.trim().toLowerCase(Locale.ROOT);
    }

    private List<QuizQuestion> buildJavaScriptQuestionPool() {
        List<QuizQuestion> questions = new ArrayList<>();

        questions.add(createQuestion(
                "What keyword is used to declare a variable that cannot be reassigned in JavaScript?",
                Arrays.asList("var", "let", "const", "static"),
                2,
                "The 'const' keyword declares a constant that cannot be reassigned after initialization."
        ));

        questions.add(createQuestion(
                "What is the output of: console.log(typeof null)?",
                Arrays.asList("'null'", "'undefined'", "'object'", "'NaN'"),
                2,
                "This is a famous JavaScript quirk. typeof null returns 'object' due to a legacy bug."
        ));

        questions.add(createQuestion(
                "Which method adds an element to the end of an array?",
                Arrays.asList("unshift()", "push()", "pop()", "shift()"),
                1,
                "push() adds elements to the end, while pop() removes from the end."
        ));

        questions.add(createQuestion(
                "What is the result of: 2 + '2' in JavaScript?",
                Arrays.asList("4", "'22'", "NaN", "Error"),
                1,
                "When you add a number and a string, JavaScript converts the number to a string and concatenates."
        ));

        questions.add(createQuestion(
                "Which keyword is used to define a function in JavaScript?",
                Arrays.asList("function", "def", "func", "method"),
                0,
                "The 'function' keyword is used to declare functions in JavaScript."
        ));

        questions.add(createQuestion(
                "What does === compare in JavaScript?",
                Arrays.asList("Value only", "Type only", "Value and type", "Reference"),
                2,
                "=== is the strict equality operator, checking both value and type."
        ));

        questions.add(createQuestion(
                "What is an arrow function in JavaScript?",
                Arrays.asList(
                        "A function that points to another function",
                        "A shorter syntax for functions using =>",
                        "A function that returns an object",
                        "A deprecated function type"
                ),
                1,
                "Arrow functions provide a concise syntax using the => operator."
        ));

        questions.add(createQuestion(
                "Which array method creates a new array with transformed elements?",
                Arrays.asList("forEach()", "filter()", "map()", "reduce()"),
                2,
                "map() transforms each element and returns a new array."
        ));

        questions.add(createQuestion(
                "What is a closure in JavaScript?",
                Arrays.asList(
                        "A way to close the browser window",
                        "A function that has access to variables from its outer scope",
                        "A method to end a loop",
                        "A type of error"
                ),
                1,
                "A closure is a function that remembers and can access variables from its outer scope."
        ));

        questions.add(createQuestion(
                "What does the 'let' keyword do differently from 'var'?",
                Arrays.asList(
                        "Nothing, they are identical",
                        "let is block-scoped, var is function-scoped",
                        "let is for numbers only",
                        "let requires a semicolon"
                ),
                1,
                "let has block scope, while var has function scope."
        ));

        return questions;
    }

    private List<QuizQuestion> buildPythonQuestionPool() {
        List<QuizQuestion> questions = new ArrayList<>();

        questions.add(createQuestion(
                "What is the correct way to print output in Python?",
                Arrays.asList("print()", "echo()", "console.log()", "printf()"),
                0,
                "print() is Python's built-in function for displaying output."
        ));

        questions.add(createQuestion(
                "Which symbol is used for comments in Python?",
                Arrays.asList("//", "/*", "#", "--"),
                2,
                "The # symbol creates single-line comments in Python."
        ));

        questions.add(createQuestion(
                "What is the correct syntax to define a function in Python?",
                Arrays.asList("function myFunc()", "def myFunc():", "func myFunc()", "define myFunc()"),
                1,
                "Python uses the 'def' keyword to define functions."
        ));

        questions.add(createQuestion(
                "Which data type is immutable in Python?",
                Arrays.asList("List", "Dictionary", "Set", "Tuple"),
                3,
                "Tuples are immutable and cannot be changed after creation."
        ));

        questions.add(createQuestion(
                "What is the output of: print(type([]))?",
                Arrays.asList("<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"),
                0,
                "[] creates a list, and type() returns its class."
        ));

        questions.add(createQuestion(
                "How do you create a dictionary in Python?",
                Arrays.asList("[1, 2, 3]", "(1, 2, 3)", "{'a': 1, 'b': 2}", "<1, 2, 3>"),
                2,
                "Dictionaries use curly braces with key-value pairs."
        ));

        questions.add(createQuestion(
                "What does 'self' refer to in a Python class?",
                Arrays.asList(
                        "The class itself",
                        "The current instance of the class",
                        "A global variable",
                        "The parent class"
                ),
                1,
                "self refers to the instance of the class being operated on."
        ));

        questions.add(createQuestion(
                "Which method is called when an object is initialized?",
                Arrays.asList("__start__", "__init__", "__create__", "__new__"),
                1,
                "__init__ is the constructor-like method called during object initialization."
        ));

        questions.add(createQuestion(
                "What is list comprehension in Python?",
                Arrays.asList(
                        "Creating lists from iterables with concise syntax",
                        "A way to organize imports",
                        "A method to sort lists",
                        "A type of loop error"
                ),
                0,
                "List comprehension creates lists from iterables in a concise syntax."
        ));

        questions.add(createQuestion(
                "What is the output of: bool('') in Python?",
                Arrays.asList("True", "False", "None", "Error"),
                1,
                "An empty string is falsy in Python, so bool('') returns False."
        ));

        return questions;
    }

    private List<QuizQuestion> buildHTMLQuestionPool() {
        List<QuizQuestion> questions = new ArrayList<>();

        questions.add(createQuestion(
                "What does HTML stand for?",
                Arrays.asList(
                        "Hyper Text Markup Language",
                        "High Tech Modern Language",
                        "Home Tool Markup Language",
                        "Hyper Transfer Markup Language"
                ),
                0,
                "HTML stands for Hyper Text Markup Language."
        ));

        questions.add(createQuestion(
                "Which tag is used for the largest heading?",
                Arrays.asList("<h6>", "<heading>", "<h1>", "<head>"),
                2,
                "<h1> is the largest heading, and <h6> is the smallest."
        ));

        questions.add(createQuestion(
                "Which tag creates a clickable link?",
                Arrays.asList("<link>", "<a>", "<href>", "<url>"),
                1,
                "The <a> tag creates hyperlinks."
        ));

        questions.add(createQuestion(
                "What tag is used for a paragraph?",
                Arrays.asList("<text>", "<p>", "<paragraph>", "<para>"),
                1,
                "The <p> tag defines a paragraph."
        ));

        questions.add(createQuestion(
                "Which attribute specifies the URL in a link?",
                Arrays.asList("link", "href", "src", "url"),
                1,
                "The href attribute specifies the URL for links."
        ));

        questions.add(createQuestion(
                "What tag creates a line break?",
                Arrays.asList("<break>", "<lb>", "<br>", "<newline>"),
                2,
                "<br> creates a line break in HTML."
        ));

        questions.add(createQuestion(
                "Which tag creates an unordered list?",
                Arrays.asList("<ol>", "<li>", "<ul>", "<list>"),
                2,
                "<ul> creates an unordered list."
        ));

        questions.add(createQuestion(
                "What tag displays an image?",
                Arrays.asList("<picture>", "<image>", "<img>", "<photo>"),
                2,
                "The <img> tag embeds images and uses the src attribute."
        ));

        questions.add(createQuestion(
                "Which element is a container for metadata?",
                Arrays.asList("<body>", "<html>", "<head>", "<meta>"),
                2,
                "The <head> element contains metadata about the document."
        ));

        questions.add(createQuestion(
                "What is the correct HTML5 document structure?",
                Arrays.asList(
                        "<html><body></body></html>",
                        "<!DOCTYPE html><html><head></head><body></body></html>",
                        "<document><page></page></document>",
                        "<html5></html5>"
                ),
                1,
                "A proper HTML5 document includes DOCTYPE, html, head, and body elements."
        ));

        return questions;
    }

    private List<QuizQuestion> buildCSSQuestionPool() {
        List<QuizQuestion> questions = new ArrayList<>();

        questions.add(createQuestion(
                "What does CSS stand for?",
                Arrays.asList(
                        "Cascading Style Sheets",
                        "Computer Style Sheets",
                        "Creative Style System",
                        "Colorful Style Sheets"
                ),
                0,
                "CSS stands for Cascading Style Sheets."
        ));

        questions.add(createQuestion(
                "Which property changes text color?",
                Arrays.asList("text-color", "font-color", "color", "text-style"),
                2,
                "The color property sets the text color."
        ));

        questions.add(createQuestion(
                "How do you select an element with class 'example'?",
                Arrays.asList("#example", ".example", "example", "*example"),
                1,
                "Class selectors use a dot followed by the class name."
        ));

        questions.add(createQuestion(
                "Which property creates space inside an element?",
                Arrays.asList("margin", "spacing", "padding", "gap"),
                2,
                "padding creates space inside the element's border."
        ));

        questions.add(createQuestion(
                "Which property creates space outside an element?",
                Arrays.asList("padding", "border", "margin", "spacing"),
                2,
                "margin creates space outside the element's border."
        ));

        questions.add(createQuestion(
                "What does 'display: flex' do?",
                Arrays.asList(
                        "Makes text flexible",
                        "Creates a flex container for layout",
                        "Adds flexibility to images",
                        "Makes elements disappear"
                ),
                1,
                "display: flex creates a flex container for flexible layouts."
        ));

        questions.add(createQuestion(
                "Which property changes the background color?",
                Arrays.asList("bg-color", "background", "color", "back-color"),
                1,
                "background or background-color controls the background."
        ));

        questions.add(createQuestion(
                "What is the correct way to center text?",
                Arrays.asList("text-align: center", "align: center", "center: true", "text: middle"),
                0,
                "text-align: center horizontally centers inline text."
        ));

        questions.add(createQuestion(
                "Which property changes the font size?",
                Arrays.asList("font-style", "text-size", "font-size", "size"),
                2,
                "font-size sets the size of the font."
        ));

        questions.add(createQuestion(
                "What does 'display: none' do?",
                Arrays.asList(
                        "Hides the element from view",
                        "Shows the element",
                        "Removes formatting",
                        "Adds a border"
                ),
                0,
                "display: none hides the element completely and removes its layout space."
        ));

        return questions;
    }

    private List<QuizQuestion> buildGenericProgrammingQuestionPool() {
        List<QuizQuestion> questions = new ArrayList<>();

        questions.add(createQuestion(
                "What is a variable?",
                Arrays.asList(
                        "A fixed value that cannot change",
                        "A named container for storing data",
                        "A type of function",
                        "A programming language"
                ),
                1,
                "Variables are named containers that store data values."
        ));

        questions.add(createQuestion(
                "What is a function?",
                Arrays.asList(
                        "A type of loop",
                        "A reusable block of code that performs a specific task",
                        "A way to store data",
                        "A CSS property"
                ),
                1,
                "Functions are reusable blocks of code that perform specific tasks."
        ));

        questions.add(createQuestion(
                "What does an 'if' statement do?",
                Arrays.asList(
                        "Repeats code multiple times",
                        "Makes decisions based on conditions",
                        "Stores data",
                        "Creates a variable"
                ),
                1,
                "An if statement executes code when its condition is true."
        ));

        questions.add(createQuestion(
                "What is a loop?",
                Arrays.asList(
                        "A type of variable",
                        "Code that repeats until a condition is met",
                        "A way to make decisions",
                        "A CSS property"
                ),
                1,
                "Loops repeat code multiple times until a condition is met."
        ));

        questions.add(createQuestion(
                "What is an array?",
                Arrays.asList(
                        "A single value",
                        "A collection of items stored together",
                        "A type of loop",
                        "A CSS property"
                ),
                1,
                "An array stores multiple values in a single variable."
        ));

        questions.add(createQuestion(
                "What does 'return' do in a function?",
                Arrays.asList(
                        "Starts the function",
                        "Ends the function",
                        "Sends a value back from the function",
                        "Creates a variable"
                ),
                2,
                "The return statement sends a value back from a function."
        ));

        questions.add(createQuestion(
                "What is debugging?",
                Arrays.asList(
                        "Writing new code",
                        "Finding and fixing errors in code",
                        "Deleting code",
                        "Testing code performance"
                ),
                1,
                "Debugging is the process of finding and fixing errors in code."
        ));

        questions.add(createQuestion(
                "What is an operator?",
                Arrays.asList(
                        "A type of variable",
                        "A symbol that performs operations on values",
                        "A way to create functions",
                        "A CSS property"
                ),
                1,
                "Operators are symbols such as +, -, *, and / that perform operations on values."
        ));

        questions.add(createQuestion(
                "What is syntax?",
                Arrays.asList(
                        "The meaning of code",
                        "The rules for writing valid code",
                        "A type of error",
                        "A programming language"
                ),
                1,
                "Syntax is the set of rules for writing code in a language."
        ));

        questions.add(createQuestion(
                "What is a comment in code?",
                Arrays.asList(
                        "Code that runs",
                        "Notes for humans that are ignored by the computer",
                        "A type of variable",
                        "A way to create variables"
                ),
                1,
                "Comments are notes for developers that the computer ignores."
        ));

        return questions;
    }

    private QuizQuestion createQuestion(String question, List<String> options, int correctIndex, String explanation) {
        return QuizQuestion.builder()
                .question(question)
                .options(options)
                .correctIndex(correctIndex)
                .explanation(explanation)
                .build();
    }

    private static class LiveQuizPayload {
        private List<QuizQuestion> questions;
        private Integer timeLimitSeconds;

        public List<QuizQuestion> getQuestions() {
            return questions;
        }

        public void setQuestions(List<QuizQuestion> questions) {
            this.questions = questions;
        }

        public Integer getTimeLimitSeconds() {
            return timeLimitSeconds;
        }

        public void setTimeLimitSeconds(Integer timeLimitSeconds) {
            this.timeLimitSeconds = timeLimitSeconds;
        }
    }
}
