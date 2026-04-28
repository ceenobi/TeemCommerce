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
import {
  signUpSchema,
  verifyEmailSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../lib/schemaValidations.js";
import { validateFormData } from "../middleware/formValidate.js";

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
        middleware: [validateFormData(signUpSchema)],
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

          // Read the response body from better-auth
          const responseData = await authResponse.json().catch(() => ({}));

          // Forward auth headers (cookies, etc.) in all cases
          forwardAuthHeaders(res, authResponse.headers);

          if (!authResponse.ok) {
            logger.error("Failed to register user:", responseData);
            // Transform better-auth errors to ts-rest ErrorSchema format
            const errorData: any = await authResponse.json().catch(() => ({}));
            logger.error("Failed to register user:", errorData);
            return createTsRestError(
              400,
              errorData.message || "Registration failed",
              errorData?.details || [],
            );
          }
          return createTsRestSuccess(201, {
            success: true,
            message: "Registration successful",
          });
        }),
      },
      verifyEmail: {
        middleware: [validateFormData(verifyEmailSchema)],
        handler: tryCatchFn(async ({ req, res }) => {
          const { email } = req.query;
          const { otp } = req.body;

          // Verify OTP is valid before attempting email verification
          const verifyOtp = await auth.api.checkVerificationOTP({
            body: {
              email,
              type: "email-verification",
              otp,
            },
          });

          if (!verifyOtp.success) {
            return createTsRestError(400, "Invalid or expired OTP", []);
          }

          const authResponse = await auth.api.verifyEmailOTP({
            body: {
              email,
              otp,
            },
            headers: fromNodeHeaders(req.headers),
            returnHeaders: true,
            asResponse: true,
          });

          // Read the response body from better-auth (only once)
          const responseData = await authResponse.json().catch(() => ({}));

          // Forward auth headers (cookies, etc.) in all cases
          forwardAuthHeaders(res, authResponse.headers);

          if (!authResponse.ok) {
            logger.error("Failed to verify email:", responseData);
            return createTsRestError(
              400,
              responseData.message || "Verification failed",
              responseData?.details || [],
            );
          }

          return createTsRestSuccess(200, {
            success: true,
            message: "Email verified successfully",
          });
        }),
      },
      resendEmailVerification: {
        handler: tryCatchFn(async ({ req, res }) => {
          const { email } = req.body;
          const authResponse = await auth.api.sendVerificationOTP({
            body: {
              email,
              type: "email-verification",
            },
            headers: fromNodeHeaders(req.headers),
            returnHeaders: true,
            asResponse: true,
          });
          // Read the response body from better-auth (only once)
          const responseData = await authResponse.json().catch(() => ({}));
          // Forward auth headers (cookies, etc.) in all cases
          forwardAuthHeaders(res, authResponse.headers);

          if (!authResponse.ok) {
            logger.error("Failed to send otp code:", responseData);
            return createTsRestError(
              400,
              responseData.message || "Failed to send otp code",
              responseData?.details || [],
            );
          }
          return createTsRestSuccess(200, {
            success: true,
            message: "OTP code sent successfully",
          });
        }),
      },
      loginUser: {
        middleware: [validateFormData(signInSchema)],
        handler: tryCatchFn(async ({ req, res }) => {
          const { email, password } = req.body;
          const authResponse = await auth.api.signInEmail({
            body: {
              email,
              password,
              callbackURL: `${env.clientUrl}/dashboard`,
            },
            headers: fromNodeHeaders(req.headers),
            returnHeaders: true,
            asResponse: true,
          });
          if (!authResponse.ok) {
            const errorData: any = await authResponse.json().catch(() => ({}));
            logger.error("Failed to login user:", errorData);
            return createTsRestError(400, errorData.message || "Login failed");
          }
          forwardAuthHeaders(res, authResponse.headers);
          return createTsRestSuccess(200, {
            success: true,
            message: "Login successful",
          });
        }),
      },
      getSession: tryCatchFn(async ({ req, res }) => {
        const response = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
          asResponse: true,
        });
        const session = (await response.json()) as {
          user: BetterAuthUser;
        };
        if (!session || !session.user) {
          return createTsRestError(404, "No active session found");
        }
        forwardAuthHeaders(res, response.headers);
        return createTsRestSuccess(200, session.user);
      }),
      logOutUser: tryCatchFn(async ({ req, res }) => {
        const response = await auth.api.signOut({
          headers: fromNodeHeaders(req.headers),
          asResponse: true,
          returnHeaders: true,
        });
        if (!response.ok) {
          return createTsRestError(404, "No active session found");
        }
        forwardAuthHeaders(res, response.headers);
        return createTsRestSuccess(200, {
          success: true,
          message: "User logged out successfully",
        });
      }),
      forgotPassword: {
        middleware: [validateFormData(forgotPasswordSchema)],
        handler: tryCatchFn(async ({ req }) => {
          const { email } = req.body;
          const authResponse = await auth.api.requestPasswordResetEmailOTP({
            body: {
              email,
            },
            asResponse: true,
          });
          if (!authResponse.ok) {
            const errorData: any = await authResponse.json().catch(() => ({}));
            logger.error("Failed to send password reset otp:", errorData);
            return createTsRestError(
              400,
              errorData.message || "Failed to send password reset otp",
            );
          }
          return createTsRestSuccess(200, {
            success: true,
            message: "Password reset otp has been sent to your email",
          });
        }),
      },
      resetPassword: {
        middleware: [validateFormData(resetPasswordSchema)],
        handler: tryCatchFn(async ({ req, res }) => {
          const { email } = req.query;
          const { otp, newPassword } = req.body;

          // Verify OTP is valid before attempting email verification
          const verifyOtp = await auth.api.checkVerificationOTP({
            body: {
              email,
              type: "forget-password",
              otp,
            },
          });

          if (!verifyOtp.success) {
            return createTsRestError(400, "Invalid or expired OTP", []);
          }

          const authResponse = await auth.api.resetPasswordEmailOTP({
            body: {
              email,
              otp,
              password: newPassword,
            },
            headers: fromNodeHeaders(req.headers),
            returnHeaders: true,
            asResponse: true,
          });

          // Read the response body from better-auth (only once)
          const responseData = await authResponse.json().catch(() => ({}));

          // Forward auth headers (cookies, etc.) in all cases
          forwardAuthHeaders(res, authResponse.headers);

          if (!authResponse.ok) {
            logger.error("Failed to reset password:", responseData);
            return createTsRestError(
              400,
              responseData.message || "Failed to reset password",
              responseData?.details || [],
            );
          }

          return createTsRestSuccess(200, {
            success: true,
            message: "Password reset successfully",
          });
        }),
      },
    },
  });
};
