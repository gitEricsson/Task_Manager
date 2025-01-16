import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleResponse } from '../utils/helper.utils';
import OtpService from '../services/otp.service';
import AuthService from '../services/auth/auth.service';
import { BadRequestError } from '../utils/errors/errors.util';
import { OTPTypes } from '../constants/enums.constants';

class OtpController {
  private otpService: OtpService;
  private authService: AuthService;

  constructor(otpService: OtpService, authService: AuthService) {
    this.otpService = otpService;
    this.authService = authService;
  }

  /**@description Otp request */
  async requestOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<{
    res: Response<any, Record<string, any>>;
    statusCode: number;
    message: string;
  }> | void> {
    try {
      const { email, type } = req.body;
      if (!(email && type)) {
        return next(new BadRequestError('Email and type are required'));
      }

      const user = await this.authService.getCredentials(email);
      // Handle verified and non-MFA users
      if (type === OTPTypes.Email && user?.isVerified)
        return next(new BadRequestError('User already verified'));
      if (type === OTPTypes.MFA && !user?.MFA)
        return next(new BadRequestError('User not MFA enabled'));

      await this.otpService.requestOtp(email, type);

      return handleResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'Otp sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**@description Verify Otp */
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, type } = req.body;
      if (!(email && type)) {
        return next(new BadRequestError('Email and type are required'));
      }

      const user = await this.authService.getCredentials(email);
      // Handle verified and non-MFA users
      if (type === OTPTypes.Email && user?.isVerified)
        return next(new BadRequestError('User already verified'));
      if (type === OTPTypes.MFA && !user?.MFA)
        return next(new BadRequestError('User not currently MFA enabled'));

      const role = user?.role;
      if (!role) {
        return next(new BadRequestError('User role not found'));
      }

      const data = await this.otpService.verifyOtp(email, otp, type, role);

      return handleResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'OTP verified successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

export default OtpController;
