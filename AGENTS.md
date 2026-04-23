# 🤖 AROHAN Agent Instructions

## Project State
**Greenfield** — Architecture defined in README.md, no source code yet. Build from the ground up following the documented architecture.

## 🤖 Multi-Agent Development Workflow

### Available Agency Agents

#### Engineering Division
- **Backend Architect** — System design, API architecture, microservices patterns
- **AI Engineer** — LangGraph implementation, agent orchestration, ML pipeline integration
- **DevOps Automator** — Docker Compose setup, CI/CD pipelines, infrastructure automation
- **Database Optimizer** — PostgreSQL schema design, query optimization, indexing strategies
- **Security Engineer** — API security, data encryption, compliance (GDPR, Indian data protection)
- **Software Architect** — High-level system design, technology stack validation, architectural patterns
- **SRE (Site Reliability Engineer)** — Monitoring, alerting, incident response, production readiness
- **Code Reviewer** — Code quality, best practices, security vulnerabilities, performance optimization
- **Technical Writer** — API documentation, architecture docs, developer guides
- **Git Workflow Master** — Branching strategies, commit standards, release management
- **Data Engineer** — ETL pipelines, data modeling, batch processing workflows
- **Senior Developer** — Core implementation, complex feature development, mentorship
- **Rapid Prototyper** — Quick MVP development, proof-of-concept validation
- **Frontend Developer** — Next.js dashboard, shadcn/ui components, responsive design
- **Mobile App Builder** — Mobile interfaces, cross-platform development
- **Embedded Firmware Engineer** — Hardware integration, low-level optimizations
- **Threat Detection Engineer** — Security monitoring, anomaly detection, threat analysis
- **Incident Response Commander** — Crisis management, post-incident analysis, recovery procedures
- **AI Data Remediation Engineer** — Data quality, bias detection, fairness auditing
- **Autonomous Optimization Architect** — Self-healing systems, auto-scaling, performance tuning

#### Product Division
- **Product Manager** — Feature prioritization, roadmap planning, stakeholder management
- **Sprint Prioritizer** — Sprint planning, backlog management, delivery optimization
- **Behavioral Nudge Engine** — User experience optimization, engagement strategies
- **Feedback Synthesizer** — User feedback analysis, feature improvement insights
- **Trend Researcher** — Market analysis, competitive intelligence, technology trends

#### Testing Division
- **API Tester** — API contract testing, integration testing, endpoint validation
- **Performance Benchmarker** — Load testing, stress testing, performance profiling
- **Reality Checker** — Production validation, real-world scenario testing
- **Evidence Collector** — Test result documentation, evidence gathering, compliance verification
- **Accessibility Auditor** — WCAG compliance, screen reader testing, keyboard navigation
- **Test Results Analyzer** — Test metrics analysis, failure pattern identification
- **Tool Evaluator** — Testing tool selection, framework evaluation, automation strategy
- **Workflow Optimizer** — Testing workflow improvement, efficiency optimization

#### Specialized Division
- **Agents Orchestrator** — Multi-agent coordination, workflow orchestration, task distribution
- **MCP Builder** — MCP server development, tool integration, protocol implementation
- **Workflow Architect** — System workflow design, process optimization, automation strategy
- **Model QA** — AI model validation, performance testing, quality assurance
- **Developer Advocate** — API usability, developer experience, community engagement
- **Cultural Intelligence Strategist** — Regional adaptation, localization strategy, cultural nuances
- **Compliance Auditor** — Regulatory compliance, audit preparation, risk assessment
- **Automation Governance Architect** — Automation policies, governance frameworks, control mechanisms
- **Identity Graph Operator** — Identity management, graph database operations, relationship mapping
- **LSP Index Engineer** — Language server integration, code intelligence, IDE support
- **Document Generator** — Automated documentation, report generation, content creation
- **Data Consolidation Agent** — Data aggregation, normalization, integration workflows
- **Report Distribution Agent** — Automated reporting, distribution workflows, notification systems
- **Sales Data Extraction Agent** — Sales analytics, data extraction, reporting automation
- **Accounts Payable Agent** — Financial workflows, payment processing, invoice management
- **Agentic Identity Trust** — Identity verification, trust frameworks, security protocols
- **Blockchain Security Auditor** — Smart contract auditing, blockchain security, vulnerability assessment
- **Corporate Training Designer** — Training materials, onboarding programs, skill development
- **Government Digital Presales Consultant** — Government sector consulting, digital transformation
- **Healthcare Marketing Compliance** — Healthcare regulations, marketing compliance, privacy standards
- **Recruitment Specialist** — Talent acquisition, recruitment workflows, candidate management
- **Salesforce Architect** — CRM integration, Salesforce development, data synchronization
- **Study Abroad Advisor** — Educational consulting, program management, student services
- **Supply Chain Strategist** — Supply chain optimization, logistics planning, inventory management
- **ZK Steward** — Zero-knowledge proof systems, privacy-preserving technologies
- **French Consulting Market Navigator** — French market analysis, business strategy, localization
- **Korean Business Navigator** — Korean market entry, business development, cultural adaptation

