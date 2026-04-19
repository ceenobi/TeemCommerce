import { sendEmail } from "../config/email.server.js";
import { verifyAccountTemplate, forgotPasswordTemplate } from "./templates.js";
import type { User } from "../config/better-auth.js";

const emailService = {
  sendVerificationEmail: async ({ user, otp }: { user: User; otp: string }) => {
    const htmlBody = verifyAccountTemplate(user.name, otp);
    await sendEmail({
      email: user.email,
      subject: "Verify your account",
      message: htmlBody,
    });
  },
  sendForgotPasswordEmail: async ({
    user,
    otp,
  }: {
    user: User;
    otp: string;
  }) => {
    const htmlBody = forgotPasswordTemplate(user.name, otp);
    await sendEmail({
      email: user.email,
      subject: "Forgot your password",
      message: htmlBody,
    });
  },
};

export default emailService;
