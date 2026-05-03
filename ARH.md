# Arohan tech stack

**Session ID:** ses_2156b1d70ffe40d5SPrVy2Ipf2
**Created:** 5/3/2026, 2:55:19 AM
**Updated:** 5/3/2026, 4:24:59 AM

---

## User

what is the tech stack of Arohan?

---

## Assistant (Orchestrator · GLM 4.7 · 42.7s)

_Thinking:_

The user is asking about the tech stack of Arohan. Looking at the AGENTS.md file, I can see a comprehensive section about the tech stack under "Critical Architectural Constraints". Let me extract and present this information clearly.

From the AGENTS.md file, I can see:

### Tech Stack (Non-Negotiable)
- **Core**: Python 3.12 + FastAPI + LangGraph (stateful agent flows)
- **Task Queue**: RabbitMQ + Celery (not Redis Streams — mass-hire spikes require durable queues)
- **Session State**: Redis only (LangGraph checkpoints for drop-off recovery)
- **STT Primary**: Bhashini API (Govt of India) — 22 languages, free tier
- **STT Fallback**: OpenAI Whisper (local deployment for air-gapped clients)
- **Vector Store**: Pinecone (trait embedding similarity scoring)
- **Database**: PostgreSQL (candidates, requisitions, scorecards, audit trail)
- **Dashboard**: Next.js 14 + shadcn/ui (read-only employer view)

I should also mention the deployment environment and other relevant details from the file.

Based on the AGENTS.md file, here's the **Arohan Tech Stack**:

## Core Backend
- **Language**: Python 3.12
- **API Framework**: FastAPI
- **Agent Orchestration**: LangGraph (stateful agent flows)

## Task Processing & Queuing
- **Task Queue**: RabbitMQ + Celery (chosen over Redis Streams for durable queues during mass-hire spikes)
- **Session State**: Redis (LangGraph checkpoints for drop-off recovery)

## AI/ML & Speech Processing
- **STT Primary**: Bhashini API (Govt of India) — 22 languages, free tier
- **STT Fallback**: OpenAI Whisper (local deployment for air-gapped clients)
- **Vector Store**: Pinecone (trait embedding similarity scoring)

## Database
- **Primary Database**: PostgreSQL (candidates, requisitions, scorecards, audit trail)

## Frontend
- **Dashboard**: Next.js 14 + shadcn/ui (read-only employer view)

## Deployment Environment
- **Target Hardware**: Dell Latitude 3460 (Ubuntu) — CPU-bound
- **Production**: Docker Compose only (FastAPI, Celery worker/beat, Redis, RabbitMQ, PostgreSQL)
- **No Electron builds** — Backend kept lightweight

## Key Architectural Decisions

1. **IVR + WhatsApp over App**: Higher adoption in Tier 3 India markets
2. **Bhashini over Whisper**: Better performance on Indian acoustic data and regional languages
3. **RabbitMQ over Redis Streams**: Better queue durability for bursty workloads (500+ screenings/week)
4. **Pinecone for Trait Scoring**: Embedding-based scoring more robust than keyword matching

This stack is optimized for the Indian mass-hiring market with focus on regional language support, drop-off recovery, and cost-effective scaling.

---

## User

Is Frontend Dashboard is designed for employer view which is users right and where is admin view ? do we need ?

---

## Assistant (Orchestrator · GLM 4.7 · 50.6s)

_Thinking:_

The user is asking about the frontend dashboard architecture in Arohan. They want to understand:
1. Is the dashboard designed for employers (users)?
2. Where is the admin view?
3. Do we need an admin view?

Let me check the AGENTS.md and explore the codebase to understand the current dashboard architecture and whether there's any admin view defined.

From the AGENTS.md, I can see:
- "Dashboard: Next.js 14 + shadcn/ui (read-only employer view)"

This suggests the dashboard is indeed for employers. But I should explore the codebase to see:
1. What the current dashboard structure looks like
2. Whether there's any admin view defined
3. What the user roles and permissions are

Let me start by exploring the project structure to understand the dashboard architecture.

Great question! Let me explore the codebase to understand the current dashboard architecture and user roles.

**Tool: bash**

**Input:**
```json
{
  "description": "Explore project structure to understand dashboard architecture",
  "command": "tree -L 2 -I 'node_modules|__pycache__|*.pyc|.git'"
}
```

**Output:**
```
.
├── AGENTS.md
├── alembic
│   ├── env.py
│   ├── script.py.mako
│   └── versions
├── alembic.ini
├── arohan.db
├── audio
├── backend-architect.md
├── COMPLETE_SYSTEM.md
├── config
│   └── keys
├── dashboard
│   ├── AGENT_REVIEW_GUIDE.md
│   ├── AGENT_REVIEW_QUICK_REFERENCE.md
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── COMPLETE_AGENT_REVIEW_SUMMARY.md
│   ├── components.json
│   ├── CRITICAL_ISSUES_QUICK_REFERENCE.md
│   ├── CRITICAL_REVIEWS_SUMMARY.md
│   ├── dashboard.sh
│   ├── eslint.config.mjs
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── LIGHTHOUSE_AUDIT_GUIDE.md
│   ├── logs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── PHASE_1_COMPLETE.md
│   ├── PHASE_2_COMPLETION_REPORT.md
│   ├── PHASE_2_PROGRESS.md
│   ├── postcss.config.mjs
│   ├── public
│   ├── QUICK_START.md
│   ├── README.md
│   ├── SETTINGS_COMPLETE.md
│   ├── SETTINGS_DOCUMENTATION.md
│   ├── SETTINGS_QUICK_GUIDE.md
│   ├── src
│   ├── TABS_FIXED.md
│   ├── tailwind.config.js
│   └── tsconfig.json
├── db
│   └── init
├── docker-compose.yml
├── Dockerfile
├── docs
│   ├── ADR.md
│   ├── API_SPEC.md
│   ├── compliance-documentation.md
│   ├── index.html
│   ├── ivr-accessibility-compliance.md
│   ├── phase5-completion-summary.md
│   ├── phase5-evidence-package.md
│   ├── phase5-progress-summary.md
│   ├── PRD.md
│   ├── PRICING_BUSINESS_MODEL.md
│   ├── production-deployment-procedures.md
│   ├── runbooks
│   └── whatsapp-usability-testing.md
├── frontend
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── DESIGN_GUIDE.md
│   ├── eslint.config.mjs
│   ├── LANDING_PAGE_COMPLETE.md
│   ├── landing-page.sh
│   ├── logs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── public
│   ├── README.md
│   ├── src
│   ├── STYLING_FIXED.md
│   ├── tailwind.config.js
│   └── tsconfig.json
├── htmlcov
│   ├── class_index.html
│   ├── coverage_html_cb_dd2e7eb5.js
│   ├── favicon_32_cb_c827f16f.png
│   ├── function_index.html
│   ├── index.html
│   ├── keybd_closed_cb_900cfef5.png
│   ├── status.json
│   ├── style_cb_9ff733b0.css
│   ├── z_145eef247bfb46b6___init___py.html
│   ├── z_145eef247bfb46b6_main_py.html
│   ├── z_236ccc2b459bbb2b___init___py.html
│   ├── z_236ccc2b459bbb2b_language_detection_py.html
│   ├── z_236ccc2b459bbb2b_stt_py.html
│   ├── z_276c81cb0f9851cf_middleware_py.html
│   ├── z_28398e0e8a2026e7_database_py.html
│   ├── z_28398e0e8a2026e7___init___py.html
│   ├── z_28398e0e8a2026e7_optimization_py.html
│   ├── z_3595fc627d656939_dependencies_py.html
│   ├── z_3595fc627d656939_jwt_py.html
│   ├── z_3595fc627d656939_rbac_py.html
│   ├── z_3595fc627d656939_service_py.html
│   ├── z_67f6f9a13eff1831___init___py.html
│   ├── z_6f57f923ae69d111_agents_py.html
│   ├── z_6f57f923ae69d111_auth_py.html
│   ├── z_6f57f923ae69d111_campaigns_py.html
│   ├── z_6f57f923ae69d111_candidates_py.html
│   ├── z_6f57f923ae69d111_health_py.html
│   ├── z_6f57f923ae69d111___init___py.html
│   ├── z_6f57f923ae69d111_requisitions_py.html
│   ├── z_72c3329eae2883e9_celery_tasks_py.html
│   ├── z_72c3329eae2883e9_etl_py.html
│   ├── z_72c3329eae2883e9___init___py.html
│   ├── z_7f00d53815207ab7___init___py.html
│   ├── z_7f00d53815207ab7_meta_server_py.html
│   ├── z_7f00d53815207ab7_pinecone_server_py.html
│   ├── z_7f00d53815207ab7_twilio_server_py.html
│   ├── z_defad1a87623d8bf_database_py.html
│   ├── z_defad1a87623d8bf___init___py.html
│   ├── z_defad1a87623d8bf_schemas_py.html
│   ├── z_f0e24b7f04f99860___init___py.html
│   ├── z_f1b38b22aeb65474___init___py.html
│   ├── z_f1b38b22aeb65474_logging_py.html
│   ├── z_f954cdf8d5380f57___init___py.html
│   ├── z_f954cdf8d5380f57_settings_py.html
│   ├── z_fb6de0e1bfba701d_assessor_py.html
│   ├── z_fb6de0e1bfba701d___init___py.html
│   ├── z_fb6de0e1bfba701d_matchmaker_py.html
│   ├── z_fb6de0e1bfba701d_orchestrator_py.html
│   ├── z_fb6de0e1bfba701d_proctor_py.html
│   └── z_fb6de0e1bfba701d_state_py.html
├── logs
├── monitoring
│   ├── alertmanager
│   ├── grafana
│   └── prometheus
├── package.json
├── package-lock.json
├── product-manager.md
├── PROJECT_COMPLETE.md
├── pytest.ini
├── README.md
├── requirements.txt
├── software-architect.md
├── src
│   ├── agents
│   ├── api
│   ├── auth
│   ├── config
│   ├── db
│   ├── __init__.py
│   ├── main.py
│   ├── mcp
│   ├── models
│   ├── nlp
│   ├── security
│   ├── services
│   ├── tasks
│   └── utils
├── tests
│   ├── agents
│   ├── conftest.py
│   ├── integration
│   ├── load_test.py
│   ├── nlp
│   ├── production
│   ├── recovery
│   ├── test_api_auth.py
│   ├── test_auth_jwt.py
│   ├── test_auth_rbac.py
│   └── test_schemas.py
├── tmp
└── venv
    ├── bin
    ├── include
    ├── lib
    ├── lib64 -> lib
    └── pyvenv.cfg

49 directories, 131 files

```

---

## Assistant (Orchestrator · GLM 4.7 · 58.9s)

_Thinking:_

I can see there are two frontend projects:
1. `dashboard/` - This appears to be the employer dashboard
2. `frontend/` - This appears to be a landing page

Let me explore the dashboard structure to understand the current user roles and whether there's any admin view.

**Tool: bash**

**Input:**
```json
{
  "description": "Explore dashboard source structure",
  "command": "tree -L 3 dashboard/src/"
}
```

**Output:**
```
dashboard/src/
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── animations
│   │   └── OptimizedAnimations.tsx
│   ├── APIErrorBoundary.tsx
│   ├── AsyncErrorBoundary.tsx
│   ├── dashboard
│   │   ├── AgentsTab.tsx
│   │   ├── IntegrationsTab.tsx
│   │   ├── MonitoringTab.tsx
│   │   ├── OverviewTab.tsx
│   │   ├── ScorecardsTab.tsx
│   │   ├── SessionsTab.tsx
│   │   ├── SettingsTab.tsx
│   │   └── Sidebar.tsx
│   ├── ErrorBoundary.tsx
│   ├── LazyImage.tsx
│   ├── Toaster.tsx
│   ├── ui
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loading
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── toast
│   └── VirtualList.tsx
├── config
│   └── performance.ts
├── hooks
│   ├── use-api.ts
│   ├── use-optimization.ts
│   ├── use-performance.ts
│   └── use-timeout.ts
├── lib
│   ├── api-client.ts
│   ├── auth.tsx
│   ├── icons.ts
│   ├── security.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validation.ts
├── middleware
├── middleware.ts
└── store
    └── app-store.ts

13 directories, 44 files

```

---

## Assistant (Orchestrator · GLM 4.7 · 38.8s)

_Thinking:_

Let me check the auth system and RBAC to understand the user roles defined in the system.

**Tool: read**

**Input:**
```json
{
  "filePath": "/media/matrix/DATA/opencode_projects/AROHAN/src/auth/rbac.py"
}
```

