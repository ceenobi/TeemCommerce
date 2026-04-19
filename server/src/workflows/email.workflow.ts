import emailService from "../email/send-email.js";
import logger from "../config/logger.js";
import { type User } from "../config/better-auth.js";

export const sendVerifyAccountWorkflow = async (context: any) => {
  const { user, otp } = context.requestPayload as {
    user: User;
    otp: string;
  };

  await context.run("send-email", async () => {
    try {
      await emailService.sendVerificationEmail({ user, otp });
    } catch (error: any) {
      logger.error(
        `Workflow failed to send email for user ${user.email}:`,
        error,
      );
      throw error; // Rethrow to trigger retry
    }
  });
};
