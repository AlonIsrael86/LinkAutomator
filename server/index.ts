import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Initialize Clerk with secret key from environment
if (!process.env.CLERK_SECRET_KEY) {
  console.warn("Warning: CLERK_SECRET_KEY not found in environment variables. Authentication will not work.");
}

const app = express();
// Trust proxy for accurate IP address detection in production
app.set('trust proxy', true);
// Add request body logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api/links') && req.method === 'POST') {
    console.log('=== INCOMING REQUEST ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw body before parsing:', req.body);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log body after parsing
app.use((req, res, next) => {
  if (req.path.startsWith('/api/links') && req.method === 'POST') {
    console.log('Parsed body:', JSON.stringify(req.body, null, 2));
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('========================');
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  console.log(`Starting server on localhost:${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT env var: ${process.env.PORT}`);
  
  server.listen(port, () => {
    log(`serving on port ${port}`);
    console.log(`Server successfully bound to 0.0.0.0:${port}`);
  });
})();
