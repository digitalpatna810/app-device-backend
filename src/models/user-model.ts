import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId | string;
  firstName: string;
  lastName: string;
  deviceId: string;
  phoneNumber?: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  refreshToken?: string;
  role: UserRole;
}

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long."],
      maxlength: [20, "First name cannot exceed 50 characters."],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long."],
      maxlength: [20, "Last name cannot exceed 50 characters."],
    },

    deviceId: {
      type: String,
      // required: [true, "Device ID is required."],
      unique: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
      trim: true,
      // match: [/^\d{10}$/, "Phone number must be a valid 10-digit number."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    profileImage: {
      url: { type: String, required: false },
      public_id: { type: String, required: false },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verificationTokenExpiry: {
      type: Date,
      default: null, 
    },

    refreshToken: {
      type: String,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },

   { timestamps: true });


export const User = mongoose.model<IUser>("User", userSchema);