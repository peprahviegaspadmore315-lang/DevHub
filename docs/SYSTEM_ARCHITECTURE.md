# Learning Platform - System Architecture

## Overview

The AI Learning Platform is a full-stack application that combines:
- **Code Execution** - Run Python, JavaScript, Java, HTML, CSS
- **AI Evaluation** - Get intelligent feedback on written answers
- **Robot Assistant** - Text-to-speech helper that reacts to user actions

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ TryItYourself│  │  Exercise   │  │   Quiz     │  │  Lesson     │            │
│  │  Component   │  │  Component  │  │  Page      │  │  Page       │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                 │                 │                 │                  │
│         ▼                 ▼                 ▼                 ▼                  │
│  ┌─────────────────────────────────────────────────────────────────────┐       │
│  │                         SERVICES LAYER                              │       │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │       │
│  │  │ codeExecution    │  │  evaluation     │  │     ai          │   │       │
│  │  │   Service        │  │    Service      │  │    Service      │   │       │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘   │       │
│  │           │                     │                     │              │       │
│  │           └──────────┬──────────┴─────────────────────┘              │       │
│  │                      ▼                                              │       │
│  │              ┌──────────────┐                                       │       │
│  │              │ api-client  │  (Shared HTTP utilities)                │       │
│  │              └──────────────┘                                       │       │
│  └─────────────────────────────────────────────────────────────────────┘       │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐       │
│  │                      ROBOT ASSISTANT                                  │       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │       │
│  │  │RobotProvider │  │ SpeechSynth │  │ RobotAvatar │                  │       │
│  │  │  (Context)   │  │  (Hook)     │  │ (Component) │                  │       │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │       │
│  │           │                                                              │       │
│  │           ▼                                                              │       │
│  │  ┌─────────────────────────────────────────────────────────────┐       │       │
│  │  │           window.__robot (Global Event Bus)                 │       │       │
│  │  │  • dispatch(event, payload) - Trigger robot reactions      │       │       │
│  │  │  • speak(text) - Make robot speak                          │       │       │
│  │  └─────────────────────────────────────────────────────────────┘       │       │
│  └─────────────────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Spring Boot)                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           CONTROLLERS                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │   │
│  │  │  AIController   │  │ CodeExecution   │  │  Other APIs     │         │   │
│  │  │  /api/ai/*      │  │ Controller      │  │                 │         │   │
│  │  │                 │  │ /api/code/*     │  │                 │         │   │
│  │  └────────┬────────┘  └────────┬────────┘  └─────────────────┘         │   │
│  └───────────┼───────────────────┼─────────────────────────────────────────┘   │
│              │                   │                                             │
│              ▼                   ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          SERVICES                                        │   │
│  │                                                                          │   │
│  │  AI Layer:                      Code Execution Layer:                     │   │
│  │  ┌──────────────────────┐      ┌──────────────────────┐                │   │
│  │  │ GeminiService        │      │ CodeExecutionService  │                │   │
│  │  │ (Interface)          │      │ (Interface)           │                │   │
│  │  ├──────────────────────┤      ├──────────────────────┤                │   │
│  │  │ • GeminiServiceImpl  │      │ • DockerCodeExecution │                │   │
│  │  │   (Real Gemini API)  │      │   ServiceImpl         │                │   │
│  │  │ • MockAIResponse     │      │   (Docker sandboxed)   │                │   │
│  │  │   ServiceImpl        │      │                      │                │   │
│  │  │   (Fallback)         │      │ • CodeSecurityScanner│                │   │
│  │  └──────────────────────┘      │   (Blocks malicious) │                │   │
│  │                                 └──────────────────────┘                │   │
│  │                                                                          │   │
│  │  Evaluation Layer:                                                       │   │
│  │  ┌──────────────────────────────┐                                       │   │
│  │  │ AnswerEvaluationService      │                                       │   │
│  │  │ • Evaluates student answers │                                       │   │
│  │  │ • Returns: score, feedback  │                                       │   │
│  │  │ • Uses Gemini with tutor    │                                       │   │
│  │  │   prompt                    │                                       │   │
│  │  └──────────────────────────────┘                                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           DATA LAYER                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │   Users     │  │  Courses    │  │  Lessons    │  │  Exercises  │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DOCKER CONTAINERS (Sandboxed)                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │    node:20       │  │   python:3.11     │  │  openjdk:17      │           │
│  │   - alpine       │  │    - slim        │  │   - alpine       │           │
│  │                  │  │                  │  │                  │           │
│  │ • Network: NONE  │  │ • Network: NONE  │  │ • Network: NONE  │           │
│  │ • Memory: 256MB  │  │ • Memory: 256MB  │  │ • Memory: 256MB  │           │
│  │ • Read-only FS   │  │ • Read-only FS   │  │ • Read-only FS   │           │
│  │ • No exec sys    │  │ • No exec sys    │  │ • No exec sys    │           │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Code Execution
```
POST /api/code/run
Request:  { code: string, language: "PYTHON" | "JAVASCRIPT" | "JAVA" | "HTML" | "CSS" }
Response: { success: boolean, output?: string, error?: string, executionTimeMs: number }
```

### AI Evaluation
```
POST /api/ai/evaluate
Request:  { question: string, studentAnswer: string, context?: string, language?: string }
Response: { success: boolean, score: number, feedback: string, correct: boolean,
             strengths?: string[], weaknesses?: string[], suggestions?: string[] }
```

### AI Chat
```
POST /api/ai/chat
Request:  { message: string, conversationHistory?: ChatMessage[] }
Response: { success: boolean, message: string, aiName: string }
```

## Data Flow Examples

### 1. User Runs Code
```
User clicks "Run"
        ↓
TryItYourself.runCode()
        ↓
codeExecutionService.execute({ code, language })
        ↓
POST /api/code/run
        ↓
┌─ Security Scan (backend)
│  └─ Block malicious patterns
│         ↓
├─ CodeExecutionService.execute()
│  └─ If HTML/CSS → return code directly
│  └─ If Python/JS/Java → Docker execution
│         ↓
└─ CodeRunResponse
        ↓
TryItYourself displays output
        ↓
Robot speaks: "Code executed successfully!" (on success)
```

### 2. User Submits Exercise Answer
```
User types answer and clicks "Submit"
        ↓
Exercise.handleSubmit()
        ↓
evaluationService.evaluate({ question, studentAnswer })
        ↓
POST /api/ai/evaluate
        ↓
┌─ AnswerEvaluationService.evaluate()
│  └─ If Gemini configured:
│     └─ Call Gemini with tutor prompt
│  └─ If not configured:
│     └─ Rule-based fallback evaluation
│         ↓
└─ AnswerEvaluationResponse
        ↓
┌─ Exercise displays result
│  └─ Score card, feedback, suggestions
│         ↓
└─ Robot reacts based on score:
   ├─ Score ≥ 80: "Great job! You scored [X]!"
   ├─ Score 60-79: "Good effort! You scored [X]."
   └─ Score < 60: "Let's work on this together. You scored [X]."
```

## Robot Assistant Integration

### Global Event System
Components communicate with the Robot via `window.__robot`:

```typescript
// Trigger robot reaction
const robot = (window as any).__robot;
robot.dispatch('EVALUATION_GOOD', { score: 85, feedback: 'Great job!' });

// Make robot speak
robot.speak('Your code executed successfully!');
```

### Robot States
| State | Emoji | Trigger |
|-------|-------|---------|
| `idle` | 🤖 | Default state |
| `thinking` | 🤔 | User typing, evaluation in progress |
| `speaking` | 💬 | Robot speaking |
| `excited` | 🎉 | High score (≥80), quiz correct |
| `celebrating` | 🏆 | Quiz completion |
| `evaluating` | 📝 | AI evaluating answer |
| `confused` | 😕 | Error state |

### Robot Events
| Event | Behavior |
|-------|----------|
| `EVALUATION_GOOD` | React based on score, speak feedback |
| `EVALUATION_BAD` | Supportive message, suggest retry |
| `QUIZ_CORRECT` | Excited celebration |
| `QUIZ_COMPLETE` | Major celebration |
| `CODE_SUCCESS` | Brief positive acknowledgment |
| `CODE_ERROR` | Suggest troubleshooting |

## Security

### Code Execution Security
1. **Docker Sandboxing**
   - `--network none` - No network access
   - `--memory=256m` - Memory limit
   - `--read-only` - Read-only filesystem
   - `--cap-drop=ALL` - Drop all capabilities
   - `--user 1000:1000` - Non-root execution

2. **Security Scanner** blocks:
   - Shell commands (`rm`, `fork`, `exec`)
   - Network access (`socket`, `curl`, `wget`)
   - File system access (`open`, `chmod`)
   - Process manipulation (`signal`, `kill`)
   - Import restrictions

### API Security
- All API calls include JWT token from `localStorage`
- Backend validates tokens on protected routes
- Rate limiting on execution endpoints

## File Structure

```
frontend/src/
├── services/
│   ├── api-client.ts          # Shared HTTP utilities
│   ├── codeExecutionService.ts # Code execution API
│   ├── evaluationService.ts   # AI evaluation API
│   └── aiService.ts          # AI chat API
│
├── components/
│   ├── editor/
│   │   ├── TryItYourself.tsx  # Code editor with execution
│   │   ├── TryItYourself.css
│   │   ├── Exercise.tsx       # AI-evaluated exercise
│   │   ├── Exercise.css
│   │   └── AnswerEvaluator.tsx # Standalone evaluator
│   │
│   └── robot/
│       ├── context/
│       │   └── RobotContext.tsx  # Robot state management
│       ├── hooks/
│       │   ├── useSpeechSynthesis.ts
│       │   └── useRobotState.ts
│       ├── components/
│       │   ├── RobotAvatar.tsx
│       │   └── RobotAssistant.tsx
│       └── types/
│           └── index.ts
│
└── pages/
    ├── CodeEditorPage.tsx
    ├── LessonPage.tsx
    └── QuizPage.tsx

backend/src/main/java/
├── controller/
│   ├── AIController.java      # /api/ai/*
│   └── CodeExecutionController.java  # /api/code/*
│
├── service/
│   ├── GeminiService.java
│   ├── AnswerEvaluationService.java
│   ├── CodeExecutionService.java
│   └── CodeSecurityScanner.java
│
└── model/dto/
    ├── CodeRunRequest.java
    ├── CodeRunResponse.java
    ├── AnswerEvaluationRequest.java
    └── AnswerEvaluationResponse.java
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker (for code execution)
- PostgreSQL (for database)

### Running Locally
```bash
# Backend
cd backend
cp .env.example .env  # Configure API keys
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

### Environment Variables
```env
# Backend (.env)
GEMINI_API_KEY=your_key_here
DATABASE_URL=jdbc:postgresql://localhost:5432/learning_platform

# Frontend (.env)
VITE_API_URL=http://localhost:8080
```
