**Version**: 1.0  
**Status**: Draft  
**Author**: Backend Architect  
**Last Updated**: April 24, 2026  
**API Version**: v1.0

---

## Table of Contents

1. [API Design Principles](#1-api-design-principles)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [API Endpoints](#3-api-endpoints)
4. [Database Schema](#4-database-schema)
5. [Error Handling](#5-error-handling)
6. [Rate Limiting & Security](#6-rate-limiting--security)
7. [Performance Optimization](#7-performance-optimization)
8. [API Versioning Strategy](#8-api-versioning-strategy)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Considerations](#10-deployment-considerations)
11. [Pydantic Models](#11-pydantic-models)

---

## 1. API Design Principles

### 1.1 RESTful Design

The AROHAN API follows RESTful principles with resource-based URLs and standard HTTP methods:

- **Resource-based URLs**: All endpoints represent resources (campaigns, candidates, requisitions)
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Stateless**: Each request contains all necessary information
- **Uniform Interface**: Consistent patterns across all endpoints

### 1.2 Consistent Response Format

All API responses follow a consistent structure:

```json
{
  "data": { },
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  },
  "errors": [ ]
}
```

**Response Fields**:
- `data`: The actual response payload (object or array)
- `meta`: Request metadata (request_id, timestamp, version)
- `errors`: Array of error objects (empty on success)

### 1.3 Performance-First Approach

- **Pagination**: All list endpoints support pagination (default: 50 items, max: 200)
- **Filtering**: List endpoints support filtering to reduce payload size
- **Caching**: Frequently accessed data cached in Redis with appropriate TTL
- **Async Processing**: Heavy operations (audio processing, agent evaluation) use Celery
- **Connection Pooling**: Database connection pooling for optimal performance

### 1.4 Security-First Design

- **Encryption**: All data encrypted at rest (PostgreSQL) and in transit (TLS 1.3)
- **Authentication**: JWT tokens with RS256 encryption
- **Authorization**: Role-based access control (RBAC) with company_id scoping
- **Input Validation**: All inputs validated using Pydantic models
- **SQL Injection Prevention**: Parameterized queries only, no string concatenation
- **Rate Limiting**: Per-endpoint rate limits to prevent abuse

---

## 2. Authentication & Authorization

### 2.1 JWT Token Structure

The AROHAN API uses JWT (JSON Web Tokens) for authentication with RS256 encryption:

**Token Payload**:
```json
{
  "sub": "user_id",
  "company_id": "company_uuid",
  "role": "admin|viewer",
  "iat": 1713958200,
  "exp": 1714044600,
  "jti": "token_uuid"
}
```

**Token Fields**:
- `sub`: User ID (UUID)
- `company_id`: Company ID for multi-tenant isolation (UUID)
- `role`: User role ("admin" or "viewer")
- `iat`: Issued at timestamp (Unix epoch)
- `exp`: Expiration timestamp (Unix epoch, 24 hours from iat)
- `jti`: Token ID (UUID) for revocation tracking

**Token Validation**:
- Signature verified using RS256 public key
- Expiration checked on every request
- Token revocation list maintained in Redis
- Refresh tokens used for token renewal

### 2.2 Authentication Endpoints

#### POST /api/v1/auth/login

Authenticate user and receive access token.

**Request**:
```json
{
  "email": "priya@example.com",
  "password": "secure_password"
}
```

**Response**:
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": "user_uuid",
      "email": "priya@example.com",
      "name": "Priya Sharma",
      "company_id": "company_uuid",
      "role": "admin"
    }
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Rate Limiting**: 10 requests/minute per IP

#### POST /api/v1/auth/refresh

Refresh access token using refresh token.

**Request**:
```json
{
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Rate Limiting**: 10 requests/minute per IP

### 2.3 Authorization Matrix

| Role | Campaigns | Candidates | Requisitions | Shortlist/Reject |
|------|-----------|------------|--------------|------------------|
| **Admin** | Read, Create | Read, Shortlist, Reject | Read, Create | Full access |
| **Viewer** | Read only | Read only | Read only | No access |

**Authorization Rules**:
- All requests scoped to `company_id` from JWT token
- Admin users can perform all actions
- Viewer users can only read data
- Cross-company access strictly prohibited

### 2.4 Multi-Tenant Isolation

**Company ID Scoping**:
- All database queries filtered by `company_id`
- No cross-company data access
- Company ID validated on every request
- Audit trail records company context

**Isolation Enforcement**:
```python
# Example: Candidate list query
SELECT * FROM candidates 
WHERE company_id = :company_id 
  AND [other filters]
```

---

## 3. API Endpoints

### 3.1 Campaign Management

#### GET /api/v1/campaigns

List all campaigns for the authenticated company with filtering and pagination.

**Authentication**: Required (Admin or Viewer)

**Rate Limiting**: 100 requests/minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `page_size` | integer | No | 50 | Items per page (max: 200) |
| `status` | string | No | - | Filter by status ("active", "completed", "paused") |
| `requisition_id` | string | No | - | Filter by requisition ID |
| `sort_by` | string | No | "created_at" | Sort field ("created_at", "name", "candidate_count") |
| `sort_order` | string | No | "desc" | Sort order ("asc", "desc") |

**Response**:
```json
{
  "data": {
    "campaigns": [
      {
        "id": "campaign_uuid",
        "name": "Delivery Partner Screening - April 2026",
        "requisition_id": "requisition_uuid",
        "requisition_name": "Delivery Partner",
        "status": "active",
        "candidate_count": 127,
        "shortlisted_count": 45,
        "rejected_count": 12,
        "created_at": "2026-04-20T08:00:00Z",
        "updated_at": "2026-04-24T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 50,
      "total_items": 127,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 200ms

#### GET /api/v1/campaigns/{id}

Get detailed information about a specific campaign.

**Authentication**: Required (Admin or Viewer)

**Rate Limiting**: 100 requests/minute

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Campaign UUID |

**Response**:
```json
{
  "data": {
    "id": "campaign_uuid",
    "name": "Delivery Partner Screening - April 2026",
    "requisition_id": "requisition_uuid",
    "requisition_name": "Delivery Partner",
    "status": "active",
    "candidate_count": 127,
    "shortlisted_count": 45,
    "rejected_count": 12,
    "pending_count": 70,
    "created_at": "2026-04-20T08:00:00Z",
    "updated_at": "2026-04-24T10:30:00Z",
    "statistics": {
      "average_score": 72.5,
      "median_score": 75.0,
      "score_distribution": {
        "90-100": 15,
        "80-89": 30,
        "70-79": 45,
        "60-69": 25,
        "50-59": 10,
        "below_50": 2
      },
      "language_distribution": {
        "hi-IN": 85,
        "en-IN": 30,
        "ta-IN": 8,
        "mr-IN": 4
      }
    }
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 300ms

---

### 3.2 Candidate Management

#### GET /api/v1/candidates

List all candidates with filtering and pagination.

**Authentication**: Required (Admin or Viewer)

**Rate Limiting**: 100 requests/minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `page_size` | integer | No | 50 | Items per page (max: 200) |
| `campaign_id` | string | No | - | Filter by campaign ID |
| `requisition_id` | string | No | - | Filter by requisition ID |
| `status` | string | No | - | Filter by status ("shortlisted", "rejected", "pending") |
| `min_score` | integer | No | - | Minimum overall score (1-100) |
| `max_score` | integer | No | - | Maximum overall score (1-100) |
| `language` | string | No | - | Filter by language (e.g., "hi-IN") |
| `search` | string | No | - | Search by phone number or name |
| `sort_by` | string | No | "created_at" | Sort field ("created_at", "overall_score", "name") |
| `sort_order` | string | No | "desc" | Sort order ("asc", "desc") |

**Response**:
```json
{
  "data": {
    "candidates": [
      {
        "id": "candidate_uuid",
        "name": "Rahul Kumar",
        "phone": "+919876543210",
        "pin_code": "440001",
        "language_detected": "hi-IN",
        "inbound_channel": "ivr",
        "overall_score": 85,
        "communication_score": 88,
        "domain_knowledge_score": 82,
        "situational_judgment_score": 84,
        "confidence_score": 86,
        "language_fluency": "proficient",
        "status": "shortlisted",
        "campaign_id": "campaign_uuid",
        "campaign_name": "Delivery Partner Screening - April 2026",
        "requisition_id": "requisition_uuid",
        "requisition_name": "Delivery Partner",
        "created_at": "2026-04-22T14:30:00Z",
        "updated_at": "2026-04-23T09:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 50,
      "total_items": 127,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 800ms for 200 items

#### GET /api/v1/candidates/{id}

Get detailed candidate information with scorecard.

**Authentication**: Required (Admin or Viewer)

**Rate Limiting**: 100 requests/minute

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Candidate UUID |

**Response**:
```json
{
  "data": {
    "id": "candidate_uuid",
    "name": "Rahul Kumar",
    "phone": "+919876543210",
    "pin_code": "440001",
    "language_detected": "hi-IN",
    "inbound_channel": "ivr",
    "status": "shortlisted",
    "campaign_id": "campaign_uuid",
    "campaign_name": "Delivery Partner Screening - April 2026",
    "requisition_id": "requisition_uuid",
    "requisition_name": "Delivery Partner",
    "created_at": "2026-04-22T14:30:00Z",
    "updated_at": "2026-04-23T09:15:00Z",
    "scorecard": {
      "id": "scorecard_uuid",
      "overall_score": 85,
      "communication_score": 88,
      "domain_knowledge_score": 82,
      "situational_judgment_score": 84,
      "confidence_score": 86,
      "language_fluency": "proficient",
      "assessor_notes": "Strong communication skills, good domain knowledge. Confident responses.",
      "recommended_roles": ["Delivery Partner", "Warehouse Associate"],
      "shortlist_flag": true,
      "created_at": "2026-04-22T15:00:00Z"
    },
    "matched_requisitions": [
      {
        "id": "requisition_uuid",
        "role_name": "Delivery Partner",
        "company_name": "LogiFast India",
        "location": "Nagpur",
        "pin_code": "440001",
        "distance_km": 0,
        "score_threshold": 70,
        "status": "open"
      }
    ]
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 500ms

#### GET /api/v1/candidates/{id}/transcript

Get the full interview transcript for a candidate.

**Authentication**: Required (Admin or Viewer)

**Rate Limiting**: 100 requests/minute

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Candidate UUID |

**Response**:
```json
{
  "data": {
    "id": "candidate_uuid",
    "name": "Rahul Kumar",
    "phone": "+919876543210",
    "session_id": "session_uuid",
    "language_detected": "hi-IN",
    "duration_seconds": 312,
    "transcript_segments": [
      {
        "speaker": "proctor",
        "text": "Namaste! Aapka naam kya hai?",
        "timestamp": 0.5,
        "confidence": 0.98
      },
      {
        "speaker": "candidate",
        "text": "Namaste, mera naam Rahul Kumar hai.",
        "timestamp": 2.3,
        "confidence": 0.95
      },
      {
        "speaker": "proctor",
        "text": "Kya aap delivery partner ka kaam karne ke liye taiyaar hain?",
        "timestamp": 5.8,
        "confidence": 0.97
      },
      {
        "speaker": "candidate",
        "text": "Haan, main delivery partner ka kaam kar sakta hoon. Mere paas driving license hai aur main Nagpur ke saare areas ko jaanta hoon.",
        "timestamp": 8.2,
        "confidence": 0.92
      }
    ],
    "created_at": "2026-04-22T14:30:00Z"
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 400ms

#### POST /api/v1/candidates/{id}/shortlist

Mark a candidate as shortlisted.

**Authentication**: Required (Admin only)

**Rate Limiting**: 50 requests/minute

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Candidate UUID |

**Request Body**:
```json
{
  "notes": "Strong candidate, good communication skills"
}
```

**Response**:
```json
{
  "data": {
    "id": "candidate_uuid",
    "name": "Rahul Kumar",
    "phone": "+919876543210",
    "status": "shortlisted",
    "shortlisted_at": "2026-04-24T10:30:00Z",
    "shortlisted_by": "user_uuid",
    "notes": "Strong candidate, good communication skills"
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 300ms

#### POST /api/v1/candidates/{id}/reject

Mark a candidate as rejected.

**Authentication**: Required (Admin only)

**Rate Limiting**: 50 requests/minute

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Candidate UUID |

**Request Body**:
```json
{
  "reason": "Low domain knowledge score",
  "notes": "Candidate lacks understanding of delivery operations"
}
```

**Response**:
```json
{
  "data": {
    "id": "candidate_uuid",
    "name": "Rahul Kumar",
    "phone": "+919876543210",
    "status": "rejected",
    "rejected_at": "2026-04-24T10:30:00Z",
    "rejected_by": "user_uuid",
    "reason": "Low domain knowledge score",
    "notes": "Candidate lacks understanding of delivery operations"
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 300ms

---

### 3.3 Requisition Management

#### GET /api/v1/requisitions

List all requisitions with filtering and pagination.

**Authentication**: Required (Admin or Viewer)

**Rate Limiting**: 100 requests/minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `page_size` | integer | No | 50 | Items per page (max: 200) |
| `status` | string | No | - | Filter by status ("open", "closed", "paused") |
| `role_name` | string | No | - | Filter by role name (partial match) |
| `location` | string | No | - | Filter by location (partial match) |
| `sort_by` | string | No | "created_at" | Sort field ("created_at", "candidate_count", "matched_count") |
| `sort_order` | string | No | "desc" | Sort order ("asc", "desc") |

**Response**:
```json
{
  "data": {
    "requisitions": [
      {
        "id": "requisition_uuid",
        "role_name": "Delivery Partner",
        "company_name": "LogiFast India",
        "location": "Nagpur",
        "pin_code": "440001",
        "score_threshold": 70,
        "geo_radius_km": 50,
        "status": "open",
        "candidate_count": 127,
        "matched_count": 85,
        "shortlisted_count": 45,
        "created_at": "2026-04-15T08:00:00Z",
        "updated_at": "2026-04-24T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 50,
      "total_items": 15,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 600ms

#### GET /api/v1/requisitions/{id}

Get detailed requisition information with matched candidates.

**Authentication**: Required (Admin or Viewer)

**Rate Limiting**: 100 requests/minute

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Requisition UUID |

**Response**:
```json
{
  "data": {
    "id": "requisition_uuid",
    "role_name": "Delivery Partner",
    "company_name": "LogiFast India",
    "location": "Nagpur",
    "pin_code": "440001",
    "score_threshold": 70,
    "geo_radius_km": 50,
    "status": "open",
    "candidate_count": 127,
    "matched_count": 85,
    "shortlisted_count": 45,
    "created_at": "2026-04-15T08:00:00Z",
    "updated_at": "2026-04-24T10:30:00Z",
    "matched_candidates": [
      {
        "id": "candidate_uuid",
        "name": "Rahul Kumar",
        "phone": "+919876543210",
        "overall_score": 85,
        "status": "shortlisted",
        "distance_km": 0,
        "created_at": "2026-04-22T14:30:00Z"
      }
    ],
    "recommendations": {
      "fill_rate": 0.35,
      "average_score": 72.5,
      "suggested_actions": [
        "Consider lowering score threshold to 65 to increase candidate pool",
        "Expand geo-radius to 75km to reach more candidates"
      ]
    }
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 700ms

---

### 3.4 Agent Orchestration (Internal)

These endpoints are used internally by the agent system and are not exposed to the employer dashboard.

#### POST /api/v1/agents/proctor/start

Start a new interview session with the Proctor agent.

**Authentication**: Internal service token

**Rate Limiting**: 1000 requests/minute

**Request Body**:
```json
{
  "candidate_phone": "+919876543210",
  "candidate_pin_code": "440001",
  "campaign_id": "campaign_uuid",
  "requisition_id": "requisition_uuid",
  "inbound_channel": "ivr",
  "preferred_language": "hi-IN"
}
```

**Response**:
```json
{
  "data": {
    "session_id": "session_uuid",
    "candidate_phone": "+919876543210",
    "status": "in_progress",
    "first_question": "Namaste! Aapka naam kya hai?",
    "created_at": "2026-04-24T10:30:00Z"
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 100ms

#### POST /api/v1/agents/proctor/resume

Resume an interrupted interview session.

**Authentication**: Internal service token

**Rate Limiting**: 1000 requests/minute

**Request Body**:
```json
{
  "session_id": "session_uuid"
}
```

**Response**:
```json
{
  "data": {
    "session_id": "session_uuid",
    "candidate_phone": "+919876543210",
    "status": "resumed",
    "last_question": "Kya aap delivery partner ka kaam karne ke liye taiyaar hain?",
    "drop_off_count": 1,
    "resumed_at": "2026-04-24T10:30:00Z"
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 100ms

#### POST /api/v1/agents/assessor/evaluate

Evaluate a candidate transcript and generate scorecard.

**Authentication**: Internal service token

**Rate Limiting**: 1000 requests/minute

**Request Body**:
```json
{
  "session_id": "session_uuid",
  "candidate_id": "candidate_uuid",
  "requisition_id": "requisition_uuid",
  "transcript_segments": [
    {
      "speaker": "proctor",
      "text": "Namaste! Aapka naam kya hai?",
      "timestamp": 0.5,
      "confidence": 0.98
    },
    {
      "speaker": "candidate",
      "text": "Namaste, mera naam Rahul Kumar hai.",
      "timestamp": 2.3,
      "confidence": 0.95
    }
  ]
}
```

**Response**:
```json
{
  "data": {
    "scorecard_id": "scorecard_uuid",
    "candidate_id": "candidate_uuid",
    "requisition_id": "requisition_uuid",
    "overall_score": 85,
    "communication_score": 88,
    "domain_knowledge_score": 82,
    "situational_judgment_score": 84,
    "confidence_score": 86,
    "language_fluency": "proficient",
    "assessor_notes": "Strong communication skills, good domain knowledge. Confident responses.",
    "recommended_roles": ["Delivery Partner", "Warehouse Associate"],
    "shortlist_flag": true,
    "created_at": "2026-04-24T10:30:00Z"
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 500ms (async processing via Celery)

#### POST /api/v1/agents/matchmaker/find

Find matching requisitions for a candidate based on geo-radius and score threshold.

**Authentication**: Internal service token

**Rate Limiting**: 1000 requests/minute

**Request Body**:
```json
{
  "candidate_id": "candidate_uuid",
  "candidate_pin_code": "440001",
  "overall_score": 85,
  "language_detected": "hi-IN"
}
```

**Response**:
```json
{
  "data": {
    "candidate_id": "candidate_uuid",
    "matched_requisitions": [
      {
        "id": "requisition_uuid",
        "role_name": "Delivery Partner",
        "company_name": "LogiFast India",
        "location": "Nagpur",
        "pin_code": "440001",
        "distance_km": 0,
        "score_threshold": 70,
        "status": "open"
      }
    ],
    "total_matches": 3,
    "created_at": "2026-04-24T10:30:00Z"
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Performance Target**: p95 < 200ms

---

## 4. Database Schema

### 4.1 Table: candidates

Stores candidate information and screening results.

```sql
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(255),
    pin_code VARCHAR(10) NOT NULL,
    language_detected VARCHAR(10),
    inbound_channel VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT candidates_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT candidates_phone_company_unique UNIQUE (phone, company_id),
    CONSTRAINT candidates_status_check CHECK (status IN ('pending', 'shortlisted', 'rejected')),
    CONSTRAINT candidates_inbound_channel_check CHECK (inbound_channel IN ('ivr', 'whatsapp_audio', 'whatsapp_text'))
);

-- Indexes
CREATE INDEX idx_candidates_company_id ON candidates(company_id);
CREATE INDEX idx_candidates_phone ON candidates(phone);
CREATE INDEX idx_candidates_pin_code ON candidates(pin_code);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_language_detected ON candidates(language_detected);
CREATE INDEX idx_candidates_created_at ON candidates(created_at DESC);
CREATE INDEX idx_candidates_company_status ON candidates(company_id, status);
```

**Column Definitions**:
- `id`: UUID primary key
- `company_id`: Foreign key to companies table for multi-tenant isolation
- `phone`: Candidate phone number in E.164 format
- `name`: Candidate name (optional, may be collected during interview)
- `pin_code`: Candidate pin code for geo-routing
- `language_detected`: Detected language (e.g., "hi-IN", "en-IN")
- `inbound_channel`: Channel used for interview ("ivr", "whatsapp_audio", "whatsapp_text")
- `status`: Candidate status ("pending", "shortlisted", "rejected")
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Performance Optimization**:
- Composite index on (company_id, status) for filtered queries
- Index on phone for candidate lookup
- Index on pin_code for geo-radius queries
- Index on created_at for sorting and pagination

---

### 4.2 Table: requisitions

Stores job requisitions with geo-radius and score threshold.

```sql
CREATE TABLE requisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    score_threshold INTEGER NOT NULL,
    geo_radius_km INTEGER NOT NULL DEFAULT 50,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT requisitions_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT requisitions_score_threshold_check CHECK (score_threshold >= 1 AND score_threshold <= 100),
    CONSTRAINT requisitions_geo_radius_km_check CHECK (geo_radius_km >= 1 AND geo_radius_km <= 500),
    CONSTRAINT requisitions_status_check CHECK (status IN ('open', 'closed', 'paused'))
);

-- Indexes
CREATE INDEX idx_requisitions_company_id ON requisitions(company_id);
CREATE INDEX idx_requisitions_pin_code ON requisitions(pin_code);
CREATE INDEX idx_requisitions_status ON requisitions(status);
CREATE INDEX idx_requisitions_created_at ON requisitions(created_at DESC);
CREATE INDEX idx_requisitions_company_status ON requisitions(company_id, status);
```

**Column Definitions**:
- `id`: UUID primary key
- `company_id`: Foreign key to companies table for multi-tenant isolation
- `role_name`: Job role name (e.g., "Delivery Partner")
- `company_name`: Company name for display
- `location`: Job location (e.g., "Nagpur")
- `pin_code`: Pin code for geo-radius matching
- `score_threshold`: Minimum score required for matching (1-100)
- `geo_radius_km`: Geo-radius in kilometers for candidate matching
- `status`: Requisition status ("open", "closed", "paused")
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Performance Optimization**:
- Composite index on (company_id, status) for filtered queries
- Index on pin_code for geo-radius queries
- Index on created_at for sorting and pagination

---

### 4.3 Table: campaigns

Stores screening campaigns linked to requisitions.

```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    requisition_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT campaigns_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT campaigns_requisition_id_fkey FOREIGN KEY (requisition_id) REFERENCES requisitions(id),
    CONSTRAINT campaigns_status_check CHECK (status IN ('active', 'completed', 'paused'))
);

-- Indexes
CREATE INDEX idx_campaigns_company_id ON campaigns(company_id);
CREATE INDEX idx_campaigns_requisition_id ON campaigns(requisition_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX idx_campaigns_company_status ON campaigns(company_id, status);
```

**Column Definitions**:
- `id`: UUID primary key
- `company_id`: Foreign key to companies table for multi-tenant isolation
- `requisition_id`: Foreign key to requisitions table
- `name`: Campaign name (e.g., "Delivery Partner Screening - April 2026")
- `status`: Campaign status ("active", "completed", "paused")
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Performance Optimization**:
- Composite index on (company_id, status) for filtered queries
- Index on requisition_id for candidate-campaign joins
- Index on created_at for sorting and pagination

---

### 4.4 Table: scorecards

Stores candidate scorecards with detailed assessment scores.

```sql
CREATE TABLE scorecards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    requisition_id UUID NOT NULL,
    campaign_id UUID NOT NULL,
    overall_score FLOAT NOT NULL,
    communication_score FLOAT,
    domain_knowledge_score FLOAT,
    situational_judgment_score FLOAT,
    confidence_score FLOAT,
    language_fluency VARCHAR(20),
    assessor_notes TEXT,
    recommended_roles TEXT[],
    shortlist_flag BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT scorecards_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    CONSTRAINT scorecards_requisition_id_fkey FOREIGN KEY (requisition_id) REFERENCES requisitions(id),
    CONSTRAINT scorecards_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    CONSTRAINT scorecards_overall_score_check CHECK (overall_score >= 0 AND overall_score <= 100),
    CONSTRAINT scorecards_status_check CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Indexes
CREATE INDEX idx_scorecards_candidate_id ON scorecards(candidate_id);
CREATE INDEX idx_scorecards_requisition_id ON scorecards(requisition_id);
CREATE INDEX idx_scorecards_campaign_id ON scorecards(campaign_id);
CREATE INDEX idx_scorecards_overall_score ON scorecards(overall_score DESC);
CREATE INDEX idx_scorecards_status ON scorecards(status);
CREATE INDEX idx_scorecards_shortlist_flag ON scorecards(shortlist_flag);
```

**Column Definitions**:
- `id`: UUID primary key
- `candidate_id`: Foreign key to candidates table
- `requisition_id`: Foreign key to requisitions table
- `campaign_id`: Foreign key to campaigns table
- `overall_score`: Overall candidate score (0-100)
- `communication_score`: Communication skills score (0-100)
- `domain_knowledge_score`: Domain knowledge score (0-100)
- `situational_judgment_score`: Situational judgment score (0-100)
- `confidence_score`: Confidence level score (0-100)
- `language_fluency`: Language fluency level ("native", "proficient", "functional")
- `assessor_notes`: Notes from the Assessor agent
- `recommended_roles`: Array of recommended job roles
- `shortlist_flag`: Whether candidate meets shortlist criteria
- `status`: Scorecard status ("pending", "completed", "failed")
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Performance Optimization**:
- Index on overall_score for sorting by score
- Index on shortlist_flag for filtering shortlisted candidates
- Composite indexes for candidate-requisition-campaign joins

---

### 4.5 Table: transcripts

Stores interview transcripts with speaker segments and timestamps.

```sql
CREATE TABLE transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    language_detected VARCHAR(10),
    duration_seconds INTEGER,
    transcript_segments JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT transcripts_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    CONSTRAINT transcripts_session_unique UNIQUE (session_id)
);

-- Indexes
CREATE INDEX idx_transcripts_candidate_id ON transcripts(candidate_id);
CREATE INDEX idx_transcripts_session_id ON transcripts(session_id);
CREATE INDEX idx_transcripts_language_detected ON transcripts(language_detected);
CREATE INDEX idx_transcripts_created_at ON transcripts(created_at DESC);
```

**Column Definitions**:
- `id`: UUID primary key
- `candidate_id`: Foreign key to candidates table
- `session_id`: Unique session identifier for the interview
- `language_detected`: Detected language (e.g., "hi-IN", "en-IN")
- `duration_seconds`: Total interview duration in seconds
- `transcript_segments`: JSONB array of transcript segments with speaker, text, timestamp, confidence
- `created_at`: Record creation timestamp

**Performance Optimization**:
- Index on session_id for fast lookup
- Index on candidate_id for candidate transcript retrieval
- JSONB format for efficient querying of transcript segments

---

### 4.6 Table: audit_trail

Stores audit trail for all data changes and user actions.

```sql
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID NOT NULL,
    actor_type VARCHAR(20) NOT NULL,
    changes JSONB,
    company_id UUID NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_trail_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_trail_actor ON audit_trail(actor_id);
CREATE INDEX idx_audit_trail_timestamp ON audit_trail(timestamp DESC);
CREATE INDEX idx_audit_trail_company_id ON audit_trail(company_id);
CREATE INDEX idx_audit_trail_action ON audit_trail(action);
```

**Column Definitions**:
- `id`: UUID primary key
- `entity_type`: Type of entity affected ("candidate", "requisition", "campaign", "scorecard")
- `entity_id`: ID of the affected entity
- `action`: Action performed ("create", "update", "delete", "shortlist", "reject")
- `actor_id`: ID of the user or system that performed the action
- `actor_type`: Type of actor ("user", "system", "agent")
- `changes`: JSONB object containing the changes made
- `company_id`: Company ID for multi-tenant isolation
- `timestamp`: When the action occurred

**Performance Optimization**:
- Composite index on (entity_type, entity_id) for entity history queries
- Index on timestamp for time-based queries
- Index on company_id for multi-tenant isolation

---

### 4.7 Table: companies

Stores company information for multi-tenant isolation.

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT companies_status_check CHECK (status IN ('active', 'suspended', 'deleted'))
);

-- Indexes
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);
```

**Column Definitions**:
- `id`: UUID primary key
- `name`: Company name
- `email`: Company email (unique)
- `phone`: Company phone number
- `address`: Company address
- `city`: Company city
- `state`: Company state
- `pin_code`: Company pin code
- `status`: Company status ("active", "suspended", "deleted")
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Performance Optimization**:
- Unique index on email for login
- Index on status for filtering active companies

---

### 4.8 Table: users

Stores user accounts with authentication credentials.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'viewer',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT users_email_company_unique UNIQUE (email, company_id),
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'viewer')),
    CONSTRAINT users_status_check CHECK (status IN ('active', 'suspended', 'deleted'))
);

-- Indexes
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_company_email ON users(company_id, email);
```

**Column Definitions**:
- `id`: UUID primary key
- `company_id`: Foreign key to companies table for multi-tenant isolation
- `email`: User email address
- `password_hash`: Hashed password (bcrypt)
- `name`: User full name
- `role`: User role ("admin" or "viewer")
- `status`: User status ("active", "suspended", "deleted")
- `last_login_at`: Last login timestamp
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Performance Optimization**:
- Composite unique index on (email, company_id) for login
- Index on role for authorization filtering
- Index on status for filtering active users

---

## 5. Error Handling

### 5.1 Error Codes

The AROHAN API uses standard HTTP status codes with specific error codes for detailed error reporting.

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required or failed |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (duplicate, etc.) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### 5.2 Error Response Format

All error responses follow this consistent format:

```json
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Invalid phone number format",
      "field": "phone",
      "details": {
        "expected_format": "E.164 (e.g., +91XXXXXXXXXX)",
        "provided_value": "9876543210"
      }
    }
  ],
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Error Response Fields**:
- `errors`: Array of error objects
  - `code`: Machine-readable error code
  - `message`: Human-readable error message
  - `field`: Field that caused the error (if applicable)
  - `details`: Additional error details (if applicable)
- `meta`: Request metadata (request_id, timestamp, version)

### 5.3 Common Error Scenarios

#### Validation Error (400)

```json
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Invalid phone number format",
      "field": "phone",
      "details": {
        "expected_format": "E.164 (e.g., +91XXXXXXXXXX)",
        "provided_value": "9876543210"
      }
    }
  ],
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

#### Unauthorized (401)

```json
{
  "errors": [
    {
      "code": "UNAUTHORIZED",
      "message": "Invalid or expired token",
      "details": {
        "action": "Please login again"
      }
    }
  ],
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

#### Forbidden (403)

```json
{
  "errors": [
    {
      "code": "FORBIDDEN",
      "message": "Insufficient permissions to perform this action",
      "details": {
        "required_role": "admin",
        "current_role": "viewer"
      }
    }
  ],
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

#### Not Found (404)

```json
{
  "errors": [
    {
      "code": "NOT_FOUND",
      "message": "Candidate not found",
      "details": {
        "candidate_id": "candidate_uuid"
      }
    }
  ],
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

#### Rate Limit Exceeded (429)

```json
{
  "errors": [
    {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests",
      "details": {
        "limit": 100,
        "window": "1 minute",
        "retry_after": 30
      }
    }
  ],
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1713957549
Retry-After: 30
```

---

## 6. Rate Limiting & Security

### 6.1 Rate Limiting Strategy

The AROHAN API implements per-endpoint rate limiting to prevent abuse and ensure fair usage.

**Rate Limits by Endpoint**:

| Endpoint | Rate Limit | Window | Burst Allowance |
|----------|------------|--------|-----------------|
| `/api/v1/auth/*` | 10 requests/minute | 1 minute | 5 requests |
| `/api/v1/campaigns` | 100 requests/minute | 1 minute | 20 requests |
| `/api/v1/campaigns/{id}` | 100 requests/minute | 1 minute | 20 requests |
| `/api/v1/candidates` | 100 requests/minute | 1 minute | 20 requests |
| `/api/v1/candidates/{id}` | 100 requests/minute | 1 minute | 20 requests |
| `/api/v1/candidates/{id}/transcript` | 100 requests/minute | 1 minute | 20 requests |
| `/api/v1/candidates/{id}/shortlist` | 50 requests/minute | 1 minute | 10 requests |
| `/api/v1/candidates/{id}/reject` | 50 requests/minute | 1 minute | 10 requests |
| `/api/v1/requisitions` | 100 requests/minute | 1 minute | 20 requests |
| `/api/v1/requisitions/{id}` | 100 requests/minute | 1 minute | 20 requests |
| `/api/v1/agents/*` | 1000 requests/minute | 1 minute | 200 requests |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1713957549
X-RateLimit-Window: 60
```

**Rate Limit Exceeded Response**:
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 30

{
  "errors": [
    {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests",
      "details": {
        "limit": 100,
        "window": "1 minute",
        "retry_after": 30
      }
    }
  ],
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-04-24T10:30:00Z",
    "version": "1.0"
  }
}
```

### 6.2 Security Measures

#### Authentication

**JWT Token Validation**:
- RS256 signature verification using public key
- Token expiration check (24 hours from issuance)
- Token revocation list maintained in Redis
- Refresh token rotation for enhanced security

**Password Security**:
- bcrypt hashing with 12 rounds
- Minimum password length: 8 characters
- Password complexity requirements: uppercase, lowercase, number, special character
- Password reset tokens with 1-hour expiration

#### Authorization

**Role-Based Access Control (RBAC)**:
- Two roles: "admin" and "viewer"
- Admin users can perform all actions
- Viewer users can only read data
- Role validation on every request

**Multi-Tenant Isolation**:
- All database queries filtered by `company_id`
- No cross-company data access
- Company ID validated on every request
- Audit trail records company context

#### Data Protection

**Encryption at Rest**:
- PostgreSQL Transparent Data Encryption (TDE)
- Redis AES-256 encryption
- File system encryption for audio files

**Encryption in Transit**:
- TLS 1.3 for all API communications
- Certificate pinning for internal services
- Secure WebSocket connections (wss://)

**Data Masking**:
- Phone numbers masked in logs (e.g., "+91XXXXXX78")
- PII redacted in error messages
- Audit trail stores changes without sensitive data

#### Input Validation

**Pydantic Model Validation**:
- All request bodies validated using Pydantic models
- Type checking and constraint validation
- Custom validators for business logic
- Automatic error messages for validation failures

**SQL Injection Prevention**:
- Parameterized queries only
- No string concatenation in SQL
- ORM (SQLAlchemy) for database operations
- Query logging for security monitoring

**XSS Prevention**:
- Input sanitization for user-generated content
- Output encoding for HTML/JSON responses
- Content Security Policy (CSP) headers
- XSS protection middleware

---

## 7. Performance Optimization

### 7.1 Caching Strategy

**Redis Cache Configuration**:

```python
# Cache TTL values
CACHE_TTLS = {
    "candidate_list": 300,      # 5 minutes
    "candidate_detail": 600,    # 10 minutes
    "scorecard": 600,           # 10 minutes
    "requisition_list": 300,    # 5 minutes
    "campaign_list": 300,       # 5 minutes
    "transcript": 1800,         # 30 minutes
    "auth_token": 3600,         # 1 hour
    "user_profile": 1800,       # 30 minutes
    "company_profile": 3600,    # 1 hour
}
```

**Cache Invalidation Strategies**:

1. **Time-based Invalidation**: Automatic expiration based on TTL
2. **Event-based Invalidation**: Invalidate on mutations (shortlist, reject)
3. **Manual Invalidation**: Admin endpoint for cache clearing

**Cache Key Patterns**:
```
candidate:list:{company_id}:{filters_hash}
candidate:detail:{candidate_id}
scorecard:{candidate_id}:{requisition_id}
requisition:list:{company_id}:{filters_hash}
campaign:list:{company_id}:{filters_hash}
transcript:{candidate_id}
auth:token:{token_id}
user:profile:{user_id}
company:profile:{company_id}
```

### 7.2 Connection Pooling

**Database Connection Pooling (PostgreSQL)**:

```python
# SQLAlchemy connection pool configuration
SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_size": 20,              # Number of connections to maintain
    "max_overflow": 10,           # Maximum connections beyond pool_size
    "pool_timeout": 30,           # Timeout for getting connection from pool
    "pool_recycle": 3600,         # Recycle connections after 1 hour
    "pool_pre_ping": True,        # Test connections before using
    "echo": False,                # Don't log SQL queries
}
```

**Redis Connection Pooling**:

```python
# Redis connection pool configuration
REDIS_CONNECTION_POOL = {
    "max_connections": 10,        # Maximum connections in pool
    "socket_timeout": 5,          # Socket timeout in seconds
    "socket_connect_timeout": 5,  # Connection timeout in seconds
    "retry_on_timeout": True,     # Retry on timeout
}
```

**RabbitMQ Connection Pooling**:

```python
# RabbitMQ connection pool configuration
RABBITMQ_CONNECTION_POOL = {
    "max_connections": 5,         # Maximum connections in pool
    "heartbeat": 600,             # Heartbeat interval in seconds
    "blocked_connection_timeout": 300,  # Blocked connection timeout
}
```

### 7.3 Query Optimization

**Database Query Optimization Strategies**:

1. **Index Usage**:
   - All foreign keys indexed
   - Frequently filtered columns indexed
   - Composite indexes for common query patterns
   - Partial indexes for status-based queries

2. **Query Patterns**:
   - Use `EXPLAIN ANALYZE` for query optimization
   - Implement pagination with `LIMIT` and `OFFSET`
   - Use `SELECT` only required columns
   - Avoid `SELECT *` in production

3. **N+1 Query Prevention**:
   - Use SQLAlchemy `eagerload()` for related data
   - Batch queries for multiple records
   - Use `join()` instead of separate queries

**Example Optimized Query**:

```python
# Bad: N+1 query problem
candidates = []
for campaign in campaigns:
    candidates.extend(campaign.candidates)  # N+1 queries

# Good: Eager loading
from sqlalchemy.orm import eagerload

campaigns = session.query(Campaign).options(
    eagerload(Campaign.candidates)
).all()
```

### 7.4 Performance Targets

**API Response Time Targets**:

| Operation | Target (p50) | Target (p95) | Target (p99) |
|-----------|-------------|--------------|--------------|
| Campaign list | 100ms | 200ms | 500ms |
| Campaign detail | 150ms | 300ms | 700ms |
| Candidate list (200 items) | 400ms | 800ms | 2000ms |
| Candidate detail | 250ms | 500ms | 1200ms |
| Transcript retrieval | 200ms | 400ms | 1000ms |
| Shortlist action | 150ms | 300ms | 700ms |
| Requisition list | 300ms | 600ms | 1500ms |
| Requisition detail | 350ms | 700ms | 1800ms |

**Database Query Targets**:

| Operation | Target (p50) | Target (p95) | Target (p99) |
|-----------|-------------|--------------|--------------|
| Simple SELECT | 10ms | 50ms | 100ms |
| JOIN query | 20ms | 100ms | 200ms |
| Aggregation query | 30ms | 150ms | 300ms |
| INSERT/UPDATE | 15ms | 75ms | 150ms |

**Cache Operation Targets**:

| Operation | Target (p50) | Target (p95) | Target (p99) |
|-----------|-------------|--------------|--------------|
| Redis GET | 2ms | 10ms | 20ms |
| Redis SET | 3ms | 15ms | 30ms |
| Redis DELETE | 2ms | 10ms | 20ms |

---

## 8. API Versioning Strategy

### 8.1 Versioning Approach

The AROHAN API uses **URL-based versioning** to ensure backward compatibility and smooth transitions between versions.

**Version URL Pattern**:
```
/api/v{version}/{resource}
```

**Examples**:
- `/api/v1/campaigns`
- `/api/v2/campaigns`
- `/api/v3/campaigns`

### 8.2 Version Support Policy

**Current Version**: v1.0

**Version Support**:
- **Current version**: Fully supported, active development
- **Previous versions**: Supported for 6 months after deprecation
- **Deprecated versions**: 30-day notice before removal

**Version Lifecycle**:
1. **Active**: Current version with active development
2. **Maintenance**: No new features, bug fixes only
3. **Deprecated**: No changes, 30-day removal notice
4. **Removed**: No longer supported

### 8.3 Version Transition Process

**New Feature**:
- Add to current version
- No breaking changes
- Backward compatible

**Breaking Change**:
- Create new version
- Maintain previous version for 6 months
- Provide migration guide
- Update documentation

**Deprecation**:
- Add `X-API-Deprecation` header to responses
- Include deprecation notice in error messages
- Provide migration timeline
- Update API documentation

**Removal**:
- 30-day notice before removal
- Email notification to API users
- Update status page
- Remove from documentation

### 8.4 Version Headers

**API Version Header**:
```http
X-API-Version: 1.0
```

**Deprecation Header**:
```http
X-API-Deprecation: true
X-API-Deprecation-Date: 2026-10-24
X-API-Deprecation-Message: This version will be removed on 2026-10-24. Please migrate to v2.0.
```

**Sunset Header**:
```http
X-API-Sunset: 2026-10-24
```

---

## 9. Testing Strategy

### 9.1 Test Coverage Targets

**Unit Tests**:
- **Target**: 80% coverage for business logic
- **Focus**: Pydantic models, business logic functions, utility functions
- **Tools**: pytest, pytest-cov

**Integration Tests**:
- **Target**: 70% coverage for API endpoints
- **Focus**: API contracts, database integration, external service mocking
- **Tools**: pytest, pytest-asyncio, httpx

**End-to-End Tests**:
- **Target**: Critical user flows
- **Focus**: Complete user journeys, agent orchestration, drop-off recovery
- **Tools**: pytest, testcontainers

**Performance Tests**:
- **Target**: Load testing for peak scenarios
- **Focus**: API response times, database query performance, cache hit rates
- **Tools**: locust, pytest-benchmark

### 9.2 Test Categories

#### Unit Tests

**Test Structure**:
```
tests/
├── unit/
│   ├── models/
│   │   ├── test_candidate.py
│   │   ├── test_requisition.py
│   │   ├── test_campaign.py
│   │   └── test_scorecard.py
│   ├── services/
│   │   ├── test_auth_service.py
│   │   ├── test_candidate_service.py
│   │   └── test_scorecard_service.py
│   └── utils/
│       ├── test_validation.py
│       └── test_helpers.py
```

**Example Unit Test**:
```python
import pytest
from src.models.candidate import Candidate

def test_candidate_creation():
    candidate = Candidate(
        phone="+919876543210",
        pin_code="440001",
        language_detected="hi-IN",
        inbound_channel="ivr"
    )
    assert candidate.phone == "+919876543210"
    assert candidate.status == "pending"
    assert candidate.language_detected == "hi-IN"
```

#### Integration Tests

**Test Structure**:
```
tests/
├── integration/
│   ├── api/
│   │   ├── test_campaigns_api.py
│   │   ├── test_candidates_api.py
│   │   └── test_requisitions_api.py
│   ├── database/
│   │   ├── test_candidate_repository.py
│   │   └── test_scorecard_repository.py
│   └── external/
│       ├── test_bhashini_integration.py
│       └── test_pinecone_integration.py
```

**Example Integration Test**:
```python
import pytest
from httpx import AsyncClient
from src.main import app

@pytest.mark.asyncio
async def test_get_candidates_list():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/candidates")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "candidates" in data["data"]
```

#### End-to-End Tests

**Test Structure**:
```
tests/
├── e2e/
│   ├── test_candidate_flow.py
│   ├── test_campaign_flow.py
│   └── test_drop_off_recovery.py
```

**Example E2E Test**:
```python
import pytest
from httpx import AsyncClient
from src.main import app

@pytest.mark.e2e
async def test_complete_candidate_flow():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Login
        login_response = await client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "test_password"
        })
        assert login_response.status_code == 200
        token = login_response.json()["data"]["access_token"]

        # Get candidates
        candidates_response = await client.get(
            "/api/v1/candidates",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert candidates_response.status_code == 200

        # Shortlist candidate
        shortlist_response = await client.post(
            "/api/v1/candidates/{candidate_id}/shortlist",
            headers={"Authorization": f"Bearer {token}"},
            json={"notes": "Strong candidate"}
        )
        assert shortlist_response.status_code == 200
```

#### Performance Tests

**Test Structure**:
```
tests/
├── performance/
│   ├── test_api_performance.py
│   ├── test_database_performance.py
│   └── test_cache_performance.py
```

**Example Performance Test**:
```python
import pytest
from locust import HttpUser, task, between

class ArohanUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def get_campaigns(self):
        self.client.get("/api/v1/campaigns")

    @task(2)
    def get_candidates(self):
        self.client.get("/api/v1/candidates")

    @task(1)
    def get_requisitions(self):
        self.client.get("/api/v1/requisitions")
```

### 9.3 Test Execution

**Run All Tests**:
```bash
pytest tests/ -v --cov=src --cov-report=term-missing
```

**Run Unit Tests Only**:
```bash
pytest tests/unit/ -v
```

**Run Integration Tests Only**:
```bash
pytest tests/integration/ -v
```

**Run E2E Tests Only**:
```bash
pytest tests/e2e/ -v -m e2e
```

**Run Performance Tests**:
```bash
locust -f tests/performance/test_api_performance.py
```

**Coverage Report**:
```bash
pytest tests/ --cov=src --cov-report=html
```

---

## 10. Deployment Considerations

### 10.1 Docker Compose Configuration

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  # FastAPI Backend
  api:
    build: ./backend
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
    environment:
      - DATABASE_URL=postgresql://arohan:arohan_password@postgres:5432/arohan
      - REDIS_URL=redis://redis:6379/0
      - RABBITMQ_URL=amqp://arohan:arohan_password@rabbitmq:5672/
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - JWT_ALGORITHM=RS256
      - BHASHINI_API_KEY=${BHASHINI_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - PINECONE_INDEX_NAME=${PINECONE_INDEX_NAME}
    depends_on:
      - postgres
      - redis
      - rabbitmq
    ports:
      - "8000:8000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '1.0'
          memory: 512M

  # Celery Workers
  celery_worker:
    build: ./backend
    command: celery -A src.tasks worker --loglevel=info --concurrency=8
    environment:
      - DATABASE_URL=postgresql://arohan:arohan_password@postgres:5432/arohan
      - REDIS_URL=redis://redis:6379/0
      - RABBITMQ_URL=amqp://arohan:arohan_password@rabbitmq:5672/
      - BHASHINI_API_KEY=${BHASHINI_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - PINECONE_INDEX_NAME=${PINECONE_INDEX_NAME}
    depends_on:
      - postgres
      - redis
      - rabbitmq
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "celery", "-A", "src.tasks", "inspect", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '1.0'
          memory: 512M

  # Celery Beat
  celery_beat:
    build: ./backend
    command: celery -A src.tasks beat --loglevel=info
    environment:
      - DATABASE_URL=postgresql://arohan:arohan_password@postgres:5432/arohan
      - REDIS_URL=redis://redis:6379/0
      - RABBITMQ_URL=amqp://arohan:arohan_password@rabbitmq:5672/
    depends_on:
      - postgres
      - redis
      - rabbitmq
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=arohan
      - POSTGRES_PASSWORD=arohan_password
      - POSTGRES_DB=arohan
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U arohan"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '1.0'
          memory: 512M

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  # RabbitMQ Message Queue
  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      - RABBITMQ_DEFAULT_USER=arohan
      - RABBITMQ_DEFAULT_PASS=arohan_password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:

networks:
  default:
    driver: bridge
```

**Resource Allocation Summary**:

| Service | CPU Limit | RAM Limit | Purpose |
|---------|-----------|-----------|---------|
| api | 2.0 | 1GB | FastAPI backend |
| celery_worker | 2.0 | 1GB | Audio processing |
| celery_beat | 0.5 | 256MB | Scheduled tasks |
| postgres | 2.0 | 1GB | Database |
| redis | 1.0 | 512MB | Session state + cache |
| rabbitmq | 1.0 | 512MB | Task queue |

**Total Resource Allocation**: ~8.5 CPU cores, ~4.25GB RAM

### 10.2 Health Checks

**API Health Check Endpoint**:

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": check_database_connection(),
            "redis": check_redis_connection(),
            "rabbitmq": check_rabbitmq_connection()
        }
    }
```

**Health Check Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-24T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "rabbitmq": "connected"
  }
}
```

### 10.3 Monitoring & Observability

**Application Logging**:

```python
import logging
from pythonjsonlogger import jsonlogger

# JSON structured logging
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

**Log Levels**:
- **INFO**: Production (default)
- **DEBUG**: Development
- **ERROR**: Critical errors only

**Log Retention**: 7 days

**Metrics Collection**:

```python
from prometheus_client import Counter, Histogram, Gauge

# Request metrics
request_count = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint', 'status'])
request_duration = Histogram('api_request_duration_seconds', 'API request duration', ['method', 'endpoint'])

# Database metrics
db_query_count = Counter('db_queries_total', 'Total database queries', ['operation'])
db_query_duration = Histogram('db_query_duration_seconds', 'Database query duration')

# Cache metrics
cache_hit_count = Counter('cache_hits_total', 'Total cache hits', ['cache_type'])
cache_miss_count = Counter('cache_misses_total', 'Total cache misses', ['cache_type'])

# Queue metrics
queue_length = Gauge('queue_length', 'Current queue length', ['queue_name'])
task_duration = Histogram('task_duration_seconds', 'Task duration', ['task_name'])
```

**Alerting Rules**:

```yaml
# Prometheus alerting rules
groups:
  - name: arohan_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(api_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/second"

      - alert: HighLatency
        expr: histogram_quantile(0.95, api_request_duration_seconds) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency detected"
          description: "P95 latency is {{ $value }} seconds"

      - alert: DatabaseConnectionPoolExhausted
        expr: db_connection_pool_available < 5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool exhausted"
          description: "Available connections: {{ $value }}"
```

---

## 11. Pydantic Models

### 11.1 Authentication Models

#### LoginRequest

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "priya@example.com",
                "password": "secure_password"
            }
        }
```

#### LoginResponse

```python
from typing import Dict, Any

class LoginResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(default=86400, description="Token expiration in seconds")
    user: Dict[str, Any] = Field(..., description="User information")

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "Bearer",
                "expires_in": 86400,
                "user": {
                    "id": "user_uuid",
                    "email": "priya@example.com",
                    "name": "Priya Sharma",
                    "company_id": "company_uuid",
                    "role": "admin"
                }
            }
        }
```

#### RefreshRequest

```python
class RefreshRequest(BaseModel):
    refresh_token: str = Field(..., description="JWT refresh token")

    class Config:
        json_schema_extra = {
            "example": {
                "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
```

#### RefreshResponse

```python
class RefreshResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(default=86400, description="Token expiration in seconds")

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "Bearer",
                "expires_in": 86400
            }
        }
```

### 11.2 Campaign Models

#### CampaignListResponse

```python
from typing import List, Optional
from datetime import datetime

class CampaignSummary(BaseModel):
    id: str = Field(..., description="Campaign UUID")
    name: str = Field(..., description="Campaign name")
    requisition_id: str = Field(..., description="Requisition UUID")
    requisition_name: str = Field(..., description="Requisition name")
    status: str = Field(..., description="Campaign status")
    candidate_count: int = Field(default=0, description="Total candidates")
    shortlisted_count: int = Field(default=0, description="Shortlisted candidates")
    rejected_count: int = Field(default=0, description="Rejected candidates")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

class PaginationMeta(BaseModel):
    page: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, le=200, description="Items per page")
    total_items: int = Field(..., ge=0, description="Total items")
    total_pages: int = Field(..., ge=0, description="Total pages")
    has_next: bool = Field(..., description="Has next page")
    has_prev: bool = Field(..., description="Has previous page")

class CampaignListResponse(BaseModel):
    campaigns: List[CampaignSummary] = Field(..., description="List of campaigns")
    pagination: PaginationMeta = Field(..., description="Pagination metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "campaigns": [
                    {
                        "id": "campaign_uuid",
                        "name": "Delivery Partner Screening - April 2026",
                        "requisition_id": "requisition_uuid",
                        "requisition_name": "Delivery Partner",
                        "status": "active",
                        "candidate_count": 127,
                        "shortlisted_count": 45,
                        "rejected_count": 12,
                        "created_at": "2026-04-20T08:00:00Z",
                        "updated_at": "2026-04-24T10:30:00Z"
                    }
                ],
                "pagination": {
                    "page": 1,
                    "page_size": 50,
                    "total_items": 127,
                    "total_pages": 3,
                    "has_next": True,
                    "has_prev": False
                }
            }
        }
```

#### CampaignDetailResponse

```python
from typing import Dict, Any

class CampaignStatistics(BaseModel):
    average_score: float = Field(..., ge=0, le=100, description="Average score")
    median_score: float = Field(..., ge=0, le=100, description="Median score")
    score_distribution: Dict[str, int] = Field(..., description="Score distribution")
    language_distribution: Dict[str, int] = Field(..., description="Language distribution")

class CampaignDetailResponse(BaseModel):
    id: str = Field(..., description="Campaign UUID")
    name: str = Field(..., description="Campaign name")
    requisition_id: str = Field(..., description="Requisition UUID")
    requisition_name: str = Field(..., description="Requisition name")
    status: str = Field(..., description="Campaign status")
    candidate_count: int = Field(default=0, description="Total candidates")
    shortlisted_count: int = Field(default=0, description="Shortlisted candidates")
    rejected_count: int = Field(default=0, description="Rejected candidates")
    pending_count: int = Field(default=0, description="Pending candidates")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    statistics: CampaignStatistics = Field(..., description="Campaign statistics")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "campaign_uuid",
                "name": "Delivery Partner Screening - April 2026",
                "requisition_id": "requisition_uuid",
                "requisition_name": "Delivery Partner",
                "status": "active",
                "candidate_count": 127,
                "shortlisted_count": 45,
                "rejected_count": 12,
                "pending_count": 70,
                "created_at": "2026-04-20T08:00:00Z",
                "updated_at": "2026-04-24T10:30:00Z",
                "statistics": {
                    "average_score": 72.5,
                    "median_score": 75.0,
                    "score_distribution": {
                        "90-100": 15,
                        "80-89": 30,
                        "70-79": 45,
                        "60-69": 25,
                        "50-59": 10,
                        "below_50": 2
                    },
                    "language_distribution": {
                        "hi-IN": 85,
                        "en-IN": 30,
                        "ta-IN": 8,
                        "mr-IN": 4
                    }
                }
            }
        }
```

### 11.3 Candidate Models

#### CandidateListResponse

```python
class CandidateSummary(BaseModel):
    id: str = Field(..., description="Candidate UUID")
    name: Optional[str] = Field(None, description="Candidate name")
    phone: str = Field(..., description="Candidate phone number")
    pin_code: str = Field(..., description="Candidate pin code")
    language_detected: Optional[str] = Field(None, description="Detected language")
    inbound_channel: str = Field(..., description="Inbound channel")
    overall_score: Optional[float] = Field(None, ge=0, le=100, description="Overall score")
    communication_score: Optional[float] = Field(None, ge=0, le=100, description="Communication score")
    domain_knowledge_score: Optional[float] = Field(None, ge=0, le=100, description="Domain knowledge score")
    situational_judgment_score: Optional[float] = Field(None, ge=0, le=100, description="Situational judgment score")
    confidence_score: Optional[float] = Field(None, ge=0, le=100, description="Confidence score")
    language_fluency: Optional[str] = Field(None, description="Language fluency")
    status: str = Field(..., description="Candidate status")
    campaign_id: str = Field(..., description="Campaign UUID")
    campaign_name: str = Field(..., description="Campaign name")
    requisition_id: str = Field(..., description="Requisition UUID")
    requisition_name: str = Field(..., description="Requisition name")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

class CandidateListResponse(BaseModel):
    candidates: List[CandidateSummary] = Field(..., description="List of candidates")
    pagination: PaginationMeta = Field(..., description="Pagination metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "candidates": [
                    {
                        "id": "candidate_uuid",
                        "name": "Rahul Kumar",
                        "phone": "+919876543210",
                        "pin_code": "440001",
                        "language_detected": "hi-IN",
                        "inbound_channel": "ivr",
                        "overall_score": 85,
                        "communication_score": 88,
                        "domain_knowledge_score": 82,
                        "situational_judgment_score": 84,
                        "confidence_score": 86,
                        "language_fluency": "proficient",
                        "status": "shortlisted",
                        "campaign_id": "campaign_uuid",
                        "campaign_name": "Delivery Partner Screening - April 2026",
                        "requisition_id": "requisition_uuid",
                        "requisition_name": "Delivery Partner",
                        "created_at": "2026-04-22T14:30:00Z",
                        "updated_at": "2026-04-23T09:15:00Z"
                    }
                ],
                "pagination": {
                    "page": 1,
                    "page_size": 50,
                    "total_items": 127,
                    "total_pages": 3,
                    "has_next": True,
                    "has_prev": False
                }
            }
        }
```

#### CandidateDetailResponse

```python
class ScorecardSummary(BaseModel):
    id: str = Field(..., description="Scorecard UUID")
    overall_score: float = Field(..., ge=0, le=100, description="Overall score")
    communication_score: float = Field(..., ge=0, le=100, description="Communication score")
    domain_knowledge_score: float = Field(..., ge=0, le=100, description="Domain knowledge score")
    situational_judgment_score: float = Field(..., ge=0, le=100, description="Situational judgment score")
    confidence_score: float = Field(..., ge=0, le=100, description="Confidence score")
    language_fluency: str = Field(..., description="Language fluency")
    assessor_notes: str = Field(..., description="Assessor notes")
    recommended_roles: List[str] = Field(..., description="Recommended roles")
    shortlist_flag: bool = Field(..., description="Shortlist flag")
    created_at: datetime = Field(..., description="Creation timestamp")

class MatchedRequisition(BaseModel):
    id: str = Field(..., description="Requisition UUID")
    role_name: str = Field(..., description="Role name")
    company_name: str = Field(..., description="Company name")
    location: str = Field(..., description="Location")
    pin_code: str = Field(..., description="Pin code")
    distance_km: float = Field(..., ge=0, description="Distance in kilometers")
    score_threshold: int = Field(..., ge=1, le=100, description="Score threshold")
    status: str = Field(..., description="Requisition status")

class CandidateDetailResponse(BaseModel):
    id: str = Field(..., description="Candidate UUID")
    name: Optional[str] = Field(None, description="Candidate name")
    phone: str = Field(..., description="Candidate phone number")
    pin_code: str = Field(..., description="Candidate pin code")
    language_detected: Optional[str] = Field(None, description="Detected language")
    inbound_channel: str = Field(..., description="Inbound channel")
    status: str = Field(..., description="Candidate status")
    campaign_id: str = Field(..., description="Campaign UUID")
    campaign_name: str = Field(..., description="Campaign name")
    requisition_id: str = Field(..., description="Requisition UUID")
    requisition_name: str = Field(..., description="Requisition name")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    scorecard: ScorecardSummary = Field(..., description="Scorecard summary")
    matched_requisitions: List[MatchedRequisition] = Field(..., description="Matched requisitions")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "candidate_uuid",
                "name": "Rahul Kumar",
                "phone": "+919876543210",
                "pin_code": "440001",
                "language_detected": "hi-IN",
                "inbound_channel": "ivr",
                "status": "shortlisted",
                "campaign_id": "campaign_uuid",
                "campaign_name": "Delivery Partner Screening - April 2026",
                "requisition_id": "requisition_uuid",
                "requisition_name": "Delivery Partner",
                "created_at": "2026-04-22T14:30:00Z",
                "updated_at": "2026-04-23T09:15:00Z",
                "scorecard": {
                    "id": "scorecard_uuid",
                    "overall_score": 85,
                    "communication_score": 88,
                    "domain_knowledge_score": 82,
                    "situational_judgment_score": 84,
                    "confidence_score": 86,
                    "language_fluency": "proficient",
                    "assessor_notes": "Strong communication skills, good domain knowledge. Confident responses.",
                    "recommended_roles": ["Delivery Partner", "Warehouse Associate"],
                    "shortlist_flag": True,
                    "created_at": "2026-04-22T15:00:00Z"
                },
                "matched_requisitions": [
                    {
                        "id": "requisition_uuid",
                        "role_name": "Delivery Partner",
                        "company_name": "LogiFast India",
                        "location": "Nagpur",
                        "pin_code": "440001",
                        "distance_km": 0,
                        "score_threshold": 70,
                        "status": "open"
                    }
                ]
            }
        }
```

#### TranscriptResponse

```python
class TranscriptSegment(BaseModel):
    speaker: str = Field(..., description="Speaker (proctor or candidate)")
    text: str = Field(..., description="Transcript text")
    timestamp: float = Field(..., ge=0, description="Timestamp in seconds")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")

class TranscriptResponse(BaseModel):
    id: str = Field(..., description="Candidate UUID")
    name: Optional[str] = Field(None, description="Candidate name")
    phone: str = Field(..., description="Candidate phone number")
    session_id: str = Field(..., description="Session UUID")
    language_detected: Optional[str] = Field(None, description="Detected language")
    duration_seconds: int = Field(..., ge=0, description="Duration in seconds")
    transcript_segments: List[TranscriptSegment] = Field(..., description="Transcript segments")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "candidate_uuid",
                "name": "Rahul Kumar",
                "phone": "+919876543210",
                "session_id": "session_uuid",
                "language_detected": "hi-IN",
                "duration_seconds": 312,
                "transcript_segments": [
                    {
                        "speaker": "proctor",
                        "text": "Namaste! Aapka naam kya hai?",
                        "timestamp": 0.5,
                        "confidence": 0.98
                    },
                    {
                        "speaker": "candidate",
                        "text": "Namaste, mera naam Rahul Kumar hai.",
                        "timestamp": 2.3,
                        "confidence": 0.95
                    }
                ],
                "created_at": "2026-04-22T14:30:00Z"
            }
        }
```

#### ShortlistRequest

```python
class ShortlistRequest(BaseModel):
    notes: Optional[str] = Field(None, description="Shortlist notes")

    class Config:
        json_schema_extra = {
            "example": {
                "notes": "Strong candidate, good communication skills"
            }
        }
```

#### ShortlistResponse

```python
class ShortlistResponse(BaseModel):
    id: str = Field(..., description="Candidate UUID")
    name: Optional[str] = Field(None, description="Candidate name")
    phone: str = Field(..., description="Candidate phone number")
    status: str = Field(..., description="Candidate status")
    shortlisted_at: datetime = Field(..., description="Shortlist timestamp")
    shortlisted_by: str = Field(..., description="User UUID who shortlisted")
    notes: Optional[str] = Field(None, description="Shortlist notes")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "candidate_uuid",
                "name": "Rahul Kumar",
                "phone": "+919876543210",
                "status": "shortlisted",
                "shortlisted_at": "2026-04-24T10:30:00Z",
                "shortlisted_by": "user_uuid",
                "notes": "Strong candidate, good communication skills"
            }
        }
```

#### RejectRequest

```python
class RejectRequest(BaseModel):
    reason: str = Field(..., description="Rejection reason")
    notes: Optional[str] = Field(None, description="Rejection notes")

    class Config:
        json_schema_extra = {
            "example": {
                "reason": "Low domain knowledge score",
                "notes": "Candidate lacks understanding of delivery operations"
            }
        }
```

#### RejectResponse

```python
class RejectResponse(BaseModel):
    id: str = Field(..., description="Candidate UUID")
    name: Optional[str] = Field(None, description="Candidate name")
    phone: str = Field(..., description="Candidate phone number")
    status: str = Field(..., description="Candidate status")
    rejected_at: datetime = Field(..., description="Rejection timestamp")
    rejected_by: str = Field(..., description="User UUID who rejected")
    reason: str = Field(..., description="Rejection reason")
    notes: Optional[str] = Field(None, description="Rejection notes")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "candidate_uuid",
                "name": "Rahul Kumar",
                "phone": "+919876543210",
                "status": "rejected",
                "rejected_at": "2026-04-24T10:30:00Z",
                "rejected_by": "user_uuid",
                "reason": "Low domain knowledge score",
                "notes": "Candidate lacks understanding of delivery operations"
            }
        }
```

### 11.4 Requisition Models

#### RequisitionListResponse

```python
class RequisitionSummary(BaseModel):
    id: str = Field(..., description="Requisition UUID")
    role_name: str = Field(..., description="Role name")
    company_name: str = Field(..., description="Company name")
    location: str = Field(..., description="Location")
    pin_code: str = Field(..., description="Pin code")
    score_threshold: int = Field(..., ge=1, le=100, description="Score threshold")
    geo_radius_km: int = Field(..., ge=1, le=500, description="Geo-radius in kilometers")
    status: str = Field(..., description="Requisition status")
    candidate_count: int = Field(default=0, description="Total candidates")
    matched_count: int = Field(default=0, description="Matched candidates")
    shortlisted_count: int = Field(default=0, description="Shortlisted candidates")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

class RequisitionListResponse(BaseModel):
    requisitions: List[RequisitionSummary] = Field(..., description="List of requisitions")
    pagination: PaginationMeta = Field(..., description="Pagination metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "requisitions": [
                    {
                        "id": "requisition_uuid",
                        "role_name": "Delivery Partner",
                        "company_name": "LogiFast India",
                        "location": "Nagpur",
                        "pin_code": "440001",
                        "score_threshold": 70,
                        "geo_radius_km": 50,
                        "status": "open",
                        "candidate_count": 127,
                        "matched_count": 85,
                        "shortlisted_count": 45,
                        "created_at": "2026-04-15T08:00:00Z",
                        "updated_at": "2026-04-24T10:30:00Z"
                    }
                ],
                "pagination": {
                    "page": 1,
                    "page_size": 50,
                    "total_items": 15,
                    "total_pages": 1,
                    "has_next": False,
                    "has_prev": False
                }
            }
        }
```

#### RequisitionDetailResponse

```python
class MatchedCandidate(BaseModel):
    id: str = Field(..., description="Candidate UUID")
    name: Optional[str] = Field(None, description="Candidate name")
    phone: str = Field(..., description="Candidate phone number")
    overall_score: float = Field(..., ge=0, le=100, description="Overall score")
    status: str = Field(..., description="Candidate status")
    distance_km: float = Field(..., ge=0, description="Distance in kilometers")
    created_at: datetime = Field(..., description="Creation timestamp")

class RequisitionRecommendations(BaseModel):
    fill_rate: float = Field(..., ge=0, le=1, description="Fill rate")
    average_score: float = Field(..., ge=0, le=100, description="Average score")
    suggested_actions: List[str] = Field(..., description="Suggested actions")

class RequisitionDetailResponse(BaseModel):
    id: str = Field(..., description="Requisition UUID")
    role_name: str = Field(..., description="Role name")
    company_name: str = Field(..., description="Company name")
    location: str = Field(..., description="Location")
    pin_code: str = Field(..., description="Pin code")
    score_threshold: int = Field(..., ge=1, le=100, description="Score threshold")
    geo_radius_km: int = Field(..., ge=1, le=500, description="Geo-radius in kilometers")
    status: str = Field(..., description="Requisition status")
    candidate_count: int = Field(default=0, description="Total candidates")
    matched_count: int = Field(default=0, description="Matched candidates")
    shortlisted_count: int = Field(default=0, description="Shortlisted candidates")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    matched_candidates: List[MatchedCandidate] = Field(..., description="Matched candidates")
    recommendations: RequisitionRecommendations = Field(..., description="Requisition recommendations")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "requisition_uuid",
                "role_name": "Delivery Partner",
                "company_name": "LogiFast India",
                "location": "Nagpur",
                "pin_code": "440001",
                "score_threshold": 70,
                "geo_radius_km": 50,
                "status": "open",
                "candidate_count": 127,
                "matched_count": 85,
                "shortlisted_count": 45,
                "created_at": "2026-04-15T08:00:00Z",
                "updated_at": "2026-04-24T10:30:00Z",
                "matched_candidates": [
                    {
                        "id": "candidate_uuid",
                        "name": "Rahul Kumar",
                        "phone": "+919876543210",
                        "overall_score": 85,
                        "status": "shortlisted",
                        "distance_km": 0,
                        "created_at": "2026-04-22T14:30:00Z"
                    }
                ],
                "recommendations": {
                    "fill_rate": 0.35,
                    "average_score": 72.5,
                    "suggested_actions": [
                        "Consider lowering score threshold to 65 to increase candidate pool",
                        "Expand geo-radius to 75km to reach more candidates"
                    ]
                }
            }
        }
```

### 11.5 Agent Orchestration Models

#### StartSessionRequest

```python
class StartSessionRequest(BaseModel):
    candidate_phone: str = Field(..., description="Candidate phone number")
    candidate_pin_code: str = Field(..., description="Candidate pin code")
    campaign_id: str = Field(..., description="Campaign UUID")
    requisition_id: str = Field(..., description="Requisition UUID")
    inbound_channel: str = Field(..., description="Inbound channel")
    preferred_language: Optional[str] = Field(None, description="Preferred language")

    class Config:
        json_schema_extra = {
            "example": {
                "candidate_phone": "+919876543210",
                "candidate_pin_code": "440001",
                "campaign_id": "campaign_uuid",
                "requisition_id": "requisition_uuid",
                "inbound_channel": "ivr",
                "preferred_language": "hi-IN"
            }
        }
```

#### StartSessionResponse

```python
class StartSessionResponse(BaseModel):
    session_id: str = Field(..., description="Session UUID")
    candidate_phone: str = Field(..., description="Candidate phone number")
    status: str = Field(..., description="Session status")
    first_question: str = Field(..., description="First question")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "session_uuid",
                "candidate_phone": "+919876543210",
                "status": "in_progress",
                "first_question": "Namaste! Aapka naam kya hai?",
                "created_at": "2026-04-24T10:30:00Z"
            }
        }
```

#### ResumeSessionRequest

```python
class ResumeSessionRequest(BaseModel):
    session_id: str = Field(..., description="Session UUID")

    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "session_uuid"
            }
        }
```

#### ResumeSessionResponse

```python
class ResumeSessionResponse(BaseModel):
    session_id: str = Field(..., description="Session UUID")
    candidate_phone: str = Field(..., description="Candidate phone number")
    status: str = Field(..., description="Session status")
    last_question: str = Field(..., description="Last question")
    drop_off_count: int = Field(..., ge=0, description="Drop-off count")
    resumed_at: datetime = Field(..., description="Resume timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "session_uuid",
                "candidate_phone": "+919876543210",
                "status": "resumed",
                "last_question": "Kya aap delivery partner ka kaam karne ke liye taiyaar hain?",
                "drop_off_count": 1,
                "resumed_at": "2026-04-24T10:30:00Z"
            }
        }
```

#### EvaluateRequest

```python
class EvaluateRequest(BaseModel):
    session_id: str = Field(..., description="Session UUID")
    candidate_id: str = Field(..., description="Candidate UUID")
    requisition_id: str = Field(..., description="Requisition UUID")
    transcript_segments: List[TranscriptSegment] = Field(..., description="Transcript segments")

    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "session_uuid",
                "candidate_id": "candidate_uuid",
                "requisition_id": "requisition_uuid",
                "transcript_segments": [
                    {
                        "speaker": "proctor",
                        "text": "Namaste! Aapka naam kya hai?",
                        "timestamp": 0.5,
                        "confidence": 0.98
                    },
                    {
                        "speaker": "candidate",
                        "text": "Namaste, mera naam Rahul Kumar hai.",
                        "timestamp": 2.3,
                        "confidence": 0.95
                    }
                ]
            }
        }
```

#### EvaluateResponse

```python
class EvaluateResponse(BaseModel):
    scorecard_id: str = Field(..., description="Scorecard UUID")
    candidate_id: str = Field(..., description="Candidate UUID")
    requisition_id: str = Field(..., description="Requisition UUID")
    overall_score: float = Field(..., ge=0, le=100, description="Overall score")
    communication_score: float = Field(..., ge=0, le=100, description="Communication score")
    domain_knowledge_score: float = Field(..., ge=0, le=100, description="Domain knowledge score")
    situational_judgment_score: float = Field(..., ge=0, le=100, description="Situational judgment score")
    confidence_score: float = Field(..., ge=0, le=100, description="Confidence score")
    language_fluency: str = Field(..., description="Language fluency")
    assessor_notes: str = Field(..., description="Assessor notes")
    recommended_roles: List[str] = Field(..., description="Recommended roles")
    shortlist_flag: bool = Field(..., description="Shortlist flag")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "scorecard_id": "scorecard_uuid",
                "candidate_id": "candidate_uuid",
                "requisition_id": "requisition_uuid",
                "overall_score": 85,
                "communication_score": 88,
                "domain_knowledge_score": 82,
                "situational_judgment_score": 84,
                "confidence_score": 86,
                "language_fluency": "proficient",
                "assessor_notes": "Strong communication skills, good domain knowledge. Confident responses.",
                "recommended_roles": ["Delivery Partner", "Warehouse Associate"],
                "shortlist_flag": True,
                "created_at": "2026-04-24T10:30:00Z"
            }
        }
```

#### FindMatchesRequest

```python
class FindMatchesRequest(BaseModel):
    candidate_id: str = Field(..., description="Candidate UUID")
    candidate_pin_code: str = Field(..., description="Candidate pin code")
    overall_score: float = Field(..., ge=0, le=100, description="Overall score")
    language_detected: Optional[str] = Field(None, description="Detected language")

    class Config:
        json_schema_extra = {
            "example": {
                "candidate_id": "candidate_uuid",
                "candidate_pin_code": "440001",
                "overall_score": 85,
                "language_detected": "hi-IN"
            }
        }
```

#### FindMatchesResponse

```python
class FindMatchesResponse(BaseModel):
    candidate_id: str = Field(..., description="Candidate UUID")
    matched_requisitions: List[MatchedRequisition] = Field(..., description="Matched requisitions")
    total_matches: int = Field(..., ge=0, description="Total matches")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "candidate_id": "candidate_uuid",
                "matched_requisitions": [
                    {
                        "id": "requisition_uuid",
                        "role_name": "Delivery Partner",
                        "company_name": "LogiFast India",
                        "location": "Nagpur",
                        "pin_code": "440001",
                        "distance_km": 0,
                        "score_threshold": 70,
                        "status": "open"
                    }
                ],
                "total_matches": 3,
                "created_at": "2026-04-24T10:30:00Z"
            }
        }
```

---

## 12. Appendix

### 12.1 Glossary

| Term | Definition |
|------|------------|
| **Candidate** | A job applicant who has completed the voice screening process |
| **Campaign** | A screening initiative linked to a specific requisition |
| **Requisition** | A job opening with specific requirements and score threshold |
| **Scorecard** | Detailed assessment of a candidate's performance |
| **Proctor** | AI agent that conducts adaptive voice interviews |
| **Assessor** | AI agent that evaluates transcripts and generates scorecards |
| **Matchmaker** | AI agent that finds matching job requisitions for candidates |
| **Drop-off Recovery** | Ability to resume interrupted interviews |
| **Geo-radius** | Geographic radius for candidate-requisition matching |
| **Shortlist** | Marking a candidate as qualified for the role |

### 12.2 Reference Documentation

**Technology Documentation**:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Pydantic](https://docs.pydantic.dev/) - Data validation using Python type annotations
- [SQLAlchemy](https://docs.sqlalchemy.org/) - Python SQL toolkit and ORM
- [PostgreSQL](https://www.postgresql.org/docs/) - Relational database management system
- [Redis](https://redis.io/docs/) - In-memory data structure store
- [RabbitMQ](https://www.rabbitmq.com/docs) - Message broker
- [Celery](https://docs.celeryq.dev/) - Distributed task queue
- [LangGraph](https://langchain-ai.github.io/langgraph/) - Stateful agent framework
- [Pinecone](https://docs.pinecone.io/) - Vector database

**API Standards**:
- [REST API Design Best Practices](https://restfulapi.net/)
- [JSON API Specification](https://jsonapi.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [RFC 7231 - HTTP Semantics](https://datatracker.ietf.org/doc/html/rfc7231)

**Security Standards**:
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0](https://oauth.net/2/)
- [TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)

### 12.3 Contact & Support

**API Support**:
- Email: api-support@arohan.ai
- Documentation: https://docs.arohan.ai
- Status Page: https://status.arohan.ai
- GitHub Issues: https://github.com/ravikumarve/Arohan/issues

**Development Team**:
- Backend Architect: backend-architect@arohan.ai
- DevOps Automator: devops@arohan.ai
- Database Optimizer: database@arohan.ai
- Security Engineer: security@arohan.ai

---

## Document Status

**Status**: Complete  
**Version**: 1.0  
**Last Updated**: April 24, 2026  
**Next Review**: After Phase 2 implementation (Week 4)  
**Owner**: Backend Architect  
**Reviewers**: DevOps Automator, Database Optimizer, Security Engineer

---

**End of API Specification**


