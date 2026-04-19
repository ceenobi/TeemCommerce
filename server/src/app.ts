import * as Sentry from "@sentry/node";
import { env } from "./config/keys.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createExpressEndpoints } from "@ts-rest/express";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/better-auth.js";
import { gracefulShutdown } from "./config/db.server.js";
import logger from "./config/logger.js";
import { compressionOptions, helmetOptions } from "./lib/options.js";
import {
  globalLimiter,
  strictLimiter,
} from "./middleware/rateLimit.middleware.js";
import { authContract } from "./contract/auth.contract.js";
import { getAuthRouter } from "./routes/auth.routes.js";

declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
      rawBody?: Buffer;
    }
  }
}

const app = express();
// Trust first proxy (for production/ngrok)
app.set("trust proxy", 1);

const allowedOrigins = ["http://localhost:5500", env.clientUrl].filter(
  Boolean,
) as string[];

// DEBUG: Log the allowed origins at startup
logger.info(`CORS: Allowed origins configured: ${allowedOrigins.join(", ")}`);

// // Add production URL if not already included
if (env.nodeEnv === "production") {
  if (!env.clientUrl || !env.serverUrl) {
    logger.warn("CORS: clientUrl or serverUrl not defined in production!");
  }
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      logger.info("CORS: Allowing request with no origin");
      return callback(null, true);
    }

    // In development, allow all for easier testing, but still prefer defined origins
    if (env.nodeEnv === "development") {
      logger.info("CORS: Development mode - allowing all origins");
      return callback(null, true);
    }

    // Strict origin matching for production - check exact match first
    if (allowedOrigins.includes(origin)) {
      logger.info(`CORS: Origin ${origin} is allowed (exact match)`);
      return callback(null, true);
    }

    // Allow ALL Vercel preview/production deployments (both .vercel.app and custom domains)
    // This is more permissive to handle all Vercel deployment patterns
    if (
      // Match any .vercel.app domain (covers preview, production, staging, etc.)
      origin.match(/^[\w-]+:\/\/[\w.-]+\.vercel\.app$/) ||
      // Also match direct vercel.app patterns without protocol prefix issues
      origin.includes(".vercel.app") ||
      // Allow localhost for testing
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
      // DEBUG: Also allow bcc007pay-server.vercel.app explicitly
      //origin === "https://bcc007pay-server.vercel.app"
    ) {
      logger.info(`CORS: Allowing Vercel/localhost deployment: ${origin}`);
      return callback(null, true);
    }

    // Allow if the origin matches the server's own domain (for same-origin requests)
    if (env.serverUrl && origin === env.serverUrl) {
      logger.info(`CORS: Allowing same origin (server URL): ${origin}`);
      return callback(null, true);
    }

    // Reject requests from other origins
    logger.error(
      `Blocked by CORS: ${origin} - Allowed: ${allowedOrigins.join(", ")}`,
    );
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Middlewares use
app.use(cors(corsOptions));
app.use((req, res, next) => {
  // Allow credentials
  res.header("Access-Control-Allow-Credentials", "true");
  // Handle preflight
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(204).end();
  }
  next();
});
app.use(globalLimiter);
app.use(compression(compressionOptions));
app.use(cookieParser());
app.use(helmet(helmetOptions));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static("public"));
app.disable("x-powered-by");

app.all("/api/auth/*splat", strictLimiter, toNodeHandler(auth));
app.use(
  express.json({
    limit: "25mb",
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
// Logging middleware in development
if (env.nodeEnv === "development") {
  app.use(morgan("combined"));
}

// Request time middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

createExpressEndpoints(authContract, getAuthRouter(), app, {
  jsonQuery: true,
  responseValidation: true,
});

// Sentry error handler must be before any other error middleware
Sentry.setupExpressErrorHandler(app);
// Handle 404
app.use(notFound);
// Global error handler (adapted for ts-rest)
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5600;

// Start the server
const startServer = async (): Promise<void> => {
  let server: any;
  try {
    server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`\n✅ Server running in ${env.nodeEnv} mode on port ${PORT}`);
      logger.info(`🌐 http://localhost:${PORT}\n`);
    });
    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: unknown) => {
      console.error("\n❌ UNHANDLED REJECTION! Shutting down...");

      const error =
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : String(reason);

      logger.error("Reason:", error);

      // Close server gracefully
      server.close(() => {
        logger.info("💥 Process terminated due to unhandled rejection");
        process.exit(1);
      });
    });

    // Handle termination signals
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    // Handle any other errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.syscall !== "listen") throw error;

      switch (error.code) {
        case "EACCES":
          logger.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
        case "EADDRINUSE":
          logger.error(`Port ${PORT} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error(`\n❌ Failed to start server: ${errorMessage}`);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
