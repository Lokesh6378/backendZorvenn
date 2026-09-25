import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';

export async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Sign in to continue.' });

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.sub);
    if (!admin) return res.status(401).json({ message: 'Account not found. Sign in again.' });
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Sign in again.' });
  }
}

export function signToken(admin) {
  return jwt.sign({ sub: admin._id.toString(), role: admin.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}
