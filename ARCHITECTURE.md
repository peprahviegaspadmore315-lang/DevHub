# Learning Platform Architecture

## Table of Contents
1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Frontend Structure](#2-frontend-structure)
3. [Backend Structure](#3-backend-structure)
4. [Database Schema](#4-database-schema)
5. [API Endpoints](#5-api-endpoints)
6. [Code Execution Service](#6-code-execution-service)

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │   React     │  │   Redux/    │  │   Router    │  │    Code Editor          ││
│  │   UI        │  │   Context   │  │             │  │    (Monaco/CodeMirror)  ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTPS
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY (Nginx)                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  - Load Balancing    - SSL Termination    - Static File Serving         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
┌─────────────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐
│   Frontend Server       │  │  Backend API    │  │  Code Execution Service     │
│   (Static Files)        │  │  (Spring Boot)  │  │  (Docker Containers)        │
│                         │  │                 │  │                             │
│   - React Build         │  │  - REST API     │  │  - Sandboxed Execution      │
│   - Assets              │  │  - Auth         │  │  - Multiple Languages        │
│   - CDN Ready           │  │  - Business     │  │  - Timeout Management       │
└─────────────────────────┘  └────────┬────────┘  └──────────────┬──────────────┘
                                       │                         │
                                       ▼                         │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER (PostgreSQL)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Users      │  │  Courses    │  │  Progress   │  │  Exercises/Quizzes      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Component Overview

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Frontend | React + TypeScript | UI, Code Editor, Interactive Tutorials |
| API Gateway | Nginx | Load balancing, SSL, Static files |
| Backend API | Spring Boot | Business logic, Auth, Data management |
| Database | PostgreSQL | Persistent data storage |
| Code Execution | Docker + Judge0/isolated containers | Safe code execution |
| Cache | Redis (optional) | Session management, caching |

---

## 2. Frontend Structure

### 2.1 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── assets/
│       ├── images/
│       └── icons/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Loader/
│   │   │   └── Navbar/
│   │   ├── code-editor/
│   │   │   ├── CodeEditor.tsx
│   │   │   ├── OutputPanel.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── EditorToolbar.tsx
│   │   ├── tutorial/
│   │   │   ├── TutorialContent.tsx
│   │   │   ├── CodeExample.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── exercises/
│   │   │   ├── ExerciseCard.tsx
│   │   │   ├── QuizQuestion.tsx
│   │   │   ├── ExerciseRunner.tsx
│   │   │   └── ResultsPanel.tsx
│   │   ├── progress/
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── CourseProgress.tsx
│   │   │   └── AchievementBadge.tsx
│   │   └── certificate/
│   │       ├── CertificatePreview.tsx
│   │       └── CertificateDownload.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Tutorial.tsx
│   │   ├── TryItYourself.tsx
│   │   ├── Exercises.tsx
│   │   ├── Quiz.tsx
│   │   ├── Courses.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── Profile.tsx
│   │   ├── Certificates.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   ├── exercise.service.ts
│   │   ├── code-execution.service.ts
│   │   └── certificate.service.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── auth.slice.ts
│   │   ├── course.slice.ts
│   │   └── progress.slice.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProgress.ts
│   │   └── useCodeExecution.ts
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── course.types.ts
│   │   ├── exercise.types.ts
│   │   └── certificate.types.ts
│   ├── utils/
│   │   ├── api-config.ts
│   │   ├── local-storage.ts
│   │   └── validators.ts
│   ├── styles/
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env
```

### 2.2 Key Components Design

#### Code Editor Component
- **Technology**: Monaco Editor or CodeMirror 6
- **Features**:
  - Syntax highlighting for 10+ languages
  - Auto-completion
  - Error highlighting
  - Multiple file support (for HTML/CSS/JS)
  - Theme support (light/dark)

#### Tutorial Component
- **Features**:
  - Markdown content rendering
  - Interactive code examples
  - "Try It Yourself" integration
  - Previous/Next navigation
  - Table of contents sidebar

#### Exercise/Quiz System
- **Exercise Types**:
  - Fill in the blank
  - Fix the code
  - Write code to solve problem
  - Multiple choice quizzes
  - Code completion

---

## 3. Backend Structure

### 3.1 Project Structure

```
backend/
├── src/main/java/com/learningplatform/
│   ├── LearningPlatformApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CORSConfig.java
│   │   ├── JwtConfig.java
│   │   ├── DatabaseConfig.java
│   │   └── RedisConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── CourseController.java
│   │   ├── TutorialController.java
│   │   ├── ExerciseController.java
│   │   ├── QuizController.java
│   │   ├── ProgressController.java
│   │   ├── CertificateController.java
│   │   └── CodeExecutionController.java
│   ├── service/
│   │   ├── impl/
│   │   │   ├── AuthServiceImpl.java
│   │   │   ├── UserServiceImpl.java
│   │   │   ├── CourseServiceImpl.java
│   │   │   ├── TutorialServiceImpl.java
│   │   │   ├── ExerciseServiceImpl.java
│   │   │   ├── QuizServiceImpl.java
│   │   │   ├── ProgressServiceImpl.java
│   │   │   ├── CertificateServiceImpl.java
│   │   │   └── CodeExecutionServiceImpl.java
│   │   └── interfaces/
│   │       ├── IAuthService.java
│   │       ├── IUserService.java
│   │       └── ...
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── CourseRepository.java
│   │   ├── TutorialRepository.java
│   │   ├── ExerciseRepository.java
│   │   ├── QuizRepository.java
│   │   ├── ProgressRepository.java
│   │   ├── CertificateRepository.java
│   │   └── ExerciseAttemptRepository.java
│   ├── model/
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Course.java
│   │   │   ├── Tutorial.java
│   │   │   ├── Exercise.java
│   │   │   ├── Quiz.java
│   │   │   ├── QuizQuestion.java
│   │   │   ├── Progress.java
│   │   │   ├── Certificate.java
│   │   │   └── ExerciseAttempt.java
│   │   ├── dto/
│   │   │   ├── UserDTO.java
│   │   │   ├── CourseDTO.java
│   │   │   ├── TutorialDTO.java
│   │   │   ├── ExerciseDTO.java
│   │   │   ├── QuizDTO.java
│   │   │   ├── ProgressDTO.java
│   │   │   └── CertificateDTO.java
│   │   └── enums/
│   │       ├── Role.java
│   │       ├── Difficulty.java
│   │       ├── ExerciseType.java
│   │       └── CertificateStatus.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── UnauthorizedException.java
│   │   └── InvalidInputException.java
│   ├── validation/
│   │   └── Validators.java
│   └── util/
│       ├── PasswordEncoder.java
│       └── DateUtils.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── data.sql
├── pom.xml
└── Dockerfile
```

### 3.2 Backend Modules

| Module | Responsibility |
|--------|----------------|
| Auth Module | JWT authentication, registration, login, password reset |
| User Module | Profile management, preferences |
| Course Module | Course CRUD, categorization |
| Tutorial Module | Tutorial content management |
| Exercise Module | Exercise management, validation |
| Quiz Module | Quiz management, scoring |
| Progress Module | Track user progress |
| Certificate Module | Generate and manage certificates |
| Code Execution Module | Submit code for execution |

---

## 4. Database Schema

### 4.1 ER Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │   courses    │       │  tutorials   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ id (PK)      │◄──────│ id (PK)      │
│ email        │       │ title        │       │ course_id(FK)│
│ password     │       │ description  │       │ title        │
│ username     │       │ category     │       │ content      │
│ role         │       │ difficulty   │       │ order_index  │
│ created_at   │       │ created_at   │       │ code_example │
│ updated_at   │       │ updated_at   │       │ course_id    │
└──────────────┘       └──────────────┘       └──────────────┘
                              │                      │
                              │                      │
                              ▼                      ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  progress    │       │  exercises   │       │ certificates │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ user_id(FK)  │       │ tutorial_id  │       │ user_id(FK)  │
│ course_id(FK)│       │ course_id(FK)│       │ course_id(FK)│
│ tutorial_id │       │ title        │       │ issued_date  │
│ completed    │       │ description  │       │ status       │
│ completed_at │       │ type         │       │ code         │
│              │       │ solution     │       │ template     │
└──────────────┘       │ test_cases   │       └──────────────┘
                       │ difficulty   │
                       │ points       │
                       └──────────────┘
                              │
                              ▼
┌──────────────┐       ┌──────────────┐
│    quizzes   │       │exercise_attempts│
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ course_id(FK)│       │ exercise_id(FK)│
│ title        │       │ user_id(FK)  │
│ description  │       │ user_code    │
│ passing_score│       │ is_correct   │
└──────────────┘       │ executed_at  │
       │              │ output       │
       ▼              │ error        │
┌──────────────┐      └──────────────┘
│quiz_questions│
├──────────────┤
│ id (PK)      │
│ quiz_id(FK)  │
│ question     │
│ options (JSON)
│ correct_ans  │
│ order_index  │
└──────────────┘
```

### 4.2 Detailed Table Definitions

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    icon_url VARCHAR(500),
    is_premium BOOLEAN DEFAULT FALSE,
    order_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tutorials table
CREATE TABLE tutorials (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    code_example TEXT,
    order_index INT NOT NULL,
    estimated_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE exercises (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    tutorial_id BIGINT REFERENCES tutorials(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('FILL_BLANK', 'FIX_CODE', 'WRITE_CODE', 'MULTIPLE_CHOICE')),
    starter_code TEXT,
    solution TEXT NOT NULL,
    test_cases JSONB NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'BEGINNER',
    points INT DEFAULT 10,
    hints TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE quizzes (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    tutorial_id BIGINT REFERENCES tutorials(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INT DEFAULT 70,
    time_limit_minUTES INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Questions table
CREATE TABLE quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT,
    order_index INT NOT NULL
);

-- Progress table
CREATE TABLE progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    tutorial_id BIGINT REFERENCES tutorials(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, tutorial_id)
);

-- Exercise Attempts table
CREATE TABLE exercise_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    exercise_id BIGINT REFERENCES exercises(id) ON DELETE CASCADE,
    user_code TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    output TEXT,
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
    certificate_code VARCHAR(50) UNIQUE NOT NULL,
    template_id VARCHAR(50)
);

-- User Course Enrollments
CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Indexes for performance
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_course ON progress(course_id);
CREATE INDEX idx_exercise_attempts_user ON exercise_attempts(user_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_tutorials_course ON tutorials(course_id);
```

---

## 5. API Endpoints

### 5.1 Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | Logout user | Authenticated |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password` | Reset password | Public |

### 5.2 User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Get current user profile | Authenticated |
| PUT | `/api/users/me` | Update profile | Authenticated |
| PUT | `/api/users/me/password` | Change password | Authenticated |
| DELETE | `/api/users/me` | Delete account | Authenticated |

### 5.3 Course Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/courses` | List all courses | Public |
| GET | `/api/courses/{id}` | Get course details | Public |
| GET | `/api/courses/{id}/tutorials` | Get course tutorials | Public |
| POST | `/api/courses` | Create course | Admin |
| PUT | `/api/courses/{id}` | Update course | Admin |
| DELETE | `/api/courses/{id}` | Delete course | Admin |
| POST | `/api/courses/{id}/enroll` | Enroll in course | Authenticated |

### 5.4 Tutorial Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tutorials/{id}` | Get tutorial content | Public |
| GET | `/api/tutorials/{id}/next` | Get next tutorial | Public |
| GET | `/api/tutorials/{id}/previous` | Get previous tutorial | Public |
| POST | `/api/tutorials` | Create tutorial | Admin |
| PUT | `/api/tutorials/{id}` | Update tutorial | Admin |
| DELETE | `/api/tutorials/{id}` | Delete tutorial | Admin |

### 5.5 Exercise Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/exercises` | List exercises (with filters) | Public |
| GET | `/api/exercises/{id}` | Get exercise details | Public |
| POST | `/api/exercises/{id}/submit` | Submit exercise solution | Authenticated |
| GET | `/api/exercises/{id}/solution` | Get solution (after completion) | Authenticated |
| GET | `/api/exercises/{id}/hints` | Get hints | Authenticated |
| POST | `/api/exercises` | Create exercise | Admin |
| PUT | `/api/exercises/{id}` | Update exercise | Admin |
| DELETE | `/api/exercises/{id}` | Delete exercise | Admin |
| GET | `/api/exercises/user/attempts` | Get user's exercise attempts | Authenticated |

### 5.6 Quiz Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/quizzes` | List quizzes | Public |
| GET | `/api/quizzes/{id}` | Get quiz details | Public |
| GET | `/api/quizzes/{id}/questions` | Get quiz questions | Public |
| POST | `/api/quizzes/{id}/submit` | Submit quiz answers | Authenticated |
| GET | `/api/quizzes/{id}/results` | Get quiz results | Authenticated |

### 5.7 Progress Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/progress` | Get user progress | Authenticated |
| GET | `/api/progress/course/{courseId}` | Get course progress | Authenticated |
| POST | `/api/progress/tutorial/{tutorialId}/complete` | Mark tutorial complete | Authenticated |
| GET | `/api/progress/stats` | Get user statistics | Authenticated |

### 5.8 Certificate Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/certificates` | Get user certificates | Authenticated |
| GET | `/api/certificates/{id}` | Get certificate details | Authenticated |
| GET | `/api/certificates/verify/{code}` | Verify certificate | Public |
| GET | `/api/certificates/{id}/download` | Download PDF | Authenticated |

### 5.9 Code Execution Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/execute` | Execute code | Authenticated |
| GET | `/api/execute/languages` | Get supported languages | Public |

### 5.10 Request/Response Examples

```json
// POST /api/auth/login
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "role": "STUDENT"
  }
}

// POST /api/execute
Request:
{
  "language": "python",
  "code": "print('Hello, World!')",
  "input": ""
}

Response:
{
  "output": "Hello, World!\n",
  "executionTime": 0.045,
  "memory": 2048,
  "status": "SUCCESS"
}

// POST /api/exercises/1/submit
Request:
{
  "code": "print('Hello')"
}

Response:
{
  "isCorrect": true,
  "output": "Hello",
  "testResults": [
    {
      "testCase": 1,
      "passed": true,
      "expected": "Hello",
      "actual": "Hello"
    }
  ],
  "pointsEarned": 10
}
```

---

## 6. Code Execution Service

### 6.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CODE EXECUTION SERVICE                              │
│                                                                         │
│  ┌──────────────┐     ┌──────────────┐     ┌────────────────────────┐  │
│  │   Backend    │────►│  API Server  │────►│   Docker Container     │  │
│  │   (React)    │     │  (Spring)    │     │   (Execution Worker)   │  │
│  └──────────────┘     └──────────────┘     └────────────────────────┘  │
│                              │                        │                │
│                              │                        ▼                │
│                              │              ┌────────────────────────┐  │
│                              │              │   Language Runtimes    │  │
│                              │              │   - Python             │  │
│                              │              │   - Node.js            │  │
│                              │              │   - Java               │  │
│                              │              │   - C/C++              │  │
│                              │              │   - Go                 │  │
│                              └──────────────┘                        │  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     SECURITY LAYERS                              │   │
│  │  - Container Isolation (Docker)                                 │   │
│  │  - Resource Limits (CPU, Memory, Time)                          │   │
│  │  - Network Isolation                                            │   │
│  │  - No File System Access                                         │   │
│  │  - No External Network Access                                    │   │
│  │  - Process Sandboxing                                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Supported Languages & Versions

| Language | Version | Container Image |
|----------|---------|------------------|
| Python | 3.11 | `python:3.11-sandbox` |
| JavaScript | Node 20 | `node:20-sandbox` |
| Java | JDK 17 | `openjdk:17-sandbox` |
| C | GCC 12 | `gcc:12-sandbox` |
| C++ | G++ 12 | `g++:12-sandbox` |
| Go | 1.21 | `golang:1.21-sandbox` |
| PHP | 8.2 | `php:8.2-sandbox` |
| Ruby | 3.2 | `ruby:3.2-sandbox` |

### 6.3 Execution Flow

```
User Code Submission
        │
        ▼
┌───────────────────┐
│  Input Validation │
│  - Size limit     │
│  - Language check │
│  - Security scan  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐     ┌─────────────────┐
│  Queue Management │────►│  Container Pool │
│  - Job ID         │     │  - Pre-warmed   │
│  - Priority       │     │  - Reusable     │
└────────┬──────────┘     └────────┬────────┘
         │                         │
         │                         ▼
         │                ┌─────────────────┐
         │                │  Execute Code   │
         │                │  - Run in Docker│
         │                │  - Time limit    │
         │                │  - Memory limit  │
         │                └────────┬────────┘
         │                         │
         ▼                         ▼
┌─────────────────────────────────────────────┐
│              Results Processing             │
│  - Capture stdout/stderr                    │
│  - Measure execution time                    │
│  - Check for malicious behavior              │
│  - Return results                            │
└─────────────────────────────────────────────┘
```

### 6.4 Security Measures

| Security Layer | Implementation |
|----------------|----------------|
| Container Isolation | Each execution runs in isolated Docker container |
| Resource Limits | CPU: 1 core, Memory: 256MB, Time: 5 seconds |
| Network Isolation | No internet access from execution containers |
| File System | Read-only system files, temp workspace only |
| Process Limits | Max 50 processes, no fork bombs |
| Memory Protection | Hard memory limits, OOM killer |
| Malicious Code | Detection of infinite loops, system calls |

### 6.5 Docker Configuration

```yaml
# docker-compose.yml for code execution service
version: '3.8'

services:
  executor:
    image: learning-platform/executor:latest
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 256M
    environment:
      - MAX_EXECUTION_TIME=5000
      - MAX_MEMORY=256
      - MAX_PROCESSES=50
      - ALLOWED_LANGUAGES=python,javascript,java,c,cpp,go,php,ruby
    volumes:
      - ./workspace:/workspace
    networks:
      - execution-network
    cap_drop:
      - ALL
    read_only: true
    tmpfs:
      - /tmp:size=50M
    restart: unless-stopped

  # Pre-warmed containers for faster execution
  executor-python:
    image: python:3.11-sandbox
    deploy:
      replicas: 3
      
  executor-node:
    image: node:20-sandbox
    deploy:
      replicas: 3
```

### 6.6 Implementation Options

#### Option A: Custom Docker-based Solution
- Build custom Docker images for each language
- Implement job queue using Redis
- Use Spring Boot to manage execution requests

#### Option B: Judge0 (Recommended for MVP)
- Open-source online judge API
- Supports 70+ languages
- Built-in sandboxing
- Easy integration

```java
// CodeExecutionService using Judge0
@Service
public class CodeExecutionService {
    
    private final String JUDGE0_API_URL = "https://api.judge0.com";
    
    public ExecutionResult execute(String language, String sourceCode, String input) {
        // Create submission
        Submission submission = createSubmission(language, sourceCode, input);
        
        // Wait for execution
        while (!submission.isCompleted()) {
            submission = getSubmission(submission.getToken());
            Thread.sleep(100);
        }
        
        return mapToResult(submission);
    }
}
```

### 6.7 Code Execution API

```java
@RestController
@RequestMapping("/api/execute")
public class CodeExecutionController {
    
    @PostMapping
    public ResponseEntity<ExecutionResponse> executeCode(
            @Valid @RequestBody ExecutionRequest request,
            @AuthenticationPrincipal User user) {
        
        // Validate input
        validateRequest(request);
        
        // Execute code
        ExecutionResult result = codeExecutionService.execute(
                request.getLanguage(),
                request.getCode(),
                request.getInput()
        );
        
        // Log attempt if user is authenticated
        if (user != null) {
            exerciseAttemptService.logAttempt(user, request, result);
        }
        
        return ResponseEntity.ok(mapToResponse(result));
    }
    
    @GetMapping("/languages")
    public ResponseEntity<List<Language>> getSupportedLanguages() {
        return ResponseEntity.ok(codeExecutionService.getSupportedLanguages());
    }
}
```

---

## 7. Additional Considerations

### 7.1 Scalability

- **Horizontal Scaling**: Use load balancer for multiple backend instances
- **Database**: Implement read replicas for heavy read operations
- **Caching**: Use Redis for frequently accessed content
- **CDN**: Serve static assets via CDN

### 7.2 Monitoring & Logging

- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Metrics**: Prometheus + Grafana
- **Error Tracking**: Sentry
- **Uptime**: Health checks with actuator

### 7.3 CI/CD Pipeline

```
GitHub Actions Workflow:
1. Build Frontend → Docker Image
2. Build Backend → Docker Image  
3. Run Tests
4. Security Scan (OWASP)
5. Deploy to Staging
6. Manual/S自动 Deploy to Production
```

### 7.4 Future Enhancements

- Real-time collaboration in code editor
- AI-powered code suggestions
- Mobile app (React Native)
- Gamification (badges, leaderboards)
- Subscription/Payment integration
- Multi-language support

---

## 8. Summary

This architecture provides a robust foundation for a W3Schools-style learning platform with:

- **Complete separation** between frontend and backend
- **Secure authentication** with JWT
- **Scalable code execution** using Docker containers
- **Comprehensive progress tracking** and certificates
- **RESTful API** design
- **PostgreSQL** database with proper indexing

The system can be deployed using Docker Compose for development and Kubernetes for production scaling.
