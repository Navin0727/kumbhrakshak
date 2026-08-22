import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Import backend app & database config
// @ts-ignore
import { createApp } from "./backend/src/app.js";
// @ts-ignore
import { connectDatabase } from "./backend/src/config/database.js";

dotenv.config();

async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Initialize MongoDB Connection
  await connectDatabase();

  // Create Express App with modular backend routes mounted under /api/v1 and /api
  const app = createApp();

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KumbhRakshak server running on http://localhost:${PORT}`);
  });
}

startServer();

