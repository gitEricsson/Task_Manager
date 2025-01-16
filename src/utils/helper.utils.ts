import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../interfaces/user.interface';
import crypto from 'crypto';
import AppConfig from '../config/app.config';
import { Model } from 'sequelize';

export const uniqueId: () => string = (): string => uuidv4();

export const UserDataPasswordRemover = function(data: IUser): Partial<IUser> {
  const { password, ...others } = data;
  return others;
};

export const handleResponse = function({
  res,
  statusCode,
  message,
  data
}: {
  res: Response;
  statusCode: number;
  message?: string;
  data?: any;
}): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export interface ValidationOptions {
  modelObject: any;
  componentModel: Model<Document>;
}

export const validateInput = async ({
  modelObject,
  componentModel
}: ValidationOptions): Promise<{ message: string } | undefined> => {
  try {
    await componentModel.validate(modelObject);
    const successData = {
      message: 'Validation successful'
    };
    return successData;
  } catch (validationError) {
    if (validationError) {
      const errorMessages = Object.entries(validationError.errors).map(
        ([field, error]) => {
          const errorMessage = (error as { message: string }).message; // Type assertion to ensure 'message' exists
          return {
            field,
            message: errorMessage
          };
        }
      );

      const errorData = {
        message: 'Validation failed',
        errors: errorMessages
      };

      throw errorData;
    }
  }
};

export const randomKey = function(length: number): string {
  let result = '';
  let stringValue = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ1234567890';

  for (let i = 0; i < length; i++) {
    result += stringValue.charAt(Math.floor(Math.random()) * length);
  }
  return result;
};

export const capitalizeEachWord = function(input: string): string {
  const convertToLowercase: string = input.toLowerCase();
  return convertToLowercase.replace(/\b\w/g, match => match.toUpperCase());
};
