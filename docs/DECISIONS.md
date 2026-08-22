# KumbhRakshak — Decisions Log

## DEC-001
**Decision**: Use MongoDB with Mongoose as the database
**Why**: Data is document-oriented (POIs with nested arrays, temples with aarti schedules, shuttles with embedded vehicles). Schema flexibility suits evolving event data.
**Alternatives**: PostgreSQL (better for relational queries but overhead for nested document patterns)
**Impact**: All models use Mongoose schemas
**Date**: 2026-08-22

## DEC-002
**Decision**: JWT access tokens for authentication (no refresh tokens in v1)
**Why**: Stateless auth for mobile-first app. No session store required. Frontend uses localStorage.
**Alternatives**: Session-based auth (requires session store), OAuth2 (overkill for event app)
**Impact**: Auth middleware validates JWT on protected routes
**Date**: 2026-08-22

## DEC-003
**Decision**: Demo OTP mode (hardcoded `2027`) for authentication
**Why**: No SMS provider is configured. Frontend already uses `2027` as demo OTP.
**Alternatives**: Integrate Twilio/MSG91 (requires provider credentials)
**Impact**: OTP verification accepts any 4-digit code matching `2027` in demo mode
**Date**: 2026-08-22

## DEC-004
**Decision**: Backend in `backend/` subdirectory, integrated via existing `server.ts`
**Why**: Preserves existing AI Studio monolith structure. Frontend Vite middleware stays in `server.ts`. Backend routes are mounted as Express middleware.
**Alternatives**: Separate backend server (requires CORS/proxy), rewrite server.ts completely
**Impact**: `server.ts` imports and mounts backend app
**Date**: 2026-08-22

## DEC-005
**Decision**: API versioning with `/api/v1/` prefix
**Why**: Standard REST practice. Existing frontend uses `/api/` — backend will handle both prefixes for backward compatibility.
**Alternatives**: No versioning (harder to evolve)
**Impact**: All new routes under `/api/v1/`, legacy routes proxied
**Date**: 2026-08-22

## DEC-006
**Decision**: Seed database from existing `mockData.ts`
**Why**: Ensures data consistency with frontend expectations. Provides realistic demo data.
**Alternatives**: Empty database with manual data entry
**Impact**: `npm run seed` populates all collections
**Date**: 2026-08-22

## DEC-007
**Decision**: Most data endpoints are public (no auth required)
**Why**: This is an emergency/safety application. Pilgrims need access to hospitals, police, water stations, etc. without auth barriers. Only write operations and personal data require auth.
**Alternatives**: All endpoints behind auth (blocks emergency access for guests)
**Impact**: GET endpoints for POIs, temples, alerts, services are public
**Date**: 2026-08-22
