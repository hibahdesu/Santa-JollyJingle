// lib/mongoose.ts
import mongoose from 'mongoose';

const connectToDatabase = async () => {
  // Check if already connected or in the process of connecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const startTime = Date.now();  // Start time for the MongoDB connection attempt

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);

    const endTime = Date.now();  // End time after connection is successful
    const timeTaken = endTime - startTime;  // Time taken for the connection

    console.log(`MongoDB connected in ${timeTaken} ms`);
  } catch (error) {
    const endTime = Date.now();  // End time if the connection fails
    const timeTaken = endTime - startTime;

    console.error(`Error connecting to MongoDB in ${timeTaken} ms:`, error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectToDatabase;
