import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  const MONGODB_URI = env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
