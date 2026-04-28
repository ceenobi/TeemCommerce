import mongoose, { Document, Schema } from "mongoose";

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  storeUrl: string;
  industry: string;
  vendorEmail: string;
  storeDescription: string;
  currency: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    country: string;
  };
  logo: string;
  logoId: string;
  shopBanner: string;
  shopBannerId: string;
  brandPrimary: string;
  brandSecondary: string;
  isActive: boolean;
  onboardingStep: number;
  subscriptionTier: string;
  maxUsers: number;
  maxInvoices: number;
  shipping: {
    standardRate: string;
    expressRate: string;
    freeShippingThreshold: string;
    activeRegions: string[];
  };
  payments: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    paystackEnabled: boolean;
  };
}

const VendorSchema = new Schema<IVendor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    storeUrl: {
      type: String,
      unique: true,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    vendorEmail: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    storeDescription: {
      type: String,
      default: "Welcome to my store",
    },
    currency: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zip: {
        type: String,
      },
      phone: {
        type: String,
        unique: true,
      },
      country: {
        type: String,
      },
    },
    logo: {
      type: String,
    },
    logoId: {
      type: String,
    },
    shopBanner: {
      type: String,
    },
    shopBannerId: {
      type: String,
    },
    brandPrimary: {
      type: String,
      default: "#006b2f",
    },
    brandSecondary: {
      type: String,
      default: "#fdc003",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    onboardingStep: {
      type: Number,
      default: 1,
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "starter", "pro"],
      default: "free",
    },
    maxUsers: {
      type: Number,
      default: 1,
    },
    maxInvoices: {
      type: Number,
      default: 1,
    },
    shipping: {
      standardRate: String,
      expressRate: String,
      freeShippingThreshold: String,
      activeRegions: [String],
    },
    payments: {
      stripeEnabled: { type: Boolean, default: false },
      paypalEnabled: { type: Boolean, default: false },
      paystackEnabled: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  },
);

const Vendor =
  mongoose.models.Vendor ||
  mongoose.model<IVendor>("Vendor", VendorSchema);

// VendorSchema.index({ storeUrl: 1 });
VendorSchema.index({ isActive: 1 });

export type { IVendor as IVendorModel };
export default Vendor;