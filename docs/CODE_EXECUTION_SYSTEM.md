# Secure Code Execution System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Code Editor (Monaco) │ Output Panel │ Evaluation Panel   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               CodeExecutionController                         │   │
│  │  POST /api/execute        - Execute code                   │   │
│  │  POST /api/execute/evaluate - Execute + AI Evaluation      │   │
│  │  GET  /api/execute/languages - Supported languages         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌───────────────────────────┼───────────────────────────────┐   │
│  │                           ▼                                │   │
│  │  ┌─────────────────┐  ┌────────────────┐  ┌───────────┐ │   │
│  │  │ CodeSecurity    │  │ CodeExecutor    │  │ CodeEval  │ │   │
│  │  │ Scanner        │──▶│ (Docker-based) │  │ Service   │ │   │
│  │  └─────────────────┘  └───────┬────────┘  └─────┬─────┘ │   │
│  │                               │                   │        │   │
│  └───────────────────────────────┼───────────────────┼────────┘   │
└──────────────────────────────────┼───────────────────┼────────────┘
                                   │ Docker API
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DOCKER CONTAINERS (Sandboxed)                    │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ Node.js     │  │ Python      │  │ Java        │                 │
│  │ Container   │  │ Container   │  │ Container   │                 │
│  │             │  │             │  │             │                 │
│  │ Network:    │  │ Network:    │  │ Network:    │                 │
│  │ NONE        │  │ NONE        │  │ NONE        │                 │
│  │ Memory:256m │  │ Memory:256m │  │ Memory:256m │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

## Security Features

### 1. Network Isolation
```
Container Security Options:
✓ --network none           # No network access
✓ --read-only              # Read-only filesystem
✓ --tmpfs /tmp             # Writable /tmp only in memory
✓ --user 1000:1000         # Non-root user
✓ --pids-limit 50          # Limit process count
```

### 2. Resource Limits
- **Memory**: 256MB max per execution
- **CPU**: Limited by container scheduling
- **Processes**: Max 50 per container
- **Execution Time**: 10 seconds timeout
- **Output Size**: 64KB max

### 3. Security Scanning

The `CodeSecurityScanner` blocks dangerous patterns:

| Pattern Type | Description | Action |
|-------------|-------------|--------|
| `FILE_READ` | Reading files (fs.readFile, etc.) | Warning |
| `FILE_WRITE` | Writing files | Warning |
| `FILE_DELETE` | Deleting files | Warning |
| `NETWORK_ACCESS` | HTTP requests, sockets | Warning |
| `COMMAND_EXECUTION` | child_process, exec, Runtime.exec | **BLOCKED** |
| `SHELL_INJECTION` | eval, backticks | **BLOCKED** |
| `CRYPTO_MINING` | Cryptocurrency mining | **BLOCKED** |
| `DANGEROUS_EVAL` | eval() usage | Warning |

### 4. Docker Security Options

```bash
# Security-hardened container run
docker run --rm \
  --network none \           # No network
  --read-only \              # Read-only filesystem
  --tmpfs /tmp:rw,noexec \  # Writable /tmp in memory only
  --memory=256m \           # Memory limit
  --pids-limit=50 \         # Process limit
  --user 1000:1000 \        # Non-root user
  --cap-drop=ALL \          # Drop all capabilities
  --security-opt=no-new-privileges \
  node:20-alpine node -e "console.log('Hello')"
```

## API Endpoints

### Execute Code
```
POST /api/execute
Content-Type: application/json

{
  "code": "console.log('Hello, World!');",
  "language": "JAVASCRIPT"
}

Response:
{
  "success": true,
  "output": "Hello, World!\n",
  "executionTimeMs": 45,
  "exitCode": 0,
  "language": "javascript",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Execute + AI Evaluation
```
POST /api/execute/evaluate

{
  "code": "console.log('Hello!');",
  "language": "JAVASCRIPT",
  "question": "Write a program that prints Hello World",
  "expectedOutput": "Hello World"
}

