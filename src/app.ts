import express from 'express';
import { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
// const compression = require('compression');

import { setUpSwaggerDocs } from './utils/swaggerDocs.utils';
import { AppError } from './utils/errors/appError';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import AppConfig from './config/app.config';

const app: Application = express();

// Global MiddleWares

// Security HTTP Headers
app.use(helmet({ contentSecurityPolicy: false }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// compress responses
// app.use(compression());

// Test middleware
app.use(
  (
    req: Request & { requestTime?: string },
    res: Response,
    next: NextFunction
  ) => {
    req.requestTime = new Date().toISOString();
    next();
  }
);

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});

const port: number = parseInt(AppConfig.server.port || '3000');

setUpSwaggerDocs(app, port);

app.use(errorHandler);

export default app;
