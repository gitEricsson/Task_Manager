import HashData from '../utils/hashData.utils';
import EmailTemplate from '../utils/templates/userMessages.template';
import Guard from '../utils/auth/tokens.auth.util';
import { BadRequestError, NotFoundError } from '../utils/errors/errors.util';
import AuthService from './auth/auth.service';
import AppConfig from '../config/app.config';
import { OTPTypes, UserRoles } from '../constants/enums.constants';
import { getUserData } from '../utils/switch.utils';
import Email from '../utils/email';
import UserRepository from '../repositories/user.repository';

class OtpService {
  private static instance: OtpService;
  hashData: HashData;
  guard: Guard;
  authService: AuthService;
  userRepository: UserRepository;

  constructor(
    hashData: HashData,
    guard: Guard,
    authService: AuthService,
    userRepository: UserRepository
  ) {
    this.hashData = hashData;
    this.guard = guard;
    this.authService = authService;
    this.userRepository = userRepository;
  }

  public static getInstance(
    hashData: HashData,
    guard: Guard,
    authService: AuthService,
    userRepository: UserRepository
  ): OtpService {
    if (!OtpService.instance) {
      OtpService.instance = new OtpService(
        hashData,
        guard,
        authService,
        userRepository
      );
    }
    return OtpService.instance;
  }

  async requestOtp(email: string, type: string) {
    // Get the base user
    const baseUser = await this.authService.getCredentials(email);
    if (!baseUser) {
      throw new NotFoundError('User not found');
    }

    const otp = Guard.generateOtp();

    let subject;
    let htmlContent: string;
    let duration = 1 / 60; // For duration conversion to minutes
    const firstName = baseUser.name;

    if (!type) throw new BadRequestError('Provide an otp type');

    switch (type) {
      case OTPTypes.Email:
        subject = 'Email Verification';
        duration *= AppConfig.TTL.EMAIL_DURATION;
        htmlContent = EmailTemplate.verifyEmailContent(
          firstName,
          otp,
          duration
        );
        break;
      case OTPTypes.ForgotPassword:
        await this.authService.isVerifiedUserAccount(
          baseUser,
          email,
          OTPTypes.Email
        );

        subject = 'Password Reset';
        duration *= AppConfig.TTL.PASSWORD_DURATION;
        htmlContent = EmailTemplate.forgotPasswordContent(
          firstName,
          otp,
          duration
        );
        break;
      case OTPTypes.MFA:
        await this.authService.isVerifiedUserAccount(
          baseUser,
          email,
          OTPTypes.Email
        );

        subject = '2-Factor Authentication';
        duration *= AppConfig.TTL.MFA_DURATION;
        htmlContent = EmailTemplate.MFAContent(firstName, otp, duration);
        break;
      default:
        throw new BadRequestError('Invalid otp type');
    }
    // Convert duration to Date object
    const expiryDate = new Date(Date.now() + duration * 60 * 1000);

    // Save OTP to database
    await this.userRepository.findAndUpdateOTP(email, otp, expiryDate);

    const emailTo = email;

    const mail = new Email(emailTo);
    await mail.send(htmlContent, subject);
  }

  async verifyOtp(
    email: string,
    otp: string,
    type: string,
    role: string
  ): Promise<any> {
    // Get the base user
    const user = await this.authService.getCredentials(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { id } = user;

    // Get the saved OTP and check expiry
    const { otp: hashedOtp, otpExpiry } = await this.userRepository.getOTP(
      email
    );
    if (!hashedOtp || !otpExpiry || new Date() > otpExpiry) {
      throw new BadRequestError('Expired or invalid OTP');
    }

    const isValidOtp = await this.hashData.verifyHashedData(otp, hashedOtp);

    if (!isValidOtp) {
      throw new BadRequestError('Invalid OTP');
    }
    let generatedId: string | null = null;

    switch (type) {
      case OTPTypes.Email:
        await this.authService.findByEmailAndUpdateVerifiedStatus(email);

        // Send a welcome email
        const name = user.name;
        const subject: string = 'Welcome Mail';
        const htmlContent: string = EmailTemplate.welcomeContent(name);
        const emailTo = email;

        const mail = new Email(emailTo);
        await mail.send(htmlContent, subject);

        break;
      case OTPTypes.MFA:
        if (user.MFA) {
          // Now issue a token for the user to login
          const access = await this.authService.issueToken(id, email, role);
          const { password, ...rest } = user; // Remove the password from the user object
          return {
            ...rest,
            ...access
          };
        }
        break;
      case OTPTypes.ForgotPassword:
        const resetData = await this.authService.findByEmailAndGenerateResetToken(
          email
        );
        return resetData;
    }

    const data = await getUserData(id, user);
    return {
      generatedId: generatedId,
      data
    };
  }
}

export default OtpService;
