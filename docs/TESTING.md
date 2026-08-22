# KumbhRakshak — Testing Strategy

## Test Suite
- **Runner**: Jest + Supertest
- **Location**: `backend/tests/`
- **Coverage Target**: >80% for Controllers, Services, Middlewares, and Validators.

## Key Test Scenarios
1. **Authentication Flow**: Request OTP, verify demo OTP (`2027`), issue JWT, get profile.
2. **SOS Dispatch**: Trigger emergency SOS, check incident ID generation & responder assignment.
3. **POI & Temple Data**: Verify public GET endpoints.
4. **Validation & Rate Limiting**: Ensure invalid payloads get HTTP 422 with structured field errors.
