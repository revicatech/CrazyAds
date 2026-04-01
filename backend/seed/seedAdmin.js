require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    await connectDB();
    await Admin.deleteMany();

    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
    });

    console.log(`Admin created: username="${admin.username}", password="admin123"`);
    console.log('Change this password after first login!');
    process.exit(0);
  } catch (err) {
    console.error('Seed admin error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
