import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import buildRoutes from "./server/routes/buildRoutes.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("Backend GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
  console.log("Backend API_KEY present:", !!process.env.API_KEY);
  console.log("Backend GOOGLE_API_KEY present:", !!process.env.GOOGLE_API_KEY);


  // Add headers for WebContainers
  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.use("/api/build", buildRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files except index.html
    app.use(express.static("dist", { index: false }));
    
    // Serve index.html with injected env vars
    app.get("*", async (req, res) => {
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        let template = await fs.readFile(path.resolve("dist/index.html"), "utf-8");
        
        // Inject process.env.GEMINI_API_KEY
        const script = `<script>window.process = { env: { GEMINI_API_KEY: "${process.env.GEMINI_API_KEY || ''}" } };</script>`;
        template = template.replace("</head>", `${script}</head>`);
        
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        res.status(500).end(e.message);
      }
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
