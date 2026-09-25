import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id.' });
  if (err.code === 11000) return res.status(409).json({ message: 'That record already exists.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request is too large.' });

  console.error(err);
  res.status(err.status || 500).json({
    message: env.isProd ? 'Something went wrong on our side.' : err.message,
  });
}
