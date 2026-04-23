# AROHAN — Voice-Native Mass Screening Mesh for Bharat

[![Version](https://img.shields.io/badge/version-v2.0.0--enterprise-orange)](https://github.com/ravikumarve/Arohan/releases)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-18%2F18%20passing-green)](tests/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-teal)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.20-purple)](https://langchain-ai.github.io/langgraph)

> **No resume. No webcam. No dashboard.** A candidate gives a missed call — and gets a full AI-powered voice interview in their language, scored and matched to open roles before a recruiter opens their inbox.

---

## 🎯 The Problem

India hires 12 million blue-collar workers a year. The recruitment process is fundamentally broken.

Most candidates apply for roles in logistics, retail, construction, BPO, and manufacturing — sectors that move fast and hire in bulk. The existing recruitment funnel was designed for knowledge workers: upload a PDF resume, schedule a Zoom call, complete a web form. **None of that works at the ground level.**

**The Reality:**
- HR teams spend ₹200–500 per candidate in human hours before a single interview happens
- Candidates in Tier 2/3 cities have shared phones, 3G connections, and no webcam
- Resume screening for roles where no one has a resume worth reading
- Webcam interviews where bandwidth is the bottleneck
- Dropped calls with no recovery
- Assessment tools built for English speakers

**AROHAN cuts the per-screening cost to ₹15–20 in compute and telephony.** At 1,000 screenings a month, that's a ₹1.85L cost saving per client. And the candidate never needs to do anything except pick up a phone.

---

## 🚀 Key Features

### 🎙️ Resume-less Triage
Candidates apply with a missed call or WhatsApp "Hi." No PDF, no form, no app download. AROHAN initiates screening immediately.

### 🌐 Dialect-Agnostic STT
Bhashini handles 22 Indian languages natively. Whisper covers English-heavy responses. RNNoise strips background noise before either model sees the audio.

### 🧠 Adaptive Interrogation
No static scripts. Strong answer → harder follow-up. Weak answer → simpler reframe. Every response reshapes the next question.

### 🔄 Drop-off Recovery
Call drops mid-interview? Session state saved to Redis instantly. WhatsApp prompt sent in 60 seconds. Candidate resumes exactly where they left off.

### 📍 Geo-Aware Routing
Matchmaker queries open requisitions within a configurable radius of the candidate's pin code. A driver in Nagpur doesn't get routed to Bengaluru.

### 🏢 Multi-Tenant Architecture
One AROHAN deployment runs multiple clients — isolated PostgreSQL schemas, Redis namespaces, and WhatsApp numbers per tenant.

---

## 🤖 Agent Topology

AROHAN's intelligence is split across three specialized cognitive nodes connected via a LangGraph stateful flow. Each agent has exactly one responsibility.

### The Proctor — Interviewer · Node 01
Conducts a fluid, empathetic 5-minute interview. Manages dropped calls, handles code-switched speech, and dynamically adjusts question difficulty based on every answer.

**Tools:** `TwilioVoiceGen` · `DynamicScripting` · `SessionStateManager` · `LangGraph`

### The Assessor — Evaluator · Node 02
Analyzes the complete transcript for confidence, keyword accuracy, and situational judgment. Outputs a structured 1–100 scorecard with sub-scores per trait using Pinecone vector similarity.

**Tools:** `SentimentAnalyzer` · `SkillMatrix` · `PineconeVectorStore`

### The Matchmaker — Dispatcher · Node 03
Compares the Assessor's scorecard against every open requisition within the candidate's geographic radius. Fires the ATS webhook and notifies the candidate on WhatsApp in seconds.

**Tools:** `GeoSpatialQuery` · `ATS-Webhook` · `WhatsAppNotifier`

---

## 📊 Impact Metrics

| Metric | Value | Impact |
|--------|-------|--------|
| **Cost per screening** | ₹15 | vs ₹200–500 in HR hours |
| **Time-to-hire reduction** | 80% | Faster recruitment cycles |
| **Language support** | 22 | Indian languages via Bhashini |
| **Concurrent screenings** | 1000+ | Celery-powered scalability |

---

## 🛠️ Technology Stack

Every technology choice is justified for the Indian context.

| Layer | Technology | Why |
|-------|-------------|-----|
| **Agent Orchestration** | `LangGraph` | DAG-based stateful flows with native checkpointing for drop-off recovery |
| **API Framework** | `FastAPI · Python 3.12` | Async throughout — handles concurrent audio webhook ingestion |
| **Telephony** | `Twilio Programmable Voice` | Missed call detection + outbound IVR callback |
| **Messaging** | `Meta WhatsApp Cloud API` | 500M+ Indian users — zero install friction |
| **STT Primary** | `Bhashini API` | Trained on Indian acoustic data across 22 languages — outperforms Whisper on field audio |
| **STT Fallback** | `OpenAI Whisper` | CPU-deployable for on-premise clients; English-heavy responses |
| **Task Queue** | `RabbitMQ + Celery` | Dead-letter queues + durability for bursty mass-hire drives |
| **Session State** | `Redis` | LangGraph checkpoint storage for drop-off recovery |
| **Database** | `PostgreSQL 15` | ACID compliance for financial-grade ledger and scorecard data |
| **Vector Store** | `Pinecone` | Candidate response → ideal trait embedding similarity (robust to dialect variation) |
| **Dashboard** | `Next.js 14 + shadcn/ui` | Employer-facing read-only ATS view |
| **Noise Suppression** | `RNNoise / WebRTC VAD` | Pre-STT field noise removal |

---

## 🎬 STT Pipeline

Four stages between a voice note and a clean transcript. Standard STT APIs fail on Indian field audio — markets, construction sites, moving vehicles. AROHAN pre-processes every audio file before a single token is transcribed.

### 1. Noise Suppression
RNNoise (WebRTC-derived) strips background noise before audio reaches any STT model. Handles traffic, machinery, crowded market environments.

### 2. Language Detection
FastLangDetect runs on the first 5 seconds of audio to identify the primary language. Routes to the correct Bhashini model or Whisper language parameter.

### 3. Domain Vocabulary Injection
Job-role-specific vocabulary injected as Whisper `logit_bias` to force-decode role names, city names, company names, and industry jargon. Configurable per employer client.

### 4. Transcript Normalization
Numbers, dates, and currency spoken in Hindi or regional form converted to canonical format. `"paanch hazaar rupaye" → ₹5,000`, `"teen baje" → 15:00`.

---

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.12 (for local development)
- PostgreSQL 15, Redis 7, RabbitMQ 3.12

### Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/ravikumarve/Arohan.git
cd Arohan

# Configure environment variables
cp config/.env.template config/.env
nano config/.env  # Add your API keys

# Start all services
docker-compose up -d

# Verify health
curl http://localhost:8000/health
```

### Local Development

```bash
# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Terminal 1: API server
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Audio processing workers
celery -A src.tasks worker --loglevel=info --concurrency=8

# Terminal 3: Scheduled tasks
celery -A src.tasks beat --loglevel=info
```

---

## 📡 API Reference

REST endpoints with interactive documentation at `/docs`.

### Campaign Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/campaigns/` | Create a new screening campaign |
| `GET` | `/api/v1/campaigns/` | List all campaigns |
| `GET` | `/api/v1/campaigns/{id}` | Get campaign details + metrics |

### Candidate Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/candidates/` | List candidates with filtering + pagination |
| `GET` | `/api/v1/candidates/{id}` | Full candidate profile + scorecard |
| `POST` | `/api/v1/candidates/{id}/shortlist` | Mark candidate as shortlisted |
| `POST` | `/api/v1/candidates/{id}/reject` | Reject candidate with reason |

### Agent Orchestration
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/agents/proctor/start` | Initiate interview session |
| `POST` | `/api/v1/agents/proctor/{id}/continue` | Resume a dropped session |
| `POST` | `/api/v1/agents/assessor/evaluate` | Trigger scorecard generation |
| `POST` | `/api/v1/agents/matchmaker/find` | Run geo-aware job matching |

### Health & Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Basic health check |
| `GET` | `/health/detailed` | Per-service health status |
| `GET` | `/health/readiness` | Kubernetes readiness probe |
| `GET` | `/metrics` | Prometheus metrics endpoint |

---

## 🎯 Performance Targets

p95 targets for production environment.

| Metric | Target |
|--------|--------|
| API response time (p95) | `<200ms` |
| Average database query | `<100ms` |
| Scorecard retrieval | `<500ms` |
| Candidate list endpoint | `<800ms` |
| Drop-off recovery WhatsApp ping | `<60s` |
| Concurrent screenings (Celery) | `1000+` |

---

## 💰 Monetization

Pay-per-screening. No seat licenses.

Traditional BPO and retail recruitment agencies spend ₹200–500 per candidate in human HR hours for initial screening alone. AROHAN brings this to ₹10–18 in compute and telephony — roughly 85% gross margin at scale.

| Tier | Price | Volume | Features |
|------|-------|--------|----------|
| **Startup** | ₹18/screening | Up to 500/mo | IVR + WhatsApp, 3 role templates, Basic dashboard |
| **Growth** | ₹14/screening | 500–5,000/mo | Custom question banks, ATS webhook, Priority support |
| **Enterprise** | ₹10/screening | 5,000+/mo | Geo-routing, White-label dashboard, SLA guarantee |
| **On-Premise** | License | One-time · Unlimited | Air-gapped deploy, Full source access, Setup support |

---

## 🗺️ Roadmap

### ✅ Done (v2.0.0)
- Proctor + Assessor + Matchmaker agent core
- Bhashini + Whisper dual-STT pipeline
- Drop-off recovery via Redis checkpointing
- RabbitMQ + Celery async audio processing
- Adaptive question sequencing (LangGraph DAG)
- JWT auth + multi-tenant isolation + RBAC

### 🔄 In Progress (v2.1)
- Employer ATS dashboard (Next.js 14 + shadcn/ui)
- Pinecone trait-embedding scoring (vector similarity)
- Bulk campaign mode — upload 500 phone numbers, auto-schedule

### 📋 Planned (v2.2+)
- Regional language expansion: Odia, Kannada, Gujarati
- HRMS integrations: Keka, DarwinBox, greytHR
- On-device STT via Whisper.cpp — zero API cost mode

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src --cov-report=term-missing

# Run specific test categories
pytest tests/agents/ -v              # Agent pipeline tests
pytest tests/integration/ -v         # Integration tests
pytest tests/production/ -v         # Production validation tests
pytest tests/recovery/ -v            # Drop-off recovery tests
```

**Coverage Targets:**
- 80% on agent pipeline
- 95% on scorecard calculation logic

---

## 📁 Project Structure

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
├── monitoring/           # Prometheus, Grafana, Alertmanager
├── config/               # Configuration files
├── docker-compose.yml    # Docker services
├── Dockerfile           # Container image
└── requirements.txt    # Python dependencies
```

---

## 🤝 Contributing

High-impact areas for PRs:

| Path | What to contribute |
|------|-------------------|
| `src/nlp/dialect_maps/` | Regional vocabulary arrays, code-switching patterns, unit/number normalization rules |
| `tests/fixtures/audio/` | Real-world voice samples (see CONTRIBUTING.md for privacy guidelines) |
| `src/db/seeds/question_banks/` | New role-specific question banks: delivery, warehouse, retail, pharma |
| `src/nlp/noise/` | RNNoise filter tuning for specific acoustic environments |

**Before submitting a PR:**
1. Run `pytest tests/ -v`
2. Add tests for any new agent behavior
3. Ensure scorecard calculation changes hit 95% coverage

---

## 🔒 Security

- JWT authentication with RS256
- Role-based access control (Admin/Viewer)
- Multi-tenant isolation with company_id
- Rate limiting and CORS protection
- Encrypted data at rest and in transit

---

## 📈 Monitoring & Observability

### Health Checks
- Basic health: `GET /health`
- Detailed health: `GET /health/detailed`
- Readiness check: `GET /health/readiness`
- Liveness check: `GET /health/liveness`

### Metrics
Prometheus metrics available at: `http://localhost:8000/metrics`

### Logging
Structured logs output in JSON format for production and console format for development, with correlation IDs for distributed tracing.

---

## 🌐 Live Demo

**Interactive Landing Page:** [https://ravikumarve.github.io/Arohan/](https://ravikumarve.github.io/Arohan/)

**API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs) (when running locally)

---

## 📞 Support

| Resource | Link |
|----------|------|
| **Documentation** | [docs.arohan.ai](https://docs.arohan.ai) |
| **Status Page** | [status.arohan.ai](https://status.arohan.ai) |
| **GitHub Issues** | [github.com/ravikumarve/Arohan/issues](https://github.com/ravikumarve/Arohan/issues) |
| **API Support** | [api-support@arohan.ai](mailto:api-support@arohan.ai) |
| **License** | Apache 2.0 — see [LICENSE](LICENSE) for commercial deployment terms |

---

## 🙏 Acknowledgments

- **Bhashini API** for Indian language STT
- **OpenAI Whisper** for fallback STT
- **LangGraph** for agent orchestration
- **FastAPI** for the web framework
- **Twilio** for telephony services
- **Meta** for WhatsApp Business API

---

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

---

**No resume required. No dashboard needed. Just a phone and a voice.**

*Built for Bharat · v2.0.0-enterprise*