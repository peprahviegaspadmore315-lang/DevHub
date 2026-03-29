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
AI_PROVIDER=gemini
AI_OPENAI_URL=https://api.openai.com/v1/responses
AI_MODEL=gpt-5.4
```

### 3. Get API Keys

**OpenAI API Key (recommended):**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to `OPENAI_API_KEY` in `.env`
4. Set `AI_PROVIDER=openai` if you want to use OpenAI instead of Gemini

**Gemini API Key (recommended free-tier option):**
1. Go to https://aistudio.google.com/apikey
2. Create an API key
3. Copy it to `GEMINI_API_KEY` in `.env`
4. Keep `AI_PROVIDER=gemini`

### 4. Run the Application

If you use the desktop shortcut or `OPEN_LOCAL_APP.cmd`, the launcher now loads `backend/.env` automatically before it starts the backend.

```bash
# Manual startup
export $(cat .env | xargs) && mvn spring-boot:run

# Or use Maven with environment variables
JWT_SECRET=your_secret GEMINI_API_KEY=your_key AI_PROVIDER=gemini mvn spring-boot:run
```

---

## Security Best Practices

### DO ✅
- Store secrets in `.env` file (excluded from git)
- Use strong, random JWT secrets (256+ bits)
- Rotate API keys periodically
- Use different configs for dev, staging, and production

### DON'T ❌
- Commit `.env` files to version control
- Hardcode secrets in source code
- Share API keys via chat or email
- Use weak JWT secrets

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key |
| `GEMINI_API_KEY` | Yes* | - | Google Gemini API key |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `DB_PASSWORD` | No | postgres | Database password |
| `AI_ENABLED` | No | true | Enable AI features |
| `AI_PROVIDER` | No | gemini | AI provider: `openai` or `gemini` |
| `AI_OPENAI_URL` | No | `https://api.openai.com/v1/responses` | OpenAI endpoint |
| `AI_MODEL` | No | `gpt-5.4` | OpenAI model |
| `CORS_ALLOWED_ORIGINS` | No | localhost:5173,3000 | Allowed frontend URLs |

*At least one real AI API key is required for live chat functionality

---

## Production Deployment

For production, use proper secret management:

### Docker
```bash
docker run -e OPENAI_API_KEY=your_key \
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
  OPENAI_API_KEY: your_key
  JWT_SECRET: your_secret
```

### Environment File (Production)
Never commit this file!
```env
OPENAI_API_KEY=actual_key_here
JWT_SECRET=actual_secret_here
DB_PASSWORD=actual_password_here
```
