import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON payload parser
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Persistence file location in project directory
  const DATA_DIR = path.join(process.cwd(), 'data');
  const DATA_FILE = path.join(DATA_DIR, 'bosp_database.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // In-memory version and modification tracking for high-frequency synchronization
  let currentVersion = 1;
  let lastSavedAt = new Date().toISOString();
  let lastModifiedBy: {
    userId?: string;
    nama?: string;
    role?: string;
    action?: string;
    timestamp?: string;
  } | null = null;

  // Initialize version from existing disk file if available
  try {
    if (fs.existsSync(DATA_FILE)) {
      const existingRaw = fs.readFileSync(DATA_FILE, 'utf-8');
      const existingData = JSON.parse(existingRaw);
      if (typeof existingData.version === 'number') {
        currentVersion = existingData.version;
      }
      if (existingData.savedAt) {
        lastSavedAt = existingData.savedAt;
      }
      if (existingData.lastModifiedBy) {
        lastModifiedBy = existingData.lastModifiedBy;
      }
    }
  } catch (initErr) {
    console.warn('Notice: Could not parse initial database file:', initErr);
  }

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), version: currentVersion });
  });

  // Fast lightweight sync status check (for real-time polling every 2-3 seconds)
  app.get("/api/bosp-data/status", (_req, res) => {
    res.json({
      success: true,
      version: currentVersion,
      savedAt: lastSavedAt,
      lastModifiedBy
    });
  });

  // Load persistent BOSP state
  app.get("/api/bosp-data", (_req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return res.json({
          success: true,
          data: parsed,
          version: currentVersion,
          lastModifiedBy,
          savedAt: lastSavedAt,
          source: 'server-disk'
        });
      }
      return res.json({
        success: true,
        data: null,
        version: currentVersion,
        lastModifiedBy: null,
        source: 'none'
      });
    } catch (err: any) {
      console.error('Error reading bosp-data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save persistent BOSP state (auto-save from any browser/device)
  app.post("/api/bosp-data", (req, res) => {
    try {
      const payload = req.body || {};
      currentVersion += 1;
      lastSavedAt = new Date().toISOString();

      if (payload.modifiedBy) {
        lastModifiedBy = {
          ...payload.modifiedBy,
          timestamp: lastSavedAt
        };
      }

      const dataToSave = {
        ...payload,
        version: currentVersion,
        savedAt: lastSavedAt,
        lastModifiedBy
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
      return res.json({
        success: true,
        version: currentVersion,
        savedAt: lastSavedAt,
        lastModifiedBy
      });
    } catch (err: any) {
      console.error('Error saving bosp-data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Download complete school backup JSON
  app.get("/api/bosp-data/export", (_req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="BOSP_SMPN7_Sentani_Backup_2026.json"');
        res.setHeader('Content-Type', 'application/json');
        return res.send(content);
      }
      return res.status(404).json({ success: false, message: 'Belum ada data tersimpan di server' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server BOSP running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
