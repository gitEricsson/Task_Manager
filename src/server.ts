import app from './app';
import { connectToDatabase } from './config/db/db.config';
import AppConfig from './config/app.config';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

const server = app.listen(AppConfig.server.port, async () => {
  try {
    await connectToDatabase();
    console.log(`App running on port ${AppConfig.server.port}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
