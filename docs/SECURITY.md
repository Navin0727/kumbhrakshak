# KumbhRakshak — Security Specifications

- **JWT Authentication**: Signed JWTs with standard expiration (`7d`).
- **Rate Limiting**: Rate limits enforced on `/api/` (100 req/15m), `/api/v1/auth` (10 req/15m), and `/api/v1/sos/dispatch` (5 req/5m).
- **Helmet Headers**: Configured to restrict vulnerable headers.
- **Input Sanitization**: Joi schemas strip unknown fields and validate regex patterns.
- **No Secret Exposure**: Passwords, OTP codes, and JWT secrets are excluded from JSON output (`toJSON` transform & `select: false`).
