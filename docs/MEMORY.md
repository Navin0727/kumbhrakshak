# PROJECT MEMORY

## Project Folder Structure
```text
kumbhrakshak-main/
│
├── frontend/                 # Decoupled Frontend App
│   ├── src/                  # React components, pages, hooks, types
│   ├── assets/               # Images, icons, static assets
│   ├── index.html            # HTML entry point
│   ├── vite.config.ts        # Vite config with backend proxy
│   ├── tsconfig.json         # TypeScript config
│   └── package.json          # Frontend dependencies
│
├── backend/                  # Decoupled Backend API
│   ├── src/
│   │   ├── config/           # DB, Env, Logger config
│   │   ├── controllers/      # Auth, SOS, AI, Data controllers
│   │   ├── services/         # Business logic & Gemini AI integration
│   │   ├── models/           # 10 Mongoose models
│   │   ├── middlewares/      # JWT Auth, Joi Validation, Rate Limiters, Error Handler
│   │   ├── routes/           # REST API routes
│   │   ├── seeds/            # Database seed script
│   │   └── server.js         # Standalone backend server entry (Port 5000)
│   ├── tests/                # Integration tests
│   ├── .env.example          # Environment variables template
│   └── package.json          # Backend dependencies
│
├── docs/                     # Persistent AI Context documentation
├── server.ts                 # Integrated single-port server (optional)
└── package.json              # Root script runner
```

## Commands
- **Backend**: `npm run dev:backend` (runs standalone API on http://localhost:5000)
- **Frontend**: `npm run dev:frontend` (runs Vite UI on http://localhost:3000)
- **Integrated Server**: `npm run dev` (runs single server on http://localhost:3000)
- **Seed Data**: `npm run seed`
