# KumbhRakshak — Backend Requirements

## Requirements Matrix

### REQ-001: User Authentication & Profile
- **Description**: Support 3 login modes: Phone OTP (demo 2027 code), Pilgrim Pass ID, Official Badge number, and Guest access. Provide profile retrieval and update APIs with medical emergency details (blood group, allergies, conditions, emergency contact).
- **Priority**: High
- **Backend Impact**: User Model, JWT Authentication, Auth Routes & Controllers.
- **Status**: Implemented

### REQ-002: Live Safety Metrics & Crowd Monitoring
- **Description**: Serve real-time safety metrics including crowd status, traffic grid level, water quality index, estimated pilgrims, and weather conditions.
- **Priority**: High
- **Backend Impact**: Safety Metrics API endpoint.
- **Status**: Implemented

### REQ-003: Emergency SOS Dispatch
- **Description**: Accept one-tap emergency SOS triggers, assign responder sectors, estimate response ETA, notify control room, and return structured incident details.
- **Priority**: High
- **Backend Impact**: SOSIncident Model, SOS Dispatch API, Rate limiting.
- **Status**: Implemented

### REQ-004: Kumbh Mitra AI Safety Assistant
- **Description**: Multi-lingual AI safety & emergency chatbot powered by Gemini API with reliable fallback responses when API keys are unconfigured.
- **Priority**: High
- **Backend Impact**: AI Assistant Controller, Gemini API integration, System prompts.
- **Status**: Implemented

### REQ-005: Safety Points of Interest (POIs) & Interactive Map
- **Description**: Serve categorized POIs (Hospitals, Police Booths, Petrol Pumps, Water Stations, Drone Rescue, E-Shuttle Hubs, Food Annakshetras) with geo-coordinates and search/filter.
- **Priority**: High
- **Backend Impact**: SafetyPoi Model & Data API.
- **Status**: Implemented

### REQ-006: Temple & Aarti Schedule Directory
- **Description**: Provide temple listings, darshan timings, detailed Aarti schedules with crowd levels, and safety guidelines for pilgrims.
- **Priority**: Medium
- **Backend Impact**: Temple Model & API.
- **Status**: Implemented

### REQ-007: Real-Time Safety Alerts
- **Description**: Serve categorized alerts (CROWD, TRAFFIC, WEATHER, AARTI, MEDICAL) with severity levels (critical, warning, info, safe) and action guidance.
- **Priority**: High
- **Backend Impact**: SafetyAlert Model & Alert API.
- **Status**: Implemented

### REQ-008: Lost & Found / Reunion Tracker
- **Description**: Allow searching active missing person cases, submitting new lost person reports, and updating investigation/reunion statuses.
- **Priority**: High
- **Backend Impact**: LostPersonCase Model, CRUD APIs.
- **Status**: Implemented

### REQ-009: Pilgrim Seva & Rescue Grid (Water, Drone, Shuttle, Food)
- **Description**: Detailed API endpoints for 24/7 Pilgrim services: Water Stations with tank levels, Aerial Drone units with flight telemetry, E-Shuttle routes with active vehicle ETAs, and Free Food Annakshetras.
- **Priority**: Medium
- **Backend Impact**: WaterStation, DroneUnit, ShuttleRoute, FoodService Models & Service APIs.
- **Status**: Implemented
