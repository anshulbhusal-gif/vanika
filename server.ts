import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import apiRouter from "./server/src/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;


const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((s) => s.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV !== 'production') return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy violation: origin not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

// Register modular backend API router
app.use('/api', apiRouter);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Vanika - AI Cognitive Care for North East India",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Opportunistic Background Sync Endpoint for Caregiver/ASHA Uploads
app.post("/api/sync", (req, res) => {
  try {
    const { queue, patientId, clientTimestamp } = req.body;
    console.log(`[SyncServer] Received ${queue?.length || 0} offline sync items for patient ${patientId} at ${clientTimestamp}`);
    res.json({
      status: "synced",
      itemsProcessed: queue?.length || 0,
      syncedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("[SyncServer] Sync upload failed:", err);
    res.status(500).json({ error: "Failed to process offline sync upload" });
  }
});

async function startServer() {
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
    console.log(`Vanika Server running on http://localhost:${PORT} (or http://127.0.0.1:${PORT})`);
  });
}

startServer();
