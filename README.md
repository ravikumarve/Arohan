# ⛰️ AROHAN
### Voice-Native Mass Screening Mesh for Bharat

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Release](https://img.shields.io/badge/Release-v2.0.0--enterprise-purple.svg)
![Framework](https://img.shields.io/badge/Framework-FastAPI%20%7C%20LangGraph-brightgreen.svg)
![Market](https://img.shields.io/badge/Market-India_Tier_2%2F3-orange.svg)
![STT](https://img.shields.io/badge/STT-Whisper%20%7C%20Bhashini-yellow.svg)
![Tests](https://img.shields.io/badge/Tests-pytest--asyncio-green.svg)

> **AROHAN** *(Sanskrit: Ascension / To Rise)* is a high-volume, headless recruitment and triage engine for the Indian entry-level and grey-collar workforce.

No resume. No webcam. No dashboard login. A candidate sends a "Hi" on WhatsApp or gives a missed call — AROHAN takes it from there. A dynamic, dialect-aware 5-minute voice interview runs autonomously, produces a structured scorecard, and routes the candidate to the right open requisition — all before a human recruiter has opened their inbox.

---

## The Problem AROHAN Solves

India produces 12 million new workforce entrants per year. The majority apply for roles in logistics, retail, construction, BPO, and manufacturing — sectors that move fast and hire in bulk. The existing process:

- HR calls a candidate. Candidate doesn't pick up. Repeat 3 days.
- Resume screening for roles where no one has a resume worth reading.
- Webcam interviews in villages with 3G connectivity and shared phones.
- Rs. 200–500 spent per candidate in human HR hours — before a single interview.

AROHAN cuts that to Rs. 15–20 in compute and telephony. At 1,000 screenings a month, that is a Rs. 1.85L cost saving per client.

---

## Enterprise Architecture

AROHAN is designed for hostile network conditions: 3G/4G connections, high background noise, code-switched speech, and dropped calls. Every architectural decision accounts for this.

```text
                    +--------------------------------------------+
                    |            CANDIDATE INBOUND               |
                    |                                            |
                    |  Missed Call --> Twilio IVR callback       |
                    |  WhatsApp "Hi" --> Meta Cloud API          |
                    |  WhatsApp Voice Note --> Meta Cloud API    |
                    +--------------------+-----------------------+
                                         |
                                         v
                    +--------------------------------------------+
                    |            INBOUND GATEWAY                 |
                    |  FastAPI · Webhook verification            |
                    |  Twilio signature validation               |
                    |  Session init · Candidate lookup/create    |
                    +--------------------+-----------------------+
                                         |
                                         v
                    +--------------------------------------------+
                    |          RABBITMQ / CELERY BUS             |
                    |  Async audio processing queue              |
                    |  Handles mass-hire spikes (1000+ concurrent)|
                    +----------+-------------------+------------+
                               |                   |
              +----------------v------+ +----------v------------------+
              |  NOISE SUPPRESSOR     | |    STT ENGINE               |
              |  (RNNoise / WebRTC)   | |  Bhashini API (primary)     |
              |  Pre-processing       | |  Whisper (fallback / local) |
              +--------------+--------+ +----------+------------------+
                             +----------+----------+
                                        | Cleaned transcript
                                        v
                    +--------------------------------------------+
                    |           THE PROCTOR AGENT                |
                    |  Stateful LangGraph flow                   |
                    |  Dynamic question sequencing               |
                    |  Drop-off recovery · Call resume           |
                    |  Multilingual response handling            |
                    +--------------------+-----------------------+
                                         | Completed transcript + metadata
                                         v
                    +--------------------------------------------+
                    |           THE ASSESSOR AGENT               |
                    |  Trait extraction via Pinecone similarity  |
                    |  Confidence scoring · Keyword accuracy     |
                    |  Situational judgment rubric               |
                    |  Output: structured 1-100 scorecard        |
                    +--------------------+-----------------------+
                                         |
                                         v
                    +--------------------------------------------+
                    |          THE MATCHMAKER AGENT              |
                    |  Geo-radius requisition matching           |
                    |  ATS webhook dispatch                      |
                    |  Candidate WhatsApp result notification    |
                    +----------+----------------------------+----+
                               |                            |
              +----------------v---------+  +--------------v-----------+
              |   EMPLOYER DASHBOARD     |  |   CANDIDATE WHATSAPP     |
              |   Next.js + shadcn/ui    |  |   "You've been           |
              |   ATS integration        |  |    shortlisted for..."   |
              +--------------------------+  +--------------------------+
```

---

## Core Differentiators

### Resume-less Triage
Candidates apply with a missed call or a WhatsApp "Hi." No PDF, no form, no app download. AROHAN initiates the screening immediately in the candidate's preferred language.

### Dialect-Agnostic Processing
Integrates with Bhashini (Government of India's translation API) as the primary STT layer, with Whisper as fallback. Handles English, Hindi, Hinglish, Tamil-English, Marathi-Hindi, and Bengali-Hindi code-switching. Regional acoustic models account for background noise common in field environments — traffic, machinery, market noise.

### Adaptive Interrogation
The Proctor does not run a static script. Every answer reshapes the next question. A candidate who handles a sales objection scenario confidently gets a harder follow-up. A candidate who struggles gets a simpler reframe. This produces a far more accurate signal than any fixed questionnaire.

### Drop-off Recovery Protocol
Call drops are a daily reality in Tier 2/3 markets. When a session is interrupted, AROHAN saves state to Redis and sends a WhatsApp voice note within 60 seconds: "Koi baat nahi — jahan chhoda wahan se shuru karte hain." The candidate resumes exactly where they left off.

### Geo-Aware Routing
The Matchmaker queries open requisitions within a configurable radius of the candidate's pin code. A driver in Nagpur does not get routed to a job in Bengaluru. Matching accounts for role, score threshold, shift preference, and geography.

---

## Agent Topology

Three specialized cognitive nodes. Each has one job.

| Designation | Agent Name | Core Directive | Primary Tools |
|---|---|---|---|
| Interviewer | **The Proctor** | Conduct a fluid, empathetic 5-minute interview. Manage interruptions, handle colloquialisms, dynamically adjust difficulty. | TwilioVoiceGen, DynamicScripting, SessionStateManager |
| Evaluator | **The Assessor** | Analyze transcript for confidence, keyword accuracy, and situational judgment. Output structured 1-100 scorecard with sub-scores per trait. | SentimentAnalyzer, SkillMatrix, PineconeVectorStore |
| Dispatcher | **The Matchmaker** | Compare scorecard against open requisitions in candidate's geographic radius. Trigger ATS webhook and notify candidate. | GeoSpatialQuery, ATS-Webhook, WhatsAppNotifier |

### Agent State Contract

All agents share a single `CandidateSession` object persisted to Redis. No agent maintains local state.

```python
class CandidateSession(BaseModel):
    session_id: str                     # UUID — idempotency key
    candidate_phone: str                # E.164 format
    candidate_pin_code: str
    language_detected: str              # e.g. "hi-IN", "ta-IN"
    inbound_channel: str                # "ivr" | "whatsapp_audio" | "whatsapp_text"
    interview_state: dict               # LangGraph checkpoint — drop-off recovery
    transcript_segments: List[dict]     # [{speaker, text, timestamp, confidence}]
    scorecard: Optional[Scorecard]      # Populated by Assessor on completion
    matched_requisition_id: Optional[str]
    drop_off_count: int                 # Number of interruptions/recoveries
    created_at: datetime
    last_active_at: datetime

class Scorecard(BaseModel):
    overall_score: float                # 1-100
    communication_score: float
    domain_knowledge_score: float
    situational_judgment_score: float
    confidence_score: float
    language_fluency: str               # "native" | "proficient" | "functional"
    assessor_notes: str
    recommended_roles: List[str]
    shortlist_flag: bool                # True if overall_score >= client threshold
```

---

## STT Pipeline: Bhashini + Whisper

Standard STT APIs fail on Indian field audio. AROHAN adds four pre/post-processing stages:

**Stage 1 — Noise Suppression.** RNNoise strips background noise before audio hits any STT model. Critical for candidates calling from markets, construction sites, or moving vehicles.

**Stage 2 — Language Detection.** FastLangDetect runs on the first 5 seconds of audio to identify the primary language and route to the appropriate Bhashini model or Whisper language parameter.

**Stage 3 — Domain Vocabulary Injection.** Job-role-specific vocabulary is injected as Whisper `logit_bias` to force-decode terms the model would otherwise mishear — role names, city names, company names, industry jargon. Configurable per employer client.

**Stage 4 — Transcript Normalization.** Numbers, dates, and currency spoken in Hindi or regional form are converted to canonical format (`"paanch hazaar rupaye" → Rs. 5,000`, `"teen baje" → 15:00`).

Fine-tune dialect arrays live in `src/nlp/dialect_maps/` — the highest-value area for community contributions.

---

## Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Core Engine | Python 3.12 · FastAPI · LangGraph | Stateful agent flows via LangGraph checkpoints |
| Telephony | Twilio Programmable Voice | IVR callback on missed call |
| Messaging | Meta WhatsApp Cloud API | Audio + text inbound/outbound |
| STT Primary | Bhashini API (Govt of India) | 22 scheduled languages, free tier available |
| STT Fallback | OpenAI Whisper (CPU/GPU) | Local deployment for air-gapped clients |
| Noise Suppression | RNNoise / WebRTC VAD | Pre-processing before STT |
| Vector Store | Pinecone | Response-to-ideal-trait embedding similarity |
| Task Queue | RabbitMQ + Celery | Async audio processing, handles mass-hire spikes |
| Session State | Redis | LangGraph checkpoints, drop-off recovery |
| Database | PostgreSQL | Candidates, requisitions, scorecards, audit trail |
| Dashboard | Next.js 14 + shadcn/ui | Employer-facing ATS view — read-only scorecards |
| Testing | pytest + pytest-asyncio | Async agent pipeline + audio fixture tests |

---

## Deployment Pipeline

### Prerequisites

```bash
sudo apt update && sudo apt install -y \
  python3.12 python3.12-venv \
  ffmpeg \
  redis-server \
  rabbitmq-server \
  postgresql-15
```

### Core Installation

```bash
git clone https://github.com/your-org/arohan-core.git
cd arohan-core
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Environment Variables

```bash
cp config/.env.template config/.env
nano config/.env
```

```env
# Telephony
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# WhatsApp
META_APP_ID=
META_APP_SECRET=
META_PHONE_NUMBER_ID=
META_VERIFY_TOKEN=
META_ACCESS_TOKEN=

# STT
BHASHINI_API_KEY=               # Free key at bhashini.ai
OPENAI_API_KEY=                 # Whisper fallback
WHISPER_MODEL_SIZE=medium       # base | small | medium | large-v3

# Vector Store
PINECONE_API_KEY=
PINECONE_INDEX_NAME=arohan-traits

# Infrastructure
DATABASE_URL=postgresql://arohan_user:pass@localhost/arohan_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672/

# Screening Config
MAX_INTERVIEW_DURATION_SECONDS=360
DROP_OFF_RECOVERY_WINDOW_SECONDS=60
DEFAULT_SHORTLIST_THRESHOLD=65      # Minimum scorecard to flag shortlisted
DEFAULT_GEO_RADIUS_KM=50
```

### Launch Services

```bash
# Terminal 1: FastAPI inbound gateway
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4

# Terminal 2: Celery workers (audio processing)
celery -A src.tasks worker --loglevel=info --concurrency=8

# Terminal 3: Celery beat (scheduled — aging alerts, requisition expiry)
celery -A src.tasks beat --loglevel=info
```

### Production: Docker Compose

```bash
docker compose up --build -d
# Starts: FastAPI, Celery worker, Celery beat, Redis, RabbitMQ, PostgreSQL
```

---

## Question Bank Structure

The Proctor pulls questions from a structured bank in PostgreSQL. Each question carries routing logic for adaptive sequencing.

```python
class Question(BaseModel):
    question_id: str
    role_tags: List[str]            # ["sales", "logistics", "bpo"]
    difficulty: int                 # 1-5
    language_variants: dict         # {"hi": "...", "en": "...", "ta": "..."}
    expected_keywords: List[str]    # Used by Assessor for keyword accuracy scoring
    follow_up_if_strong: str        # question_id of harder follow-up
    follow_up_if_weak: str          # question_id of easier reframe
    ideal_response_embedding: List[float]   # Pinecone vector for similarity scoring
```

Seed question banks for Sales, Logistics, Retail, and BPO roles ship in `src/db/seeds/question_banks/`.

---

## Monetization & SaaS Strategy

AROHAN operates on a **Pay-per-Screening** API model.

| Tier | Price | Volume | Features |
|---|---|---|---|
| Startup | Rs. 18/screening | Up to 500/month | IVR + WhatsApp, 3 role templates |
| Growth | Rs. 14/screening | 500–5,000/month | + Custom question bank, ATS webhook |
| Enterprise | Rs. 10/screening | 5,000+/month | + Geo-routing, white-label dashboard, SLA |
| On-Premise | One-time license | Unlimited | Air-gapped deployment for large enterprises |

Unit economics at scale: 10,000 screenings/month at Rs. 14 = Rs. 1.4L revenue. Compute + telephony cost approximately Rs. 1.5–2/screening. Gross margin: ~85%.

Target buyers: staffing agencies, large retail chains, logistics companies (Delhivery, Ecom Express), BPO operators.

---

## Testing

```bash
# Full suite
pytest tests/ -v --tb=short

# Agent pipeline (async)
pytest tests/agents/ -v

# STT + NLP processing
pytest tests/nlp/ -v

# Drop-off recovery scenarios
pytest tests/recovery/ -v

# Coverage
pytest tests/ --cov=src --cov-report=term-missing
```

**Audio test fixtures** in `tests/fixtures/audio/` — 60+ real-world voice samples across Hindi, Hinglish, Tamil-English, and Marathi-Hindi covering clean answers, noisy background, code-switched responses, mid-sentence drop-offs, and low-bandwidth compressed audio artifacts.

Coverage targets: **80%** on agent pipeline, **95%** on scorecard calculation logic.

---

## Sample Screening Flow

```
Candidate --> gives missed call to +91-XXXXXXXX

AROHAN --> detects missed call via Twilio webhook
       --> initiates outbound IVR call within 10 seconds
       --> "Namaste! Main AROHAN hoon. Aapki 5 minute ki interview shuru karte hain..."

Proctor --> Q1 (easy): "Apna naam aur aap abhi kahan kaam kar rahe hain, batayein."
        --> Candidate: "Main Rajesh hoon, Nagpur mein ek shop pe kaam karta tha..."
        --> Language confirmed: Hinglish · Difficulty route: standard

Proctor --> Q2 (domain): "Agar ek customer gussa ho aur paisa wapas maange, aap kya karenge?"
        --> Strong response --> routes to difficulty=4 follow-up

[Call drops at Q3]

AROHAN --> Session state preserved in Redis
       --> WhatsApp sent in 45 seconds:
           "Rajesh ji, call cut ho gayi. Koi baat nahi — abhi reply karein aur
            hum wahin se shuru karenge."

Candidate --> Replies "Ha"

AROHAN --> Resumes exactly at Q3. No repeat.

Assessor --> Overall: 74/100
            Communication: 71 · Domain: 68 · Situational Judgment: 82
            Fluency: proficient · Shortlist: true

Matchmaker --> 3 open logistics roles within 40km of Nagpur pin code
           --> ATS webhook fired to client system
           --> Candidate WhatsApp:
               "Badhai ho Rajesh ji! Aap shortlist ho gaye hain Delhivery
                Field Executive role ke liye, Nagpur. HR kal call karenge."

Employer Dashboard --> Rajesh's scorecard with audio playback, transcript, sub-scores
```

---

## Roadmap

| Milestone | Status |
|---|---|
| Proctor + Assessor + Matchmaker agent core | v2.0.0 done |
| Bhashini + Whisper dual-STT pipeline | v2.0.0 done |
| Drop-off recovery via Redis checkpointing | v2.0.0 done |
| RabbitMQ/Celery async audio processing | v2.0.0 done |
| Adaptive question sequencing | v2.0.0 done |
| Employer ATS dashboard (Next.js) | In progress |
| Pinecone trait-embedding scoring | In progress |
| Bulk campaign mode (upload 500 phone numbers) | Planned v2.1 |
| Video-optional async screening (WhatsApp video note) | Planned v2.1 |
| Regional language expansion: Odia, Kannada, Gujarati | Planned v2.2 |
| HRMS integrations: Keka, DarwinBox, greytHR | Planned v3.0 |
| On-device STT via Whisper.cpp (zero API cost mode) | Planned v3.0 |

---

## Contribution Guidelines

Priority areas:

- **`src/nlp/dialect_maps/`** — Regional vocabulary arrays, code-switching patterns, number/unit normalization rules
- **`tests/fixtures/audio/`** — Real-world voice samples (see `CONTRIBUTING.md` for privacy/consent guidelines before adding recordings)
- **`src/db/seeds/question_banks/`** — New role-specific question banks: delivery, warehouse, retail, pharma
- **`src/nlp/noise/`** — RNNoise filter tuning for specific acoustic environments

Before submitting a PR: run the full test suite, add tests for any new agent behavior, update `AGENTS.md` if agent responsibilities change, and ensure scorecard calculation changes hit the 95% coverage target.

---

## Architecture Decisions

**Why IVR + WhatsApp and not an app?** App install rates in Tier 3 India drop sharply below a certain income bracket. A missed call costs the candidate nothing and requires zero literacy. WhatsApp is already on 500M+ Indian phones. Meeting candidates on infrastructure they already trust removes the adoption barrier entirely.

**Why Bhashini over Whisper as primary?** Bhashini is trained on Indian acoustic data by government-funded research specifically for this problem. For Hindi and regional languages it outperforms standard Whisper on field-recorded audio. Whisper remains the fallback for English-heavy responses and on-premise deployments.

**Why RabbitMQ over Redis Streams for the task queue?** Mass hiring drives produce audio processing spikes — a logistics company onboarding 500 delivery partners in a week is the normal case, not the edge case. RabbitMQ's queue durability and dead-letter queue handling are better suited to this bursty workload than Redis Streams. Redis is retained for session state only.

**Why Pinecone for trait scoring?** Rule-based keyword matching produces brittle scorecards. Embedding a candidate's response and measuring cosine similarity against an ideal response vector is robust to paraphrasing, dialect variation, and vocabulary differences. A candidate who says "main customer ko shant karta hoon" scores the same as one who says "I de-escalate the situation."

---

*No resume required. No dashboard needed. Just a phone and a voice.*