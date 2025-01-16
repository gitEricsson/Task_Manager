import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error to the console
  console.error(error);

  let statusCode: any = undefined;

  if (!error.statusCode) {
    statusCode = res.statusCode === 200 ? 500 : error.statusCode;
  } else {
    statusCode = error.statusCode;
  }

  let errorMessage = error.message;

  if (Array.isArray(error.errors)) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err: any) => `${err.message}`);
      errorMessage += `: ${formattedErrors.join(', ')}`;
    }
  }

  // Handle zod validation errors
  if (error instanceof z.ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    errorMessage = error.errors
      .map((err: any) => `${err.path.join(', ')} ${err.message.toLowerCase()}`)
      .join(', ');
  }

  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
};

export { errorHandler };
