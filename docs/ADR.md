# ADR-001: AROHAN System Architecture

## Status
Accepted

## Context

AROHAN is an AI-powered voice screening platform for blue-collar hiring in India. The system must support:

1. **Three specialized AI agents** (Proctor, Assessor, Matchmaker) conducting adaptive voice interviews
2. **Real-time candidate screening** via IVR and WhatsApp with drop-off recovery
3. **Employer dashboard** for viewing screening results and candidate scorecards
4. **Hardware constraints**: Dell Latitude 3460 (CPU-bound), Docker Compose only
5. **Scale requirements**: Support mass hiring drives (500+ candidates/week) with bursty workloads
6. **Regional language support**: 22 Indian languages with code-switching and dialect handling

The PRD for the Employer ATS Dashboard introduces a read-only Next.js 14 + shadcn/ui web application that requires integration with the existing Python backend. We need to validate the technology stack and design a cohesive architecture that supports both the AI agent system and the employer dashboard within hardware constraints.

## Decision

### 1. Technology Stack Validation

**Core Backend Stack** ✅ **Validated**
- **Python 3.12 + FastAPI**: Optimal for async I/O, type safety, and rapid development. FastAPI's automatic OpenAPI documentation and dependency injection align well with agent orchestration needs.
- **LangGraph**: Ideal for stateful agent flows with built-in checkpointing for drop-off recovery. Matches the requirement for adaptive interrogation and session persistence.
- **RabbitMQ + Celery**: Correct choice over Redis Streams for durable task queues. Mass hiring drives produce bursty audio processing workloads; RabbitMQ's dead-letter queues and message persistence handle this better than Redis.
- **Redis**: Appropriate for session state only. LangGraph checkpoints provide the drop-off recovery mechanism without requiring persistent storage in the database.
- **PostgreSQL**: Solid choice for relational data (candidates, requisitions, scorecards, audit trail). ACID compliance ensures data integrity for hiring decisions.
- **Bhashini API (Primary) + Whisper (Fallback)**: Validated approach. Bhashini's Indian acoustic data training outperforms standard Whisper for regional languages. Whisper provides air-gapped fallback for on-premise deployments.
- **Pinecone**: Appropriate for trait embedding similarity scoring. Vector-based scoring is more robust to paraphrasing and dialect variation than keyword matching.

**Frontend Stack** ✅ **Validated**
- **Next.js 14 + shadcn/ui**: Good choice for the employer dashboard. Server-side rendering improves initial load performance on CPU-bound hardware. shadcn/ui provides accessible components that reduce development time.
- **Read-only architecture**: Pragmatic decision for v1. Employer-initiated actions (job posting, candidate outreach) are deferred to reduce complexity and accelerate time-to-market.

**Trade-offs Accepted**:
- **CPU-bound constraint**: No local LLM training or Docker swarms. All AI processing relies on external APIs (Bhashini, Pinecone) or lightweight local models (Whisper fallback).
- **Docker Compose only**: No Kubernetes or complex orchestration. Simplifies deployment but limits horizontal scaling options.
- **Monolithic backend**: All agents run in the same FastAPI application. Reduces operational complexity but may limit independent scaling of agent components.

### 2. High-Level System Architecture

**Architecture Pattern**: **Event-Driven Modular Monolith**

We chose a modular monolith with event-driven communication over microservices because:

- **Team size**: Solo developer with agency agent support. Microservices introduce operational overhead that outweighs benefits at this scale.
- **Unclear boundaries**: Agent responsibilities may evolve as we learn from real-world usage. Monolith makes refactoring easier.
- **Hardware constraints**: Single Dell Latitude 3460 cannot support multiple services with independent scaling.
- **Development velocity**: Faster iteration with single codebase, shared dependencies, and simplified debugging.

**Bounded Contexts**:

