import { IToken, ITokenResult } from '../../interfaces/auth-token.interface';
import UserRepository from '../../repositories/user.repository';
import HashData from '../../utils/hashData.utils';
import RefreshTokenBrain from '../../utils/auth/tokenBrain.auth.util';
import { otpService, guard } from '../../dependencies/dependencies';
import {
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  NotFoundError
} from '../../utils/errors/errors.util';
import { Profile } from 'passport-google-oauth20';
import { OTPTypes, UserRoles } from '../../constants/enums.constants';
import EmailTemplate from '../../utils/templates/userMessages.template';
import AppConfig from '../../config/app.config';
import Guard from '../../utils/auth/tokens.auth.util';
import ms from 'ms';
import User from '../../models/user.model';
import { IUser } from '../../interfaces/user.interface';
import { WhereOptions } from 'sequelize';

class AuthService {
  hash: HashData = new HashData();
  private baseRepo: UserRepository;
  private tokenBrain: RefreshTokenBrain;
  private authGuard: Guard;
  private static instanceBase: AuthService;

  constructor(
    repo: UserRepository,
    tokenBrain: RefreshTokenBrain,
    authGuard: Guard
  ) {
    this.baseRepo = repo;
    this.tokenBrain = tokenBrain;
    this.authGuard = authGuard;
  }

  public static getInstance(
    repo: UserRepository,
    tokenBrain: RefreshTokenBrain,
    authGuard: Guard
  ): AuthService {
    if (!AuthService.instanceBase) {
      AuthService.instanceBase = new AuthService(repo, tokenBrain, authGuard);
    }
    return AuthService.instanceBase;
  }

  async issueToken(id: number, email: string, role: string) {
    const { accessToken, refreshToken } = this.tokenBrain.createToken({
      id,
      email,
      role
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: `${ms(AppConfig.jwt.ACCESS_TOKEN_EXPIRY)} milliseconds`
    };
  }

  async signUp(credentials: Partial<IUser>) {
    let newUser: IUser | null = null;

    const { email, role, isVerified } = credentials;
    let { password } = credentials;

    if (!email) throw new BadRequestError('Missing email!');

    // Check if user already exists on the platform
    const user = await this.getCredentials(email);
    if (user) throw new BadRequestError(`User already exists as ${user.role}`);

    if (role && Object.values(UserRoles).includes((role as any) as UserRoles)) {
      if (!password) throw new BadRequestError('Missing password!');
      password = await this.hash.hash(password);
    }

    const baseData = {
      name,
      password,
      role,
      isVerified: isVerified ? isVerified : false
    };

    // Create a base user first
    const baseUser = await User.create(baseData);

    // Generate OTP and send to user
    await otpService.requestOtp(email, OTPTypes.Email);

    return newUser;
  }

  async login(credentials: object | any) {
    const { password } = credentials;
    const email = credentials.email?.trim().toLowerCase();

    const user = await this.getCredentials(email);
    if (!user) throw new AuthenticationError('Invalid email or password');

    if (!password) throw new BadRequestError('Password is required');

    // Handle user account verification
    await this.isVerifiedUserAccount(user, email, OTPTypes.Email);

    // Verify user password
    const secureData = await this.getCredentials(email);
    const isValidPassword = await this.hash.verifyHashedData(
      password as string,
      secureData?.password as string
    );
    if (!isValidPassword)
      throw new AuthenticationError('Invalid email or password');

    // Handle MFA
    if (user.MFA) {
      await otpService.requestOtp(user.email, OTPTypes.MFA);
      return;
    }

    // Issue token for non MFA users
    const accesses = await this.issueToken(user.id, user.email, user.role);
    const { password: userPassword, ...rest } = user; // Remove the password from the user object
    const data = {
      ...rest,
      ...accesses
    };

    return data;
  }

  async findByEmailAndUpdate2FA(email: string) {
    const user = await this.getCredentials(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user account is verified
    await this.isVerifiedUserAccount(user, email, OTPTypes.Email);

    const state = !user.MFA; // Toggle MFA state

    const updatedUser = await this.baseRepo.findByEmailAndUpdate2FA_Status(
      email,
      state
    );

    const status = state ? 'Enabled' : 'Disabled';

    // Send notification email to user
    const userName = updatedUser?.name as string;
    const subject = 'Multi-Factor Authentication Status Update';
    const htmlContent = EmailTemplate.mfaStatusUpdateContent(userName, status);
    const emailTo = email;

    return updatedUser;
  }

  async forgotPassword(credentials: object | any) {
    const { email } = credentials.Contact;
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const user = await this.baseRepo.findByEmail(email);

    const fpType = OTPTypes.ForgotPassword;
    await otpService.requestOtp(
      credentials.Contact.email,
      fpType
      // user?.role as string
    );
  }

  async updatePassword(credentials: object | any) {
    const { id, password } = credentials;
    const hashedPassword = await this.hash.hash(password);

    const update = await this.baseRepo.findByIdAndUpdatePassword(
      id,
      hashedPassword
    );

    return update;
  }

  async resetPassword(credentials: object | any) {
    if (credentials.newPassword !== credentials.confirmPassword) {
      return new AuthenticationError(
        'Confirm Password must be same as New Password'
      );
    }

    const payload: IToken = await guard.verifyAccessToken(credentials.token);
    if (!payload)
      return new AuthenticationError('Invalid reset or Expired token❗');

    return await this.updatePassword({
      password: credentials.confirmPassword,
      id: credentials.userId
    });
  }

  async findUserByGoogle(profile: Profile) {
    const email = profile.emails?.[0].value;

    if (!email) {
      throw new Error('Email not found');
    }

    let user = await this.baseRepo.findByEmail(email);
    if (!user) return;

    return user;
  }

  async isVerifiedUserAccount(
    user: IUser,
    email: string,
    type: string
  ): Promise<void> {
    if (!user.isVerified) {
      // await otpService.requestOtp(email, type); // Till further notice
      throw new AuthorizationError('Account not verified, OTP sent to mail');
    }
  }

  async getFreshTokens(token: string): Promise<ITokenResult> {
    const data = await this.authGuard.verifyRefreshToken(token);
    if (!data) throw new AuthorizationError('Invalid token');

    const newTokens = await this.issueToken(data.userId, data.email, data.role);

    return newTokens;
  }
  async findOne(query: WhereOptions) {
    const user = await this.baseRepo.findOne(query);
    if (!user) throw new NotFoundError('User not found');

    return user;
  }

  async findByEmailAndGenerateResetToken(email: string) {
    const user = await this.getCredentials(email);

    if (!user) throw new AuthenticationError('Invalid email');

    const tokens = await this.issueToken(user.id, user.email, user.role);

    const data = {
      userId: String(user.id),
      resetToken: tokens.accessToken
    };

    return data;
  }

  async findByEmailAndUpdateAccountStatus(id: number, status: string) {
    const update = await this.baseRepo.findByIdAndUpdateAccountStatus(
      id,
      status
    );
    if (!update) throw new NotFoundError('User not found');

    return update;
  }

  async findByEmailAndUpdateVerifiedStatus(email: string) {
    if (!email) throw new BadRequestError('No email provided');
    const update = await this.baseRepo.findAndUpdateEmailVerificationStatus(
      email
    );
    if (!update) throw new NotFoundError('User not found');

    return update;
  }

  async getCredentials(email: string) {
    return this.baseRepo.findCredentialsByEmail(email);
  }
}

export default AuthService;
