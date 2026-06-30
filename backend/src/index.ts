import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './database/connection';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import apiRouter from './routes';
import { NotFoundError } from './utils/appError';

const app = express();

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Enable CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger middleware
app.use(requestLogger);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API routes
app.use('/api', apiRouter);

// 404 Route handler
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot find ${req.method} ${req.originalUrl} on this server`));
});

// Centralized error handler
app.use(errorHandler);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const server = app.listen(env.PORT, () => {
      logger.info(`===================================================`);
      logger.info(`🚀 Food Discovery Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`===================================================`);
    });

    // Handle graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('Server closed. Database connection closing...');
        import('mongoose').then((mongoose) => {
          mongoose.connection.close().then(() => {
            logger.info('Database connection closed. Safe exit.');
            process.exit(0);
          });
        });
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    logger.error('Failed to start the application server: %O', error);
    process.exit(1);
  }
};

startServer();
