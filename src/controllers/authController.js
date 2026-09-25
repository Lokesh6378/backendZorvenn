import { Admin } from '../models/Admin.js';
import { signToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
export async function login(req, res) {
  const { email, password } = req.body;
  console.log("email",email);
  
  const admin = await Admin.findOne({ email }).select('+passwordHash');
  console.log("admin",admin);
  
  const ok = admin && (await admin.comparePassword(password));
  if (!ok) return res.status(401).json({ message: 'Email or password is incorrect.' });

  res.json({ token: signToken(admin), admin: admin.toPublic() });
}

export function me(req, res) {
  res.json({ admin: req.admin.toPublic() });
}




export async function createAdmin(req, res) {
  const { name, email, password } = req.body;

  console.log("CREATE ADMIN:", name, email);

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    return res.status(409).json({
      message: 'Admin already exists.'
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await Admin.create({
    name,
    email,
    passwordHash,
  });

  res.status(201).json({
    message: 'Admin created successfully.',
    admin: admin.toPublic(),
  });
}