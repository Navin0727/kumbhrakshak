# KumbhRakshak — Deployment Guide

## Environment Variables
- `PORT`: Server port (Default: `3000` / `3001`)
- `NODE_ENV`: `development` | `production`
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing tokens
- `GEMINI_API_KEY`: Google Gemini API Key for AI safety assistant
- `OTP_DEMO_MODE`: `true` | `false` (Default: `true`)
- `OTP_DEMO_CODE`: `2027`

## Local Development
```bash
npm run dev
```

## Production Build & Start
```bash
npm run build
npm start
```
