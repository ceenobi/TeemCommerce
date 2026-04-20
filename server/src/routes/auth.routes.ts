import { initServer } from "@ts-rest/express";
import { authContract } from "../contract/auth.contract.js";
import { auth } from "../config/better-auth.js";
import {
  createTsRestSuccess,
  createTsRestError,
} from "../lib/tsRestResponse.js";
import { fromNodeHeaders } from "better-auth/node";
import tryCatchFn from "../lib/tryCatchFn.js";
import { env } from "../config/keys.js";
import { type User as BetterAuthUser } from "../config/better-auth.js";
import logger from "../config/logger.js";
import { generateVendorId } from "../lib/options.js";
import { workflowClient } from "../workflows/client.js";
import { strictLimiter } from "../middleware/rateLimit.middleware.js";

const forwardAuthHeaders = (res: any, headers: Headers) => {
  const getSetCookie = (headers as any).getSetCookie?.bind(headers as any);
  const setCookies =
    typeof getSetCookie === "function"
      ? getSetCookie()
      : headers.get("set-cookie");

  if (Array.isArray(setCookies)) {
    for (const cookie of setCookies) {
      res.append("set-cookie", cookie);
    }
  } else if (typeof setCookies === "string" && setCookies.length > 0) {
    res.setHeader("set-cookie", setCookies);
  }

  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    res.setHeader(key, value);
  });
};

export const getAuthRouter = () => {
  const s = initServer();

  return s.router(authContract, {
    health: async () => {
      return {
        status: 200 as const,
        body: {
          status: "success" as const,
          message: "Server is healthy",
          environment: env.nodeEnv!,
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        },
      };
    },
    auth: {
      createUser: {
        middleware: [strictLimiter],
        handler: tryCatchFn(async ({ req, res }) => {
          const { email, name, password } = req.body;
          const authResponse = await auth.api.signUpEmail({
            body: {
              name,
              email,
              password,
              vendorId: generateVendorId(),
              callbackURL: `${env.clientUrl}/account/verify-email`,
            },
            headers: fromNodeHeaders(req.headers),
            returnHeaders: true,
            asResponse: true,
          });

          if (!authResponse.ok) {
            const errorData: any = await authResponse.json().catch(() => ({}));
            logger.error("Failed to register user:", errorData);
            return createTsRestError(
              400,
              errorData.message || "Registration failed",
              errorData?.details || [],
            );
          }
          forwardAuthHeaders(res, authResponse.headers);
          return createTsRestSuccess(201, {
            success: true,
            message: "Registered successfully",
          });
        }),
      },
    },
  });
};
