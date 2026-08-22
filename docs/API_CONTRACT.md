# KumbhRakshak — API Contract

## Auth Endpoints
- `POST /api/v1/auth/request-otp` -> Request 4-digit OTP
- `POST /api/v1/auth/verify-otp` -> Verify OTP, return JWT + User Profile
- `POST /api/v1/auth/login-pass-id` -> Login via Pilgrim Pass ID
- `POST /api/v1/auth/login-official` -> Login via Official Badge Number
- `POST /api/v1/auth/guest` -> Obtain emergency guest JWT & profile
- `GET /api/v1/auth/me` -> Get current user profile (Auth Bearer)
- `PUT /api/v1/auth/profile` -> Update current user profile (Auth Bearer)

## Core Safety Endpoints
- `GET /api/v1/safety/metrics` -> Live crowd, traffic, weather metrics
- `POST /api/v1/sos/dispatch` -> Emergency SOS dispatch trigger
- `GET /api/v1/sos/:incidentId` -> SOS incident status
- `POST /api/v1/ai/safety-assistant` -> Kumbh Mitra AI assistant chatbot query

## POIs, Temples, Alerts & Cases
- `GET /api/v1/pois` -> List safety POIs (optional `?category=`, `?area=`)
- `GET /api/v1/pois/:id` -> Single POI detail
- `GET /api/v1/temples` -> Temple directory & Aarti schedules
- `GET /api/v1/temples/:id` -> Single temple detail
- `GET /api/v1/alerts` -> Live safety alerts (`?severity=`, `?category=`)
- `GET /api/v1/cases` -> Lost person cases (`?status=`)
- `POST /api/v1/cases` -> Report missing person
- `PUT /api/v1/cases/:id` -> Update missing person case status (Auth)

## Pilgrim Seva Grid
- `GET /api/v1/services/water-stations` -> Water kiosks with tank %
- `GET /api/v1/services/drone-units` -> Rescue drones with battery & status
- `GET /api/v1/services/shuttle-routes` -> E-Shuttle routes with active buses
- `GET /api/v1/services/food` -> Free Mahaprasad & Langar halls