**Output:**
```
<path>/media/matrix/DATA/opencode_projects/AROHAN/src/auth/rbac.py</path>
<type>file</type>
<content>
1: """
2: AROHAN Role-Based Access Control (RBAC)
3: Comprehensive permission and role management system
4: """
5: 
6: from enum import Enum
7: from typing import List, Set, Dict, Any, Optional
8: from functools import wraps
9: from fastapi import HTTPException, status
10: 
11: from src.models.schemas import UserRole
12: 
13: 
14: # ============================================================================
15: # Permission Definitions
16: # ============================================================================
17: 
18: class Permission(str, Enum):
19:     """System permissions"""
20:     
21:     # Company management
22:     COMPANY_READ = "company:read"
23:     COMPANY_WRITE = "company:write"
24:     COMPANY_DELETE = "company:delete"
25:     COMPANY_SETTINGS = "company:settings"
26:     
27:     # User management
28:     USER_READ = "user:read"
29:     USER_WRITE = "user:write"
30:     USER_DELETE = "user:delete"
31:     USER_INVITE = "user:invite"
32:     
33:     # Requisition management
34:     REQUISITION_READ = "requisition:read"
35:     REQUISITION_WRITE = "requisition:write"
36:     REQUISITION_DELETE = "requisition:delete"
37:     REQUISITION_PUBLISH = "requisition:publish"
38:     
39:     # Campaign management
40:     CAMPAIGN_READ = "campaign:read"
41:     CAMPAIGN_WRITE = "campaign:write"
42:     CAMPAIGN_DELETE = "campaign:delete"
43:     CAMPAIGN_LAUNCH = "campaign:launch"
44:     
45:     # Candidate management
46:     CANDIDATE_READ = "candidate:read"
47:     CANDIDATE_WRITE = "candidate:write"
48:     CANDIDATE_DELETE = "candidate:delete"
49:     CANDIDATE_SHORTLIST = "candidate:shortlist"
50:     CANDIDATE_REJECT = "candidate:reject"
51:     
52:     # Interview management
53:     INTERVIEW_READ = "interview:read"
54:     INTERVIEW_WRITE = "interview:write"
55:     INTERVIEW_DELETE = "interview:delete"
56:     INTERVIEW_START = "interview:start"
57:     INTERVIEW_STOP = "interview:stop"
58:     
59:     # Scorecard management
60:     SCORECARD_READ = "scorecard:read"
61:     SCORECARD_WRITE = "scorecard:write"
62:     SCORECARD_DELETE = "scorecard:delete"
63:     
64:     # Analytics and reporting
65:     ANALYTICS_READ = "analytics:read"
66:     ANALYTICS_EXPORT = "analytics:export"
67:     REPORTS_READ = "reports:read"
68:     REPORTS_GENERATE = "reports:generate"
69:     
70:     # System administration
71:     SYSTEM_READ = "system:read"
72:     SYSTEM_WRITE = "system:write"
73:     SYSTEM_ADMIN = "system:admin"
74:     
75:     # Audit and compliance
76:     AUDIT_READ = "audit:read"
77:     AUDIT_EXPORT = "audit:export"
78:     
79:     # API access
80:     API_READ = "api:read"
81:     API_WRITE = "api:write"
82:     API_DELETE = "api:delete"
83:     
84:     # Agent management
85:     AGENT_READ = "agent:read"
86:     AGENT_WRITE = "agent:write"
87:     AGENT_EXECUTE = "agent:execute"
88:     
89:     # Integration management
90:     INTEGRATION_READ = "integration:read"
91:     INTEGRATION_WRITE = "integration:write"
92:     INTEGRATION_DELETE = "integration:delete"
93: 
94: 
95: # ============================================================================
96: # Role-Permission Mappings
97: # ============================================================================
98: 
99: ROLE_PERMISSIONS: Dict[UserRole, Set[Permission]] = {
100:     # Admin has all permissions
101:     UserRole.ADMIN: {
102:         # Company management
103:         Permission.COMPANY_READ,
104:         Permission.COMPANY_WRITE,
105:         Permission.COMPANY_DELETE,
106:         Permission.COMPANY_SETTINGS,
107:         
108:         # User management
109:         Permission.USER_READ,
110:         Permission.USER_WRITE,
111:         Permission.USER_DELETE,
112:         Permission.USER_INVITE,
113:         
114:         # Requisition management
115:         Permission.REQUISITION_READ,
116:         Permission.REQUISITION_WRITE,
117:         Permission.REQUISITION_DELETE,
118:         Permission.REQUISITION_PUBLISH,
119:         
120:         # Campaign management
121:         Permission.CAMPAIGN_READ,
122:         Permission.CAMPAIGN_WRITE,
123:         Permission.CAMPAIGN_DELETE,
124:         Permission.CAMPAIGN_LAUNCH,
125:         
126:         # Candidate management
127:         Permission.CANDIDATE_READ,
128:         Permission.CANDIDATE_WRITE,
129:         Permission.CANDIDATE_DELETE,
130:         Permission.CANDIDATE_SHORTLIST,
131:         Permission.CANDIDATE_REJECT,
132:         
133:         # Interview management
134:         Permission.INTERVIEW_READ,
135:         Permission.INTERVIEW_WRITE,
136:         Permission.INTERVIEW_DELETE,
137:         Permission.INTERVIEW_START,
138:         Permission.INTERVIEW_STOP,
139:         
140:         # Scorecard management
141:         Permission.SCORECARD_READ,
142:         Permission.SCORECARD_WRITE,
143:         Permission.SCORECARD_DELETE,
144:         
145:         # Analytics and reporting
146:         Permission.ANALYTICS_READ,
147:         Permission.ANALYTICS_EXPORT,
148:         Permission.REPORTS_READ,
149:         Permission.REPORTS_GENERATE,
150:         
151:         # System administration
152:         Permission.SYSTEM_READ,
153:         Permission.SYSTEM_WRITE,
154:         Permission.SYSTEM_ADMIN,
155:         
156:         # Audit and compliance
157:         Permission.AUDIT_READ,
158:         Permission.AUDIT_EXPORT,
159:         
160:         # API access
161:         Permission.API_READ,
162:         Permission.API_WRITE,
163:         Permission.API_DELETE,
164:         
165:         # Agent management
166:         Permission.AGENT_READ,
167:         Permission.AGENT_WRITE,
168:         Permission.AGENT_EXECUTE,
169:         
170:         # Integration management
171:         Permission.INTEGRATION_READ,
172:         Permission.INTEGRATION_WRITE,
173:         Permission.INTEGRATION_DELETE,
174:     },
175:     
176:     # Recruiter has most permissions except system admin
177:     UserRole.RECRUITER: {
178:         # Company management
179:         Permission.COMPANY_READ,
180:         Permission.COMPANY_SETTINGS,
181:         
182:         # User management
183:         Permission.USER_READ,
184:         Permission.USER_INVITE,
185:         
186:         # Requisition management
187:         Permission.REQUISITION_READ,
188:         Permission.REQUISITION_WRITE,
189:         Permission.REQUISITION_PUBLISH,
190:         
191:         # Campaign management
192:         Permission.CAMPAIGN_READ,
193:         Permission.CAMPAIGN_WRITE,
194:         Permission.CAMPAIGN_LAUNCH,
195:         
196:         # Candidate management
197:         Permission.CANDIDATE_READ,
198:         Permission.CANDIDATE_WRITE,
199:         Permission.CANDIDATE_SHORTLIST,
200:         Permission.CANDIDATE_REJECT,
201:         
202:         # Interview management
203:         Permission.INTERVIEW_READ,
204:         Permission.INTERVIEW_WRITE,
205:         Permission.INTERVIEW_START,
206:         Permission.INTERVIEW_STOP,
207:         
208:         # Scorecard management
209:         Permission.SCORECARD_READ,
210:         Permission.SCORECARD_WRITE,
211:         
212:         # Analytics and reporting
213:         Permission.ANALYTICS_READ,
214:         Permission.ANALYTICS_EXPORT,
215:         Permission.REPORTS_READ,
216:         Permission.REPORTS_GENERATE,
217:         
218:         # Audit and compliance
219:         Permission.AUDIT_READ,
220:         
221:         # API access
222:         Permission.API_READ,
223:         Permission.API_WRITE,
224:         
225:         # Agent management
226:         Permission.AGENT_READ,
227:         Permission.AGENT_EXECUTE,
228:         
229:         # Integration management
230:         Permission.INTEGRATION_READ,
231:     },
232:     
233:     # Viewer has read-only permissions
234:     UserRole.VIEWER: {
235:         # Company management
236:         Permission.COMPANY_READ,
237:         
238:         # User management
239:         Permission.USER_READ,
240:         
241:         # Requisition management
242:         Permission.REQUISITION_READ,
243:         
244:         # Campaign management
245:         Permission.CAMPAIGN_READ,
246:         
247:         # Candidate management
248:         Permission.CANDIDATE_READ,
249:         
250:         # Interview management
251:         Permission.INTERVIEW_READ,
252:         
253:         # Scorecard management
254:         Permission.SCORECARD_READ,
255:         
256:         # Analytics and reporting
257:         Permission.ANALYTICS_READ,
258:         Permission.REPORTS_READ,
259:         
260:         # Audit and compliance
261:         Permission.AUDIT_READ,
262:         
263:         # API access
264:         Permission.API_READ,
265:         
266:         # Agent management
267:         Permission.AGENT_READ,
268:         
269:         # Integration management
270:         Permission.INTEGRATION_READ,
271:     },
272: }
273: 
274: 
275: # ============================================================================
276: # RBAC Utilities
277: # ============================================================================
278: 
279: class RBACManager:
280:     """Role-Based Access Control Manager"""
281:     
282:     @staticmethod
283:     def get_role_permissions(role: UserRole) -> Set[Permission]:
284:         """Get all permissions for a role
285:         
286:         Args:
287:             role: User role
288:             
289:         Returns:
290:             Set[Permission]: Set of permissions
291:         """
292:         return ROLE_PERMISSIONS.get(role, set())
293:     
294:     @staticmethod
295:     def has_permission(role: UserRole, permission: Permission) -> bool:
296:         """Check if role has specific permission
297:         
298:         Args:
299:             role: User role
300:             permission: Permission to check
301:             
302:         Returns:
303:             bool: True if role has permission
304:         """
305:         role_permissions = RBACManager.get_role_permissions(role)
306:         return permission in role_permissions
307:     
308:     @staticmethod
309:     def has_any_permission(role: UserRole, permissions: List[Permission]) -> bool:
310:         """Check if role has any of the specified permissions
311:         
312:         Args:
313:             role: User role
314:             permissions: List of permissions to check
315:             
316:         Returns:
317:             bool: True if role has any of the permissions
318:         """
319:         role_permissions = RBACManager.get_role_permissions(role)
320:         return any(permission in role_permissions for permission in permissions)
321:     
322:     @staticmethod
323:     def has_all_permissions(role: UserRole, permissions: List[Permission]) -> bool:
324:         """Check if role has all of the specified permissions
325:         
326:         Args:
327:             role: User role
328:             permissions: List of permissions to check
329:             
330:         Returns:
331:             bool: True if role has all of the permissions
332:         """
333:         role_permissions = RBACManager.get_role_permissions(role)
334:         return all(permission in role_permissions for permission in permissions)
335:     
336:     @staticmethod
337:     def get_permissions_list(role: UserRole) -> List[str]:
338:         """Get list of permission strings for a role
339:         
340:         Args:
341:             role: User role
342:             
343:         Returns:
344:             List[str]: List of permission strings
345:         """
346:         permissions = RBACManager.get_role_permissions(role)
347:         return [permission.value for permission in permissions]
348:     
349:     @staticmethod
350:     def check_permission(
351:         role: UserRole,
352:         permission: Permission,
353:         raise_exception: bool = True
354:     ) -> bool:
355:         """Check permission and optionally raise exception
356:         
357:         Args:
358:             role: User role
359:             permission: Permission to check
360:             raise_exception: Whether to raise exception on failure
361:             
362:         Returns:
363:             bool: True if permission granted
364:             
365:         Raises:
366:             HTTPException: If permission denied and raise_exception is True
367:         """
368:         if RBACManager.has_permission(role, permission):
369:             return True
370:         
371:         if raise_exception:
372:             raise HTTPException(
373:                 status_code=status.HTTP_403_FORBIDDEN,
374:                 detail=f"Permission denied: {permission.value}",
375:             )
376:         
377:         return False
378:     
379:     @staticmethod
380:     def check_any_permission(
381:         role: UserRole,
382:         permissions: List[Permission],
383:         raise_exception: bool = True
384:     ) -> bool:
385:         """Check any permission and optionally raise exception
386:         
387:         Args:
388:             role: User role
389:             permissions: List of permissions to check
390:             raise_exception: Whether to raise exception on failure
391:             
392:         Returns:
393:             bool: True if any permission granted
394:             
395:         Raises:
396:             HTTPException: If all permissions denied and raise_exception is True
397:         """
398:         if RBACManager.has_any_permission(role, permissions):
399:             return True
400:         
401:         if raise_exception:
402:             raise HTTPException(
403:                 status_code=status.HTTP_403_FORBIDDEN,
404:                 detail=f"Permission denied: Required one of {[p.value for p in permissions]}",
405:             )
406:         
407:         return False
408:     
409:     @staticmethod
410:     def check_all_permissions(
411:         role: UserRole,
412:         permissions: List[Permission],
413:         raise_exception: bool = True
414:     ) -> bool:
415:         """Check all permissions and optionally raise exception
416:         
417:         Args:
418:             role: User role
419:             permissions: List of permissions to check
420:             raise_exception: Whether to raise exception on failure
421:             
422:         Returns:
423:             bool: True if all permissions granted
424:             
425:         Raises:
426:             HTTPException: If any permission denied and raise_exception is True
427:         """
428:         if RBACManager.has_all_permissions(role, permissions):
429:             return True
430:         
431:         if raise_exception:
432:             raise HTTPException(
433:                 status_code=status.HTTP_403_FORBIDDEN,
434:                 detail=f"Permission denied: Required all of {[p.value for p in permissions]}",
435:             )
436:         
437:         return False
438: 
439: 
440: # ============================================================================
441: # RBAC Decorators
442: # ============================================================================
443: 
444: def require_permission(permission: Permission):
445:     """Decorator to require specific permission
446:     
447:     Args:
448:         permission: Required permission
449:         
450:     Returns:
451:         Decorator function
452:     """
453:     def decorator(func):
454:         @wraps(func)
455:         async def wrapper(*args, **kwargs):
456:             # Get current user from kwargs
457:             current_user = kwargs.get('current_user')
458:             
459:             if current_user is None:
460:                 raise HTTPException(
461:                     status_code=status.HTTP_401_UNAUTHORIZED,
462:                     detail="Authentication required",
463:                 )
464:             
465:             # Check permission
466:             RBACManager.check_permission(
467:                 UserRole(current_user.role),
468:                 permission
469:             )
470:             
471:             return await func(*args, **kwargs)
472:         
473:         return wrapper
474:     return decorator
475: 
476: 
477: def require_any_permission(*permissions: Permission):
478:     """Decorator to require any of the specified permissions
479:     
480:     Args:
481:         *permissions: List of required permissions
482:         
483:     Returns:
484:         Decorator function
485:     """
486:     def decorator(func):
487:         @wraps(func)
488:         async def wrapper(*args, **kwargs):
489:             # Get current user from kwargs
490:             current_user = kwargs.get('current_user')
491:             
492:             if current_user is None:
493:                 raise HTTPException(
494:                     status_code=status.HTTP_401_UNAUTHORIZED,
495:                     detail="Authentication required",
496:                 )
497:             
498:             # Check any permission
499:             RBACManager.check_any_permission(
500:                 UserRole(current_user.role),
501:                 list(permissions)
502:             )
503:             
504:             return await func(*args, **kwargs)
505:         
506:         return wrapper
507:     return decorator
508: 
509: 
510: def require_all_permissions(*permissions: Permission):
511:     """Decorator to require all of the specified permissions
512:     
513:     Args:
514:         *permissions: List of required permissions
515:         
516:     Returns:
517:         Decorator function
518:     """
519:     def decorator(func):
520:         @wraps(func)
521:         async def wrapper(*args, **kwargs):
522:             # Get current user from kwargs
523:             current_user = kwargs.get('current_user')
524:             
525:             if current_user is None:
526:                 raise HTTPException(
527:                     status_code=status.HTTP_401_UNAUTHORIZED,
528:                     detail="Authentication required",
529:                 )
530:             
531:             # Check all permissions
532:             RBACManager.check_all_permissions(
533:                 UserRole(current_user.role),
534:                 list(permissions)
535:             )
536:             
537:             return await func(*args, **kwargs)
538:         
539:         return wrapper
540:     return decorator
541: 
542: 
543: # ============================================================================
544: # Permission Groups
545: # ============================================================================
546: 
547: class PermissionGroup:
548:     """Predefined permission groups for common use cases"""
549:     
550:     # Full access (admin only)
551:     FULL_ACCESS = set(Permission)
552:     
553:     # Recruiter access
554:     RECRUITER_ACCESS = ROLE_PERMISSIONS[UserRole.RECRUITER]
555:     
556:     # Viewer access
557:     VIEWER_ACCESS = ROLE_PERMISSIONS[UserRole.VIEWER]
558:     
559:     # Read-only access
560:     READ_ONLY = {
561:         Permission.COMPANY_READ,
562:         Permission.USER_READ,
563:         Permission.REQUISITION_READ,
564:         Permission.CAMPAIGN_READ,
565:         Permission.CANDIDATE_READ,
566:         Permission.INTERVIEW_READ,
567:         Permission.SCORECARD_READ,
568:         Permission.ANALYTICS_READ,
569:         Permission.REPORTS_READ,
570:         Permission.AUDIT_READ,
571:         Permission.API_READ,
572:         Permission.AGENT_READ,
573:         Permission.INTEGRATION_READ,
574:     }
575:     
576:     # Hiring workflow
577:     HIRING_WORKFLOW = {
578:         Permission.REQUISITION_READ,
579:         Permission.REQUISITION_WRITE,
580:         Permission.REQUISITION_PUBLISH,
581:         Permission.CAMPAIGN_READ,
582:         Permission.CAMPAIGN_WRITE,
583:         Permission.CAMPAIGN_LAUNCH,
584:         Permission.CANDIDATE_READ,
585:         Permission.CANDIDATE_WRITE,
586:         Permission.CANDIDATE_SHORTLIST,
587:         Permission.CANDIDATE_REJECT,
588:         Permission.INTERVIEW_READ,
589:         Permission.INTERVIEW_WRITE,
590:         Permission.INTERVIEW_START,
591:         Permission.INTERVIEW_STOP,
592:         Permission.SCORECARD_READ,
593:         Permission.SCORECARD_WRITE,
594:     }
595:     
596:     # Analytics and reporting
597:     ANALYTICS_ACCESS = {
598:         Permission.ANALYTICS_READ,
599:         Permission.ANALYTICS_EXPORT,
600:         Permission.REPORTS_READ,
601:         Permission.REPORTS_GENERATE,
602:     }
603:     
604:     # System administration
605:     SYSTEM_ADMIN = {
606:         Permission.SYSTEM_READ,
607:         Permission.SYSTEM_WRITE,
608:         Permission.SYSTEM_ADMIN,
609:         Permission.AUDIT_READ,
610:         Permission.AUDIT_EXPORT,
611:     }
612: 
613: 
614: # Create RBAC manager instance
615: rbac_manager = RBACManager()

(End of file - total 615 lines)
</content>
```

---

## Assistant (Orchestrator · GLM 4.7 · 38.0s)

_Thinking:_

Now let me check the user roles defined in the schemas to understand the complete user hierarchy.

**Tool: read**

**Input:**
```json
{
  "limit": 100,
  "filePath": "/media/matrix/DATA/opencode_projects/AROHAN/src/models/schemas.py"
}
```

**Output:**
```
<path>/media/matrix/DATA/opencode_projects/AROHAN/src/models/schemas.py</path>
<type>file</type>
<content>
1: """
2: AROHAN Pydantic Models
3: Request/Response models for API endpoints
4: """
5: 
6: from pydantic import BaseModel, Field, EmailStr, validator
7: from typing import Optional, List, Dict, Any
8: from datetime import datetime
9: from uuid import UUID
10: from enum import Enum
11: 
12: 
13: # ============================================================================
14: # Base Models
15: # ============================================================================
16: 
17: class BaseResponse(BaseModel):
18:     """Base response model with common fields"""
19:     success: bool = True
20:     message: Optional[str] = None
21:     timestamp: datetime = Field(default_factory=datetime.utcnow)
22: 
23: 
24: class ErrorResponse(BaseModel):
25:     """Error response model"""
26:     success: bool = False
27:     error: str
28:     message: Optional[str] = None
29:     details: Optional[Dict[str, Any]] = None
30:     timestamp: datetime = Field(default_factory=datetime.utcnow)
31: 
32: 
33: # ============================================================================
34: # Company Models
35: # ============================================================================
36: 
37: class CompanyCreate(BaseModel):
38:     """Company creation request"""
39:     name: str = Field(..., min_length=1, max_length=255)
40:     domain: str = Field(..., min_length=1, max_length=255)
41:     industry: Optional[str] = Field(None, max_length=100)
42:     size: Optional[str] = Field(None, pattern="^(1-10|11-50|51-200|201-500|500+)$")
43:     plan: str = Field(default="startup", pattern="^(startup|growth|enterprise)$")
44:     settings: Optional[Dict[str, Any]] = None
45: 
46:     @validator('domain')
47:     def validate_domain(cls, v):
48:         if not v.replace('.', '').replace('-', '').isalnum():
49:             raise ValueError('Domain must contain only alphanumeric characters, dots, and hyphens')
50:         return v.lower()
51: 
52: 
53: class CompanyUpdate(BaseModel):
54:     """Company update request"""
55:     name: Optional[str] = Field(None, min_length=1, max_length=255)
56:     industry: Optional[str] = Field(None, max_length=100)
57:     size: Optional[str] = Field(None, pattern="^(1-10|11-50|51-200|201-500|500+)$")
58:     plan: Optional[str] = Field(None, pattern="^(startup|growth|enterprise)$")
59:     status: Optional[str] = Field(None, pattern="^(active|suspended|deleted)$")
60:     settings: Optional[Dict[str, Any]] = None
61: 
62: 
63: class CompanyResponse(BaseModel):
64:     """Company response"""
65:     id: UUID
66:     name: str
67:     domain: str
68:     industry: Optional[str]
69:     size: Optional[str]
70:     plan: str
71:     status: str
72:     settings: Dict[str, Any]
73:     created_at: datetime
74:     updated_at: datetime
75: 
76:     class Config:
77:         from_attributes = True
78: 
79: 
80: # ============================================================================
81: # User Models
82: # ============================================================================
83: 
84: class UserRole(str, Enum):
85:     """User role enumeration"""
86:     ADMIN = "admin"
87:     VIEWER = "viewer"
88:     RECRUITER = "recruiter"
89: 
90: 
91: class UserCreate(BaseModel):
92:     """User creation request"""
93:     company_id: UUID
94:     email: EmailStr
95:     phone: Optional[str] = Field(None, max_length=20)
96:     name: str = Field(..., min_length=1, max_length=255)
97:     role: UserRole = UserRole.VIEWER
98:     password: str = Field(..., min_length=8, max_length=128)
99:     settings: Optional[Dict[str, Any]] = None
100: 

(Showing lines 1-100 of 584. Use offset=101 to continue.)
</content>
```

---

## Assistant (Orchestrator · GLM 4.7 · 324.2s)

_Thinking:_

Perfect! Now I understand the user roles. Let me also check the dashboard page to see how it's currently structured and whether there's any role-based UI rendering.

**Tool: read**

**Input:**
```json
{
  "filePath": "/media/matrix/DATA/opencode_projects/AROHAN/dashboard/src/app/page.tsx"
}
```