### Agent Activation Commands

Activate agents in OpenCode sessions using the following pattern:

```bash
# Load agent from agency-agents directory
opencode --agent /home/matrix/agency-agents/integrations/opencode/agents/[agent-name].md

# Example: Activate Backend Architect
opencode --agent /home/matrix/agency-agents/integrations/opencode/agents/backend-architect.md

# Example: Activate AI Engineer
opencode --agent /home/matrix/agency-agents/integrations/opencode/agents/ai-engineer.md

# Example: Activate Product Manager
opencode --agent /home/matrix/agency-agents/integrations/opencode/agents/product-manager.md
```

### Recommended Agent Workflow for AROHAN

#### Phase 1: Architecture & Planning
**Primary Agents:** Product Manager → Software Architect → Backend Architect

1. **Product Manager**
   - Define feature requirements and user stories
   - Prioritize MVP features vs. roadmap items
   - Create acceptance criteria for each feature
   - **Deliverable:** Product requirements document (PRD)

2. **Software Architect**
   - Validate technology stack against requirements
   - Design high-level system architecture
   - Define component boundaries and interfaces
   - **Deliverable:** Architecture decision record (ADR)

3. **Backend Architect**
   - Design API contracts and data models
   - Define service boundaries and communication patterns
   - Plan for scalability and performance
   - **Deliverable:** API specification and service architecture

**Quality Gate:** Approved PRD, validated architecture, complete API specifications

#### Phase 2: Core Infrastructure
**Primary Agents:** DevOps Automator → Database Optimizer → Security Engineer

1. **DevOps Automator**
   - Set up Docker Compose environment
   - Configure CI/CD pipelines
   - Implement infrastructure as code
   - **Deliverable:** Working Docker Compose setup, CI/CD pipeline

2. **Database Optimizer**
   - Design PostgreSQL schema
   - Create indexes and constraints
   - Optimize query performance
   - **Deliverable:** Database schema, migration scripts, performance benchmarks

3. **Security Engineer**
   - Implement authentication and authorization
   - Configure data encryption
   - Set up security monitoring
   - **Deliverable:** Security implementation, compliance checklist

**Quality Gate:** Deployable infrastructure, optimized database, security compliance

#### Phase 3: AI/ML Implementation
**Primary Agents:** AI Engineer → MCP Builder → Data Engineer

1. **AI Engineer**
   - Implement LangGraph agent flows
   - Build Proctor, Assessor, Matchmaker agents
   - Integrate STT pipeline (Bhashini + Whisper)
   - **Deliverable:** Working agent system, STT integration

2. **MCP Builder**
   - Create MCP servers for external integrations
   - Implement tool interfaces for Twilio, Meta, Pinecone
   - Build protocol handlers for communication
   - **Deliverable:** MCP servers, integration tests

3. **Data Engineer**
   - Build ETL pipelines for candidate data
   - Implement data normalization workflows
   - Create batch processing jobs
   - **Deliverable:** Data pipelines, processing workflows

**Quality Gate:** Functional AI agents, working integrations, data pipelines operational

#### Phase 4: Development & Testing
**Primary Agents:** Senior Developer → Code Reviewer → API Tester → Performance Benchmarker

1. **Senior Developer**
   - Implement core business logic
   - Build FastAPI endpoints
   - Integrate Celery task queues
   - **Deliverable:** Feature-complete backend code

