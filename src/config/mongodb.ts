import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error("MongoDB URI not defined in .env file");
      }
  
      await mongoose.connect(uri);
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  };

export default connectDB;