```
┌─────────────────────────────────────────────────────────────┐
│                     AROHAN System                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Screening      │  │   Employer      │                 │
│  │  Context         │  │   Context       │                 │
│  │                  │  │                  │                 │
│  │  • Proctor       │  │  • Dashboard    │                 │
│  │  • Assessor      │  │  • Auth         │                 │
│  │  • Matchmaker    │  │  • Reporting    │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                    │                             │
│           │                    │                             │
│  ┌────────▼────────────────────▼─────────┐                 │
│  │         Shared Kernel                  │                 │
│  │                                        │                 │
│  │  • Session State (Redis)               │                 │
│  │  • Event Bus (RabbitMQ)                │                 │
│  │  • Database (PostgreSQL)               │                 │
│  │  • Vector Store (Pinecone)             │                 │
│  └────────────────────────────────────────┘                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 3. Agent System Architecture

**Agent Topology**: **Shared State, Event-Driven Coordination**

All three agents (Proctor, Assessor, Matchmaker) share a single `CandidateSession` object persisted to Redis. No agent maintains local state.

**Key Design Decision**: This ensures:
- **Drop-off recovery**: Session can be resumed from any point
- **Observability**: Complete interview history available for debugging
- **Scalability**: Stateless agents can be horizontally scaled (within hardware constraints)

### 4. Frontend Architecture

**Next.js 14 App Router** with Server Components for performance on CPU-bound hardware.

**State Management**:
- **Server State**: Fetched via Server Components and cached with React Query
- **Client State**: Managed with React hooks for UI interactions (filters, selections)
- **Real-time Updates**: Polling with 30-second intervals (WebSockets deferred to v2)

### 5. Backend Integration Architecture

**API Layer**: REST endpoints for dashboard data access
- `/api/v1/campaigns` - Campaign management
- `/api/v1/candidates` - Candidate data and scorecards
- `/api/v1/requisitions` - Requisition management

**Authentication**: JWT tokens with role-based access control (Admin/Viewer roles)

### 6. Data Flow Architecture

**End-to-End Flow**:
1. Candidate initiates interview via IVR/WhatsApp
2. Proctor conducts adaptive interview with drop-off recovery
3. Assessor analyzes transcript and generates scorecard
4. Matchmaker finds job matches within geo-radius
5. Results persisted to PostgreSQL
6. Employer dashboard displays results via Next.js + FastAPI

### 7. Scalability Strategy

**Hardware Constraints**: Dell Latitude 3460 (CPU-bound, limited RAM)

**Scaling Approach**: **Vertical Scaling + Optimization**
- Connection pooling (Database: 20, Redis: 10, RabbitMQ: 5)
- Caching strategy (API responses, database queries, vector embeddings)
- Async processing (Celery workers: 8 concurrent tasks)
- Resource limits optimized for single machine deployment

**Performance Targets**:
- Candidate list load: <800ms
- Scorecard detail load: <500ms
- Shortlist action: <300ms
- Interview processing: <60s
- Drop-off recovery: <10s

### 8. Security Architecture

**Authentication & Authorization**:
- JWT tokens with RS256 encryption
- Role-based access control (Admin/Viewer)
- Multi-tenant isolation with company_id scoping

**Data Protection**:
- Encryption at rest (PostgreSQL TDE, Redis AES-256)
- Encryption in transit (TLS 1.3)
- Data masking for PII in logs

**Compliance**:
- GDPR considerations (right to erasure, data portability)
- Indian data protection (data localization, consent framework)

### 9. Deployment Architecture

**Docker Compose Configuration** with 7 services:
- FastAPI backend (4 workers)
- Celery workers (8 workers for audio processing)
- Celery beat (scheduled tasks)
- Next.js frontend (2 workers)
- PostgreSQL (1GB RAM, 2 CPU cores)
- Redis (512MB RAM, 1 CPU core)
- RabbitMQ (512MB RAM, 1 CPU core)

**Total Resource Allocation**: ~9.5 CPU cores, ~4.75GB RAM

## Consequences

### Benefits

1. **Simplified Operations**: Modular monolith reduces deployment complexity
2. **Faster Development**: Single codebase with shared dependencies
3. **Hardware Efficiency**: Optimized for CPU-bound constraints
4. **Drop-off Recovery**: LangGraph checkpointing provides seamless resumption
5. **Real-time Visibility**: Employer dashboard provides immediate access
6. **Regional Language Support**: Bhashini + Whisper dual-STT pipeline
7. **Scalable Task Processing**: RabbitMQ + Celery handles bursty workloads
8. **Data Consistency**: Strong consistency with ACID compliance
9. **Security**: JWT authentication with RBAC
10. **Compliance**: GDPR and Indian data protection built in

### Trade-offs

1. **Limited Horizontal Scaling**: Monolithic architecture restricts independent scaling
2. **Single Point of Failure**: Monolithic backend represents single failure domain
3. **No Real-time Dashboard Updates**: Polling instead of WebSockets for v1
4. **Read-only Dashboard**: Employer-initiated actions deferred to v2
5. **External API Dependencies**: Bhashini, Pinecone, Twilio, Meta required

### Risks

1. **Hardware Resource Exhaustion**: CPU-bound constraints may limit concurrent processing
2. **External Service Downtime**: Third-party service outages could disrupt operations
3. **Database Performance**: Large volumes could slow query performance
4. **Session State Loss**: Redis failure could drop active sessions
5. **Security Vulnerabilities**: Token compromise, data breaches, unauthorized access

## Alternatives Considered

### Alternative 1: Microservices Architecture
**Rejected**: Microservices introduce operational overhead that outweighs benefits for solo development. Can extract services later if scale demands it.

### Alternative 2: Redis Streams for Task Queue
**Rejected**: RabbitMQ's message durability and dead-letter queues better handle bursty workloads from mass hiring drives.

### Alternative 3: Client-Side Rendering for Dashboard
**Rejected**: Server-side rendering improves initial load performance on CPU-bound hardware and low-bandwidth connections.

### Alternative 4: Session-Based Authentication
**Rejected**: Stateless JWT authentication is easier to scale within Docker Compose constraints.

### Alternative 5: WebSockets for Real-time Updates
**Deferred to v2**: Polling with 30-second intervals provides sufficient real-time feedback for initial use case.

### Alternative 6: PostgreSQL for Session State
**Rejected**: Redis is purpose-built for fast session state operations with automatic expiration.

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-4)
- Docker Compose setup, database schema design
- FastAPI backend structure, authentication implementation
- LangGraph agent framework, Redis integration
- RabbitMQ + Celery setup, basic task processing

### Phase 2: Agent Implementation (Weeks 5-8)
- Proctor agent implementation, Twilio/Meta integration
- Assessor agent implementation, Pinecone integration
- Matchmaker agent implementation, webhook dispatch
- Agent orchestration, drop-off recovery testing

### Phase 3: Dashboard Development (Weeks 9-12)
- Next.js setup, authentication flow
- Campaign list, candidate table components
- Scorecard detail view, transcript display
- Requisition management, shortlist actions

### Phase 4: Integration & Testing (Weeks 13-16)
- End-to-end integration testing
- Performance optimization, load testing
- Security audit, compliance review
- User acceptance testing, bug fixes

### Phase 5: Deployment & Launch (Weeks 17-20)
- Production deployment, monitoring setup
- Internal alpha testing with design partners
- Closed beta with 20 employers
- GA rollout, post-launch support

## Quality Gates

- ✅ Technology stack validated against requirements
- ✅ Component boundaries defined with clear interfaces
- ✅ Data flow documented with consistency guarantees
- ✅ Security architecture designed with compliance considerations
- ✅ Deployment architecture optimized for hardware constraints
- ✅ Performance targets defined (<800ms candidate list, <500ms scorecard)
- ✅ Scalability strategy documented (vertical scaling + optimization)
- ✅ Resource allocation specified (9.5 CPU cores, 4.75GB RAM)

## References

### Architecture Patterns
- **Domain-Driven Design**: Eric Evans - Bounded contexts, aggregates, domain events
- **Event-Driven Architecture**: Martin Fowler - Event sourcing, CQRS, eventual consistency
- **Modular Monolith**: Simon Brown - Structuring monolithic applications

### Technology Documentation
- **FastAPI**: https://fastapi.tiangolo.com/
- **LangGraph**: https://langchain-ai.github.io/langgraph/
- **Next.js 14**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com/

### Best Practices
- **Twelve-Factor App**: https://12factor.net/
- **AWS Well-Architected Framework**: Operational excellence, security, reliability
- **Google Cloud Architecture Framework**: Scalability, manageability, security

### Compliance Standards
- **GDPR**: https://gdpr.eu/
- **Indian Data Protection Bill**: https://meity.gov.in/
- **ISO 27001**: Information security management systems

---

**Document Status**: Complete  
**Next Review**: After Phase 1 implementation (Week 4)  
**Owner**: Software Architect  
**Reviewers**: Backend Architect, Frontend Developer, Security Engineer