**Output:**
```
<path>/media/matrix/DATA/opencode_projects/AROHAN/dashboard/src/app/page.tsx</path>
<type>file</type>
<content>
1: "use client";
2: 
3: import { useState, lazy, Suspense } from "react";
4: import { Toaster } from "sonner";
5: import { ErrorBoundary } from "@/components/ErrorBoundary";
6: import { Toaster as CustomToaster } from "@/components/Toaster";
7: import { FullPageLoading } from "@/components/ui/loading/LoadingSpinner";
8: import Sidebar from "@/components/dashboard/Sidebar";
9: 
10: // Dynamic imports for code splitting
11: const OverviewTab = lazy(() => import("@/components/dashboard/OverviewTab").then(m => ({ default: m.default })));
12: const AgentsTab = lazy(() => import("@/components/dashboard/AgentsTab").then(m => ({ default: m.default })));
13: const SessionsTab = lazy(() => import("@/components/dashboard/SessionsTab").then(m => ({ default: m.default })));
14: const IntegrationsTab = lazy(() => import("@/components/dashboard/IntegrationsTab").then(m => ({ default: m.default })));
15: const ScorecardsTab = lazy(() => import("@/components/dashboard/ScorecardsTab").then(m => ({ default: m.default })));
16: const MonitoringTab = lazy(() => import("@/components/dashboard/MonitoringTab").then(m => ({ default: m.default })));
17: const SettingsTab = lazy(() => import("@/components/dashboard/SettingsTab").then(m => ({ default: m.default })));
18: 
19: // Loading fallback component
20: function TabLoadingFallback() {
21:   return (
22:     <div className="flex items-center justify-center min-h-[400px]">
23:       <FullPageLoading />
24:     </div>
25:   );
26: }
27: 
28: export default function DashboardPage() {
29:   const [activeTab, setActiveTab] = useState("overview");
30: 
31:   const renderTab = () => {
32:     switch (activeTab) {
33:       case "overview":
34:         return (
35:           <Suspense fallback={<TabLoadingFallback />}>
36:             <OverviewTab />
37:           </Suspense>
38:         );
39:       case "agents":
40:         return (
41:           <Suspense fallback={<TabLoadingFallback />}>
42:             <AgentsTab />
43:           </Suspense>
44:         );
45:       case "sessions":
46:         return (
47:           <Suspense fallback={<TabLoadingFallback />}>
48:             <SessionsTab />
49:           </Suspense>
50:         );
51:       case "integrations":
52:         return (
53:           <Suspense fallback={<TabLoadingFallback />}>
54:             <IntegrationsTab />
55:           </Suspense>
56:         );
57:       case "scorecards":
58:         return (
59:           <Suspense fallback={<TabLoadingFallback />}>
60:             <ScorecardsTab />
61:           </Suspense>
62:         );
63:       case "monitoring":
64:         return (
65:           <Suspense fallback={<TabLoadingFallback />}>
66:             <MonitoringTab />
67:           </Suspense>
68:         );
69:       case "settings":
70:         return (
71:           <Suspense fallback={<TabLoadingFallback />}>
72:             <SettingsTab />
73:           </Suspense>
74:         );
75:       default:
76:         return (
77:           <Suspense fallback={<TabLoadingFallback />}>
78:             <OverviewTab />
79:           </Suspense>
80:         );
81:     }
82:   };
83: 
84:   return (
85:     <ErrorBoundary>
86:       <div className="min-h-screen bg-black flex">
87:         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
88:         <main className="flex-1 p-8 overflow-auto">
89:           {renderTab()}
90:         </main>
91:       </div>
92:       <CustomToaster />
93:       <Toaster />
94:     </ErrorBoundary>
95:   );
96: }

(End of file - total 96 lines)
</content>

<system-reminder>
Instructions from: /media/matrix/DATA/opencode_projects/AROHAN/dashboard/AGENTS.md
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

</system-reminder>
```

---

## Assistant (Orchestrator · GLM 4.7 · 28.6s)

_Thinking:_

Now let me check the PRD to understand the intended user roles and dashboard requirements.

**Tool: read**

**Input:**
```json
{
  "limit": 150,
  "filePath": "/media/matrix/DATA/opencode_projects/AROHAN/docs/PRD.md"
}
```

**Output:**
```
<path>/media/matrix/DATA/opencode_projects/AROHAN/docs/PRD.md</path>
<type>file</type>
<content>
1: # PRD: Employer ATS Dashboard
2: 
3: **Status**: Draft  
4: **Author**: Alex (Product Manager)  
5: **Last Updated**: April 23, 2026  
6: **Version**: 1.0  
7: **Stakeholders**: Frontend Developer, Backend Architect, Product Manager
8: 
9: ---
10: 
11: ## 1. Problem Statement
12: 
13: **What specific user pain or business opportunity are we solving?**
14: 
15: Employers currently have **zero visibility** into the AROHAN screening pipeline. After candidates complete voice interviews via IVR or WhatsApp, the Proctor, Assessor, and Matchmaker agents generate rich data — transcripts, scorecards, confidence scores, and geo-aware job matches — but employers cannot access this information. They must rely on manual phone calls or email reports from the AROHAN team, creating a **critical bottleneck** in the hiring workflow.
16: 
17: **Who experiences this problem, how often, and what is the cost of not solving it?**
18: 
19: - **Primary Persona**: HR managers and operations leads at logistics, retail, and warehouse companies (50–500 employees)
20: - **Frequency**: Daily — every screening campaign requires result review
21: - **Cost of not solving**: 
22:   - **Time waste**: 2–3 hours per campaign spent on manual coordination
23:   - **Delayed hiring**: 24–48 hour lag between screening completion and employer action
24:   - **Lost candidates**: Competitors with faster review cycles capture top talent
25:   - **Trust erosion**: Employers question platform value without visibility
26: 
27: **Evidence:**
28: 
29: - **User research**: 8 interviews with logistics HR managers — 100% cited "real-time result visibility" as top-3 priority
30: - **Behavioral data**: 62% of employers request status updates within 12 hours of campaign launch
31: - **Support signal**: 45 tickets/month asking for "screening results" or "candidate status"
32: - **Competitive signal**: Competitors like Zoho Recruit and Freshtworks offer real-time dashboards
33: 
34: ---
35: 
36: ## 2. Goals & Success Metrics
37: 
38: | Goal | Metric | Current Baseline | Target | Measurement Window |
39: |------|--------|-----------------|--------|--------------------|
40: | **Employer activation** | % employers logging in within 24h of campaign launch | 0% (no dashboard exists) | 65% | 30 days post-launch |
41: | **Time-to-shortlist** | Hours from screening completion to employer shortlist action | 48h (manual process) | <4h | 60 days post-launch |
42: | **Campaign efficiency** | % employers who review ≥80% of candidates per campaign | N/A | 70% | 90 days post-launch |
43: | **Support reduction** | Tickets/week requesting screening results | 45 | <10 | 90 days post-launch |
44: | **Retention** | 30-day employer return rate | 58% | 75% | Q3 cohort |
45: 
46: ---
47: 
48: ## 3. Non-Goals
49: 
50: Explicitly state what this initiative will **NOT** address in this iteration:
51: 
52: - ❌ We are **not** building a full ATS with job posting, applicant tracking, or offer management (separate product, v3.0)
53: - ❌ We are **not** supporting employer-initiated candidate outreach or WhatsApp messaging (v2.2)
54: - ❌ We are **not** adding real-time interview monitoring or live call listening (privacy concern, v3.0)
55: - ❌ We are **not** supporting bulk candidate data export or CSV downloads (v2.1.1)
56: - ❌ We are **not** building mobile apps for employers (analytics show <12% mobile usage for HR workflows)
57: 
58: ---
59: 
60: ## 4. User Personas & Stories
61: 
62: ### Primary Persona: **Priya Sharma** — HR Manager, Logistics Company
63: **Context**: Mid-sized logistics firm (200 employees), 3–5 hiring campaigns/month, manages 50–100 candidates per campaign. Tech-savvy but time-poor. Needs to make fast hiring decisions for delivery partner roles.
64: 
65: **Core user stories with acceptance criteria:**
66: 
67: #### Story 1: View Campaign Results
68: **As** Priya, **I want** to see all candidates from a screening campaign in one view **so that** I can quickly identify top performers without manual coordination.
69: 
70: **Acceptance Criteria**:
71: - [ ] Given Priya has logged in, when she navigates to "Campaigns", then she sees a list of all active and completed campaigns
72: - [ ] Given Priya selects a campaign, when the page loads, then she sees a table of all candidates with: name, phone, overall score, language fluency, shortlist status, and timestamp
73: - [ ] Given the candidate list, when Priya sorts by "overall score", then candidates are ordered highest-to-lowest score
74: - [ ] Given the candidate list, when Priya filters by "shortlisted", then only shortlisted candidates are displayed
75: - [ ] Performance: Candidate list loads in under 800ms for campaigns with ≤200 candidates
76: 
77: #### Story 2: Review Individual Candidate Scorecard
78: **As** Priya, **I want** to click on a candidate and see their detailed scorecard **so that** I can understand why they scored high/low and make informed hiring decisions.
79: 
80: **Acceptance Criteria**:
81: - [ ] Given Priya clicks on a candidate, when the detail view loads, then she sees: overall score (1-100), communication score, domain knowledge score, situational judgment score, confidence score, language fluency, and assessor notes
82: - [ ] Given the scorecard view, when Priya scrolls, then she sees the full interview transcript with speaker labels and timestamps
83: - [ ] Given the scorecard view, when Priya views the transcript, then she can click on any segment to hear the original audio (if available)
84: - [ ] Given the scorecard view, when Priya views the "matched requisitions" section, then she sees all job roles within 50km of the candidate's pin code that match their score threshold
85: - [ ] Performance: Scorecard detail view loads in under 500ms
86: 
87: #### Story 3: Shortlist Candidates
88: **As** Priya, **I want** to mark candidates as "shortlisted" or "rejected" **so that** I can track my hiring decisions and prepare for next steps.
89: 
90: **Acceptance Criteria**:
91: - [ ] Given Priya is viewing a candidate detail, when she clicks "Shortlist", then the candidate's status updates to "shortlisted" and the action is logged with timestamp
92: - [ ] Given Priya is viewing the candidate list, when she uses bulk actions to select multiple candidates and click "Shortlist All", then all selected candidates are updated to "shortlisted" status
93: - [ ] Given Priya has shortlisted candidates, when she navigates to the "Shortlisted" tab, then she sees only shortlisted candidates across all campaigns
94: - [ ] Given Priya shortlists a candidate, when the action completes, then a success notification appears: "Candidate shortlisted successfully"
95: - [ ] Performance: Shortlist action completes in under 300ms
96: 
97: #### Story 4: Filter and Search Candidates
98: **As** Priya, **I want** to filter candidates by score range, language, and location **so that** I can quickly find candidates who meet specific role requirements.
99: 
100: **Acceptance Criteria**:
101: - [ ] Given Priya is viewing a campaign, when she applies a score filter (e.g., "≥70"), then only candidates with overall score ≥70 are displayed
102: - [ ] Given Priya applies a language filter (e.g., "Hindi"), then only candidates with detected language "hi-IN" are displayed
103: - [ ] Given Priya searches by phone number, when she enters a partial number, then candidates matching that number are displayed
104: - [ ] Given Priya has multiple filters active, when she clears one filter, then the remaining filters stay active
105: - [ ] Performance: Filter updates complete in under 400ms for campaigns with ≤200 candidates
106: 
107: #### Story 5: View Requisition Management
108: **As** Priya, **I want** to see all open job requisitions with candidate match counts **so that** I can prioritize which roles need more screening volume.
109: 
110: **Acceptance Criteria**:
111: - [ ] Given Priya navigates to "Requisitions", when the page loads, then she sees a list of all open requisitions with: role name, location, required score threshold, total candidates screened, candidates matched, and candidates shortlisted
112: - [ ] Given Priya views a requisition, when she clicks on it, then she sees a list of all matched candidates for that role
113: - [ ] Given a requisition has zero matched candidates, when Priya views it, then she sees a recommendation: "Consider lowering score threshold or expanding geo-radius"
114: - [ ] Performance: Requisition list loads in under 600ms
115: 
116: ---
117: 
118: ## 5. Solution Overview
119: 
120: The **Employer ATS Dashboard** is a **read-only, Next.js 14 + shadcn/ui** web application that provides HR managers with real-time visibility into the AROHAN screening pipeline. The dashboard connects to the existing PostgreSQL database via FastAPI endpoints, displaying candidate data, scorecards, transcripts, and geo-aware job matches in a clean, responsive interface.
121: 
122: **Key UX Flows:**
123: 
124: 1. **Campaign Discovery**: Employers land on a "Campaigns" page showing all screening campaigns with status (active/completed), candidate count, and last activity timestamp. Clicking a campaign reveals the candidate list.
125: 
126: 2. **Candidate Review**: Employers scan the candidate table sorted by overall score, using filters to narrow down to top performers. Clicking a candidate opens the detailed scorecard view.
127: 
128: 3. **Decision Making**: In the scorecard view, employers review the overall score, sub-scores (communication, domain knowledge, situational judgment, confidence), language fluency, and assessor notes. They can read the full transcript and listen to audio segments for context.
129: 
130: 4. **Shortlist Action**: Employers mark candidates as "shortlisted" or "rejected" with a single click. Bulk actions allow shortlisting multiple candidates at once. All actions are logged with timestamps.
131: 
132: 5. **Requisition Management**: Employers view all open job requisitions with match counts, helping them prioritize which roles need more screening volume or threshold adjustments.
133: 
134: **Core Value Being Delivered:**
135: 
136: - **Speed**: Reduce time-to-shortlist from 48 hours to <4 hours
137: - **Visibility**: Real-time access to screening results without manual coordination
138: - **Confidence**: Detailed scorecards and transcripts enable informed hiring decisions
139: - **Efficiency**: Filters, search, and bulk actions streamline review workflows
140: 
141: **Key Design Decisions:**
142: 
143: - **Read-only architecture**: We chose a read-only dashboard for v1 because employer-initiated actions (job posting, candidate outreach) require significant backend changes and introduce complexity. Trade-off: Limited functionality, but faster time-to-market and lower risk.
144: 
145: - **Next.js + shadcn/ui over custom React**: We chose shadcn/ui because it provides pre-built, accessible components that match our design system, reducing development time by ~40%. Trade-off: Less customization flexibility, but faster iteration.
146: 
147: - **Server-side rendering over client-side**: We chose SSR for better SEO and initial load performance on the Latitude 3460 hardware. Trade-off: Slightly more complex data fetching, but better user experience on low-bandwidth connections.
148: 
149: - **Defer bulk export to v2.1.1**: We are deferring CSV export because analytics show <15% of employers request it in early adoption. Trade-off: Missing feature for power users, but faster core delivery.
150: 

(Showing lines 1-150 of 226. Use offset=151 to continue.)
</content>
```

---

## Assistant (Orchestrator · GLM 4.7 · 64.8s)

_Thinking:_

Now I have a clear understanding of the Arohan system architecture. Let me summarize my findings:

1. **Current Dashboard**: The existing dashboard is designed for **employers** (HR managers, operations leads) to view screening results, scorecards, and manage candidates.

2. **User Roles Defined**: The system has three user roles:
   - **ADMIN**: Full system access including system administration, user management, company management, etc.
   - **RECRUITER**: Most permissions except system admin - can manage requisitions, campaigns, candidates, interviews, etc.
   - **VIEWER**: Read-only permissions - can view but not modify most data

3. **Missing Admin View**: There is NO separate admin dashboard/view currently implemented. The existing dashboard appears to be a single-view application that doesn't differentiate between admin and employer views.

4. **Do we need an admin view?** Based on the RBAC system and the comprehensive permissions defined for ADMIN role, YES - we absolutely need an admin view. The admin role has permissions for:
   - System administration (SYSTEM_READ, SYSTEM_WRITE, SYSTEM_ADMIN)
   - User management (USER_READ, USER_WRITE, USER_DELETE, USER_INVITE)
   - Company management (COMPANY_READ, COMPANY_WRITE, COMPANY_DELETE, COMPANY_SETTINGS)
   - Audit and compliance (AUDIT_READ, AUDIT_EXPORT)
   - API management (API_READ, API_WRITE, API_DELETE)
   - Integration management (INTEGRATION_READ, INTEGRATION_WRITE, INTEGRATION_DELETE)

These are clearly administrative functions that should not be exposed to regular employers/recruiters.

Let me provide a comprehensive answer to the user.

Based on my analysis of the Arohan codebase, here's the complete picture:

## Current Dashboard Architecture

**Yes, the existing dashboard is designed for employers** - specifically HR managers and operations leads at logistics, retail, and warehouse companies. The PRD clearly states it's an "Employer ATS Dashboard" for viewing screening results, scorecards, and managing candidates.

## User Roles Defined in System

The backend has **three user roles** with comprehensive RBAC:

### 1. **ADMIN** (Super Admin)
- **Full system access** including:
  - System administration (SYSTEM_READ, SYSTEM_WRITE, SYSTEM_ADMIN)
  - User management (create, delete, invite users)
  - Company management (create, delete, modify companies)
  - Audit and compliance access
  - API management
  - Integration management
  - All recruiter + viewer permissions

### 2. **RECRUITER** (Employer/HR Manager)
- **Most permissions except system admin**:
  - Company settings (read/write)
  - User invitations
  - Requisition management (create, publish)
  - Campaign management (launch, manage)
  - Candidate management (shortlist, reject)
  - Interview management
  - Scorecard management
  - Analytics and reporting
  - Agent execution

### 3. **VIEWER** (Read-only Employer)
- **Read-only access**:
  - View companies, users, requisitions, campaigns
  - View candidates, interviews, scorecards
  - View analytics and reports
  - No write/delete permissions

## Missing Admin View - **YES, We Need It!**

**There is currently NO separate admin dashboard/view.** The existing dashboard appears to be a single-view application that doesn't differentiate between admin and employer interfaces.

### Why Admin View is Critical:

1. **User Management**: Admins need to create/delete user accounts, manage permissions
2. **Company Management**: Admins need to onboard/offboard companies, manage subscriptions
3. **System Monitoring**: Admins need access to system health, performance metrics
4. **Audit & Compliance**: Admins need access to audit logs, compliance reports
5. **API & Integration Management**: Admins need to manage API keys, third-party integrations
6. **Billing & Subscriptions**: Admins need to manage company plans, billing

### Recommended Admin Dashboard Features:

```
Admin Dashboard should include:
├── User Management
│   ├── Create/Delete users
│   ├── Assign roles (Admin/Recruiter/Viewer)
│   ├── Manage user permissions
│   └── User activity logs
├── Company Management  
│   ├── Onboard new companies
│   ├── Manage company settings
│   ├── Subscription/billing management
│   └── Company usage analytics
├── System Administration
│   ├── System health monitoring
│   ├── Performance metrics
│   ├── Error logs and debugging
│   └── Configuration management
├── Audit & Compliance
│   ├── Audit log viewer
│   ├── Compliance reports
│   ├── Data export requests
│   └── Security incident tracking
├── API & Integration Management
│   ├── API key management
│   ├── Integration status
│   ├── Webhook configuration
│   └── Rate limiting settings
└── Billing & Revenue
    ├── Subscription management
    ├── Usage analytics
    ├── Revenue reports
    └── Invoice generation
```

## Implementation Recommendation

**Create a separate admin dashboard** at `/admin` route with:

1. **Route Protection**: Middleware to ensure only ADMIN role can access
2. **Separate Layout**: Different sidebar/navigation for admin functions
3. **Admin-Specific Components**: User management tables, company onboarding forms, system monitoring dashboards
4. **Audit Trail**: All admin actions should be logged for compliance

The current employer dashboard at `/dashboard` should remain focused on recruitment workflows (candidates, requisitions, campaigns, scorecards) as defined in the PRD.

**Bottom Line**: The RBAC system is well-designed but the frontend doesn't reflect the admin vs employer separation. We need a dedicated admin view to properly leverage the comprehensive permissions already defined in the backend.

---

## User

ok so we need ADMIN and recruiter also design the structure who reviewed and design tech UI/UX

---

## Assistant (Orchestrator · GLM 4.7 · 47.8s)

_Thinking:_

The user wants me to:
1. Design the structure for both ADMIN and RECRUITER views
2. Design the tech UI/UX for both views
3. Consider who reviewed and designed this

Let me think about this systematically:

1. **Current State Analysis**:
   - Existing dashboard is single-view, appears to be employer-focused
   - Backend has comprehensive RBAC with 3 roles (ADMIN, RECRUITER, VIEWER)
   - No separation between admin and employer interfaces currently

2. **What's Needed**:
   - Separate admin dashboard structure
   - Enhanced recruiter dashboard structure  
   - UI/UX design for both
   - Clear separation of concerns
   - Role-based routing and permissions

3. **Design Approach**:
   - I should use the MCP tools to research best practices
   - Look at existing dashboard patterns
   - Design a scalable architecture
   - Consider the hardware constraints (CPU-only, low bandwidth)
   - Follow the existing tech stack (Next.js 14 + shadcn/ui)

4. **Key Considerations**:
   - Admin view needs system-level controls
   - Recruiter view needs workflow-focused controls
   - Both need to be performant on the hardware
   - Clear visual distinction between the two
   - Proper authentication and authorization

Let me start by exploring the current dashboard structure more thoroughly, then design both views.

Excellent! Let me design a comprehensive structure for both ADMIN and RECRUITER views with proper UI/UX. First, let me analyze the current dashboard structure and then create a detailed design.

**Tool: read**

**Input:**
```json
{
  "filePath": "/media/matrix/DATA/opencode_projects/AROHAN/dashboard/src/components/dashboard/Sidebar.tsx"
}
```

**Output:**
```
<path>/media/matrix/DATA/opencode_projects/AROHAN/dashboard/src/components/dashboard/Sidebar.tsx</path>
<type>file</type>
<content>
1: // Sidebar Component with memoization and accessibility
2: 
3: import { memo } from 'react';
4: import { LayoutDashboard, Bot, Users, MessageSquare, FileText, BarChart3, Settings } from 'lucide-react';
5: import { Button } from '@/components/ui/button';
6: 
7: interface SidebarProps {
8:   activeTab: string;
9:   setActiveTab: (tab: string) => void;
10: }
11: 
12: const menuItems = [
13:   { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
14:   { id: 'agents', icon: Bot, label: 'Agent Testing' },
15:   { id: 'sessions', icon: Users, label: 'Sessions' },
16:   { id: 'integrations', icon: MessageSquare, label: 'Integrations' },
17:   { id: 'scorecards', icon: FileText, label: 'Scorecards' },
18:   { id: 'monitoring', icon: BarChart3, label: 'Monitoring' },
19:   { id: 'settings', icon: Settings, label: 'Settings' },
20: ] as const;
21: 
22: const Sidebar = memo(({ activeTab, setActiveTab }: SidebarProps) => {
23:   const handleTabClick = (tabId: string) => {
24:     setActiveTab(tabId);
25:   };
26: 
27:   const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
28:     if (e.key === 'Enter' || e.key === ' ') {
29:       e.preventDefault();
30:       handleTabClick(tabId);
31:     }
32:   };
33: 
34:   return (
35:     <aside 
36:       className="w-64 bg-slate-900 border-r border-slate-800 p-4"
37:       aria-label="Main navigation"
38:     >
39:       <div className="flex items-center gap-3 mb-8">
40:         <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
41:           <Bot className="w-6 h-6 text-white" />
42:         </div>
43:         <div>
44:           <h1 className="text-lg font-bold text-white">AROHAN</h1>
45:           <p className="text-xs text-slate-400">Admin Dashboard</p>
46:         </div>
47:       </div>
48: 
49:       <nav aria-label="Dashboard navigation" className="space-y-2">
50:         {menuItems.map((item) => (
51:           <Button
52:             key={item.id}
53:             variant="ghost"
54:             onClick={() => handleTabClick(item.id)}
55:             onKeyDown={(e) => handleKeyDown(e, item.id)}
56:             aria-current={activeTab === item.id ? 'page' : undefined}
57:             className={`w-full justify-start gap-3 px-4 py-3 h-auto transition-all ${
58:               activeTab === item.id
59:                 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30'
60:                 : 'text-slate-400 hover:text-white hover:bg-slate-800'
61:             }`}
62:           >
63:             <item.icon className="w-5 h-5" aria-hidden="true" />
64:             <span className="font-medium">{item.label}</span>
65:           </Button>
66:         ))}
67:       </nav>
68:     </aside>
69:   );
70: });
71: 
72: Sidebar.displayName = 'Sidebar';
73: 
74: export default Sidebar;

(End of file - total 74 lines)
</content>
```

---

## Assistant (Orchestrator · GLM 4.7 · 33.7s)

_Thinking:_

I can see the current sidebar is labeled "Admin Dashboard" but the menu items are more focused on agent testing and monitoring rather than true admin functions. This confirms that the current dashboard is a mix of admin and employer functionality without proper separation.

Let me now design a comprehensive structure for both views. I'll use the websearch tool to research best practices for admin dashboard design patterns.

**Tool: websearch_tavily_search**

**Input:**
```json
{
  "max_results": 5,
  "query": "admin dashboard UI UX best practices 2024 SaaS platform design patterns"
}
```

**Output:**
```
Detailed Results:

Title: SaaS Dashboard Design: Trends And Best Practices
URL: https://codetheorem.co/blogs/saas-dashboard-ux/
Content: In this blog, we’ll explore what makes an effective SaaS dashboard design, the UX best practices that drive adoption and clarity, and the latest AI-driven trends shaping how users consume and act on data inside SaaS products. A well-thought-out SaaS dashboard UI Design ensures that every user sees the data that matters most to them, reducing noise and improving productivity. With AI becoming native to SaaS products and users expecting faster insights, dashboard design must evolve accordingly. In this blog, we’ll explore what makes an effective SaaS dashboard design, the **UX best practices** that drive adoption and clarity, and the **latest AI-driven trends** shaping how users consume and act on data inside SaaS products. A well-thought-out SaaS dashboard UI Design ensures that **every user sees the data that matters most to them**, reducing noise and improving productivity. With AI becoming native to SaaS products and users expecting faster insights, dashboard design must evolve accordingly.

Title: SaaS UI/UX Design: Best Practices, Trends & Strategies for 2024
URL: https://emergedigital.co/key-elements-best-practices-of-saas-ui-ux-design/
Content: 4 Key Elements of Effective SaaS UI/UX Design · 1. User-Centric Approach · 2. Intuitive Navigation · 3. Responsive Design · 4. Onboarding and User

Title: Best Practices and Key Features for Designing a SaaS Dashboard
URL: https://www.neuronux.com/post/how-to-design-a-saas-dashboard-best-practices-key-features
Content: So, in today’s guide, we'll dive into the key principles, design strategies, and best practices for creating a dashboard for your SaaS product that excels at turning raw data into actionable insights. User-centered design is at the crux of nearly all great UX, and surprise—SaaS dashboards are no different. ### Personas and user stories for dashboard design. For example, you may find that local managers tasked with producing a certain type of report need a specific format for data presentation, but that regional managers need different data and don’t use the same metrics for their KPIs. You may also find that within each group, you have power users who access dashboards more often and perform more sophisticated data analysis, as well as less active users. Focusing on creating intuitive navigation paths within dashboards helps ensure that users can easily find and access different sections. Make sure that your dashboards actually help users glean insights, and consider adding functionality or tooltips to help people interpret data further.

Title: my research process for SaaS dashboard design patterns ... - Reddit
URL: https://www.reddit.com/r/UXDesign/comments/1ptvrnb/my_research_process_for_saas_dashboard_design/
Content: Key patterns I found: most put primary metrics above the fold with clear hierarchy, secondary actions in top right, navigation is left sidebar

Title: SaaS UI/UX Design Guide 2024: Top 7 Best Practices
URL: https://brights.io/blog/saas-ui-ux-best-practices
Content: Good SaaS UI/UX design positively impacts user retention, conversion rates, reviews, your brand’s reputation, and even customer support costs. * UI/UX design for SaaS platforms impacts every aspect of user interaction with your product. By using familiar layouts and clear menus when creating UX design for SaaS, you minimize frustration, help users find what they need, and keep them focused on what matters. Even if your product starts small, you need to prepare the UX design for SaaS growth from the start because rapid scaling can quickly expose any weaknesses in your architecture and user experience. Brights’ UI/UX design process for Termix, a SaaS product. * **Lower customer support costs.** With an intuitive SaaS user experience and UI design, users can navigate your product easily on their own, meaning your support team will focus on complex issues rather than basic usability questions. Our UI/UX team shine when it come to making complex SaaS products into intuitive, user-friendly platforms that drive engagement.
```

---

## Assistant (Orchestrator · GLM 4.7 · 51.3s)

_Thinking:_

Good, I have some research on SaaS dashboard best practices. Now let me search for specific admin dashboard patterns and recruiter dashboard patterns to get more targeted insights.

**Tool: websearch_tavily_search**

**Input:**
```json
{
  "max_results": 5,
  "query": "admin dashboard vs user dashboard separation SaaS multi-tenant architecture"
}
```

**Output:**
```
Detailed Results:

Title: Separating Admin / User Dashboards - Best Practice? : r/webdev
URL: https://www.reddit.com/r/webdev/comments/dwtsqe/separating_admin_user_dashboards_best_practice/
Content: It's fine that both are on the same dashboard. Admin extends normal user functionality. As for security, simply don't render admin elements.

Title: Choosing the right SaaS architecture: Multi-Tenant vs. Single-Tenant
URL: https://clerk.com/blog/multi-tenant-vs-single-tenant
Content: # Choosing the right SaaS architecture: Multi-Tenant vs. What's the difference between multi-tenant and single-tenant SaaS architecture? This guide breaks down the pros, cons, and use cases of each model—so you can choose the right B2B SaaS architecture for your app. Learn how multi-tenancy scales efficiently, when single-tenancy is the better fit, and which modern tools make tenant isolation easier than ever. One of the most critical is choosing your SaaS architecture model - namely, whether to use a multi-tenant or single-tenant approach. ## What is multi-tenant SaaS architecture? In multi-tenant architecture, a single instance of your application and its underlying infrastructure is shared by multiple customer organizations (tenants). Each tenant's data and accounts are logically isolated, so that customers only see their own data - but they are all running on the same application and database in a shared environment. Because of this isolation, single-tenancy provides a high degree of control and security: a tenant's data and performance are not affected by any other customer, and there's minimal risk of data accidentally leaking between tenants by design.

Title: Multi-Tenant Architecture: The Complete Guide for SaaS | QuantumByte Success Story
URL: https://quantumbyte.ai/articles/multi-tenant-architecture
Content: # Multi-Tenant Architecture: The Complete Guide for SaaS. > “Multi-tenant architecture lets many customers share one codebase while keeping data isolated, upgrades simple, and unit economics strong.”. Multi tenant architecture is how most modern Software as a Service (SaaS) products scale: many customer accounts run on the same application, while each customer still feels like they have their own private system. This guide shows you how to design a multi tenant architecture that is secure, upgradeable, and realistic for a small team. A tenant is a customer environment. What multi tenant architecture is not:. * **Just "users and roles"**: Roles help with permissions, but multi-tenancy is about keeping one customer's data and experience separate from another customer's. * **Only a database decision**: Database isolation matters, but the harder problems are identity, routing, configuration, limits, and operations. ## When multi tenant architecture is the right move (and when it is not). Multi-tenancy works best when it supports your product strategy and your customer needs.

Title: Multi-Tenant Architecture: How It Works, Pros, and Cons | Frontegg
URL: https://frontegg.com/guides/multi-tenant-architecture
Content: Multi-tenant architecture is the use of a single logical software application or service to serve multiple customers. With multi-tenant architecture, several application instances operate in a shared environment. When designing a SaaS application, providers must choose their tenancy model: single or multi-tenant. A multi-tenant architecture uses a single instance of the software application to serve multiple customers. A common use case for multi-tenancy is to deploy applications on shared infrastructure and deliver them to multiple tenants as a SaaS application. Here are three options for delivering a multi-tenant SaaS application to its users. URL-based SaaS models utilize distinct URLs to direct users to tenant-specific instances of an application. Multi-tenant SaaS is characterized by a single application instance serving multiple tenants, where tenants share the application and infrastructure resources. One of the main challenges when building multi-tenant applications is managing user identities. One of the main challenges when building multi-tenant applications is managing user identities. ## Multi-Tenant User Management With Frontegg.

Title: The developer’s guide to SaaS multi-tenant architecture — WorkOS
URL: https://workos.com/blog/developers-guide-saas-multi-tenant-architecture
Content: # The developer’s guide to SaaS multi-tenant architecture. A practical, end-to-end deep dive into data isolation, tenant-aware auth, scaling, and compliance for B2B SaaS. Multi-tenancy is the default architecture for most modern B2B SaaS. But it’s also the root of your toughest architectural decisions: where tenant boundaries live, how you enforce them, how you scale safely, and how you evolve without leaking data or breaking customers. This guide is a technical walk through the decisions you’ll need to make: from modeling tenants, to data isolation, to runtime safety, to tenant-scoped authorization. ## What is multi-tenancy? A multi-tenant system is one where multiple tenants share your software and infrastructure, while behaving as though each tenant is alone in the world. A system is only “multi-tenant” if tenants are isolated in practice, and that isolation exists on a spectrum, depending on whether you enforce it mainly in infrastructure (single-tenant, multi-instance) or mainly in application logic (shared-runtime).
```

---

## Assistant (Orchestrator · GLM 4.7 · 51.1s)

_Thinking:_

Great! Now I have good research on SaaS dashboard patterns and multi-tenant architecture. Let me also search for specific HR/recruiter dashboard patterns to get more targeted insights for the recruiter view.

**Tool: websearch_tavily_search**

**Input:**
```json
{
  "query": "HR recruiter dashboard UI design patterns candidate management ATS interface",
  "max_results": 5
}
```

**Output:**
```
Detailed Results:

Title: A simple interface for recruiters to schedule, track, and manage ...
URL: https://medium.com/design-bootcamp/designing-a-candidate-scheduling-management-flow-for-an-applicant-tracking-system-ats-c6ecf27e75fc
Content: A simple interface for recruiters to schedule, track, and manage candidates with Applicant Tracking System Recently, I was given a design

Title: Dashboard Applicant Screens UI Design Template - Figma
URL: https://www.figma.com/community/file/1510561708000466271/dashboard-applicant-screens-ui-design-template
Content: A clean, modern, and user-friendly dashboard UI template designed for applicant tracking systems, hiring platforms, and recruitment software.

Title: HR Software: Exploring UX Patterns & Benchmarking Solutions
URL: https://lab.interface-design.co.uk/hr-software-exploring-ux-patterns-benchmarking-solutions-632d8d6a6efa
Content: The mobile interface has a catchy UI design, with highly saturated colours and many small charts that provide statistics for main areas of

Title: 5 Steps To Creating An HR Recruitment Dashboard (+ Free Template)
URL: https://www.hackerearth.com/blog/recruitment-dashboard-template
Content: Learn how to create an HR recruitment dashboard template online. Follow our step-by-step guide to design a comprehensive dashboard for tracking recruitment

Title: Browse thousands of Dashboard Ats images for design inspiration
URL: https://dribbble.com/search/dashboard-ats
Content: Explore thousands of high-quality dashboard ats images on Dribbble. Your resource to get inspired, discover and connect with designers worldwide.
```

---

## Assistant (Orchestrator · GLM 4.7 · 143.6s)

_Thinking:_

Perfect! Now I have comprehensive research on:
1. SaaS dashboard best practices
2. Multi-tenant architecture patterns
3. HR/recruiter dashboard design patterns

Based on this research and the existing Arohan codebase, I can now design a comprehensive structure for both ADMIN and RECRUITER views. Let me create a detailed design document that addresses:

1. Architecture separation
2. UI/UX design for both views
3. Navigation patterns
4. Component structure
5. Role-based routing
6. Visual design system

I'll create this as a comprehensive design document that can be used for implementation.

Now let me create a comprehensive design document for both ADMIN and RECRUITER views based on the research and existing codebase analysis.<tool_call>write<arg_key>content</arg_key><arg_value># AROHAN Dashboard Architecture Design
## ADMIN & RECRUITER Views - Complete UI/UX Specification

**Version**: 1.0  
**Date**: 2026-05-03  
**Design Status**: Ready for Implementation  
**Reviewed By**: Orchestrator Prime (AI Architect)  
**Tech Stack**: Next.js 14 + shadcn/ui + TypeScript + Tailwind CSS

---

## 🎯 Executive Summary

This document defines the complete architecture for separating AROHAN into two distinct dashboard experiences:
- **ADMIN Dashboard** (`/admin`) - Platform management and system administration
- **RECRUITER Dashboard** (`/dashboard`) - Employer hiring workflows and candidate management

**Key Design Principles:**
1. **Clear Role Separation** - Distinct interfaces for different user personas
2. **Progressive Disclosure** - Show relevant information based on user role
3. **Performance First** - Optimized for CPU-only hardware (Dell Latitude 3460)
4. **Accessibility Compliant** - WCAG 2.1 AA standards
5. **Scalable Architecture** - Multi-tenant SaaS patterns

---

## 🏗️ Architecture Overview

### Multi-Tenant Structure
```
arohan/
├── dashboard/                    # RECRUITER Dashboard (Employer View)
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/        # /dashboard route
│   │   │   │   ├── campaigns/
│   │   │   │   ├── candidates/
│   │   │   │   ├── requisitions/
│   │   │   │   ├── scorecards/
│   │   │   │   └── analytics/
│   │   │   └── layout.tsx
│   │   └── components/
│   │       └── recruiter/        # Recruiter-specific components
│   └── package.json
│
└── admin/                        # ADMIN Dashboard (Platform Management)
    ├── src/
    │   ├── app/
    │   │   ├── admin/            # /admin route
    │   │   │   ├── users/
    │   │   │   ├── companies/
    │   │   │   ├── system/
    │   │   │   ├── billing/
    │   │   │   ├── audit/
    │   │   │   └── integrations/
    │   │   └── layout.tsx
    │   └── components/
    │       └── admin/            # Admin-specific components
    └── package.json
```

### Shared Components Library
```
shared/
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── layout/               # Shared layout components
│   │   └── common/               # Cross-role components
│   ├── lib/
│   │   ├── api-client.ts         # Shared API client
│   │   ├── auth.tsx              # Shared auth utilities
│   │   └── types.ts              # Shared TypeScript types
│   └── hooks/
│       └── use-auth.ts           # Shared auth hooks
└── package.json
```

---

## 👥 User Personas & Access Patterns

### ADMIN Persona: "Platform Administrator"
**Profile**: Technical operations manager, manages platform-wide operations
**Access Level**: Full system access, cross-tenant visibility
**Primary Goals**: System health, user management, revenue optimization

### RECRUITER Persona: "Priya Sharma - HR Manager"
**Profile**: Mid-sized logistics HR manager, 3-5 campaigns/month
**Access Level**: Single-tenant (company-specific), hiring workflows
**Primary Goals**: Fast candidate review, informed hiring decisions, campaign efficiency

### VIEWER Persona: "Read-only Employer"
**Profile**: Stakeholder who needs visibility but no write access
**Access Level**: Single-tenant, read-only
**Primary Goals**: Monitor hiring progress, view analytics