2. **Code Reviewer**
   - Review code for quality and security
   - Ensure adherence to coding standards
   - Identify performance bottlenecks
   - **Deliverable:** Code review reports, improvement recommendations

3. **API Tester**
   - Test API contracts and endpoints
   - Validate integration with external services
   - Ensure error handling and edge cases
   - **Deliverable:** API test suite, integration test results

4. **Performance Benchmarker**
   - Conduct load testing
   - Profile performance under stress
   - Identify scalability limits
   - **Deliverable:** Performance benchmarks, optimization recommendations

**Quality Gate:** Code review approved, comprehensive test coverage, performance validated

#### Phase 5: Production Readiness
**Primary Agents:** SRE → Reality Checker → Evidence Collector → Accessibility Auditor

1. **SRE**
   - Set up monitoring and alerting
   - Configure logging and observability
   - Implement incident response procedures
   - **Deliverable:** Monitoring dashboard, runbooks, alerting rules

2. **Reality Checker**
   - Validate production-like environment
   - Test real-world scenarios
   - Verify drop-off recovery functionality
   - **Deliverable:** Production validation report, scenario test results

3. **Evidence Collector**
   - Document test results and evidence
   - Create compliance documentation
   - Gather performance metrics
   - **Deliverable:** Test evidence package, compliance documentation

4. **Accessibility Auditor**
   - Validate IVR accessibility
   - Test WhatsApp interface usability
   - Ensure compliance with accessibility standards
   - **Deliverable:** Accessibility audit report, remediation recommendations

**Quality Gate:** Monitoring operational, production validated, compliance verified

#### Phase 6: Documentation & Handoff
**Primary Agents:** Technical Writer → Git Workflow Master → Product Manager

1. **Technical Writer**
   - Write API documentation
   - Create architecture documentation
   - Develop developer guides
   - **Deliverable:** Complete documentation suite

2. **Git Workflow Master**
   - Establish branching strategy
   - Configure commit standards
   - Set up release management
   - **Deliverable:** Git workflow documentation, release process

3. **Product Manager**
   - Create user documentation
   - Develop training materials
   - Plan feature rollout
   - **Deliverable:** User guides, training materials, rollout plan

**Quality Gate:** Complete documentation, established workflows, ready for deployment

### Agent Coordination Guidelines

#### Context Passing Between Agents
- **Product Manager → Software Architect:** PRD, user stories, acceptance criteria
- **Software Architect → Backend Architect:** Architecture decisions, component boundaries
- **Backend Architect → DevOps Automator:** Service requirements, deployment specifications
- **DevOps Automator → Database Optimizer:** Infrastructure constraints, performance requirements
- **AI Engineer → MCP Builder:** Integration requirements, tool specifications
- **Senior Developer → Code Reviewer:** Implementation details, design decisions
- **API Tester → Performance Benchmarker:** API contracts, integration points
- **SRE → Reality Checker:** Monitoring setup, alerting configuration
- **Technical Writer → Git Workflow Master:** Documentation structure, version requirements

#### Handoff Protocols
1. **Pre-handoff Checklist**
   - All deliverables completed and reviewed
   - Documentation updated and accessible
   - Test results documented and shared
   - Known issues and limitations identified

2. **Handoff Meeting**
   - Review completed work and deliverables
   - Discuss challenges and solutions
   - Identify dependencies and risks
   - Agree on next steps and timelines

3. **Post-handoff Support**
   - Provide context and clarification as needed
   - Assist with troubleshooting and debugging
   - Share lessons learned and best practices
   - Update documentation based on feedback

#### Communication Channels
- **Daily Standups:** Quick progress updates and blocker identification
- **Weekly Reviews:** Comprehensive progress assessment and planning
- **Ad-hoc Consultations:** Immediate problem-solving and decision-making
- **Documentation:** Persistent knowledge sharing and reference

### Quality Gates

#### Phase 1 Quality Gates
- ✅ PRD approved by stakeholders
- ✅ Architecture validated against requirements
- ✅ API specifications complete and reviewed
- ✅ Technology stack confirmed suitable for constraints

