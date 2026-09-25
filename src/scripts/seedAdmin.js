// Creates the first admin, or resets its password if the email already exists.
// Usage: npm run seed:admin   (reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from server/.env)
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';

const name = process.env.ADMIN_NAME || 'ZORVENN Admin';
const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || '';

if (!email || password.length < 10 || password === 'change-this-password') {
  console.error('Set ADMIN_EMAIL and a strong ADMIN_PASSWORD (10+ characters) in server/.env first.');
  process.exit(1);
}

await connectDB();
const passwordHash = await Admin.hashPassword(password);
const admin = await Admin.findOneAndUpdate(
  { email },
  { name, email, passwordHash },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`Admin ready: ${admin.email}`);
await mongoose.disconnect();
