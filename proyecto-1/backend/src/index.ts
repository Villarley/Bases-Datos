import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT ?? 3000;

try {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
