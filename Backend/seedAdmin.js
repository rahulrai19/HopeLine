import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new User({
        name: 'System Admin',
        email: 'admin@hopeline.com',
        username: 'admin',
        password: 'admin',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user seeded successfully. (username: admin, password: admin)');
    } else {
      console.log('Admin user already exists.');
    }

    const counsellorExists = await User.findOne({ username: 'counselor' });
    if (!counsellorExists) {
      const counsellor = new User({
        name: 'Jane Doe',
        email: 'jane.counselor@hopeline.com',
        username: 'counselor',
        password: 'counselor',
        role: 'counselor'
      });
      await counsellor.save();
      console.log('Counselor user seeded successfully. (username: counselor, password: counselor)');
    } else {
      console.log('Counsellor user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
