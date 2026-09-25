import app from './app.js';
import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';

try {
  await connectDB();
  app.listen(env.PORT, () => console.log(`ZORVENN API running on http://localhost:${env.PORT}`));
} catch (err) {
  console.error('Failed to start server:', err.message);
  process.exit(1);
}
