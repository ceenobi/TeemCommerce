import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const getBaseUrl = () => {
  const url = import.meta.env.VITE_BASE_URL || "http://localhost:5600";
  return typeof document === "undefined" ? url : "";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [emailOTPClient()],
});
