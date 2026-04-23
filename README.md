# AROHAN - AI-Powered Voice Screening System

## Overview

AROHAN is an AI-powered voice screening system designed for blue-collar recruitment in India. It uses adaptive voice interviews conducted via IVR and WhatsApp to screen candidates at scale, with automatic scoring and job matching.

## Key Features

- **Adaptive Voice Interviews**: AI-powered Proctor agent conducts 5-minute interviews
- **Automatic Scoring**: Assessor agent generates detailed scorecards (1-100 scale)
- **Job Matching**: Matchmaker agent finds suitable openings based on geography and scores
- **Drop-off Recovery**: Resume interrupted interviews seamlessly
- **Multi-language Support**: 22 Indian languages with Bhashini + Whisper STT
- **IVR + WhatsApp**: No app installation required for candidates

## Technology Stack

- **Backend**: Python 3.12, FastAPI, LangGraph
- **Database**: PostgreSQL, Redis, RabbitMQ
- **Task Queue**: Celery with RabbitMQ
- **STT**: Bhashini (primary), OpenAI Whisper (fallback)
- **Vector Store**: Pinecone for trait embedding
- **Frontend**: Next.js 14 + shadcn/ui (dashboard)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.12 (for local development)
- PostgreSQL 15, Redis 7, RabbitMQ 3.12

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ravikumarve/Arohan.git
   cd Arohan
   ```

2. **Configure environment variables**
   ```bash
   cp config/.env.template config/.env
   # Edit config/.env with your API keys and configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Check service health**
   ```bash
   curl http://localhost:8000/health
   ```

### Local Development

1. **Create virtual environment**
   ```bash
   python3.12 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start services**
   ```bash
   # Terminal 1: FastAPI server
   uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

   # Terminal 2: Celery worker
   celery -A src.tasks worker --loglevel=info

   # Terminal 3: Celery beat
   celery -A src.tasks beat --loglevel=info
   ```

## Project Structure

```
AROHAN/
├── src/
│   ├── api/              # FastAPI routes and endpoints
│   ├── agents/           # AI agent implementations
│   ├── nlp/              # NLP and STT processing
│   ├── tasks/            # Celery tasks
│   ├── db/               # Database models and sessions
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic services
│   └── utils/            # Utilities and helpers
├── tests/                # Test suites
├── docs/                 # Documentation
├── config/               # Configuration files
├── docker-compose.yml    # Docker services
├── Dockerfile           # Container image
└── requirements.txt    # Python dependencies
```

## API Documentation

Once the service is running, access the API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Key Endpoints

### Campaign Management
- `POST /api/v1/campaigns/` - Create screening campaign
- `GET /api/v1/campaigns/` - List campaigns
- `GET /api/v1/campaigns/{id}` - Get campaign details

### Candidate Management
- `GET /api/v1/candidates/` - List candidates
- `GET /api/v1/candidates/{id}` - Get candidate details
- `POST /api/v1/candidates/{id}/shortlist` - Shortlist candidate
- `POST /api/v1/candidates/{id}/reject` - Reject candidate

### Requisition Management
- `POST /api/v1/requisitions/` - Create job requisition
- `GET /api/v1/requisitions/` - List requisitions
- `GET /api/v1/requisitions/{id}` - Get requisition details

### Agent Orchestration
- `POST /api/v1/agents/proctor/start` - Start interview session
- `POST /api/v1/agents/proctor/{id}/continue` - Continue interview
- `POST /api/v1/agents/assessor/evaluate` - Evaluate candidate
- `POST /api/v1/agents/matchmaker/find` - Find matching jobs

## Testing

Run the test suite:

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src --cov-report=term-missing

# Run specific test categories
pytest tests/agents/ -v
pytest tests/integration/ -v
```

## Monitoring

### Health Checks
- Basic health: `GET /health`
- Detailed health: `GET /health/detailed`
- Readiness check: `GET /health/readiness`
- Liveness check: `GET /health/liveness`

### Metrics
Prometheus metrics are available at: `http://localhost:8000/metrics`

### Logs
Structured logs are output in JSON format for production and console format for development.

## Configuration

Key environment variables (see `config/.env.template` for complete list):

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/arohan

# Redis
REDIS_URL=redis://:password@localhost:6379/0

# RabbitMQ
RABBITMQ_URL=amqp://user:pass@localhost:5672//arohan

# External APIs
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
META_ACCESS_TOKEN=your_meta_token
BHASHINI_API_KEY=your_bhashini_key
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
```

## Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Build and push Docker images**
   ```bash
   docker-compose build
   docker-compose push
   ```
3. **Deploy to production server**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### CI/CD Pipeline

The project includes a GitHub Actions CI/CD pipeline that:
- Runs security scans (Safety, Bandit)
- Performs code quality checks (Black, Flake8, MyPy)
- Executes unit and integration tests
- Builds Docker images
- Deploys to development/production environments

## Development Workflow

1. **Feature Development**
   - Create feature branch from `develop`
   - Implement changes following API specification
   - Write tests for new functionality
   - Submit pull request to `develop`

2. **Code Review**
   - Automated checks must pass
   - Manual review by team members
   - Address feedback and update

3. **Deployment**
   - Merge to `develop` for staging deployment
   - Merge to `main` for production deployment

## Performance Targets

- API response time (p95): <200ms
- Database query average: <100ms
- Candidate list endpoint: <800ms
- Scorecard retrieval: <500ms
- Shortlist action: <300ms

## Security

- JWT authentication with RS256
- Role-based access control (Admin/Viewer)
- Multi-tenant isolation with company_id
- Rate limiting and CORS protection
- Encrypted data at rest and in transit

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: https://docs.arohan.ai
- **Status Page**: https://status.arohan.ai
- **GitHub Issues**: https://github.com/ravikumarve/Arohan/issues
- **Email**: api-support@arohan.ai

## Acknowledgments

- Bhashini API for Indian language STT
- OpenAI Whisper for fallback STT
- LangGraph for agent orchestration
- FastAPI for the web framework

---

**No resume required. No dashboard needed. Just a phone and a voice.**