---

## 🎨 Visual Design System

### Color Palette - Role Differentiation

#### ADMIN Dashboard Colors
```css
/* Primary - Trust & Authority */
--admin-primary: #6366f1;        /* Indigo 500 */
--admin-primary-dark: #4f46e5;  /* Indigo 600 */
--admin-primary-light: #818cf8; /* Indigo 400 */

/* Secondary - System Status */
--admin-success: #10b981;       /* Emerald 500 */
--admin-warning: #f59e0b;       /* Amber 500 */
--admin-danger: #ef4444;        /* Red 500 */
--admin-info: #3b82f6;          /* Blue 500 */

/* Backgrounds */
--admin-bg-primary: #0f172a;     /* Slate 900 */
--admin-bg-secondary: #1e293b;  /* Slate 800 */
--admin-bg-tertiary: #334155;   /* Slate 700 */
```

#### RECRUITER Dashboard Colors
```css
/* Primary - Action & Engagement */
--recruiter-primary: #8b5cf6;    /* Violet 500 */
--recruiter-primary-dark: #7c3aed; /* Violet 600 */
--recruiter-primary-light: #a78bfa; /* Violet 400 */

/* Secondary - Candidate Status */
--recruiter-success: #10b981;    /* Emerald 500 */
--recruiter-warning: #f59e0b;    /* Amber 500 */
--recruiter-danger: #ef4444;     /* Red 500 */
--recruiter-info: #3b82f6;       /* Blue 500 */

/* Backgrounds */
--recruiter-bg-primary: #000000; /* Black */
--recruiter-bg-secondary: #111827; /* Gray 900 */
--recruiter-bg-tertiary: #1f2937;  /* Gray 800 */
```

### Typography System
```css
/* Font Family */
--font-primary: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

---

## 🖥️ ADMIN Dashboard Design

### Navigation Structure
```
ADMIN Sidebar Navigation:
├── 🏠 Overview                    # System health dashboard
├── 👥 Users                       # User management
│   ├── All Users
│   ├── Add User
│   ├── User Permissions
│   └── User Activity
├── 🏢 Companies                  # Company management
│   ├── All Companies
│   ├── Company Onboarding
│   ├── Subscription Management
│   └── Company Analytics
├── ⚙️ System                      # System administration
│   ├── Health Monitoring
│   ├── Performance Metrics
│   ├── Configuration
│   └── Error Logs
├── 💰 Billing                     # Revenue management
│   ├── Subscriptions
│   ├── Invoices
│   ├── Usage Analytics
│   └── Revenue Reports
├── 🔍 Audit                       # Compliance & audit
│   ├── Audit Logs
│   ├── Compliance Reports
│   ├── Security Events
│   └── Data Export
├── 🔗 Integrations               # Third-party integrations
│   ├── API Management
│   ├── Webhooks
│   ├── Service Status
│   └── Integration Settings
└── ⚙️ Settings                    # Admin settings
    ├── Profile
    ├── Notifications
    ├── Security
    └── API Keys
```

### Key ADMIN Screens

#### 1. Overview Dashboard
**Purpose**: System health at a glance
**Layout**: Grid-based metrics with drill-down capability

```tsx
// Admin Overview Layout
┌─────────────────────────────────────────────────────────┐
│  AROHAN ADMIN                    🔔 Admin | ⚙️ Settings  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Total Users  │  │ Total Companies│  │ Active Sessions│ │
│  │    1,247     │  │      89      │  │      342      │  │
│  │  ▲ 12%       │  │  ▲ 8%        │  │  ▲ 15%       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              System Health Status                │   │
│  │  🟢 API: Healthy  🟢 Database: Healthy  🟡 Queue: High Load│   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Revenue This Month                  │   │
│  │  ₹4,52,000  ▲ 18% vs last month                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Recent Activity                     │   │
│  │  • New company onboarded: LogisticsPro Ltd        │   │
│  │  • User created: priya.sharma@logisticspro.com   │   │
│  │  • Subscription upgraded: Growth plan            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 2. User Management
**Purpose**: CRUD operations for users across all companies
**Features**: Search, filter, bulk actions, permission management

```tsx
// User Management Table
┌─────────────────────────────────────────────────────────┐
│  Users                                    [+ Add User]  │
├─────────────────────────────────────────────────────────┤
│  Search: [___________] Filter: [Role ▼] [Company ▼]     │
├─────────────────────────────────────────────────────────┤
│  ☐ Name           Email              Role    Company     │
│  ☐ Priya Sharma   priya@logistics.com Recruiter LogisticsPro│
│  ☐ Raj Kumar      raj@retail.com      Viewer  RetailMax  │
│  ☐ Amit Singh     amit@warehouse.com  Admin   WarehouseCo│
│  ☐ ...                                                     │
├─────────────────────────────────────────────────────────┤
│  [Delete Selected] [Export] [1-50 of 1,247]              │
└─────────────────────────────────────────────────────────┘
```

#### 3. Company Management
**Purpose**: Manage companies, subscriptions, and billing
**Features**: Company onboarding, plan management, usage analytics

```tsx
// Company Management Card
┌─────────────────────────────────────────────────────────┐
│  Companies                                   [+ Onboard]  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ LogisticsPro Ltd                    Active       │   │
│  │ Plan: Growth | Users: 12 | Screenings: 1,234    │   │
│  │ [View Details] [Manage] [Billing]              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ RetailMax India                      Active       │   │
│  │ Plan: Startup | Users: 5 | Screenings: 456      │   │
│  │ [View Details] [Manage] [Billing]              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### ADMIN UI Components

#### AdminSidebar Component
```tsx
interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'ADMIN' | 'SUPER_ADMIN';
}

const adminMenuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', badge: null },
  { id: 'users', icon: Users, label: 'Users', badge: '1,247' },
  { id: 'companies', icon: Building2, label: 'Companies', badge: '89' },
  { id: 'system', icon: Server, label: 'System', badge: null },
  { id: 'billing', icon: IndianRupee, label: 'Billing', badge: null },
  { id: 'audit', icon: Shield, label: 'Audit', badge: '3 alerts' },
  { id: 'integrations', icon: Link, label: 'Integrations', badge: null },
  { id: 'settings', icon: Settings, label: 'Settings', badge: null },
];
```

#### AdminMetricCard Component
```tsx
interface AdminMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'red';
}

// Usage Example
<AdminMetricCard
  title="Total Users"
  value="1,247"
  change={12}
  trend="up"
  icon={Users}
  color="indigo"
/>
```

---

## 🎯 RECRUITER Dashboard Design

### Navigation Structure
```
RECRUITER Sidebar Navigation:
├── 📊 Overview                    # Campaign & hiring overview
├── 📋 Campaigns                   # Campaign management
│   ├── Active Campaigns
│   ├── Campaign History
│   ├── Create Campaign
│   └── Campaign Analytics
├── 👤 Candidates                  # Candidate management
│   ├── All Candidates
│   ├── Shortlisted
│   ├── Rejected
│   └── Search & Filter
├── 📝 Requisitions                # Job requisitions
│   ├── Open Requisitions
│   ├── Create Requisition
│   ├── Match Candidates
│   └── Requisition Analytics
├── 📄 Scorecards                  # Candidate scorecards
│   ├── Recent Scorecards
│   ├── Scorecard Details
│   ├── Audio Review
│   └── Transcript Analysis
├── 📈 Analytics                   # Hiring analytics
│   ├── Pipeline Metrics
│   ├── Time-to-Hire
│   ├── Candidate Quality
│   └── Custom Reports
└── ⚙️ Settings                    # Recruiter settings
    ├── Profile
    ├── Notifications
    ├── Team Management
    └── API Access
```

### Key RECRUITER Screens

#### 1. Recruiter Overview
**Purpose**: Hiring pipeline at a glance
**Layout**: Campaign-focused with candidate metrics

```tsx
// Recruiter Overview Layout
┌─────────────────────────────────────────────────────────┐
│  AROHAN                    🔔 Priya Sharma | ⚙️ Settings  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Active Campaigns│  │ Candidates This Week│  │ Shortlist Rate│ │
│  │      3       │  │      156     │  │     67%      │  │
│  │  Delivery    │  │  ▲ 23%       │  │  ▲ 8%        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Active Campaigns                     │   │
│  │  🚀 Delivery Partners - 45 candidates screened    │   │
│  │  📦 Warehouse Staff - 32 candidates screened      │   │
│  │  🛒 Retail Associates - 28 candidates screened    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Top Candidates This Week             │   │
│  │  🥇 Rahul Kumar - 92/100 - Delivery Partner       │   │
│  │  🥈 Priya Singh - 88/100 - Warehouse Staff        │   │
│  │  🥉 Amit Verma - 85/100 - Retail Associate        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 2. Candidate Management
**Purpose**: Review, filter, and action on candidates
**Features**: Advanced filtering, bulk actions, scorecard preview

```tsx
// Candidate Management Table
┌─────────────────────────────────────────────────────────┐
│  Candidates                    [Shortlist] [Reject] [Export]│
├─────────────────────────────────────────────────────────┤
│  Search: [___________] Score: [70+ ▼] Language: [Hindi ▼]│
├─────────────────────────────────────────────────────────┤
│  ☐ Name          Phone    Score  Language  Status       │
│  ☐ Rahul Kumar   +91-9876  92/100 Hindi     ⭐ Shortlisted│
│  ☐ Priya Singh   +91-8765  88/100 Hinglish  ⭐ Shortlisted│
│  ☐ Amit Verma    +91-7654  85/100 Hindi     ⏳ Pending    │
│  ☐ Sunita Devi   +91-6543  72/100 Tamil     ⏳ Pending    │
│  ☐ ...                                                     │
├─────────────────────────────────────────────────────────┤
│  [Bulk Shortlist] [Bulk Reject] [1-50 of 156]            │
└─────────────────────────────────────────────────────────┘
```

#### 3. Scorecard Detail View
**Purpose**: Detailed candidate assessment review
**Features**: Score breakdown, transcript, audio playback, job matching

```tsx
// Scorecard Detail Layout
┌─────────────────────────────────────────────────────────┐
│  ← Back to Candidates    Rahul Kumar    [Shortlist] [Reject]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Overall Score: 92/100              │   │
│  │  🟢 Communication: 95/100  🟢 Domain: 90/100      │   │
│  │  🟢 Situational: 88/100  🟢 Confidence: 94/100   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Language Fluency: Native           │   │
│  │  Detected: Hindi (hi-IN) | Confidence: 94%      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Interview Transcript               │   │
│  │  Proctor: Tell me about your experience with... │   │
│  │  Candidate: I have 3 years of experience in...  │   │
│  │  [▶ Play Audio] [Download Transcript]           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Matched Requisitions               │   │
│  │  📍 Delivery Partner - Nagpur (12km) - Match: 94%│   │
│  │  📍 Warehouse Staff - Nagpur (8km) - Match: 88% │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### RECRUITER UI Components

#### RecruiterSidebar Component
```tsx
interface RecruiterSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'RECRUITER' | 'VIEWER';
}

const recruiterMenuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', badge: null },
  { id: 'campaigns', icon: Megaphone, label: 'Campaigns', badge: '3 active' },
  { id: 'candidates', icon: Users, label: 'Candidates', badge: '156 this week' },
  { id: 'requisitions', icon: Briefcase, label: 'Requisitions', badge: '5 open' },
  { id: 'scorecards', icon: FileText, label: 'Scorecards', badge: '23 new' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null },
  { id: 'settings', icon: Settings, label: 'Settings', badge: null },
];
```

#### CandidateCard Component
```tsx
interface CandidateCardProps {
  candidate: Candidate;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onViewScorecard: (id: string) => void;
}

// Usage Example
<CandidateCard
  candidate={{
    id: '123',
    name: 'Rahul Kumar',
    phone: '+91-9876543210',
    overallScore: 92,
    language: 'Hindi',
    status: 'pending'
  }}
  onShortlist={handleShortlist}
  onReject={handleReject}
  onViewScorecard={handleViewScorecard}
/>
```

#### ScorecardBreakdown Component
```tsx
interface ScorecardBreakdownProps {
  scorecard: Scorecard;
  showTranscript?: boolean;
  showAudio?: boolean;
}

// Usage Example
<ScorecardBreakdown
  scorecard={{
    overallScore: 92,
    communicationScore: 95,
    domainKnowledgeScore: 90,
    situationalJudgmentScore: 88,
    confidenceScore: 94,
    languageFluency: 'native',
    assessorNotes: 'Strong candidate with excellent communication...'
  }}
  showTranscript={true}
  showAudio={true}
/>
```

---

## 🔐 Authentication & Authorization

### Role-Based Routing
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const userRole = getUserRoleFromToken(token?.value);

  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token || userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request));
    }
  }

  // Recruiter routes protection
  if (pathname.startsWith('/dashboard')) {
    if (!token || !['RECRUITER', 'VIEWER'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request));
    }
  }

  return NextResponse.next();
}
```

### Permission-Based Component Rendering
```tsx
// PermissionWrapper Component
interface PermissionWrapperProps {
  requiredPermission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function PermissionWrapper({ requiredPermission, fallback, children }: PermissionWrapperProps) {
  const { user } = useAuth();
  const hasPermission = checkPermission(user.role, requiredPermission);

  if (!hasPermission) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Usage Example
<PermissionWrapper requiredPermission={Permission.USER_DELETE}>
  <Button variant="destructive">Delete User</Button>
</PermissionWrapper>
```

---

## 📱 Responsive Design Strategy

### Breakpoint System
```css
/* Mobile First Approach */
/* Mobile: < 640px */
@media (max-width: 639px) {
  .sidebar { display: none; }
  .mobile-nav { display: flex; }
}

/* Tablet: 640px - 1024px */
@media (min-width: 640px) and (max-width: 1023px) {
  .sidebar { width: 200px; }
  .main-content { margin-left: 200px; }
}

/* Desktop: >= 1024px */
@media (min-width: 1024px) {
  .sidebar { width: 256px; }
  .main-content { margin-left: 256px; }
}
```

### Mobile Navigation
```tsx
// Mobile Navigation Component
function MobileNavigation({ activeTab, setActiveTab }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
```

---

## ⚡ Performance Optimization

### Code Splitting Strategy
```typescript
// Dynamic imports for route-based splitting
const AdminOverview = dynamic(() => import('./admin/overview'));
const AdminUsers = dynamic(() => import('./admin/users'));
const RecruiterCampaigns = dynamic(() => import('./recruiter/campaigns'));
const RecruiterCandidates = dynamic(() => import('./recruiter/candidates'));
```

### Lazy Loading Components
```tsx
// Lazy load heavy components
const ScorecardDetail = lazy(() => import('./components/ScorecardDetail'));
const AudioPlayer = lazy(() => import('./components/AudioPlayer'));
const TranscriptViewer = lazy(() => import('./components/TranscriptViewer'));
```

### Virtual Scrolling
```tsx
// VirtualList for large datasets
import { useVirtualizer } from '@tanstack/react-virtual';

function CandidateList({ candidates }: { candidates: Candidate[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(virtualItem => (
        <CandidateCard
          key={virtualItem.key}
          candidate={candidates[virtualItem.index]}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}
        />
      ))}
    </div>
  );
}
```

---

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
```tsx
// Accessible Button Component
function AccessibleButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      aria-label={props['aria-label'] || children?.toString()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          props.onClick?.(e as any);
        }
      }}
    >
      {children}
    </button>
  );
}

// Keyboard Navigation
function useKeyboardNavigation(items: MenuItem[]) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        items[focusedIndex].onClick();
        break;
    }
  };

  return { focusedIndex, handleKeyDown };
}
```

### Screen Reader Support
```tsx
// Screen Reader Announcements
function useAnnouncer() {
  const announce = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return { announce };
}

// Usage
const { announce } = useAnnouncer();
announce('Candidate shortlisted successfully');
```

---

## 🔄 State Management Strategy

### Global State (Zustand)
```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

// stores/admin-store.ts
interface AdminState {
  selectedCompany: string | null;
  selectedUser: string | null;
  filters: AdminFilters;
  setSelectedCompany: (id: string) => void;
  setSelectedUser: (id: string) => void;
  setFilters: (filters: AdminFilters) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedCompany: null,
  selectedUser: null,
  filters: {},
  setSelectedCompany: (id) => set({ selectedCompany: id }),
  setSelectedUser: (id) => set({ selectedUser: id }),
  setFilters: (filters) => set({ filters }),
}));

// stores/recruiter-store.ts
interface RecruiterState {
  selectedCampaign: string | null;
  selectedCandidate: string | null;
  filters: RecruiterFilters;
  setSelectedCampaign: (id: string) => void;
  setSelectedCandidate: (id: string) => void;
  setFilters: (filters: RecruiterFilters) => void;
}

export const useRecruiterStore = create<RecruiterState>((set) => ({
  selectedCampaign: null,
  selectedCandidate: null,
  filters: {},
  setSelectedCampaign: (id) => set({ selectedCampaign: id }),
  setSelectedCandidate: (id) => set({ selectedCandidate: id }),
  setFilters: (filters) => set({ filters }),
}));
```

---

## 🧪 Testing Strategy

### Component Testing
```typescript
// AdminSidebar.test.tsx
describe('AdminSidebar', () => {
  it('renders all menu items', () => {
    const { getByText } = render(<AdminSidebar activeTab="overview" setActiveTab={jest.fn()} />);
    expect(getByText('Overview')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Companies')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    const { getByText } = render(<AdminSidebar activeTab="users" setActiveTab={jest.fn()} />);
    const usersButton = getByText('Users');
    expect(usersButton).toHaveClass('bg-gradient-to-r');
  });
});

// CandidateCard.test.tsx
describe('CandidateCard', () => {
  it('displays candidate information correctly', () => {
    const candidate = {
      id: '123',
      name: 'Rahul Kumar',
      phone: '+91-9876543210',
      overallScore: 92,
      language: 'Hindi',
      status: 'pending'
    };

    const { getByText } = render(
      <CandidateCard
        candidate={candidate}
        onShortlist={jest.fn()}
        onReject={jest.fn()}
        onViewScorecard={jest.fn()}
      />
    );

    expect(getByText('Rahul Kumar')).toBeInTheDocument();
    expect(getByText('92/100')).toBeInTheDocument();
  });
});
```

### E2E Testing
```typescript
// admin.spec.ts
test('admin can create new user', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('button:has-text("Add User")');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.selectOption('select[name="role"]', 'RECRUITER');
  await page.click('button:has-text("Create User")');
  await expect(page.locator('text=Test User')).toBeVisible();
});

// recruiter.spec.ts
test('recruiter can shortlist candidate', async ({ page }) => {
  await page.goto('/dashboard/candidates');
  await page.click('text=Rahul Kumar');
  await page.click('button:has-text("Shortlist")');
  await expect(page.locator('text=Candidate shortlisted successfully')).toBeVisible();
});
```

---

## 📊 Analytics & Monitoring

