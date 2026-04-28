import { initServer } from "@ts-rest/express";
import { vendorContract } from "../contract/vendor.contract.js";
import {
  createTsRestSuccess,
  createTsRestError,
} from "../lib/tsRestResponse.js";
import tryCatchFn from "../lib/tryCatchFn.js";
import { customRateLimiter } from "../middleware/rateLimit.middleware.js";
import { createRatelimit } from "../config/upstash.js";
import { authorizedRoles, verifyUser } from "../middleware/auth.middleware.js";
import Vendor from "../models/vendor.js";
import VendorKYC from "../models/vendorKyc.js";
import {
  cacheMiddleware,
  invalidateCache,
} from "../middleware/cache.middleware.js";
import { connectMongoDb } from "../config/db.server.js";
import User from "../models/user.js";

export const getVendorRouter = () => {
  const s = initServer();

  return s.router(vendorContract, {
    vendor: {
      getVendor: {
        middleware: [
          verifyUser,
          authorizedRoles("user", "vendor"),
          cacheMiddleware({ ttl: 3600 }),
        ],
        handler: tryCatchFn(async ({ req }) => {
          const userId = req.user?.id;
          if (!userId) {
            return createTsRestError(401, "User not authenticated");
          }

          const vendor = await connectMongoDb(() =>
            Vendor.findOne({ userId }).lean(),
          );
          if (!vendor) {
            return createTsRestError(404, "Vendor profile not found");
          }

          return createTsRestSuccess(200, {
            success: true,
            message: "Vendor retrieved successfully",
            data: vendor,
          });
        }),
      },
      updateStore: {
        middleware: [verifyUser, authorizedRoles("user", "vendor")],
        handler: tryCatchFn(async ({ req, body }) => {
          const userId = req.user?.id;
          if (!userId) {
            return createTsRestError(401, "User not authenticated");
          }

          const { storeName, industry, storeUrl } = body;

          // We create a new vendor or update existing
          const vendor = await connectMongoDb(() =>
            Vendor.findOneAndUpdate(
              { userId },
              {
                storeName,
                industry,
                storeUrl,
                onboardingStep: 2, // Proceeding to step 2 after this
              },
              { new: true, upsert: true },
            ),
          );
          await invalidateCache("cache:/api/v1/vendor");
          return createTsRestSuccess(200, {
            success: true,
            message: "Store details updated successfully",
            data: vendor,
          });
        }),
      },

      updateBranding: {
        middleware: [verifyUser, authorizedRoles("user", "vendor")],
        handler: tryCatchFn(async ({ req, body }) => {
          const userId = req.user?.id;
          if (!userId) {
            return createTsRestError(401, "User not authenticated");
          }

          const { brandPrimary, brandSecondary } = body;

          const vendor = await connectMongoDb(() =>
            Vendor.findOneAndUpdate(
              { userId },
              {
                brandPrimary,
                brandSecondary,
                $max: { onboardingStep: 3 }, // Move to step 3, but don't regress if they are already past it
              },
              { new: true },
            ),
          );
          if (!vendor) {
            return createTsRestError(
              404,
              "Vendor profile not found. Complete Store Setup first.",
            );
          }
          await invalidateCache("cache:/api/v1/vendor");
          return createTsRestSuccess(200, {
            success: true,
            message: "Branding updated successfully",
            data: vendor,
          });
        }),
      },

      updateLogistics: {
        middleware: [verifyUser, authorizedRoles("user", "vendor")],
        handler: tryCatchFn(async ({ req, body }) => {
          const userId = req.user?.id;
          if (!userId) {
            return createTsRestError(401, "User not authenticated");
          }

          const vendor = await connectMongoDb(() =>
            Vendor.findOneAndUpdate(
              { userId },
              {
                shipping: {
                  standardRate: body.shippingStandard,
                  expressRate: body.shippingExpress,
                  freeShippingThreshold: body.freeShippingThreshold,
                  activeRegions: body.activeRegions,
                },
                payments: {
                  stripeEnabled: body.stripeEnabled,
                  paypalEnabled: body.paypalEnabled,
                  paystackEnabled: body.paystackEnabled,
                },
                $max: { onboardingStep: 4 }, // Finished onboarding payload
              },
              { new: true },
            ),
          );

          if (!vendor) {
            return createTsRestError(
              404,
              "Vendor profile not found. Complete Store Setup first.",
            );
          }
          await invalidateCache("cache:/api/v1/vendor");

          // Optional: You could update the User's `isOnboarded` status here using Better Auth or Mongoose
          await connectMongoDb(() =>
            User.findByIdAndUpdate(
              req.user?.id,
              {
                isOnboarded: true,
              },
              { returnDocument: "after" },
            ),
          );
          return createTsRestSuccess(200, {
            success: true,
            message: "Logistics and payments updated successfully",
            data: vendor,
          });
        }),
      },

      submitKYC: {
        middleware: [
          customRateLimiter(createRatelimit(10, "15 m", "kyc")), // stricter limit for KYC
          verifyUser,
          authorizedRoles("user", "vendor"),
        ],
        handler: tryCatchFn(async ({ req, body }) => {
          const userId = req.user?.id;
          if (!userId) {
            return createTsRestError(401, "User not authenticated");
          }

          const vendor = await connectMongoDb(() => Vendor.findOne({ userId }));
          if (!vendor) {
            return createTsRestError(
              404,
              "Vendor profile not found. Complete Store Setup first.",
            );
          }

          const kyc = await connectMongoDb(() =>
            VendorKYC.findOneAndUpdate(
              { vendorId: vendor._id },
              {
                ...body,
                status: "pending", // Always reset to pending on new submission
              },
              { new: true, upsert: true },
            ),
          );

          return createTsRestSuccess(200, {
            success: true,
            message: "KYC documents submitted successfully",
            data: kyc,
          });
        }),
      },
    },
  });
};
