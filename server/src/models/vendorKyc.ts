import mongoose, { Document, Schema } from "mongoose";

export interface IVendorKYC extends Document {
  vendorId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  verificationType: "NIN" | "Passport" | "BusinessRegistration";
  documents: {
    documentUrl: string;
    documentType: string;
    uploadedAt: Date;
  }[];
  taxId?: string;
  businessRegistrationNumber?: string;
  complianceNotes?: string;
}

const VendorKYCSchema = new Schema<IVendorKYC>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verificationType: {
      type: String,
      enum: ["NIN", "Passport", "BusinessRegistration"],
      required: true,
    },
    documents: [
      {
        documentUrl: { type: String, required: true },
        documentType: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    taxId: {
      type: String,
      trim: true,
    },
    businessRegistrationNumber: {
      type: String,
      trim: true,
    },
    complianceNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const VendorKYC =
  mongoose.models.VendorKYC ||
  mongoose.model<IVendorKYC>("VendorKYC", VendorKYCSchema);

// VendorKYCSchema.index({ vendorId: 1 });
VendorKYCSchema.index({ status: 1 });

export type { IVendorKYC as IVendorKYCModel };
export default VendorKYC;
