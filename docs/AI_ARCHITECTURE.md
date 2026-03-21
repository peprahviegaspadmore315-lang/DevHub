# AI System Architecture

## Overview

The AI system provides an interactive robot assistant (LearnBot) that helps students learn programming through conversational AI and text-to-speech capabilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐ │
│  │   ChatBox    │    │RobotAvatar   │    │   RobotControls   │ │
│  └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘ │
│         │                   │                      │            │
│         └───────────────────┼──────────────────────┘            │
│                             ▼                                   │
│                    ┌────────────────┐                           │
│                    │ RobotContext   │◄── State Management       │
│                    └───────┬────────┘                           │
│                            │                                    │
│         ┌─────────────────┼─────────────────┐                 │
│         ▼                 ▼                 ▼                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │useAIChat   │    │useSpeech  │    │useTyping   │            │
│  │Robot       │    │Synthesis  │    │Detection   │            │
│  └─────┬──────┘    └─────┬──────┘    └────────────┘            │
│        │                 │                                     │
│        └────────┬────────┘                                     │
│                 ▼                                               │
│        ┌────────────────┐                                      │
│        │   aiService    │◄── API Communication Layer           │
│        └────────┬───────┘                                      │
└─────────────────┼─────────────────────────────────────────────┘
                  │ HTTP
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Spring Boot)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│        ┌────────────────┐                                       │
│        │ AIController   │◄── /api/ai/chat, /api/ai/status      │
│        └───────┬────────┘                                       │
│                │                                                │
│                ▼                                                │
│        ┌────────────────┐                                      │
│        │ GeminiService  │◄── AI Service Interface              │
│        └───────┬────────┘                                       │
│                │                                                │
│                ▼                                                │
│        ┌────────────────┐    ┌────────────────┐                │
│        │GeminiService   │    │ GeminiConfig   │                │
│        │Impl            │    │                │                │
│        └───────┬────────┘    └────────────────┘                │
│                │                                                │
│                │  HTTP POST                                     │
│                ▼                                                │
│        ┌─────────────────────────────────────┐                  │
│        │      Google Gemini REST API         │                  │
│        │ generativelanguage.googleapis.com    │                  │
│        └─────────────────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend

| Component | Responsibility |
|-----------|----------------|
| `ChatBox` | Chat UI, message display, input handling |
| `RobotContext` | Global robot state (speaking, thinking, idle) |
| `useAIChatRobot` | AI-specific state transitions |
| `useSpeechSynthesis` | Browser TTS integration |
| `useTypingDetection` | User input detection |
| `aiService` | API communication with backend |

### Backend

| Component | Responsibility |
|-----------|----------------|
| `AIController` | REST endpoints for AI chat |
| `GeminiService` | Service interface |
| `GeminiServiceImpl` | Gemini API integration |
| `GeminiConfig` | Environment configuration |

## Data Flow

### Chat Flow

```
User types message
       ↓
ChatBox.sendMessage()
       ↓
aiService.chat() → POST /api/ai/chat
       ↓
AIController.chat()
       ↓
GeminiService.chat()
       ↓
Gemini REST API
       ↓
Parse response
       ↓
Return AIChatResponse
       ↓
Robot state: "thinking" → "speaking"
       ↓
SpeechSynthesis reads response
       ↓
Robot state: "idle"
```

## File Structure

### Frontend

```
frontend/src/
├── components/
│   └── robot/
│       ├── components/
│       │   ├── ChatBox.tsx          # Chat UI
│       │   ├── RobotAvatar.tsx      # Visual avatar
│       │   ├── RobotControls.tsx    # Control buttons
│       │   └── index.ts
│       ├── context/
│       │   ├── RobotContext.tsx     # State management
│       │   └── index.ts
│       ├── hooks/
│       │   ├── useAIChatRobot.ts    # AI state handler
│       │   ├── useRobotState.ts     # State machine
│       │   ├── useSpeechSynthesis.ts # TTS
│       │   ├── useTypingDetection.ts
│       │   ├── useLessonRobot.ts
│       │   ├── useQuizRobot.ts
│       │   └── index.ts
│       ├── types/
│       │   └── index.ts
│       └── index.ts
├── services/
│   └── aiService.ts                 # API layer
└── App.tsx
```

### Backend

```
backend/src/main/java/com/learningplatform/
├── config/
│   ├── GeminiConfig.java            # Gemini settings
│   └── AIConfig.java                # OpenAI (legacy)
├── controller/
│   └── AIController.java            # REST endpoints
├── model/
│   ├── dto/
│   │   ├── AIChatRequest.java       # Request DTO
│   │   ├── AIChatResponse.java      # Response DTO
│   │   ├── GeminiRequest.java      # Gemini request
│   │   └── GeminiResponse.java      # Gemini response
│   └── entity/
├── service/
│   ├── GeminiService.java           # Interface
│   └── impl/
│       └── GeminiServiceImpl.java   # Implementation
└── resources/
    └── application.yml              # Configuration
```

## Security

### API Key Protection

```
┌─────────────────────────────────────────┐
│             FRONTEND                    │
│                                         │
│   ┌─────────────────────────────┐      │
│   │ User sends message           │      │
│   │ NO API KEY in frontend      │      │
│   └─────────────────────────────┘      │
└─────────────────────────────────────────┘
                    │
                    │ HTTP (message only)
                    ▼
┌─────────────────────────────────────────┐
│             BACKEND                     │
│                                         │
│   ┌─────────────────────────────┐      │
│   │ Reads GEMINI_API_KEY from    │      │
│   │ environment variable         │      │
│   └─────────────────────────────┘      │
│              │                          │
│              │ API call with key        │
│              ▼                          │
│   ┌─────────────────────────────┐      │
│   │   Google Gemini API          │      │
│   └─────────────────────────────┘      │
└─────────────────────────────────────────┘
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `DB_PASSWORD` | Database password | Yes |

## State Machine

```
        ┌─────────────────────────────────────────────┐
        │                                             │
        ▼                                             │
    ┌───────┐     Event      ┌─────────┐            │
    │ idle  │ ─────────────► │ thinking│◄──────┐   │
    └───┬───┘                └────┬────┘        │   │
        │                         │              │   │
        │                         │ Response     │   │
        │                         ▼              │   │
        │                     ┌─────────┐         │   │
        │◄───────────────────│ speaking│─────────┘   │
        │                     └────┬────┘             │
        │                          │                  │
        │                          │ TTS complete     │
        │                          ▼                  │
        └──────────────────────────────────────────►  │
                                                      │
        Events:                                        │
        - THINKING → user sends message                │
        - MESSAGE_RECEIVED → AI responds              │
        - idle → auto after speaking/error            │
```

## Error Handling

```
Request fails
      │
      ▼
┌─────────────┐
│ Catch error  │──────────► Display error message
└─────────────┘                      │
      │                               │
      ▼                               ▼
┌─────────────────┐          ┌────────────────┐
│ Log error       │          │ Robot state:  │
│ (server-side)   │          │ "confused"     │
└─────────────────┘          └────────────────┘
```

## Setup

### 1. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your GEMINI_API_KEY
```

### 2. Start Backend

```bash
export $(cat .env | xargs)
mvn spring-boot:run
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send message, get AI response |
| GET | `/api/ai/status` | Check AI service status |
