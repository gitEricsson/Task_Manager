import CustomAPIError from './customAPIError.util';
import { StatusCodes } from 'http-status-codes';

export class AuthenticationError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class AuthorizationError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class BadRequestError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class DuplicateError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.TOO_MANY_REQUESTS);
  }
}

export class NotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
