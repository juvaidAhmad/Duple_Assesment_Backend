const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please ensure:');
    console.error('1. You have created a .env file in the backend directory');
    console.error('2. MONGODB_URI is set in your .env file');
    console.error('3. MongoDB is running (if using local MongoDB)');
    process.exit(1);
  }
};

module.exports = connectDB;
