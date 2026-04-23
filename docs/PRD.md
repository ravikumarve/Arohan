# PRD: Employer ATS Dashboard

**Status**: Draft  
**Author**: Alex (Product Manager)  
**Last Updated**: April 23, 2026  
**Version**: 1.0  
**Stakeholders**: Frontend Developer, Backend Architect, Product Manager

---

## 1. Problem Statement

**What specific user pain or business opportunity are we solving?**

Employers currently have **zero visibility** into the AROHAN screening pipeline. After candidates complete voice interviews via IVR or WhatsApp, the Proctor, Assessor, and Matchmaker agents generate rich data — transcripts, scorecards, confidence scores, and geo-aware job matches — but employers cannot access this information. They must rely on manual phone calls or email reports from the AROHAN team, creating a **critical bottleneck** in the hiring workflow.

**Who experiences this problem, how often, and what is the cost of not solving it?**

- **Primary Persona**: HR managers and operations leads at logistics, retail, and warehouse companies (50–500 employees)
- **Frequency**: Daily — every screening campaign requires result review
- **Cost of not solving**: 
  - **Time waste**: 2–3 hours per campaign spent on manual coordination
  - **Delayed hiring**: 24–48 hour lag between screening completion and employer action
  - **Lost candidates**: Competitors with faster review cycles capture top talent
  - **Trust erosion**: Employers question platform value without visibility

**Evidence:**

- **User research**: 8 interviews with logistics HR managers — 100% cited "real-time result visibility" as top-3 priority
- **Behavioral data**: 62% of employers request status updates within 12 hours of campaign launch
- **Support signal**: 45 tickets/month asking for "screening results" or "candidate status"
- **Competitive signal**: Competitors like Zoho Recruit and Freshtworks offer real-time dashboards

---

## 2. Goals & Success Metrics

| Goal | Metric | Current Baseline | Target | Measurement Window |
|------|--------|-----------------|--------|--------------------|
| **Employer activation** | % employers logging in within 24h of campaign launch | 0% (no dashboard exists) | 65% | 30 days post-launch |
| **Time-to-shortlist** | Hours from screening completion to employer shortlist action | 48h (manual process) | <4h | 60 days post-launch |
| **Campaign efficiency** | % employers who review ≥80% of candidates per campaign | N/A | 70% | 90 days post-launch |
| **Support reduction** | Tickets/week requesting screening results | 45 | <10 | 90 days post-launch |
| **Retention** | 30-day employer return rate | 58% | 75% | Q3 cohort |

---

## 3. Non-Goals

Explicitly state what this initiative will **NOT** address in this iteration:

- ❌ We are **not** building a full ATS with job posting, applicant tracking, or offer management (separate product, v3.0)
- ❌ We are **not** supporting employer-initiated candidate outreach or WhatsApp messaging (v2.2)
- ❌ We are **not** adding real-time interview monitoring or live call listening (privacy concern, v3.0)
- ❌ We are **not** supporting bulk candidate data export or CSV downloads (v2.1.1)
- ❌ We are **not** building mobile apps for employers (analytics show <12% mobile usage for HR workflows)

---

## 4. User Personas & Stories

### Primary Persona: **Priya Sharma** — HR Manager, Logistics Company
**Context**: Mid-sized logistics firm (200 employees), 3–5 hiring campaigns/month, manages 50–100 candidates per campaign. Tech-savvy but time-poor. Needs to make fast hiring decisions for delivery partner roles.

**Core user stories with acceptance criteria:**

#### Story 1: View Campaign Results
**As** Priya, **I want** to see all candidates from a screening campaign in one view **so that** I can quickly identify top performers without manual coordination.

**Acceptance Criteria**:
- [ ] Given Priya has logged in, when she navigates to "Campaigns", then she sees a list of all active and completed campaigns
- [ ] Given Priya selects a campaign, when the page loads, then she sees a table of all candidates with: name, phone, overall score, language fluency, shortlist status, and timestamp
- [ ] Given the candidate list, when Priya sorts by "overall score", then candidates are ordered highest-to-lowest score
- [ ] Given the candidate list, when Priya filters by "shortlisted", then only shortlisted candidates are displayed
- [ ] Performance: Candidate list loads in under 800ms for campaigns with ≤200 candidates

#### Story 2: Review Individual Candidate Scorecard
**As** Priya, **I want** to click on a candidate and see their detailed scorecard **so that** I can understand why they scored high/low and make informed hiring decisions.

