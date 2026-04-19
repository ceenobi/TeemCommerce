import { Request, Response, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { generalRatelimit, strictRatelimit } from "../config/upstash.js";
import { createTsRestError } from "../lib/tsRestResponse.js";
import logger from "../config/logger.js";

/**
 * Internal handler to process ratelimit logic
 * @param ratelimit Ratelimit instance to use
 * @param req Express request
 * @param res Express response
 * @param next Next function
 */
const handleRatelimit = async (
  ratelimit: Ratelimit,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
  
  // Use IP + User Agent as identifier for better granularity
  const identifier = `${ip}-${req.headers["user-agent"] || "unknown"}`;

  try {
    const { success, limit, remaining, reset, pending } = await ratelimit.limit(
      identifier
    );

    // Set standard rate limit headers
    res.setHeader("X-RateLimit-Limit", limit.toString());
    res.setHeader("X-RateLimit-Remaining", remaining.toString());
    res.setHeader("X-RateLimit-Reset", reset.toString());

    // Await analytics sync as requested (ensures data is sent before Vercel process terminates)
    await pending;

    if (!success) {
      logger.warn(`Rate limit exceeded for identifier: ${identifier}`);
      
      const error = createTsRestError(
        429,
        "Too many requests. Please try again later.",
        { 
          resetAt: new Date(reset).toISOString(),
          retryAfter: Math.ceil((reset - Date.now()) / 1000)
        }
      );
      
      return res.status(429).json(error.body);
    }

    next();
  } catch (error) {
    logger.error("Rate limiting encountered an error:", error);
    // Fail open: if ratelimit service is down, allow the request to pass
    next();
  }
};

/**
 * General API rate limiter (100 requests per minute)
 * Ideal for top-level usage on all API routes.
 */
export const globalLimiter = (req: Request, res: Response, next: NextFunction) => {
  handleRatelimit(generalRatelimit, req, res, next);
};

/**
 * Strict rate limiter for sensitive routes (10 requests per minute)
 * Ideal for Auth, Payments, or expensive calculations.
 */
export const strictLimiter = (req: Request, res: Response, next: NextFunction) => {
  handleRatelimit(strictRatelimit, req, res, next);
};

/**
 * Higher-order function to create a middleware from a custom Ratelimit instance
 * @param ratelimit A custom configured Ratelimit instance
 */
export const customRateLimiter = (ratelimit: Ratelimit) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handleRatelimit(ratelimit, req, res, next);
  };
};
