import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ErrorSchema,
  onboardingStoreSchema,
  onboardingBrandingSchema,
  onboardingShippingSchema,
  kycSchema,
} from "../lib/schemaValidations.js";

const c = initContract();

const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
});

export const vendorContract = c.router({
  vendor: {
    getVendor: {
      method: "GET",
      path: "/api/v1/vendor",
      responses: {
        200: SuccessResponseSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
      summary: "Get current vendor profile",
    },
    updateStore: {
      method: "PATCH",
      path: "/api/v1/vendor/store",
      body: onboardingStoreSchema,
      responses: {
        200: SuccessResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        500: ErrorSchema,
      },
      summary: "Update vendor store details (Step 1)",
    },
    updateBranding: {
      method: "PATCH",
      path: "/api/v1/vendor/branding",
      body: onboardingBrandingSchema,
      responses: {
        200: SuccessResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        500: ErrorSchema,
      },
      summary: "Update vendor branding (Step 2)",
    },
    updateLogistics: {
      method: "PATCH",
      path: "/api/v1/vendor/logistics",
      body: onboardingShippingSchema,
      responses: {
        200: SuccessResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        500: ErrorSchema,
      },
      summary: "Update vendor shipping and payments (Step 4)",
    },
    submitKYC: {
      method: "POST",
      path: "/api/v1/vendor/kyc",
      body: kycSchema,
      responses: {
        201: SuccessResponseSchema,
        200: SuccessResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        500: ErrorSchema,
      },
      summary: "Submit vendor KYC documents",
    },
  },
});

export type VendorContract = typeof vendorContract;
