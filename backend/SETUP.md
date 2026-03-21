# ===========================================
# Setup Instructions for Learning Platform
# ===========================================

## Quick Start

### 1. Copy Environment Template

```bash
cd backend
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and set your values:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_random_secret_key_at_least_256_bits

# Optional (with defaults)
DB_PASSWORD=postgres
AI_ENABLED=true
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Get API Keys

**Gemini API Key:**
1. Go to https://aistudio.google.com/apikey
2. Create an API key
3. Copy to GEMINI_API_KEY in .env

**OpenAI API Key (alternative):**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy to OPENAI_API_KEY in .env

### 4. Run the Application

```bash
# Load environment variables and start
export $(cat .env | xargs) && mvn spring-boot:run

# Or use Maven with environment variables
JWT_SECRET=your_secret GEMINI_API_KEY=your_key mvn spring-boot:run
```

---

## Security Best Practices

### DO ✅
- Store secrets in `.env` file (excluded from git)
- Use strong, random JWT secrets (256+ bits)
- Rotate API keys periodically
- Use different configs for dev/staging/prod

### DON'T ❌
- Commit `.env` files to version control
- Hardcode secrets in source code
- Share API keys via chat/email
- Use weak JWT secrets

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes* | - | Google Gemini API key |
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `DB_PASSWORD` | No | postgres | Database password |
| `AI_ENABLED` | No | true | Enable AI features |
| `AI_PROVIDER` | No | gemini | AI provider: `gemini` or `openai` |
| `CORS_ALLOWED_ORIGINS` | No | localhost:5173,3000 | Allowed frontend URLs |

*At least one AI API key is required for chat functionality

---

## Production Deployment

For production, use proper secret management:

### Docker
```bash
docker run -e GEMINI_API_KEY=your_key \
           -e JWT_SECRET=your_secret \
           -e DB_PASSWORD=your_db_pass \
           learning-platform:latest
```

### Kubernetes
Use Kubernetes Secrets for sensitive values:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: learning-platform-secrets
type: Opaque
stringData:
  GEMINI_API_KEY: your_key
  JWT_SECRET: your_secret
```

### Environment File (Production)
Never commit this file!
```env
GEMINI_API_KEY=actual_key_here
JWT_SECRET=actual_secret_here
DB_PASSWORD=actual_password_here
```
