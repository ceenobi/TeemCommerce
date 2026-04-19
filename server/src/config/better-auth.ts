import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { connectToDB } from "./db.server.js";
import { env } from "./keys.js";
import emailService from "../email/send-email.js";
import logger from "./logger.js";

await connectToDB();

export const auth = betterAuth({
  appName: "TEEMCOMMERCE",
  database: mongodbAdapter(mongoose.connection.db as any, {
    client: mongoose.connection.getClient() as any,
    transaction: false,
  }),
  trustedOrigins: ["http://localhost:5500", env.clientUrl].filter(
    Boolean,
  ) as string[],
  baseURL:
    env.nodeEnv === "production" ? `${env.clientUrl}` : "http://localhost:5600",
  session: {
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Hardened for production
    onPasswordReset: async ({ user }, request) => {
      //await emailService.sendResetPasswordSuccessEmail(user as User);
    },
    resetPasswordTokenExpiresIn: 60 * 15, // 15 minutes
    asResponse: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    asResponse: true,
    emailVerificationTokenExpiresIn: 60 * 15, // 15 minutes
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, token }) => {
        const confirmUrl = `${env.serverUrl}/api/v1/auth/verify-email?token=${token}`;
        // await emailService.sendConfirmChangeEmail(
        //   user as User,
        //   newEmail,
        //   confirmUrl,
        // );
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token }) => {
        const confirmUrl = `${env.serverUrl}/api/v1/auth/confirm-delete-account?token=${token}`;
        //await emailService.sendConfirmDeleteEmail(user as User, confirmUrl);
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: true,
        enum: ["customer", "vendor", "staff", "admin"],
        defaultValue: "customer",
      },
      isOnboarded: {
        type: "boolean",
        defaultValue: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      vendorId: {
        type: "string",
        required: true,
      },
      newsletter: {
        type: "boolean",
        input: true,
        defaultValue: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "__teemcommerce",
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: env.nodeEnv === "production",
      httpOnly: true,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        const db = mongoose.connection.db as any;

        const emailTask = (async () => {
          try {
            const user = await db.collection("users").findOne({ email });
            if (!user) {
              logger.warn(`OTP requested for non-existent user: ${email}`);
              return;
            }
            if (type === "sign-in") {
              // Send sign-in OTP if implemented
            } else if (type === "email-verification") {
              await emailService.sendVerificationEmail({ user, otp });
            } else {
              await emailService.sendForgotPasswordEmail({ user, otp });
            }
          } catch (error) {
            logger.error("Background email task failed:", error);
          }
        })();

        // Use waitUntil if available (standard in Better Auth request object on serverless)
        if (request && "waitUntil" in request) {
          (request as any).waitUntil(emailTask);
        }
      },
      sendVerificationOnSignUp: true,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;

// Extend the User type to include custom fields
export type User = typeof auth.$Infer.Session.user & {
  role: string;
  isOnboarded: boolean;
  phone?: string;
  vendorId: string;
  newsletter: boolean;
};
