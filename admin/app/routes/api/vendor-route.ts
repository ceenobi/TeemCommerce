import { apiClient } from "~/lib/apiClient";
import type {
  OnboardingStoreSchema,
  OnboardingBrandingSchema,
  OnboardingShippingSchema,
  KycSchema,
} from "~/lib/schemaValidations";

export const getVendorProfile = async ({ cookie }: { cookie: string }) => {
  return await (apiClient.vendor.getVendor as any)({
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};

export const updateVendorStore = async ({
  validated,
  cookie,
}: {
  validated: OnboardingStoreSchema;
  cookie: string;
}) => {
  return await (apiClient.vendor.updateStore as any)({
    body: validated,
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};

export const updateVendorBranding = async ({
  validated,
  cookie,
}: {
  validated: OnboardingBrandingSchema;
  cookie: string;
}) => {
  return await (apiClient.vendor.updateBranding as any)({
    body: validated,
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};

export const updateVendorLogistics = async ({
  validated,
  cookie,
}: {
  validated: OnboardingShippingSchema;
  cookie: string;
}) => {
  return await (apiClient.vendor.updateLogistics as any)({
    body: validated,
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};

export const submitVendorKYC = async ({
  validated,
  cookie,
}: {
  validated: KycSchema;
  cookie: string;
}) => {
  return await (apiClient.vendor.submitKYC as any)({
    body: validated,
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};