### Performance Monitoring
```typescript
// lib/performance.ts
export function trackPageView(page: string) {
  // Send to analytics
  analytics.track('page_view', { page });
}

export function trackUserAction(action: string, metadata?: any) {
  // Send to analytics
  analytics.track('user_action', { action, ...metadata });
}

export function trackError(error: Error, context?: any) {
  // Send to error tracking
  errorTracker.captureException(error, { context });
}

// Usage in components
useEffect(() => {
  trackPageView('admin/overview');
}, []);
```

### User Behavior Analytics
```typescript
// hooks/useAnalytics.ts
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: any) => {
    // Track user interactions
    analytics.track(eventName, {
      timestamp: new Date().toISOString(),
      ...properties,
    });
  };

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', { page: pageName });
  };

  const trackButtonClick = (buttonName: string) => {
    trackEvent('button_click', { button: buttonName });
  };

  return { trackEvent, trackPageView, trackButtonClick };
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up separate admin and recruiter dashboard projects
- [ ] Implement shared component library
- [ ] Create authentication and authorization middleware
- [ ] Set up routing structure for both dashboards
- [ ] Implement basic layout components

### Phase 2: ADMIN Dashboard (Week 3-4)
- [ ] Implement admin overview dashboard
-

---

## User

continue

---

## Assistant (Orchestrator · GLM 4.7 · 219.9s)

_Thinking:_

The user wants me to continue the implementation roadmap. I was in the middle of writing a comprehensive design document for ADMIN and RECRUITER dashboards. I should continue from where I left off in the implementation roadmap section.

**Tool: edit**

**Input:**
```json
{
  "filePath": "/media/matrix/DATA/opencode_projects/AROHAN/DASHBOARD_ARCHITECTURE_DESIGN.md",
  "newString": "### Phase 2: ADMIN Dashboard (Week 3-4)\n- [ ] Implement admin overview dashboard\n- [ ] Build user management interface\n- [ ] Create company management system\n- [ ] Implement system health monitoring\n- [ ] Add billing and subscription management\n- [ ] Create audit log viewer\n- [ ] Implement integration management\n- [ ] Add admin settings pages\n\n### Phase 3: RECRUITER Dashboard (Week 5-6)\n- [ ] Implement recruiter overview dashboard\n- [ ] Build campaign management interface\n- [ ] Create candidate management system\n- [ ] Implement requisition management\n- [ ] Build scorecard detail views\n- [ ] Add analytics and reporting\n- [ ] Create advanced filtering and search\n- [ ] Implement bulk actions\n\n### Phase 4: Integration & Testing (Week 7-8)\n- [ ] Connect dashboards to FastAPI backend\n- [ ] Implement real-time updates (WebSocket)\n- [ ] Add error handling and loading states\n- [ ] Perform comprehensive testing\n- [ ] Optimize performance for CPU-only hardware\n- [ ] Implement accessibility features\n- [ ] Add responsive design for mobile\n- [ ] Create user documentation\n\n### Phase 5: Deployment & Monitoring (Week 9-10)\n- [ ] Set up production deployment\n- [ ] Configure monitoring and alerting\n- [ ] Implement analytics tracking\n- [ ] Create admin and recruiter onboarding flows\n- [ ] Perform security audit\n- [ ] Load testing and optimization\n- [ ] Create backup and recovery procedures\n- [ ] Launch and monitor initial usage\n\n---\n\n## 🎨 Design System Documentation\n\n### Component Library Structure\n```\nshared/\n├── src/\n│   ├── components/\n│   │   ├── ui/                    # shadcn/ui base components\n│   │   │   ├── button.tsx\n│   │   │   ├── card.tsx\n│   │   │   ├── dialog.tsx\n│   │   │   ├── input.tsx\n│   │   │   ├── table.tsx\n│   │   │   ├── select.tsx\n│   │   │   ├── switch.tsx\n│   │   │   ├── badge.tsx\n│   │   │   ├── toast.tsx\n│   │   │   └── loading.tsx\n│   │   ├── layout/               # Shared layout components\n│   │   │   ├── Header.tsx\n│   │   │   ├── Sidebar.tsx\n│   │   │   ├── Footer.tsx\n│   │   │   └── MobileNav.tsx\n│   │   ├── admin/                # Admin-specific components\n│   │   │   ├── AdminSidebar.tsx\n│   │   │   ├── AdminHeader.tsx\n│   │   │   ├── AdminMetricCard.tsx\n│   │   │   ├── UserTable.tsx\n│   │   │   ├── CompanyCard.tsx\n│   │   │   ├── SystemHealth.tsx\n│   │   │   └── AuditLogViewer.tsx\n│   │   └── recruiter/            # Recruiter-specific components\n│   │       ├── RecruiterSidebar.tsx\n│   │       ├── RecruiterHeader.tsx\n│   │       ├── CampaignCard.tsx\n│   │       ├── CandidateTable.tsx\n│   │       ├── CandidateCard.tsx\n│   │       ├── ScorecardDetail.tsx\n│   │       ├── RequisitionCard.tsx\n│   │       └── AnalyticsChart.tsx\n│   ├── lib/\n│   │   ├── api-client.ts         # Shared API client\n│   │   ├── auth.tsx              # Shared auth utilities\n│   │   ├── types.ts              # Shared TypeScript types\n│   │   ├── utils.ts              # Shared utility functions\n│   │   └── constants.ts          # Shared constants\n│   ├── hooks/\n│   │   ├── use-auth.ts           # Shared auth hooks\n│   │   ├── use-api.ts            # Shared API hooks\n│   │   ├── use-permissions.ts    # Permission hooks\n│   │   └── use-analytics.ts      # Analytics hooks\n│   └── stores/\n│       ├── auth-store.ts         # Auth state management\n│       ├── admin-store.ts        # Admin state management\n│       └── recruiter-store.ts    # Recruiter state management\n```\n\n### Design Tokens\n```typescript\n// lib/constants/design-tokens.ts\nexport const DesignTokens = {\n  // Spacing\n  spacing: {\n    xs: '0.25rem',    // 4px\n    sm: '0.5rem',     // 8px\n    md: '1rem',       // 16px\n    lg: '1.5rem',     // 24px\n    xl: '2rem',       // 32px\n    '2xl': '3rem',    // 48px\n  },\n\n  // Border Radius\n  borderRadius: {\n    sm: '0.25rem',    // 4px\n    md: '0.5rem',     // 8px\n    lg: '0.75rem',    // 12px\n    xl: '1rem',       // 16px\n    full: '9999px',\n  },\n\n  // Shadows\n  shadow: {\n    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',\n    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',\n    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',\n    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',\n  },\n\n  // Transitions\n  transition: {\n    fast: '150ms ease-in-out',\n    base: '200ms ease-in-out',\n    slow: '300ms ease-in-out',\n  },\n\n  // Z-Index\n  zIndex: {\n    dropdown: 1000,\n    sticky: 1020,\n    fixed: 1030,\n    modal: 1040,\n    popover: 1050,\n    tooltip: 1060,\n  },\n};\n```\n\n---\n\n## 🔧 Technical Implementation Details\n\n### File Structure for ADMIN Dashboard\n```\nadmin/\n├── src/\n│   ├── app/\n│   │   ├── admin/\n│   │   │   ├── layout.tsx              # Admin layout wrapper\n│   │   │   ├── page.tsx               # Admin overview\n│   │   │   ├── users/\n│   │   │   │   ├── page.tsx           # User list\n│   │   │   │   ├── [id]/\n│   │   │   │   │   └── page.tsx       # User detail\n│   │   │   │   └── new/\n│   │   │   │       └── page.tsx       # Create user\n│   │   │   ├── companies/\n│   │   │   │   ├── page.tsx           # Company list\n│   │   │   │   ├── [id]/\n│   │   │   │   │   └── page.tsx       # Company detail\n│   │   │   │   └── new/\n│   │   │   │       └── page.tsx       # Create company\n│   │   │   ├── system/\n│   │   │   │   ├── page.tsx           # System health\n│   │   │   │   ├── performance/\n│   │   │   │   │   └── page.tsx       # Performance metrics\n│   │   │   │   └── logs/\n│   │   │   │       └── page.tsx       # Error logs\n│   │   │   ├── billing/\n│   │   │   │   ├── page.tsx           # Billing overview\n│   │   │   │   ├── subscriptions/\n│   │   │   │   │   └── page.tsx       # Subscription management\n│   │   │   │   └── invoices/\n│   │   │   │       └── page.tsx       # Invoice management\n│   │   │   ├── audit/\n│   │   │   │   ├── page.tsx           # Audit log overview\n│   │   │   │   ├── compliance/\n│   │   │   │   │   └── page.tsx       # Compliance reports\n│   │   │   │   └── security/\n│   │   │   │       └── page.tsx       # Security events\n│   │   │   ├── integrations/\n│   │   │   │   ├── page.tsx           # Integration overview\n│   │   │   │   ├── api/\n│   │   │   │   │   └── page.tsx       # API management\n│   │   │   │   └── webhooks/\n│   │   │   │       └── page.tsx       # Webhook configuration\n│   │   │   └── settings/\n│   │   │       ├── page.tsx           # Settings overview\n│   │   │       ├── profile/\n│   │   │       │   └── page.tsx       # Profile settings\n│   │   │       └── security/\n│   │   │           └── page.tsx       # Security settings\n│   │   ├── login/\n│   │   │   └── page.tsx               # Admin login\n│   │   ├── unauthorized/\n│   │   │   └── page.tsx               # Unauthorized access\n│   │   ├── layout.tsx                 # Root layout\n│   │   └── globals.css                # Global styles\n│   ├── components/\n│   │   └── admin/                      # Admin-specific components\n│   ├── lib/\n│   │   ├── api-client.ts               # Admin API client\n│   │   └── types.ts                    # Admin types\n│   └── middleware.ts                  # Admin middleware\n├── package.json\n├── tsconfig.json\n├── tailwind.config.js\n└── next.config.ts\n```\n\n### File Structure for RECRUITER Dashboard\n```\ndashboard/\n├── src/\n│   ├── app/\n│   │   ├── dashboard/\n│   │   │   ├── layout.tsx              # Recruiter layout wrapper\n│   │   │   ├── page.tsx               # Recruiter overview\n│   │   │   ├── campaigns/\n│   │   │   │   ├── page.tsx           # Campaign list\n│   │   │   │   ├── [id]/\n│   │   │   │   │   └── page.tsx       # Campaign detail\n│   │   │   │   └── new/\n│   │   │   │       └── page.tsx       # Create campaign\n│   │   │   ├── candidates/\n│   │   │   │   ├── page.tsx           # Candidate list\n│   │   │   │   ├── [id]/\n│   │   │   │   │   └── page.tsx       # Candidate detail\n│   │   │   │   ├── shortlisted/\n│   │   │   │   │   └── page.tsx       # Shortlisted candidates\n│   │   │   │   └── rejected/\n│   │   │   │       └── page.tsx       # Rejected candidates\n│   │   │   ├── requisitions/\n│   │   │   │   ├── page.tsx           # Requisition list\n│   │   │   │   ├── [id]/\n│   │   │   │   │   └── page.tsx       # Requisition detail\n│   │   │   │   └── new/\n│   │   │   │       └── page.tsx       # Create requisition\n│   │   │   ├── scorecards/\n│   │   │   │   ├── page.tsx           # Scorecard list\n│   │   │   │   └── [id]/\n│   │   │   │       └── page.tsx       # Scorecard detail\n│   │   │   ├── analytics/\n│   │   │   │   ├── page.tsx           # Analytics overview\n│   │   │   │   ├── pipeline/\n│   │   │   │   │   └── page.tsx       # Pipeline metrics\n│   │   │   │   └── reports/\n│   │   │   │       └── page.tsx       # Custom reports\n│   │   │   └── settings/\n│   │   │       ├── page.tsx           # Settings overview\n│   │   │       ├── profile/\n│   │   │       │   └── page.tsx       # Profile settings\n│   │   │       ├── team/\n│   │   │       │   └── page.tsx       # Team management\n│   │   │       └── notifications/\n│   │   │           └── page.tsx       # Notification settings\n│   │   ├── login/\n│   │   │   └── page.tsx               # Recruiter login\n│   │   ├── unauthorized/\n│   │   │   └── page.tsx               # Unauthorized access\n│   │   ├── layout.tsx                 # Root layout\n│   │   └── globals.css                # Global styles\n│   ├── components/\n│   │   └── recruiter/                  # Recruiter-specific components\n│   ├── lib/\n│   │   ├── api-client.ts               # Recruiter API client\n│   │   └── types.ts                    # Recruiter types\n│   └── middleware.ts                  # Recruiter middleware\n├── package.json\n├── tsconfig.json\n├── tailwind.config.js\n└── next.config.ts\n```\n\n### Shared Component Library\n```\nshared/\n├── src/\n│   ├── components/\n│   │   ├── ui/                        # shadcn/ui components\n│   │   │   ├── button.tsx\n│   │   │   ├── card.tsx\n│   │   │   ├── dialog.tsx\n│   │   │   ├── input.tsx\n│   │   │   ├── table.tsx\n│   │   │   ├── select.tsx\n│   │   │   ├── switch.tsx\n│   │   │   ├── badge.tsx\n│   │   │   ├── toast.tsx\n│   │   │   ├── loading.tsx\n│   │   │   ├── dropdown-menu.tsx\n│   │   │   ├── tabs.tsx\n│   │   │   ├── tooltip.tsx\n│   │   │   ├── popover.tsx\n│   │   │   ├── separator.tsx\n│   │   │   └── avatar.tsx\n│   │   ├── layout/\n│   │   │   ├── Header.tsx\n│   │   │   ├── Sidebar.tsx\n│   │   │   ├── Footer.tsx\n│   │   │   ├── MobileNav.tsx\n│   │   │   └── Container.tsx\n│   │   └── common/\n│   │       ├── ErrorBoundary.tsx\n│   │       ├── LoadingSpinner.tsx\n│   │       ├── EmptyState.tsx\n│   │       ├── SearchInput.tsx\n│   │       ├── FilterBar.tsx\n│   │       ├── Pagination.tsx\n│   │       └── NotificationBell.tsx\n│   ├── lib/\n│   │   ├── api-client.ts\n│   │   ├── auth.tsx\n│   │   ├── types.ts\n│   │   ├── utils.ts\n│   │   ├── constants.ts\n│   │   ├── validators.ts\n│   │   └── formatters.ts\n│   ├── hooks/\n│   │   ├── use-auth.ts\n│   │   ├── use-api.ts\n│   │   ├── use-permissions.ts\n│   │   ├── use-analytics.ts\n│   │   ├── use-debounce.ts\n│   │   ├── use-local-storage.ts\n│   │   └── use-media-query.ts\n│   └── stores/\n│       ├── auth-store.ts\n│       ├── ui-store.ts\n│       └── notification-store.ts\n├── package.json\n├── tsconfig.json\n└── index.ts                          # Export all components\n```\n\n---\n\n## 📝 API Integration Patterns\n\n### Shared API Client\n```typescript\n// shared/lib/api-client.ts\nimport axios from 'axios';\n\nclass ApiClient {\n  private baseURL: string;\n  private token: string | null = null;\n\n  constructor(baseURL: string) {\n    this.baseURL = baseURL;\n  }\n\n  setToken(token: string) {\n    this.token = token;\n  }\n\n  clearToken() {\n    this.token = null;\n  }\n\n  private getHeaders() {\n    const headers: Record<string, string> = {\n      'Content-Type': 'application/json',\n    };\n\n    if (this.token) {\n      headers['Authorization'] = `Bearer ${this.token}`;\n    }\n\n    return headers;\n  }\n\n  async get<T>(url: string, params?: any): Promise<T> {\n    const response = await axios.get<T>(`${this.baseURL}${url}`, {\n      headers: this.getHeaders(),\n      params,\n    });\n    return response.data;\n  }\n\n  async post<T>(url: string, data: any): Promise<T> {\n    const response = await axios.post<T>(`${this.baseURL}${url}`, data, {\n      headers: this.getHeaders(),\n    });\n    return response.data;\n  }\n\n  async put<T>(url: string, data: any): Promise<T> {\n    const response = await axios.put<T>(`${this.baseURL}${url}`, data, {\n      headers: this.getHeaders(),\n    });\n    return response.data;\n  }\n\n  async delete<T>(url: string): Promise<T> {\n    const response = await axios.delete<T>(`${this.baseURL}${url}`, {\n      headers: this.getHeaders(),\n    });\n    return response.data;\n  }\n}\n\n// Create instances for different dashboards\nexport const adminApiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');\nexport const recruiterApiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');\n```\n\n### Admin API Hooks\n```typescript\n// admin/lib/hooks/use-admin-api.ts\nimport { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { adminApiClient } from '@/shared/lib/api-client';\n\n// Users\nexport function useUsers(filters?: UserFilters) {\n  return useQuery({\n    queryKey: ['users', filters],\n    queryFn: () => adminApiClient.get<User[]>('/api/admin/users', filters),\n  });\n}\n\nexport function useCreateUser() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (data: UserCreate) => adminApiClient.post<User>('/api/admin/users', data),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['users'] });\n    },\n  });\n}\n\nexport function useUpdateUser() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>\n      adminApiClient.put<User>(`/api/admin/users/${id}`, data),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['users'] });\n    },\n  });\n}\n\nexport function useDeleteUser() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (id: string) => adminApiClient.delete(`/api/admin/users/${id}`),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['users'] });\n    },\n  });\n}\n\n// Companies\nexport function useCompanies(filters?: CompanyFilters) {\n  return useQuery({\n    queryKey: ['companies', filters],\n    queryFn: () => adminApiClient.get<Company[]>('/api/admin/companies', filters),\n  });\n}\n\nexport function useCreateCompany() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (data: CompanyCreate) => adminApiClient.post<Company>('/api/admin/companies', data),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['companies'] });\n    },\n  });\n}\n\n// System Health\nexport function useSystemHealth() {\n  return useQuery({\n    queryKey: ['system-health'],\n    queryFn: () => adminApiClient.get<SystemHealth>('/api/admin/system/health'),\n    refetchInterval: 30000, // Refresh every 30 seconds\n  });\n}\n```\n\n### Recruiter API Hooks\n```typescript\n// dashboard/lib/hooks/use-recruiter-api.ts\nimport { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { recruiterApiClient } from '@/shared/lib/api-client';\n\n// Campaigns\nexport function useCampaigns(filters?: CampaignFilters) {\n  return useQuery({\n    queryKey: ['campaigns', filters],\n    queryFn: () => recruiterApiClient.get<Campaign[]>('/api/recruiter/campaigns', filters),\n  });\n}\n\nexport function useCreateCampaign() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (data: CampaignCreate) => recruiterApiClient.post<Campaign>('/api/recruiter/campaigns', data),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['campaigns'] });\n    },\n  });\n}\n\n// Candidates\nexport function useCandidates(filters?: CandidateFilters) {\n  return useQuery({\n    queryKey: ['candidates', filters],\n    queryFn: () => recruiterApiClient.get<Candidate[]>('/api/recruiter/candidates', filters),\n  });\n}\n\nexport function useShortlistCandidate() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (id: string) => recruiterApiClient.post<Candidate>(`/api/recruiter/candidates/${id}/shortlist`),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['candidates'] });\n    },\n  });\n}\n\nexport function useRejectCandidate() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: (id: string) => recruiterApiClient.post<Candidate>(`/api/recruiter/candidates/${id}/reject`),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['candidates'] });\n    },\n  });\n}\n\n// Scorecards\nexport function useScorecard(candidateId: string) {\n  return useQuery({\n    queryKey: ['scorecard', candidateId],\n    queryFn: () => recruiterApiClient.get<Scorecard>(`/api/recruiter/scorecards/${candidateId}`),\n    enabled: !!candidateId,\n  });\n}\n\n// Requisitions\nexport function useRequisitions(filters?: RequisitionFilters) {\n  return useQuery({\n    queryKey: ['requisitions', filters],\n    queryFn: () => recruiterApiClient.get<Requisition[]>('/api/recruiter/requisitions', filters),\n  });\n}\n```\n\n---\n\n## 🎯 User Experience Flows\n\n### ADMIN Onboarding Flow\n```\n1. Admin Login\n   ↓\n2. System Health Check\n   ↓\n3. Quick Setup Wizard\n   ├── Configure system settings\n   ├── Set up monitoring alerts\n   └── Configure integrations\n   ↓\n4. Dashboard Overview\n   ↓\n5. First Actions\n   ├── Create first company\n   ├── Create first admin user\n   └── Review system status\n```\n\n### RECRUITER Onboarding Flow\n```\n1. Recruiter Login\n   ↓\n2. Company Profile Setup\n   ├── Company information\n   ├── Team members\n   └── Notification preferences\n   ↓\n3. Dashboard Overview\n   ↓\n4. First Campaign Setup\n   ├── Create requisition\n   ├── Define screening criteria\n   └── Launch campaign\n   ↓\n5. Candidate Review\n   ↓\n6. First Shortlist\n```\n\n### ADMIN Daily Workflow\n```\n1. Login → Overview Dashboard\n   ↓\n2. Review System Health\n   ├── Check API status\n   ├── Review database performance\n   └── Monitor queue health\n   ↓\n3. Review User Activity\n   ├── New user registrations\n   ├── User activity patterns\n   └── Security events\n   ↓\n4. Company Management\n   ├── New company onboarding\n   ├── Subscription management\n   └── Billing review\n   ↓\n5. System Administration\n   ├── Configuration updates\n   ├── Integration management\n   └── Performance optimization\n   ↓\n6. Audit & Compliance\n   ├── Review audit logs\n   ├── Compliance reports\n   └── Security monitoring\n```\n\n### RECRUITER Daily Workflow\n```\n1. Login → Overview Dashboard\n   ↓\n2. Review Campaign Status\n   ├── Active campaigns\n   ├── Candidate progress\n   └── Screening completion rates\n   ↓\n3. Candidate Review\n   ├── Filter by score\n   ├── Review top performers\n   └── Shortlist candidates\n   ↓\n4. Scorecard Analysis\n   ├── Detailed score review\n   ├── Transcript analysis\n   └── Audio review\n   ↓\n5. Requisition Management\n   ├── Open requisitions\n   ├── Candidate matching\n   └── Hiring pipeline\n   ↓\n6. Analytics & Reporting\n   ├── Pipeline metrics\n   ├── Time-to-hire analysis\n   └── Quality reports\n```\n\n---\n\n## 🔒 Security Considerations\n\n### Authentication Flow\n```typescript\n// shared/lib/auth.tsx\nimport { useState, useCallback } from 'react';\nimport { useRouter } from 'next/navigation';\nimport { adminApiClient, recruiterApiClient } from './api-client';\n\nexport function useAuth() {\n  const [user, setUser] = useState<User | null>(null);\n  const [loading, setLoading] = useState(false);\n  const router = useRouter();\n\n  const login = useCallback(async (email: string, password: string, role: 'ADMIN' | 'RECRUITER') => {\n    setLoading(true);\n    try {\n      const response = await fetch('/api/auth/login', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ email, password, role }),\n      });\n\n      const data = await response.json();\n\n      if (response.ok) {\n        setUser(data.user);\n        \n        // Set token in appropriate API client\n        if (role === 'ADMIN') {\n          adminApiClient.setToken(data.token);\n          router.push('/admin');\n        } else {\n          recruiterApiClient.setToken(data.token);\n          router.push('/dashboard');\n        }\n      } else {\n        throw new Error(data.message);\n      }\n    } catch (error) {\n      console.error('Login failed:', error);\n      throw error;\n    } finally {\n      setLoading(false);\n    }\n  }, [router]);\n\n  const logout = useCallback(async () => {\n    try {\n      await fetch('/api/auth/logout', { method: 'POST' });\n    } catch (error) {\n      console.error('Logout failed:', error);\n    } finally {\n      setUser(null);\n      adminApiClient.clearToken();\n      recruiterApiClient.clearToken();\n      router.push('/login');\n    }\n  }, [router]);\n\n  return { user, loading, login, logout };\n}\n```\n\n### Permission Checking\n```typescript\n// shared/lib/permissions.ts\nimport { UserRole, Permission } from './types';\n\nexport function hasPermission(userRole: UserRole, permission: Permission): boolean {\n  const rolePermissions: Record<UserRole, Permission[]> = {\n    ADMIN: Object.values(Permission),\n    RECRUITER: [\n      Permission.REQUISITION_READ,\n      Permission.REQUISITION_WRITE,\n      Permission.CAMPAIGN_READ,\n      Permission.CAMPAIGN_WRITE,\n      Permission.CANDIDATE_READ,\n      Permission.CANDIDATE_WRITE,\n      Permission.CANDIDATE_SHORTLIST,\n      Permission.SCORECARD_READ,\n      Permission.ANALYTICS_READ,\n    ],\n    VIEWER: [\n      Permission.REQUISITION_READ,\n      Permission.CAMPAIGN_READ,\n      Permission.CANDIDATE_READ,\n      Permission.SCORECARD_READ,\n      Permission.ANALYTICS_READ,\n    ],\n  };\n\n  return rolePermissions[userRole]?.includes(permission) || false;\n}\n\nexport function requirePermission(userRole: UserRole, permission: Permission): void {\n  if (!hasPermission(userRole, permission)) {\n    throw new Error(`Permission denied: ${permission}`);\n  }\n}\n```\n\n### Data Isolation\n```typescript\n// shared/lib/data-isolation.ts\nexport function ensureCompanyAccess(user: User, companyId: string): void {\n  if (user.role === 'ADMIN') {\n    // Admins can access all companies\n    return;\n  }\n\n  if (user.companyId !== companyId) {\n    throw new Error('Access denied: You do not have access to this company');\n  }\n}\n\nexport function filterByCompany<T extends { companyId: string }>(\n  items: T[],\n  user: User\n): T[] {\n  if (user.role === 'ADMIN') {\n    return items;\n  }\n\n  return items.filter(item => item.companyId === user.companyId);\n}\n```\n\n---\n\n## 📊 Performance Metrics & KPIs\n\n### ADMIN Dashboard KPIs\n```typescript\n// Admin Performance Metrics\ninterface AdminMetrics {\n  // User Metrics\n  totalUsers: number;\n  activeUsers: number;\n  newUsersThisMonth: number;\n  userRetentionRate: number;\n\n  // Company Metrics\n  totalCompanies: number;\n  activeCompanies: number;\n  newCompaniesThisMonth: number;\n  companyChurnRate: number;\n\n  // System Metrics\n  apiResponseTime: number;\n  databaseQueryTime: number;\n  systemUptime: number;\n  errorRate: number;\n\n  // Revenue Metrics\n  monthlyRecurringRevenue: number;\n  averageRevenuePerUser: number;\n  customerLifetimeValue: number;\n  churnRate: number;\n}\n```\n\n### RECRUITER Dashboard KPIs\n```typescript\n// Recruiter Performance Metrics\ninterface RecruiterMetrics {\n  // Campaign Metrics\n  activeCampaigns: number;\n  totalCampaigns: number;\n  campaignCompletionRate: number;\n  averageCampaignDuration: number;\n\n  // Candidate Metrics\n  totalCandidates: number;\n  screenedCandidates: number;\n  shortlistedCandidates: number;\n  shortlistRate: number;\n\n  // Time Metrics\n  averageTimeToScreen: number;\n  averageTimeToShortlist: number;\n  timeToHire: number;\n\n  // Quality Metrics\n  averageScore: number;\n  scoreDistribution: ScoreDistribution;\n  candidateQualityScore: number;\n}\n```\n\n---\n\n## 🚀 Deployment Strategy\n\n### Environment Configuration\n```bash\n# .env.admin\nNEXT_PUBLIC_API_URL=https://api.arohan.com\nNEXT_PUBLIC_APP_URL=https://admin.arohan.com\nNEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn\nNEXT_PUBLIC_ANALYTICS_ID=your_analytics_id\n\n# .env.dashboard\nNEXT_PUBLIC_API_URL=https://api.arohan.com\nNEXT_PUBLIC_APP_URL=https://dashboard.arohan.com\nNEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn\nNEXT_PUBLIC_ANALYTICS_ID=your_analytics_id\n```\n\n### Build Optimization\n```javascript\n// next.config.js (Admin)\nmodule.exports = {\n  reactStrictMode: true,\n  swcMinify: true,\n  compress: true,\n  productionBrowserSourceMaps: false,\n  \n  // Optimize for CPU-only hardware\n  experimental: {\n    optimizeCss: true,\n    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],\n  },\n\n  // Image optimization\n  images: {\n    domains: ['arohan.com'],\n    formats: ['image/avif', 'image/webp'],\n    deviceSizes: [640, 750, 828, 1080, 1200],\n  },\n\n  // Bundle analysis\n  webpack: (config, { isServer }) => {\n    if (!isServer) {\n      config.resolve.fallback = {\n        ...config.resolve.fallback,\n        fs: false,\n        net: false,\n        tls: false,\n      };\n    }\n    return config;\n  },\n};\n```\n\n### Monitoring Setup\n```typescript\n// lib/monitoring.ts\nimport * as Sentry from '@sentry/nextjs';\n\nSentry.init({\n  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,\n  environment: process.env.NODE_ENV,\n  tracesSampleRate: 0.1,\n  beforeSend(event) {\n    // Filter out sensitive data\n    if (event.request) {\n      delete event.request.cookies;\n    }\n    return event;\n  },\n});\n\n// Performance monitoring\nexport function trackPerformance(metricName: string, value: number) {\n  // Send to monitoring service\n  if (typeof window !== 'undefined' && 'performance' in window) {\n    performance.mark(metricName);\n    performance.measure(metricName, metricName);\n  }\n}\n```\n\n---\n\n## 📚 Documentation Structure\n\n### Developer Documentation\n```\ndocs/\n├── README.md\n├── ARCHITECTURE.md\n├── API_REFERENCE.md\n├── COMPONENT_LIBRARY.md\n├── STATE_MANAGEMENT.md\n├── AUTHENTICATION.md\n├── PERMISSIONS.md\n├── TESTING.md\n├── DEPLOYMENT.md\n├── TROUBLESHOOTING.md\n└── CONTRIBUTING.md\n```\n\n### User Documentation\n```\nuser-docs/\n├── admin/\n│   ├── GETTING_STARTED.md\n│   ├── USER_MANAGEMENT.md\n│   ├── COMPANY_MANAGEMENT.md\n│   ├── SYSTEM_ADMINISTRATION.md\n│   ├── BILLING.md\n│   └── TROUBLESHOOTING.md\n└── recruiter/\n    ├── GETTING_STARTED.md\n    ├── CAMPAIGN_MANAGEMENT.md\n    ├── CANDIDATE_REVIEW.md\n    ├── REQUISITION_MANAGEMENT.md\n    ├── ANALYTICS.md\n    └── TROUBLESHOOTING.md\n```\n\n---\n\n## ✅ Success Criteria\n\n### ADMIN Dashboard Success Metrics\n- [ ] System health monitoring with <30s refresh rate\n- [ ] User management with <500ms response time\n- [ ] Company management with <600ms response time\n- [ ] Real-time alerts for system issues\n- [ ] Comprehensive audit logging\n- [ ] 99.9% uptime for admin functions\n- [ ] <3s initial page load time\n- [ ] WCAG 2.1 AA compliance\n\n### RECRUITER Dashboard Success Metrics\n- [ ] Campaign management with <800ms response time\n- [ ] Candidate list with 200+ items in <800ms\n- [ ] Scorecard detail view in <500ms\n- [ ] Bulk actions on 50+ candidates in <2s\n- [ ] Real-time candidate status updates\n- [ ] Advanced filtering with <400ms response\n- [ ] <2s initial page load time\n- [ ] WCAG 2.1 AA compliance\n\n---\n\n## 🎯 Next Steps\n\n1. **Review and Approve**: Stakeholder review of this design document\n2. **Set Up Projects**: Initialize admin and dashboard Next.js projects\n3. **Create Shared Library**: Set up shared component library\n4. **Implement Authentication**: Build auth system with role-based routing\n5. **Build ADMIN Dashboard**: Implement admin features phase by phase\n6. **Build RECRUITER Dashboard**: Implement recruiter features phase by phase\n7. **Integration Testing**: Connect to FastAPI backend\n8. **Performance Optimization**: Optimize for CPU-only hardware\n9. **User Testing**: Conduct usability testing with real users\n10. **Launch**: Deploy to production and monitor\n\n---\n\n**Document Status**: ✅ Complete and Ready for Implementation  \n**Last Updated**: 2026-05-03  \n**Next Review**: After Phase 1 completion  \n**Maintained By**: Orchestrator Prime (AI Architect)",
  "oldString": "### Phase 2: ADMIN Dashboard (Week 3-4)\n- [ ] Implement admin overview dashboard\n-"
}
```

**Error:**
```
File /media/matrix/DATA/opencode_projects/AROHAN/DASHBOARD_ARCHITECTURE_DESIGN.md not found
```

---

## Assistant (Orchestrator · GLM 4.7 · 205.6s)

_Thinking:_

The file doesn't exist yet. I need to create it with the complete design document. Let me write the full document.

<tool_call>write<arg_key>content</arg_key><arg_value># AROHAN Dashboard Architecture Design
## ADMIN & RECRUITER Views - Complete UI/UX Specification

**Version**: 1.0  
**Date**: 2026-05-03  
**Design Status**: Ready for Implementation  
**Reviewed By**: Orchestrator Prime (AI Architect)  
**Tech Stack**: Next.js 14 + shadcn/ui + TypeScript + Tailwind CSS

---

## 🎯 Executive Summary

This document defines the complete architecture for separating AROHAN into two distinct dashboard experiences:
- **ADMIN Dashboard** (`/admin`) - Platform management and system administration
- **RECRUITER Dashboard** (`/dashboard`) - Employer hiring workflows and candidate management

**Key Design Principles:**
1. **Clear Role Separation** - Distinct interfaces for different user personas
2. **Progressive Disclosure** - Show relevant information based on user role
3. **Performance First** - Optimized for CPU-only hardware (Dell Latitude 3460)
4. **Accessibility Compliant** - WCAG 2.1 AA standards
5. **Scalable Architecture** - Multi-tenant SaaS patterns

---

## 🏗️ Architecture Overview

### Multi-Tenant Structure
```
arohan/
├── dashboard/                    # RECRUITER Dashboard (Employer View)
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/        # /dashboard route
│   │   │   │   ├── campaigns/
│   │   │   │   ├── candidates/
│   │   │   │   ├── requisitions/
│   │   │   │   ├── scorecards/
│   │   │   │   └── analytics/
│   │   │   └── layout.tsx
│   │   └── components/
│   │       └── recruiter/        # Recruiter-specific components
│   └── package.json
│
└── admin/                        # ADMIN Dashboard (Platform Management)
    ├── src/
    │   ├── app/
    │   │   ├── admin/            # /admin route
    │   │   │   ├── users/
    │   │   │   ├── companies/
    │   │   │   ├── system/
    │   │   │   ├── billing/
    │   │   │   ├── audit/
    │   │   │   └── integrations/
    │   │   └── layout.tsx
    │   └── components/
    │       └── admin/            # Admin-specific components
    └── package.json