Response:
{
  "execution": { ... },
  "correct": true,
  "feedback": "Great job! Your code works perfectly.",
  "score": 100,
  "suggestions": [],
  "hints": []
}
```

### Get Supported Languages
```
GET /api/execute/languages

Response:
[
  {"id": "JAVASCRIPT", "name": "javascript", "requiresDocker": true, "available": true},
  {"id": "PYTHON", "name": "python", "requiresDocker": true, "available": true},
  {"id": "JAVA", "name": "java", "requiresDocker": true, "available": true},
  {"id": "HTML", "name": "html", "requiresDocker": false, "available": true},
  {"id": "CSS", "name": "css", "requiresDocker": false, "available": true}
]
```

## Configuration

### application.yml
```yaml
app:
  execution:
    timeout-seconds: 10           # Max execution time
    max-memory-mb: 256           # Memory limit
    max-output-size: 65536        # Output size limit (bytes)
    workspace-path: /tmp/execution # Working directory
    docker:
      enabled: true
      host: unix:///var/run/docker.sock
      network: none              # Network isolation
      container-timeout-ms: 15000
    security:
      scan-for-malicious-code: true
      max-file-size-bytes: 102400
      block-system-calls: true
      block-network-access: true
      block-file-system-access: true
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DOCKER_ENABLED` | true | Enable Docker-based execution |
| `DOCKER_HOST` | unix:///var/run/docker.sock | Docker socket path |
| `EXECUTION_TIMEOUT` | 10 | Timeout in seconds |

## Docker Setup

### Prerequisites
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Add user to docker group (optional, for development)
sudo usermod -aG docker $USER

# Verify Docker is running
docker ps
```

### Pull Base Images
```bash
docker pull node:20-alpine
docker pull python:3.11-slim
docker pull openjdk:17-slim
```

### Run with Docker Compose
```bash
cd docker
docker-compose -f docker-compose.execution.yml up -d
```

## File Structure

```
backend/src/main/java/com/learningplatform/
├── config/
│   └── CodeExecutionConfig.java       # Configuration
├── controller/
│   └── CodeExecutionController.java   # REST endpoints
├── model/
│   └── dto/
│       ├── CodeExecutionRequest.java  # Request DTO
│       └── CodeExecutionResponse.java # Response DTO
└── service/
    ├── CodeSecurityScanner.java       # Security scanning
    ├── CodeExecutor.java              # Executor interface
    ├── CodeEvaluationService.java     # AI evaluation
    └── impl/
        └── DockerCodeExecutor.java    # Docker implementation
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `TIMEOUT` | Code runs > 10s | Optimize code or increase timeout |
| `MEMORY_LIMIT` | Memory > 256MB | Simplify code |
| `SECURITY_BLOCKED` | Dangerous code detected | Remove blocked patterns |
| `LANGUAGE_NOT_SUPPORTED` | Unsupported language | Use supported languages |
| `DOCKER_NOT_AVAILABLE` | Docker not running | Install/start Docker |

## Best Practices

### 1. Code Validation (Frontend)
```javascript
// Validate before sending to backend
const isValidCode = code.length <= 50000 && !hasBlockedPatterns(code);
```

### 2. Progressive Execution
```javascript
// Run smaller test cases first
const testCases = ['small_input', 'medium_input', 'large_input'];
for (const test of testCases) {
  const result = await execute(test);
  if (!result.success) break;
}
```

### 3. Graceful Degradation
```javascript
// Fallback to preview mode if execution fails
const result = await execute(code).catch(() => ({
  success: false,
  output: code, // Return as-is for preview
}));
```

## Monitoring

### Health Check
```bash
curl http://localhost:8080/api/execute/health
```

### Logs
```bash
# View container logs
docker logs learncode-executor

# View application logs
tail -f logs/application.log
```

## Troubleshooting

### Docker Not Available
```bash
# Check Docker status
systemctl status docker

# Start Docker
sudo systemctl start docker

# Enable Docker on boot
sudo systemctl enable docker
```

### Permission Denied
```bash
# Fix Docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

### Out of Memory
```bash
# Increase container memory limit
docker update --memory 512m learncode-executor
```
