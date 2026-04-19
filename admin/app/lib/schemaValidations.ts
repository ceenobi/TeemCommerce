import { z } from "zod";

export const ErrorSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  details: z
    .array(
      z.object({
        message: z.string(),
        path: z.array(z.string()),
      }),
    )
    .optional(),
});

export const signInSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});
export type SigninFormSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

export type SignupFormSchema = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address",
  }),
});

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters long",
  }),
});

export type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;

export const onboardingStoreSchema = z.object({
  storeName: z.string().min(2, {
    message: "Store name must be at least 2 characters long",
  }),
  industry: z.string().min(1, {
    message: "Please select an industry",
  }),
  storeUrl: z
    .string()
    .min(3, {
      message: "Store URL must be at least 3 characters long",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "URL can only contain lowercase letters, numbers, and hyphens",
    }),
});
export type OnboardingStoreSchema = z.infer<typeof onboardingStoreSchema>;

export const onboardingBrandingSchema = z.object({
  brandPrimary: z.string().min(4, {
    message: "Please enter a valid hex color",
  }),
  brandSecondary: z.string().min(4, {
    message: "Please enter a valid hex color",
  }),
});
export type OnboardingBrandingSchema = z.infer<typeof onboardingBrandingSchema>;

export const onboardingShippingSchema = z.object({
  shippingStandard: z.string().min(1, {
    message: "Please enter a standard shipping rate",
  }),
  shippingExpress: z.string().min(1, {
    message: "Please enter an express shipping rate",
  }),
  freeShippingThreshold: z.string().min(1, {
    message: "Please enter a free shipping threshold",
  }),
});
export type OnboardingShippingSchema = z.infer<typeof onboardingShippingSchema>;
