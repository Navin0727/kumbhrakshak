# KumbhRakshak — Database Schema

## Collections
1. **users**: User profile, phone, role, pilgrimId, medical vault.
2. **safetypois**: POIs (hospital, police, petrol, water, drone, shuttle, food).
3. **temples**: Temples, aarti schedules, darshan timings.
4. **safetyalerts**: System & safety alerts (crowd, traffic, weather, aarti).
5. **lostpersoncases**: Missing person reports & status tracking.
6. **sosincidents**: Emergency SOS triggers and responder assignments.
7. **waterstations**: RO kiosks, tank level %, dispenser count.
8. **droneunits**: Drone patrol units, telemetry, battery %.
9. **shuttleroutes**: Electric shuttle routes & vehicle tracking.
10. **foodservices**: Annakshetra & Langar free food services.

## Indexes
- `users`: `phoneNumber` (index), `pilgrimId` (unique)
- `safetypois`: `category` (index), `area` (index)
- `safetyalerts`: `severity` (index), `isActive` (index)
- `lostpersoncases`: `status` (index)
- `sosincidents`: `incidentId` (unique), `status` (index)