```

### Shared Components Library
```
shared/
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── layout/               # Shared layout components
│   │   └── common/               # Cross-role components
│   ├── lib/
│   │   ├── api-client.ts         # Shared API client
│   │   ├── auth.tsx              # Shared auth utilities
│   │   └── types.ts              # Shared TypeScript types
│   └── hooks/
│       └── use-auth.ts           # Shared auth hooks
└── package.json
```

---

## 👥 User Personas & Access Patterns

### ADMIN Persona: "Platform Administrator"
**Profile**: Technical operations manager, manages platform-wide operations
**Access Level**: Full system access, cross-tenant visibility
**Primary Goals**: System health, user management, revenue optimization

### RECRUITER Persona: "Priya Sharma - HR Manager"
**Profile**: Mid-sized logistics HR manager, 3-5 campaigns/month
**Access Level**: Single-tenant (company-specific), hiring workflows
**Primary Goals**: Fast candidate review, informed hiring decisions, campaign efficiency

### VIEWER Persona: "Read-only Employer"
**Profile**: Stakeholder who needs visibility but no write access
**Access Level**: Single-tenant, read-only
**Primary Goals**: Monitor hiring progress, view analytics

---

## 🎨 Visual Design System

### Color Palette - Role Differentiation

#### ADMIN Dashboard Colors
```css
/* Primary - Trust & Authority */
--admin-primary: #6366f1;        /* Indigo 500 */
--admin-primary-dark: #4f46e5;  /* Indigo 600 */
--admin-primary-light: #818cf8; /* Indigo 400 */

/* Secondary - System Status */
--admin-success: #10b981;       /* Emerald 500 */
--admin-warning: #f59e0b;       /* Amber 500 */
--admin-danger: #ef4444;        /* Red 500 */
--admin-info: #3b82f6;          /* Blue 500 */

/* Backgrounds */
--admin-bg-primary: #0f172a;     /* Slate 900 */
--admin-bg-secondary: #1e293b;  /* Slate 800 */
--admin-bg-tertiary: #334155;   /* Slate 700 */
```

#### RECRUITER Dashboard Colors
```css
/* Primary - Action & Engagement */
--recruiter-primary: #8b5cf6;    /* Violet 500 */
--recruiter-primary-dark: #7c3aed; /* Violet 600 */
--recruiter-primary-light: #a78bfa; /* Violet 400 */

/* Secondary - Candidate Status */
--recruiter-success: #10b981;    /* Emerald 500 */
--recruiter-warning: #f59e0b;    /* Amber 500 */
--recruiter-danger: #ef4444;     /* Red 500 */
--recruiter-info: #3b82f6;       /* Blue 500 */

/* Backgrounds */
--recruiter-bg-primary: #000000; /* Black */
--recruiter-bg-secondary: #111827; /* Gray 900 */
--recruiter-bg-tertiary: #1f2937;  /* Gray 800 */
```

### Typography System
```css
/* Font Family */
--font-primary: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

