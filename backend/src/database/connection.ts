import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options: mongoose.ConnectOptions = {};

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error: %O', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected.');
    });

    await mongoose.connect(env.MONGODB_URI, options);
  } catch (error) {
    logger.error('Failed to connect to MongoDB: %O', error);
    process.exit(1);
  }
};