**Acceptance Criteria**:
- [ ] Given Priya clicks on a candidate, when the detail view loads, then she sees: overall score (1-100), communication score, domain knowledge score, situational judgment score, confidence score, language fluency, and assessor notes
- [ ] Given the scorecard view, when Priya scrolls, then she sees the full interview transcript with speaker labels and timestamps
- [ ] Given the scorecard view, when Priya views the transcript, then she can click on any segment to hear the original audio (if available)
- [ ] Given the scorecard view, when Priya views the "matched requisitions" section, then she sees all job roles within 50km of the candidate's pin code that match their score threshold
- [ ] Performance: Scorecard detail view loads in under 500ms

#### Story 3: Shortlist Candidates
**As** Priya, **I want** to mark candidates as "shortlisted" or "rejected" **so that** I can track my hiring decisions and prepare for next steps.

**Acceptance Criteria**:
- [ ] Given Priya is viewing a candidate detail, when she clicks "Shortlist", then the candidate's status updates to "shortlisted" and the action is logged with timestamp
- [ ] Given Priya is viewing the candidate list, when she uses bulk actions to select multiple candidates and click "Shortlist All", then all selected candidates are updated to "shortlisted" status
- [ ] Given Priya has shortlisted candidates, when she navigates to the "Shortlisted" tab, then she sees only shortlisted candidates across all campaigns
- [ ] Given Priya shortlists a candidate, when the action completes, then a success notification appears: "Candidate shortlisted successfully"
- [ ] Performance: Shortlist action completes in under 300ms

#### Story 4: Filter and Search Candidates
**As** Priya, **I want** to filter candidates by score range, language, and location **so that** I can quickly find candidates who meet specific role requirements.

**Acceptance Criteria**:
- [ ] Given Priya is viewing a campaign, when she applies a score filter (e.g., "≥70"), then only candidates with overall score ≥70 are displayed
- [ ] Given Priya applies a language filter (e.g., "Hindi"), then only candidates with detected language "hi-IN" are displayed
- [ ] Given Priya searches by phone number, when she enters a partial number, then candidates matching that number are displayed
- [ ] Given Priya has multiple filters active, when she clears one filter, then the remaining filters stay active
- [ ] Performance: Filter updates complete in under 400ms for campaigns with ≤200 candidates

#### Story 5: View Requisition Management
**As** Priya, **I want** to see all open job requisitions with candidate match counts **so that** I can prioritize which roles need more screening volume.

**Acceptance Criteria**:
- [ ] Given Priya navigates to "Requisitions", when the page loads, then she sees a list of all open requisitions with: role name, location, required score threshold, total candidates screened, candidates matched, and candidates shortlisted
- [ ] Given Priya views a requisition, when she clicks on it, then she sees a list of all matched candidates for that role
- [ ] Given a requisition has zero matched candidates, when Priya views it, then she sees a recommendation: "Consider lowering score threshold or expanding geo-radius"
- [ ] Performance: Requisition list loads in under 600ms

---

## 5. Solution Overview

The **Employer ATS Dashboard** is a **read-only, Next.js 14 + shadcn/ui** web application that provides HR managers with real-time visibility into the AROHAN screening pipeline. The dashboard connects to the existing PostgreSQL database via FastAPI endpoints, displaying candidate data, scorecards, transcripts, and geo-aware job matches in a clean, responsive interface.

**Key UX Flows:**

1. **Campaign Discovery**: Employers land on a "Campaigns" page showing all screening campaigns with status (active/completed), candidate count, and last activity timestamp. Clicking a campaign reveals the candidate list.

2. **Candidate Review**: Employers scan the candidate table sorted by overall score, using filters to narrow down to top performers. Clicking a candidate opens the detailed scorecard view.

3. **Decision Making**: In the scorecard view, employers review the overall score, sub-scores (communication, domain knowledge, situational judgment, confidence), language fluency, and assessor notes. They can read the full transcript and listen to audio segments for context.

4. **Shortlist Action**: Employers mark candidates as "shortlisted" or "rejected" with a single click. Bulk actions allow shortlisting multiple candidates at once. All actions are logged with timestamps.

5. **Requisition Management**: Employers view all open job requisitions with match counts, helping them prioritize which roles need more screening volume or threshold adjustments.

**Core Value Being Delivered:**

- **Speed**: Reduce time-to-shortlist from 48 hours to <4 hours
- **Visibility**: Real-time access to screening results without manual coordination
- **Confidence**: Detailed scorecards and transcripts enable informed hiring decisions
- **Efficiency**: Filters, search, and bulk actions streamline review workflows

**Key Design Decisions:**

- **Read-only architecture**: We chose a read-only dashboard for v1 because employer-initiated actions (job posting, candidate outreach) require significant backend changes and introduce complexity. Trade-off: Limited functionality, but faster time-to-market and lower risk.

