import { initClient } from "@ts-rest/core";
import { authContract } from "~/contract/auth.contract";
import { uploadContract } from "~/contract/upload.contract";
import { vendorContract } from "~/contract/vendor.contract";

const normalizeOrigin = (value: string) => value.replace(/\/?api\/?$/, "");

const getBaseUrl = () => {
  const origin = normalizeOrigin(
    import.meta.env.VITE_BASE_URL || "http://localhost:5600",
  );
  return typeof document === "undefined" ? origin : "";
};

const combinedContract = {
  ...authContract,
  ...uploadContract,
  ...vendorContract,
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
