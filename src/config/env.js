import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy server/.env.example to server/.env and fill them in.`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  PORT: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((u) => u.trim()),
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'ZORVENN Website <no-reply@zorvenn.com>',
  },
  notifyEmail: process.env.NOTIFY_EMAIL,
};
