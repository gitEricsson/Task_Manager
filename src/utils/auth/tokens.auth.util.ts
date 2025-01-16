import jwt from 'jsonwebtoken';
import AppConfig from '../../config/app.config';
import { UserDoc } from '../../interfaces/userDoc.interface';
import { IToken } from '../../interfaces/auth-token.interface';

/**
 * @description JWT Authentication, Authorization
 * and OTP token generation
 */
class Guard {
  private static instance: Guard;
  private constructor() {}

  public static getInstance(): Guard {
    if (!Guard.instance) {
      Guard.instance = new Guard();
    }
    return Guard.instance;
  }

  async verifyAccessToken(token: any): Promise<IToken | any> {
    try {
      const decodedToken = jwt.verify(token, AppConfig.jwt.ACCESS_TOKEN_SECRET);
      return decodedToken;
    } catch (error) {
      throw error;
    }
  }

  async verifyRefreshToken(token: any): Promise<any | IToken> {
    try {
      const decodedToken = jwt.verify(
        token,
        AppConfig.jwt.REFRESH_TOKEN_SECRET
      );
      return decodedToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Issue authorization token
   * @param payload data to encrypted
   * @param key JWT key
   * @returns base64 string
   */
  SIGN_TOKEN(payload: object | Buffer, key: string, expiresIn?: string) {
    return jwt.sign(payload, key, {
      expiresIn
    });
  }

  public createUserDoc(user: object | any) {
    return {
      id: user.id,
      role: user.role,
      isVerified: user.isVerified,
      email: user.Contact.email
    } as UserDoc;
  }

  /**
   *@description Creates random 6 digit otp
   * @returns string
   */
  public static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export default Guard;