#### Phase 2 Quality Gates
- ✅ Docker Compose environment operational
- ✅ CI/CD pipeline functional and tested
- ✅ Database schema optimized and benchmarked
- ✅ Security implementation compliant with regulations

#### Phase 3 Quality Gates
- ✅ All three agents (Proctor, Assessor, Matchmaker) functional
- ✅ STT pipeline integrated and tested
- ✅ MCP servers operational and documented
- ✅ Data pipelines processing correctly

#### Phase 4 Quality Gates
- ✅ Code review approved with no critical issues
- ✅ API test suite passing with >80% coverage
- ✅ Performance benchmarks meet requirements
- ✅ Integration tests passing for all external services

#### Phase 5 Quality Gates
- ✅ Monitoring and alerting operational
- ✅ Production environment validated
- ✅ Drop-off recovery tested and working
- ✅ Accessibility standards met
- ✅ Compliance documentation complete

#### Phase 6 Quality Gates
- ✅ API documentation complete and accurate
- ✅ Architecture documentation up to date
- ✅ Developer guides comprehensive
- ✅ Git workflow established and documented
- ✅ User documentation and training materials ready
- ✅ Release process defined and tested

### Continuous Improvement

#### Agent Feedback Loop
1. **Post-Implementation Review**
   - Assess agent effectiveness and efficiency
   - Identify areas for improvement
   - Collect feedback from all participants

2. **Process Optimization**
   - Refine workflows based on lessons learned
   - Update agent coordination guidelines
   - Improve handoff protocols

3. **Knowledge Sharing**
   - Document best practices and patterns
   - Share success stories and case studies
   - Update agent capabilities and instructions

#### Metrics and KPIs
- **Development Velocity:** Features delivered per sprint
- **Quality Metrics:** Bug density, test coverage, code review approval rate
- **Performance Metrics:** Response time, throughput, resource utilization
- **Agent Effectiveness:** Task completion rate, handoff success rate, rework rate

## Critical Architectural Constraints

### Hardware & Deployment
- **Target Environment**: Dell Latitude 3460 (Ubuntu) — CPU-bound, avoid Docker swarms or heavy local LLM training
- **Production**: Docker Compose only — FastAPI, Celery worker/beat, Redis, RabbitMQ, PostgreSQL
- **No Electron builds** — Keep backend lightweight

### Tech Stack (Non-Negotiable)
- **Core**: Python 3.12 + FastAPI + LangGraph (stateful agent flows)
- **Task Queue**: RabbitMQ + Celery (not Redis Streams — mass-hire spikes require durable queues)
- **Session State**: Redis only (LangGraph checkpoints for drop-off recovery)
- **STT Primary**: Bhashini API (Govt of India) — 22 languages, free tier
- **STT Fallback**: OpenAI Whisper (local deployment for air-gapped clients)
- **Vector Store**: Pinecone (trait embedding similarity scoring)
- **Database**: PostgreSQL (candidates, requisitions, scorecards, audit trail)
- **Dashboard**: Next.js 14 + shadcn/ui (read-only employer view)

### Agent Topology (Three Specialized Nodes)
1. **The Proctor** — Conducts adaptive 5-minute voice interview, manages interruptions, handles colloquialisms
2. **The Assessor** — Analyzes transcript for confidence, keyword accuracy, situational judgment; outputs 1-100 scorecard
3. **The Matchmaker** — Geo-radius requisition matching, ATS webhook dispatch, WhatsApp notifications

**All agents share a single `CandidateSession` object persisted to Redis. No agent maintains local state.**

## Development Commands

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
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp config/.env.template config/.env
# Edit config/.env with your keys
```

### Launch Services (Dev)
```bash
# Terminal 1: FastAPI inbound gateway
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4

# Terminal 2: Celery workers (audio processing)
celery -A src.tasks worker --loglevel=info --concurrency=8

