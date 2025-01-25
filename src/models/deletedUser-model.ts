import mongoose, { Schema, Document } from "mongoose";
export enum UserRole {
    USER = "user",
    ADMIN = "admin",
  }
export interface IDeletedUser extends Document {
  originalUserId: mongoose.Types.ObjectId | string;
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
  profileImage?: {
    url?: string;
    public_id?: string;
  };
  role: UserRole;
  deletedAt: Date;
}

const deletedUserSchema: Schema = new Schema(
  {
    originalUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    deviceId: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String, required: true },
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
    profileImage: {
      url: { type: String },
      public_id: { type: String },
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DeletedUser = mongoose.model<IDeletedUser>("DeletedUser", deletedUserSchema);
