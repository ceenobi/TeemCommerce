import { initClient } from "@ts-rest/core";
import { authContract } from "~/contract/auth.contract";

const normalizeOrigin = (value: string) => value.replace(/\/?api\/?$/, "");

const getBaseUrl = () => {
  const origin = normalizeOrigin(
    import.meta.env.VITE_BASE_URL || "http://localhost:5600",
  );
  return typeof document === "undefined" ? `${origin}/api` : "/api";
};

const combinedContract = {
  ...authContract,
};

export const apiClient = initClient(combinedContract, {
  baseUrl: getBaseUrl(),
  baseHeaders: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  validateResponse: true,
  jsonQuery: false,
  throwOnUnknownStatus: true,
});