# Terminal 3: Celery beat (scheduled tasks)
celery -A src.tasks beat --loglevel=info
```

### Production
```bash
docker compose up --build -d
```

## Testing

### Test Commands
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

### Coverage Targets
- **80%** on agent pipeline
- **95%** on scorecard calculation logic

### Audio Test Fixtures
Located in `tests/fixtures/audio/` — 60+ real-world voice samples across Hindi, Hinglish, Tamil-English, Marathi-Hindi covering:
- Clean answers
- Noisy background
- Code-switched responses
- Mid-sentence drop-offs
- Low-bandwidth compressed audio artifacts

## Key Architectural Decisions (Why This Stack?)

### IVR + WhatsApp over App
App install rates in Tier 3 India drop sharply below certain income brackets. Missed call costs nothing, requires zero literacy. WhatsApp is on 500M+ Indian phones.

### Bhashini over Whisper as Primary
Bhashini is trained on Indian acoustic data by government-funded research. Outperforms standard Whisper on field-recorded audio for Hindi/regional languages. Whisper remains fallback for English-heavy responses and on-premise deployments.

### RabbitMQ over Redis Streams for Task Queue
Mass hiring drives produce audio processing spikes (500+ delivery partners in a week). RabbitMQ's queue durability and dead-letter queue handling better suited to bursty workloads. Redis retained for session state only.

### Pinecone for Trait Scoring
Rule-based keyword matching produces brittle scorecards. Embedding candidate response and measuring cosine similarity against ideal response vector is robust to paraphrasing, dialect variation, vocabulary differences.

## STT Pipeline (Four Stages)

1. **Noise Suppression** — RNNoise strips background noise before STT (critical for field audio)
2. **Language Detection** — FastLangDetect on first 5 seconds to route to appropriate model
3. **Domain Vocabulary Injection** — Job-role-specific vocabulary as Whisper `logit_bias` to force-decode terms
4. **Transcript Normalization** — Numbers/dates/currency converted to canonical format (`"paanch hazaar rupaye" → Rs. 5,000`)

**Dialect arrays live in `src/nlp/dialect_maps/` — highest-value area for contributions.**

## Drop-off Recovery Protocol

Call drops are daily reality in Tier 2/3 markets. When session interrupted:
1. Save state to Redis (LangGraph checkpoint)
2. Send WhatsApp voice note within 60 seconds: "Koi baat nahi — jahan chhoda wahan se shuru karte hain."
3. Candidate resumes exactly where they left off

## Environment Variables (Required)

See `config/.env.template` for full list. Critical keys:
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `META_APP_ID`, `META_APP_SECRET`, `META_PHONE_NUMBER_ID`, `META_ACCESS_TOKEN`
- `BHASHINI_API_KEY` (free at bhashini.ai)
- `OPENAI_API_KEY` (Whisper fallback)
- `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`
- `DATABASE_URL`, `REDIS_URL`, `RABBITMQ_URL`

## Monetization Model

**Pay-per-Screening API**:
- Startup: Rs. 18/screening (up to 500/month)
- Growth: Rs. 14/screening (500–5,000/month)
- Enterprise: Rs. 10/screening (5,000+/month)
- On-Premise: One-time license (unlimited)

Unit economics at scale: 10,000 screenings/month at Rs. 14 = Rs. 1.4L revenue. Compute + telephony cost ~Rs. 1.5–2/screening. Gross margin: ~85%.

## Priority Contribution Areas

1. **`src/nlp/dialect_maps/`** — Regional vocabulary arrays, code-switching patterns, number/unit normalization
2. **`tests/fixtures/audio/`** — Real-world voice samples (see CONTRIBUTING.md for privacy guidelines)
3. **`src/db/seeds/question_banks/`** — New role-specific question banks (delivery, warehouse, retail, pharma)
4. **`src/nlp/noise/`** — RNNoise filter tuning for specific acoustic environments

## Before Submitting PRs

1. Run full test suite: `pytest tests/ -v --tb=short`
2. Add tests for any new agent behavior
3. Update `AGENTS.md` if agent responsibilities change
4. Ensure scorecard calculation changes hit 95% coverage target

## Session State Contract

All agents share this single persisted object:

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

## Geo-Aware Routing

Matchmaker queries open requisitions within configurable radius of candidate's pin code. Driver in Nagpur does not get routed to job in Bengaluru. Matching accounts for role, score threshold, shift preference, geography.

## Adaptive Interrogation

Proctor does not run static script. Every answer reshapes next question. Strong response → harder follow-up. Weak response → simpler reframe. Produces more accurate signal than fixed questionnaire.

## Roadmap Status

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

*No resume required. No dashboard needed. Just a phone and a voice.*