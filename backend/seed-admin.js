/**
 * Run once to create your admin account:
 *   node seed-admin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'eesa@iiti.ac.in' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name:     'Piyush Raj',              // change this
    email:    'eesa@iiti.ac.in',   // change this
    password: 'Admin@1234',          // change this
    role:     'admin',
  });

  console.log('✅ Admin created:', admin.email);
  
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