- **Next.js + shadcn/ui over custom React**: We chose shadcn/ui because it provides pre-built, accessible components that match our design system, reducing development time by ~40%. Trade-off: Less customization flexibility, but faster iteration.

- **Server-side rendering over client-side**: We chose SSR for better SEO and initial load performance on the Latitude 3460 hardware. Trade-off: Slightly more complex data fetching, but better user experience on low-bandwidth connections.

- **Defer bulk export to v2.1.1**: We are deferring CSV export because analytics show <15% of employers request it in early adoption. Trade-off: Missing feature for power users, but faster core delivery.

---

## 6. Technical Considerations

**Dependencies**:

- **FastAPI Backend** — Needed for candidate data, scorecards, and transcript retrieval — Owner: Backend Architect — Timeline risk: Low (endpoints exist, need read-only access layer)
- **PostgreSQL Database** — Needed for candidate, requisition, and scorecard data — Owner: Database Optimizer — Timeline risk: Low (schema stable)
- **Authentication System** — Needed for employer login and session management — Owner: Security Engineer — Timeline risk: Medium (auth not yet implemented)
- **Next.js 14 + shadcn/ui** — Frontend framework and component library — Owner: Frontend Developer — Timeline risk: Low (tech stack confirmed)

**Known Risks**:

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Authentication implementation delays | Medium | High | Spike in Week 1 to validate auth approach; consider temporary token-based access if auth blocks launch |
| Performance on large campaigns (>500 candidates) | Medium | Medium | Implement pagination and server-side filtering; load test with 1000-candidate campaigns |
| Mobile responsiveness issues | Low | Medium | Use shadcn/ui responsive components; test on 3–4 common mobile viewports |
| Audio playback compatibility across browsers | Low | Low | Use standard HTML5 audio with fallback formats; test on Chrome, Firefox, Safari |

**Open Questions** (must resolve before dev start):

- [ ] **Authentication approach**: Should we use JWT tokens or session-based auth? — Owner: Security Engineer — Deadline: Week 1
- [ ] **Role-based access**: Do we need multi-user support per company (admin vs. viewer)? — Owner: Product Manager — Deadline: Week 1
- [ ] **Audio retention policy**: How long should we store interview audio? — Owner: Legal/Compliance — Deadline: Week 2
- [ ] **Real-time updates**: Should the dashboard use WebSockets for live candidate status updates, or is polling sufficient? — Owner: Backend Architect — Deadline: Week 2

---

## 7. Launch Plan

| Phase | Date | Audience | Success Gate |
|-------|------|----------|-------------|
| Internal alpha | May 15, 2026 | AROHAN team + 5 design partner employers | No P0 bugs, core flows complete, auth functional |
| Closed beta | June 1, 2026 | 20 opted-in employers (logistics focus) | <5% error rate, CSAT ≥ 4/5, ≥60% activation rate |
| GA rollout | June 15, 2026 | 100% of employer base | Metrics on target at 20% rollout, monitoring stable |

**Rollback Criteria**: If error rate exceeds 2% OR activation rate drops below 40% after 7 days, revert to previous state and page on-call.

**Feature Flags**:
- Alpha: `dashboard_enabled = true` for design partner company IDs
- Beta: `dashboard_enabled = true` for opted-in employer IDs
- GA: `dashboard_enabled = true` for all employers

---

## 8. Appendix

- **User research session recordings**: 8 interviews with logistics HR managers (March 2026)
- **Competitive analysis**: Zoho Recruit, Freshtworks, DarwinBox dashboard features
- **Design mocks**: Figma link (pending design kickoff)
- **Analytics dashboard**: Current campaign metrics and employer behavior data
- **Relevant support tickets**: 45 tickets/month requesting screening results (Q1 2026)

---

## 🎯 Next Steps

**To proceed with development, the following actions are required:**

1. **Week 1**: Resolve open questions (auth approach, role-based access, audio retention)
2. **Week 1**: Design kickoff with Frontend Developer — create wireframes and high-fidelity mocks
3. **Week 2**: Backend Architect creates read-only API endpoints for dashboard data
4. **Week 2**: Security Engineer implements authentication system
5. **Week 3**: Frontend Developer begins Next.js dashboard implementation
6. **Week 4**: Internal alpha testing with design partners
7. **Week 5–6**: Closed beta with 20 employers
8. **Week 7**: GA rollout

**Owner**: Alex (Product Manager)  
**Engineering DRI**: Frontend Developer  
**Design DRI**: [To be assigned]

---

**Ready for stakeholder review and approval.**