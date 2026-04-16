import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { connectDB } from './db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin',
        status: 'active'
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'Manager',
        status: 'active'
      },
      {
        name: 'Regular User 1',
        email: 'user1@example.com',
        password: 'password123',
        role: 'User',
        status: 'active'
      },
      {
        name: 'Regular User 2 (Inactive)',
        email: 'user2@example.com',
        password: 'password123',
        role: 'User',
        status: 'inactive'
      }
    ];

    await User.create(users);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedData();
