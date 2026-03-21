# Learning Platform - Development Status

## Last Updated: 2026-03-21

## Project Overview

Build a full-stack AI-powered learning platform (W3Schools-style) with:
- Spring Boot backend with PostgreSQL
- React frontend with TypeScript
- AI chatbot (Gemini/OpenAI) with text-to-speech Robot Assistant
- Secure code execution with Docker sandboxing
- Modern animated hero section on login page

## Instructions

1. Follow clean architecture and modular design
2. Never expose API keys in frontend - all AI requests go through backend
3. Use Docker for secure code execution with no network access
4. Build step-by-step with explanations
5. Keep code production-ready with proper error handling

## Discoveries

- Spring Boot 3.2 requires JAXB dependency for Java 17+
- Gemini API requires specific request/response DTOs for REST API
- Docker containers must use `--network none` for network isolation
- HTML/CSS can be previewed inline without Docker execution
- AI chatbot now has mock fallback responses when API key isn't configured
- Frontend uses `/api/code/run` endpoint (updated from `/api/execute`)
- Backend expects uppercase enum values for language (JAVASCRIPT, PYTHON, etc.)

## Accomplished

### Backend AI System
- ✅ AI Controller (`POST /api/ai/chat`, `GET /api/ai/status`)
- ✅ GeminiService with REST proxy to Gemini API
- ✅ MockAIResponseService with programming tutor responses (fallback)
- ✅ Updated system prompt for tutor-style responses
- ✅ Fixed `GeminiServiceImpl` to use new DTOs

### Code Execution System
- ✅ `CodeRunRequest.java` / `CodeRunResponse.java` DTOs
- ✅ `CodeExecutionProperties.java` configuration
- ✅ `CodeSecurityScanner.java` - blocks malicious patterns
- ✅ `DockerCodeExecutionService.java` - Docker sandboxed execution
- ✅ `CodeExecutionController.java` - `POST /api/code/run`
- ✅ Application configuration updated
- ✅ Fixed API path mismatch (frontend was calling `/api/execute` instead of `/api/code/run`)

### Frontend
- ✅ Modern animated LoginPage with split-screen layout
- ✅ `NeuralNetworkAnimation.tsx` - Canvas particle system with parallax
- ✅ `HeroRobot.tsx` - Interactive robot with eye tracking
- ✅ Input activity tracking - animation reacts to typing
- ✅ `aiService.ts` - Type-safe API communication
- ✅ `codeExecutionService.ts` - Code execution frontend (updated for correct API paths)
- ✅ Updated `TryItYourself.tsx` with new API

### Docker Configurations
- ✅ `docker/executors/python/` - Python executor with Dockerfile + entrypoint.sh
- ✅ `docker/executors/node/` - Node.js executor with Dockerfile + entrypoint.sh  
- ✅ `docker/executors/java/` - Java executor with Dockerfile + entrypoint.sh
- ✅ Security: `--network none`, `--memory=256m`, `--read-only`, non-root user

### Build Verification
- ✅ Backend compiles successfully (`mvn compile`)
- ✅ Frontend builds successfully (`npm run build`)

## Relevant Files

### Backend (Spring Boot)
```
backend/src/main/java/com/learningplatform/
├── config/
│   ├── AIConfig.java
│   ├── GeminiConfig.java
│   ├── CodeExecutionProperties.java
│   └── WebConfig.java
├── controller/
│   ├── AIController.java                     # POST /api/ai/chat
│   └── CodeExecutionController.java          # POST /api/code/run
├── model/dto/
│   ├── AIChatRequest.java
│   ├── AIChatResponse.java
│   ├── GeminiRequest.java
│   ├── GeminiResponse.java
│   ├── CodeRunRequest.java                   # { language, code }
│   └── CodeRunResponse.java                 # { success, output }
├── service/
│   ├── GeminiService.java
│   ├── MockAIResponseService.java           # Fallback responses
│   ├── CodeSecurityScanner.java              # Block malicious code
│   ├── CodeExecutionService.java            # Interface
│   └── impl/
│       ├── GeminiServiceImpl.java
│       ├── MockAIResponseServiceImpl.java   # Tutor responses
│       └── DockerCodeExecutionService.java  # Docker sandbox
└── resources/
    └── application.yml                       # Updated with code-execution config
```

### Frontend (React)
```
frontend/src/
├── components/
│   ├── hero/
│   │   ├── NeuralNetworkAnimation.tsx       # Canvas animation
│   │   ├── HeroRobot.tsx                  # Interactive robot
│   │   └── index.ts
│   └── editor/
│       └── TryItYourself.tsx              # Code execution UI
├── pages/
│   └── LoginPage.tsx                      # Modern split-screen
└── services/
    ├── aiService.ts                       # API communication
    └── codeExecutionService.ts            # Code execution API
```

### Docker
```
docker/
└── executors/
    ├── python/
    │   ├── Dockerfile                     # python:3.11-slim
    │   └── entrypoint.sh
    ├── node/
    │   ├── Dockerfile                     # node:20-alpine
    │   └── entrypoint.sh
    └── java/
        ├── Dockerfile                     # eclipse-temurin:17-jre-alpine
        └── entrypoint.sh
```

### Documentation
```
docs/
├── AI_ARCHITECTURE.md
└── CODE_EXECUTION_SYSTEM.md
```

## What's Next

### Priority 1: Test and Integration
1. **Build Docker images** for code executors:
   ```bash
   cd docker/executors/python && docker build -t learncode/python-executor .
   cd docker/executors/node && docker build -t learncode/node-executor .
   cd docker/executors/java && docker build -t learncode/java-executor .
   ```

2. **Test the code execution endpoint**:
   ```bash
   curl -X POST http://localhost:8080/api/code/run \
     -H "Content-Type: application/json" \
     -d '{"language":"PYTHON","code":"print(\"Hello, World!\")"}'
   ```

3. **Start services and test end-to-end**:
   ```bash
   # Backend
   cd backend && mvn spring-boot:run
   
   # Frontend
   cd frontend && npm run dev
   ```

### Priority 2: User Authentication
- Implement JWT authentication flow
- Create login/register pages
- Add protected routes for exercises
- Session management

### Priority 3: Course Management
- Create course listing page
- Implement tutorial viewer
- Add progress tracking
- Create exercise submission system

### Priority 4: Polish
- Add more AI chatbot features
- Implement text-to-speech for robot
- Add exercise quiz system
- Certificate generation

## Running the Project

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm run dev

# Docker (for code execution)
docker run --rm --network none --memory=256m learncode/python-executor
```
