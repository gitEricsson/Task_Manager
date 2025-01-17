import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleResponse } from '../utils/helper.utils';
import AuthService from '../services/auth/auth.service';
import { IUser } from '../interfaces/user.interface';
import { AuthenticationError } from '../utils/errors/errors.util';
import { validateBaseUser } from '../utils/validation/user/base.user.validation';

class AuthController {
  authService: AuthService;

  constructor(baseService: AuthService) {
    this.authService = baseService;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      validateBaseUser({ ...req.body }, req.body.role);

      const { email, password, name, role } = req.body;

      const credentials: Partial<IUser> = {
        email: email?.trim().toLowerCase(),
        password,
        name,
        role: role?.trim()
      };

      const newUser = await this.authService.signUp(credentials);

      return handleResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'User created successfully, kindly check your mail for otp!'
      });
    } catch (error) {
      next(error);
    }
  }

  /** @description Talent Login */
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const credentials: Partial<IUser> = {
      email: email?.trim().toLowerCase(),
      password
    };

    try {
      const data = await this.authService.login(credentials);

      return handleResponse({
        res,
        statusCode: StatusCodes.OK,
        message: data
          ? 'Login successfully'
          : 'MFA required, please check your mailbox for 2FA code',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getFreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      if (!token)
        return next(new AuthenticationError('Refresh token is required'));

      const tokens = await this.authService.getFreshTokens(token);

      return handleResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'Tokens refreshed successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    let credentials = {
      Contact: { email }
    };
    try {
      await this.authService.forgotPassword(credentials);
      return res.status(200).json({
        success: true,
        message: 'Password reset code successfully sent to mail!'
      });
    } catch (e) {
      if (e instanceof Error) {
        switch (e.name) {
          case 'AuthError':
            return res.status(401).json({
              success: false,
              message: e.message
            });
          case 'InterfaceError':
            return res.status(400).json({
              success: false,
              message: e.message
            });
          case 'DuplicateError':
            return res.status(409).json({
              success: false,
              message: e.message
            });
          default:
            return res.status(404).json({
              success: false,
              message: e.message
            });
        }
      }
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.updatePassword(req.body);
      if (user) {
        return handleResponse({
          res,
          statusCode: StatusCodes.OK,
          message: 'Password updated successfully'
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log('ctrl-catch', err.name);
      }
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword, confirmPassword, userId } = req.body;
      const credentials = { newPassword, confirmPassword, userId };

      const user = await this.authService.resetPassword(credentials);
      if (user) {
        return handleResponse({
          res,
          statusCode: StatusCodes.OK,
          message: 'Password reset successfully'
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log('ctrl-catch', err.name);
      } else {
        console.log('ctrl-catch', 'An unknown error occurred');
      }
      next(err);
    }
  }

  async updateMFAByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;

      const data = await this.authService.findByEmailAndUpdate2FA(email);
      return handleResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'MFA updated successfully'
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log('ctrl-catch', err.name);
      } else {
        console.log('ctrl-catch', 'An unknown error occurred');
      }
      next(err);
    }
  }
}

export default AuthController;
