# KumbhRakshak — Project Context

## Project
- **Name**: KumbhRakshak
- **Purpose**: Civic-Divine Emergency, Safety & Pilgrim Navigation Dashboard for Nashik Kumbh Mela 2027
- **Target Users**: Pilgrims, Volunteers, Duty Staff (Police, Medical Officers)

## Core Modules
- Authentication (Phone OTP, Pass ID, Official Badge)
- Safety Dashboard (Crowd status, traffic, weather)
- Emergency SOS Dispatch
- Safety Map with POIs (Hospitals, Police, Water, Drone, Shuttle, Food)
- Temple Directory with Aarti Schedules
- Lost & Found / Reunion Cases
- Pilgrim Services (Water Stations, Drone Rescue, E-Shuttle, Food/Langar)
- Kumbh Mitra AI Safety Assistant (Gemini)
- Safety Alerts
- User Profile & Medical Vault

## Technology Stack
- **Frontend**: React 19, Vite, TailwindCSS v4, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI**: Google Gemini API (`@google/genai`)
- **Auth**: JWT (access tokens)
- **Languages**: JavaScript (backend), TypeScript (frontend)

## Architecture
- Monorepo: Frontend (root `src/`) + Backend (`backend/`)
- Single Express server serves both Vite dev middleware and API routes
- REST API at `/api/v1/`

## Authentication Strategy
- JWT-based with phone+OTP flow
- Demo mode OTP (code: `2027`) — no SMS provider yet
- Three login modes: OTP, Pilgrim Pass ID, Official Badge
- Guest emergency access (limited)

## Authorization Strategy
- Role-based: `pilgrim`, `volunteer`, `official`, `admin`
- Most data endpoints are public (emergency/safety context)
- Write operations (report lost person, SOS) require authentication
- Profile operations require ownership

## Current Phase
- Backend implementation (Phase 1: Infrastructure)

## Important Constraints
- Frontend is AI Studio-generated and must not be broken
- Gemini API key required for AI assistant
- No SMS provider — demo OTP only
