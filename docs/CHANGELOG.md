# KumbhRakshak — Change Log

## [2026-08-22]

### Added
- Modular Node.js/Express backend in `backend/`.
- 10 Mongoose schemas (User, SafetyPoi, Temple, SafetyAlert, LostPersonCase, SOSIncident, WaterStation, DroneUnit, ShuttleRoute, FoodService).
- JWT Authentication controller & service supporting 4 login modes (Phone OTP, Pilgrim Pass ID, Official Badge, Guest).
- Centralized Error Handler, Helmet security headers, CORS, Joi validators, Winston logger, and rate limiters.
- AI Assistant service integrating Google Gemini API (`@google/genai`).
- Seed script (`backend/src/seeds/seedData.js`) populating initial dataset from `mockData.ts`.
- Integrated `backend/src/app.js` with root `server.ts` preserving Vite dev middleware.
- Full Jest + Supertest integration test suite (`backend/tests/integration.test.js`).
