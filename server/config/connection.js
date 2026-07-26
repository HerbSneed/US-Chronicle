import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing! Set MONGO_URI in your .env file.");
  process.exit(1);
}

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);  // ✅ Removed deprecated options
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
}

// Call the function to establish the connection
connectDB();

// Export the connection
export default mongoose.connection;
