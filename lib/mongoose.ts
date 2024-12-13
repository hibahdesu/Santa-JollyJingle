import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000, // Timeout for establishing connection
      socketTimeoutMS: 45000,  // Timeout for inactivity, i.e., socket gets closed after 45 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // Timeout for selecting the server, useful in case of network latency
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectToDatabase;
