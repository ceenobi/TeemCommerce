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
    message: "Email is required",
  }),
  password: z
    .string({
      message: "Password is required",
    })
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
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    }),
});
export type SignInFormSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z
    .string({
      message: "Full name is required",
    })
    .min(3, {
      message: "Full name must be at least 3 characters long",
    }),
  email: z.email({
    message: "Email is required",
  }),
  password: z
    .string({
      message: "Password is required",
    })
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
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    }),
});

export type SignupFormSchema = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
});

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  otp: z
    .string({
      message: "OTP is required",
    })
    .length(6, {
      message: "OTP must be 6 digits",
    }),
  newPassword: z
    .string({
      message: "Password is required",
    })
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
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
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
  activeRegions: z.array(z.string()).default([]),
  stripeEnabled: z.boolean().default(false),
  paypalEnabled: z.boolean().default(false),
});
export type OnboardingShippingSchema = z.infer<typeof onboardingShippingSchema>;

export const kycSchema = z.object({
  taxId: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  verificationType: z.enum(["NIN", "Passport", "BusinessRegistration"]),
  documents: z
    .array(
      z.object({
        documentUrl: z.string(),
        documentType: z.string(),
      }),
    )
    .min(1, "At least one document is required"),
});
export type KycSchema = z.infer<typeof kycSchema>;

export const verifyEmailSchema = z.object({
  otp: z
    .string({
      message: "OTP is required",
    })
    .length(6, {
      message: "OTP must be 6 digits",
    }),
});
export type VerifyEmailTypeSchema = z.infer<typeof verifyEmailSchema>;

export const userSchema = z.preprocess(
  (arg: any) => {
    if (typeof arg === "object" && arg !== null) {
      return {
        ...arg,
        id: arg.id || arg._id,
      };
    }
    return arg;
  },
  z.object({
    id: z.any(),
    email: z.email(),
    name: z.string(),
    role: z.string(),
    vendorId: z.string(),
    emailVerified: z.boolean(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    isOnboarded: z.boolean().optional(),
    phone: z
      .string()
      .refine(
        (num) => num === "" || /^\+\d{10,15}$/.test(num),
        "Invalid phone number",
      )
      .optional(),
  }),
);
export type UserData = z.infer<typeof userSchema>;

export const UploadSchema = z.object({
  files: z.array(z.string()).min(1, {
    message: "At least one file is required",
  }),
  folder: z.string().min(1, {
    message: "Folder is required",
  }),
});
export type UploadFormData = z.infer<typeof UploadSchema>;

export const DeleteMediaSchema = z.object({
  publicIds: z.array(z.string()).min(1, {
    message: "At least one public ID is required",
  }),
});
export type DeleteMediaData = z.infer<typeof DeleteMediaSchema>;