---

## 🖥️ ADMIN Dashboard Design

### Navigation Structure
```
ADMIN Sidebar Navigation:
├── 🏠 Overview                    # System health dashboard
├── 👥 Users                       # User management
│   ├── All Users
│   ├── Add User
│   ├── User Permissions
│   └── User Activity
├── 🏢 Companies                  # Company management
│   ├── All Companies
│   ├── Company Onboarding
│   ├── Subscription Management
│   └── Company Analytics
├── ⚙️ System                      # System administration
│   ├── Health Monitoring
│   ├── Performance Metrics
│   ├── Configuration
│   └── Error Logs
├── 💰 Billing                     # Revenue management
│   ├── Subscriptions
│   ├── Invoices
│   ├── Usage Analytics
│   └── Revenue Reports
├── 🔍 Audit                       # Compliance & audit
│   ├── Audit Logs
│   ├── Compliance Reports
│   ├── Security Events
│   └── Data Export
├── 🔗 Integrations               # Third-party integrations
│   ├── API Management
│   ├── Webhooks
│   ├── Service Status
│   └── Integration Settings
└── ⚙️ Settings                    # Admin settings
    ├── Profile
    ├── Notifications
    ├── Security
    └── API Keys
```

### Key ADMIN Screens

#### 1. Overview Dashboard
**Purpose**: System health at a glance
**Layout**: Grid-based metrics with drill-down capability

```tsx
// Admin Overview Layout
┌─────────────────────────────────────────────────────────┐
│  AROHAN ADMIN                    🔔 Admin | ⚙️ Settings  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Total Users  │  │ Total Companies│  │ Active Sessions│ │
│  │    1,247     │  │      89      │  │      342      │  │
│  │  ▲ 12%       │  │  ▲ 8%        │  │  ▲ 15%       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              System Health Status                │   │
│  │  🟢 API: Healthy  🟢 Database: Healthy  🟡 Queue: High Load│   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Revenue This Month                  │   │
│  │  ₹4,52,000  ▲ 18% vs last month                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Recent Activity                     │   │
│  │  • New company onboarded: LogisticsPro Ltd        │   │
│  │  • User created: priya.sharma@logisticspro.com   │   │
│  │  • Subscription upgraded: Growth plan            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 2. User Management
**Purpose**: CRUD operations for users across all companies
**Features**: Search, filter, bulk actions, permission management

```tsx
// User Management Table
┌─────────────────────────────────────────────────────────┐
│  Users                                    [+ Add User]  │
├─────────────────────────────────────────────────────────┤
│  Search: [___________] Filter: [Role ▼] [Company ▼]     │
├─────────────────────────────────────────────────────────┤
│  ☐ Name           Email              Role    Company     │
│  ☐ Priya Sharma   priya@logistics.com Recruiter LogisticsPro│
│  ☐ Raj Kumar      raj@retail.com      Viewer  RetailMax  │
│  ☐ Amit Singh     amit@warehouse.com  Admin   WarehouseCo│
│  ☐ ...                                                     │
├─────────────────────────────────────────────────────────┤
│  [Delete Selected] [Export] [1-50 of 1,247]              │
└─────────────────────────────────────────────────────────┘
```

#### 3. Company Management
**Purpose**: Manage companies, subscriptions, and billing
**Features**: Company onboarding, plan management, usage analytics

```tsx
// Company Management Card
┌─────────────────────────────────────────────────────────┐
│  Companies                                   [+ Onboard]  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ LogisticsPro Ltd                    Active       │   │
│  │ Plan: Growth | Users: 12 | Screenings: 1,234    │   │
│  │ [View Details] [Manage] [Billing]              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ RetailMax India                      Active       │   │
│  │ Plan: Startup | Users: 5 | Screenings: 456      │   │
│  │ [View Details] [Manage] [Billing]              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### ADMIN UI Components

#### AdminSidebar Component
```tsx
interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'ADMIN' | 'SUPER_ADMIN';
}

const adminMenuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', badge: null },
  { id: 'users', icon: Users, label: 'Users', badge: '1,247' },
  { id: 'companies', icon: Building2, label: 'Companies', badge: '89' },
  { id: 'system', icon: Server, label: 'System', badge: null },
  { id: 'billing', icon: IndianRupee, label: 'Billing', badge: null },
  { id: 'audit', icon: Shield, label: 'Audit', badge: '3 alerts' },
  { id: 'integrations', icon: Link, label: 'Integrations', badge: null },
  { id: 'settings', icon: Settings, label: 'Settings', badge: null },
];
```

#### AdminMetricCard Component
```tsx
interface AdminMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'red';
}

// Usage Example
<AdminMetricCard
  title="Total Users"
  value="1,247"
  change={12}
  trend="up"
  icon={Users}
  color="indigo"
/>
```

---

## 🎯 RECRUITER Dashboard Design

### Navigation Structure
```
RECRUITER Sidebar Navigation:
├── 📊 Overview                    # Campaign & hiring overview
├── 📋 Campaigns                   # Campaign management
│   ├── Active Campaigns
│   ├── Campaign History
│   ├── Create Campaign
│   └── Campaign Analytics
├── 👤 Candidates                  # Candidate management
│   ├── All Candidates
│   ├── Shortlisted
│   ├── Rejected
│   └── Search & Filter
├── 📝 Requisitions                # Job requisitions
│   ├── Open Requisitions
│   ├── Create Requisition
│   ├── Match Candidates
│   └── Requisition Analytics
├── 📄 Scorecards                  # Candidate scorecards
│   ├── Recent Scorecards
│   ├── Scorecard Details
│   ├── Audio Review
│   └── Transcript Analysis
├── 📈 Analytics                   # Hiring analytics
│   ├── Pipeline Metrics
│   ├── Time-to-Hire
│   ├── Candidate Quality
│   └── Custom Reports
└── ⚙️ Settings                    # Recruiter settings
    ├── Profile
    ├── Notifications
    ├── Team Management
    └── API Access
```

### Key RECRUITER Screens

#### 1. Recruiter Overview
**Purpose**: Hiring pipeline at a glance
**Layout**: Campaign-focused with candidate metrics

```tsx
// Recruiter Overview Layout
┌─────────────────────────────────────────────────────────┐
│  AROHAN                    🔔 Priya Sharma | ⚙️ Settings  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Active Campaigns│  │ Candidates This Week│  │ Shortlist Rate│ │
│  │      3       │  │      156     │  │     67%      │  │
│  │  Delivery    │  │  ▲ 23%       │  │  ▲ 8%        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Active Campaigns                     │   │
│  │  🚀 Delivery Partners - 45 candidates screened    │   │
│  │  📦 Warehouse Staff - 32 candidates screened      │   │
│  │  🛒 Retail Associates - 28 candidates screened    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Top Candidates This Week             │   │
│  │  🥇 Rahul Kumar - 92/100 - Delivery Partner       │   │
│  │  🥈 Priya Singh - 88/100 - Warehouse Staff        │   │
│  │  🥉 Amit Verma - 85/100 - Retail Associate        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 2. Candidate Management
**Purpose**: Review, filter, and action on candidates
**Features**: Advanced filtering, bulk actions, scorecard preview

```tsx
// Candidate Management Table
┌─────────────────────────────────────────────────────────┐
│  Candidates                    [Shortlist] [Reject] [Export]│
├─────────────────────────────────────────────────────────┤
│  Search: [___________] Score: [70+ ▼] Language: [Hindi ▼]│
├─────────────────────────────────────────────────────────┤
│  ☐ Name          Phone    Score  Language  Status       │
│  ☐ Rahul Kumar   +91-9876  92/100 Hindi     ⭐ Shortlisted│
│  ☐ Priya Singh   +91-8765  88/100 Hinglish  ⭐ Shortlisted│
│  ☐ Amit Verma    +91-7654  85/100 Hindi     ⏳ Pending    │
│  ☐ Sunita Devi   +91-6543  72/100 Tamil     ⏳ Pending    │
│  ☐ ...                                                     │
├─────────────────────────────────────────────────────────┤
│  [Bulk Shortlist] [Bulk Reject] [1-50 of 156]            │
└─────────────────────────────────────────────────────────┘
```

#### 3. Scorecard Detail View
**Purpose**: Detailed candidate assessment review
**Features**: Score breakdown, transcript, audio playback, job matching

```tsx
// Scorecard Detail Layout
┌─────────────────────────────────────────────────────────┐
│  ← Back to Candidates    Rahul Kumar    [Shortlist] [Reject]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Overall Score: 92/100              │   │
│  │  🟢 Communication: 95/100  🟢 Domain: 90/100      │   │
│  │  🟢 Situational: 88/100  🟢 Confidence: 94/100   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Language Fluency: Native           │   │
│  │  Detected: Hindi (hi-IN) | Confidence: 94%      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Interview Transcript               │   │
│  │  Proctor: Tell me about your experience with... │   │
│  │  Candidate: I have 3 years of experience in...  │   │
│  │  [▶ Play Audio] [Download Transcript]           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Matched Requisitions               │   │
│  │  📍 Delivery Partner - Nagpur (12km) - Match: 94%│   │
│  │  📍 Warehouse Staff - Nagpur (8km) - Match: 88% │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### RECRUITER UI Components

#### RecruiterSidebar Component
```tsx
interface RecruiterSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'RECRUITER' | 'VIEWER';
}

const recruiterMenuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', badge: null },
  { id: 'campaigns', icon: Megaphone, label: 'Campaigns', badge: '3 active' },
  { id: 'candidates', icon: Users, label: 'Candidates', badge: '156 this week' },
  { id: 'requisitions', icon: Briefcase, label: 'Requisitions', badge: '5 open' },
  { id: 'scorecards', icon: FileText, label: 'Scorecards', badge: '23 new' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: null },
  { id: 'settings', icon: Settings, label: 'Settings', badge: null },
];
```

#### CandidateCard Component
```tsx
interface CandidateCardProps {
  candidate: Candidate;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onViewScorecard: (id: string) => void;
}

// Usage Example
<CandidateCard
  candidate={{
    id: '123',
    name: 'Rahul Kumar',
    phone: '+91-9876543210',
    overallScore: 92,
    language: 'Hindi',
    status: 'pending'
  }}
  onShortlist={handleShortlist}
  onReject={handleReject}
  onViewScorecard={handleViewScorecard}
/>
```

#### ScorecardBreakdown Component
```tsx
interface ScorecardBreakdownProps {
  scorecard: Scorecard;
  showTranscript?: boolean;
  showAudio?: boolean;
}

// Usage Example
<ScorecardBreakdown
  scorecard={{
    overallScore: 92,
    communicationScore: 95,
    domainKnowledgeScore: 90,
    situationalJudgmentScore: 88,
    confidenceScore: 94,
    languageFluency: 'native',
    assessorNotes: 'Strong candidate with excellent communication...'
  }}
  showTranscript={true}
  showAudio={true}
/>
```

---

## 🔐 Authentication & Authorization

### Role-Based Routing
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const userRole = getUserRoleFromToken(token?.value);

  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token || userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request));
    }
  }

  // Recruiter routes protection
  if (pathname.startsWith('/dashboard')) {
    if (!token || !['RECRUITER', 'VIEWER'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request));
    }
  }

  return NextResponse.next();
}
```

### Permission-Based Component Rendering
```tsx
// PermissionWrapper Component
interface PermissionWrapperProps {
  requiredPermission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function PermissionWrapper({ requiredPermission, fallback, children }: PermissionWrapperProps) {
  const { user } = useAuth();
  const hasPermission = checkPermission(user.role, requiredPermission);

  if (!hasPermission) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Usage Example
<PermissionWrapper requiredPermission={Permission.USER_DELETE}>
  <Button variant="destructive">Delete User</Button>
</PermissionWrapper>
```

---

## 📱 Responsive Design Strategy

### Breakpoint System
```css
/* Mobile First Approach */
/* Mobile: < 640px */
@media (max-width: 639px) {
  .sidebar { display: none; }
  .mobile-nav { display: flex; }
}

/* Tablet: 640px - 1024px */
@media (min-width: 640px) and (max-width: 1023px) {
  .sidebar { width: 200px; }
  .main-content { margin-left: 200px; }
}

/* Desktop: >= 1024px */
@media (min-width: 1024px) {
  .sidebar { width: 256px; }
  .main-content { margin-left: 256px; }
}
```

### Mobile Navigation
```tsx
// Mobile Navigation Component
function MobileNavigation({ activeTab, setActiveTab }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
```

---

## ⚡ Performance Optimization

### Code Splitting Strategy
```typescript
// Dynamic imports for route-based splitting
const AdminOverview = dynamic(() => import('./admin/overview'));
const AdminUsers = dynamic(() => import('./admin/users'));
const RecruiterCampaigns = dynamic(() => import('./recruiter/campaigns'));
const RecruiterCandidates = dynamic(() => import('./recruiter/candidates'));
```

### Lazy Loading Components
```tsx
// Lazy load heavy components
const ScorecardDetail = lazy(() => import('./components/ScorecardDetail'));
const AudioPlayer = lazy(() => import('./components/AudioPlayer'));
const TranscriptViewer = lazy(() => import('./components/TranscriptViewer'));
```

### Virtual Scrolling
```tsx
// VirtualList for large datasets
import { useVirtualizer } from '@tanstack/react-virtual';

function CandidateList({ candidates }: { candidates: Candidate[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(virtualItem => (
        <CandidateCard
          key={virtualItem.key}
          candidate={candidates[virtualItem.index]}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}
        />
      ))}
    </div>
  );
}
```

---

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
```tsx
// Accessible Button Component
function AccessibleButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      aria-label={props['aria-label'] || children?.toString()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          props.onClick?.(e as any);
        }
      }}
    >
      {children}
    </button>
  );
}

// Keyboard Navigation
function useKeyboardNavigation(items: MenuItem[]) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        items[focusedIndex].onClick();
        break;
    }
  };

  return { focusedIndex, handleKeyDown };
}
```

### Screen Reader Support
```tsx
// Screen Reader Announcements
function useAnnouncer() {
  const announce = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return { announce };
}

// Usage
const { announce } = useAnnouncer();
announce('Candidate shortlisted successfully');
```

---

## 🔄 State Management Strategy

### Global State (Zustand)
```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

// stores/admin-store.ts
interface AdminState {
  selectedCompany: string | null;
  selectedUser: string | null;
  filters: AdminFilters;
  setSelectedCompany: (id: string) => void;
  setSelectedUser: (id: string) => void;
  setFilters: (filters: AdminFilters) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedCompany: null,
  selectedUser: null,
  filters: {},
  setSelectedCompany: (id) => set({ selectedCompany: id }),
  setSelectedUser: (id) => set({ selectedUser: id }),
  setFilters: (filters) => set({ filters }),
}));

// stores/recruiter-store.ts
interface RecruiterState {
  selectedCampaign: string | null;
  selectedCandidate: string | null;
  filters: RecruiterFilters;
  setSelectedCampaign: (id: string) => void;
  setSelectedCandidate: (id: string) => void;
  setFilters: (filters: RecruiterFilters) => void;
}

export const useRecruiterStore = create<RecruiterState>((set) => ({
  selectedCampaign: null,
  selectedCandidate: null,
  filters: {},
  setSelectedCampaign: (id) => set({ selectedCampaign: id }),
  setSelectedCandidate: (id) => set({ selectedCandidate: id }),
  setFilters: (filters) => set({ filters }),
}));
```

---

## 🧪 Testing Strategy

### Component Testing
```typescript
// AdminSidebar.test.tsx
describe('AdminSidebar', () => {
  it('renders all menu items', () => {
    const { getByText } = render(<AdminSidebar activeTab="overview" setActiveTab={jest.fn()} />);
    expect(getByText('Overview')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Companies')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    const { getByText } = render(<AdminSidebar activeTab="users" setActiveTab={jest.fn()} />);
    const usersButton = getByText('Users');
    expect(usersButton).toHaveClass('bg-gradient-to-r');
  });
});

// CandidateCard.test.tsx
describe('CandidateCard', () => {
  it('displays candidate information correctly', () => {
    const candidate = {
      id: '123',
      name: 'Rahul Kumar',
      phone: '+91-9876543210',
      overallScore: 92,
      language: 'Hindi',
      status: 'pending'
    };

    const { getByText } = render(
      <CandidateCard
        candidate={candidate}
        onShortlist={jest.fn()}
        onReject={jest.fn()}
        onViewScorecard={jest.fn()}
      />
    );

    expect(getByText('Rahul Kumar')).toBeInTheDocument();
    expect(getByText('92/100')).toBeInTheDocument();
  });
});
```

### E2E Testing
```typescript
// admin.spec.ts
test('admin can create new user', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('button:has-text("Add User")');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.selectOption('select[name="role"]', 'RECRUITER');
  await page.click('button:has-text("Create User")');
  await expect(page.locator('text=Test User')).toBeVisible();
});

// recruiter.spec.ts
test('recruiter can shortlist candidate', async ({ page }) => {
  await page.goto('/dashboard/candidates');
  await page.click('text=Rahul Kumar');
  await page.click('button:has-text("Shortlist")');
  await expect(page.locator('text=Candidate shortlisted successfully')).toBeVisible();
});
```

---

## 📊 Analytics & Monitoring

### Performance Monitoring
```typescript
// lib/performance.ts
export function trackPageView(page: string) {
  // Send to analytics
  analytics.track('page_view', { page });
}

export function trackUserAction(action: string, metadata?: any) {
  // Send to analytics
  analytics.track('user_action', { action, ...metadata });
}

export function trackError(error: Error, context?: any) {
  // Send to error tracking
  errorTracker.captureException(error, { context });
}

// Usage in components
useEffect(() => {
  trackPageView('admin/overview');
}, []);
```

### User Behavior Analytics
```typescript
// hooks/useAnalytics.ts
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: any) => {
    // Track user interactions
    analytics.track(eventName, {
      timestamp: new Date().toISOString(),
      ...properties,
    });
  };

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', { page: pageName });
  };

  const trackButtonClick = (buttonName: string) => {
    trackEvent('button_click', { button: buttonName });
  };

  return { trackEvent, trackPageView, trackButtonClick };
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up separate admin and recruiter dashboard projects
- [ ] Implement shared component library
- [ ] Create authentication and authorization middleware
- [ ] Set up routing structure for both dashboards
- [ ] Implement basic layout components

### Phase 2: ADMIN Dashboard (Week 3-4)
- [ ] Implement admin overview dashboard
- [ ] Build user management interface
- [ ] Create company management system
- [ ] Implement system health monitoring
- [ ] Add billing and subscription management
- [ ] Create audit log viewer
- [ ] Implement integration management
- [ ] Add admin settings pages

### Phase 3: RECRUITER Dashboard (Week 5-6)
- [ ] Implement recruiter overview dashboard
- [ ] Build campaign management interface
- [ ] Create candidate management system
- [ ] Implement requisition management
- [ ] Build scorecard detail views
- [ ] Add analytics and reporting
- [ ] Create advanced filtering and search


---

