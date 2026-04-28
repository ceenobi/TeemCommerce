import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  vendorId: string;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  phone: string;
  role: "customer" | "vendor" | "staff" | "admin";
  gender?: "male" | "female" | "other";
  isOnboarded: boolean;
  newsletter: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    vendorId: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "staff", "admin"],
      default: "customer",
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserSchema.index({ name: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ isOnboarded: 1 });
UserSchema.index({ newsletter: 1 });

const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "user");

export default User;
