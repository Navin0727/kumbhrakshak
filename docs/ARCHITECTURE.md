# KumbhRakshak — Architecture

## Data Flow
```text
Client (React / Vite Frontend)
   ↓
Express Router (/api/v1/ and /api/ compatibility)
   ↓
Rate Limiters & Auth Middlewares (JWT Verification, Joi Validation)
   ↓
Controllers (HTTP Status Codes & Response Formatting)
   ↓
Services (Business Logic & External Integrations like Gemini AI)
   ↓
Mongoose ODM Models
   ↓
MongoDB Database
```

## Security & Middleware Layers
- **Helmet**: HTTP Security Headers
- **CORS**: Domain access control
- **Rate Limiters**: General (100 req/15m), Auth (10 req/15m), SOS (5 req/5m)
- **Centralized Error Handler**: Handles Joi, Mongoose, JWT, and custom ApiErrors with no production stack leaks.
