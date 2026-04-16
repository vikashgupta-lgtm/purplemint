import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://vikashg802207:fsL1ZpRE8v6wWVSP@project.wrbptzb.mongodb.net/?retryWrites=true&w=majority&appName=project');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
