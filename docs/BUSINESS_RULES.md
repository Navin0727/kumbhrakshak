# KumbhRakshak — Business Rules

- **BR-001**: Emergency SOS dispatch must be accessible to any user (authenticated or guest) without blocking auth barriers.
- **BR-002**: OTP in demo mode defaults to `2027` if `OTP_DEMO_MODE=true`.
- **BR-003**: Safety POIs, Temples, Alerts, and Seva Grid data must be publicly queryable for fast emergency response.
- **BR-004**: Updating lost person case statuses requires authentication.
- **BR-005**: All user profiles must automatically maintain a valid `emergencyQrCode` URL encoding critical medical information.
