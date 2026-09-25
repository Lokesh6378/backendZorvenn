import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './src/config/env.js';
import publicRoutes from './src/routes/public.js';
import authRoutes from './src/routes/auth.js';
import adminRoutes from './src/routes/admin.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1); // correct client IPs for rate limiting behind a proxy (Render, Railway, Nginx)
app.use(helmet());
app.use(cors({ origin: env.clientUrls }));
app.use(express.json({ limit: '100kb' }));
if (!env.isProd) app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
