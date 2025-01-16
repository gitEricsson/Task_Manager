import AppConfig from '../../config/app.config';
import { guard } from '../../dependencies/dependencies';
import { IToken, ITokenResult } from '../../interfaces/auth-token.interface';

// const jwt_key = AppConfig.jwt.JWT_SECRET;

class RefreshTokenBrain {
  private static instance: RefreshTokenBrain;
  auth_guard = guard;

  private constructor() {}

  public static getInstance(): RefreshTokenBrain {
    if (!RefreshTokenBrain.instance) {
      RefreshTokenBrain.instance = new RefreshTokenBrain();
    }
    return RefreshTokenBrain.instance;
  }

  createToken(payload: Partial<IToken>): ITokenResult {
    const accessToken = this.auth_guard.SIGN_TOKEN(
      payload,
      AppConfig.jwt.ACCESS_TOKEN_SECRET,
      AppConfig.jwt.ACCESS_TOKEN_EXPIRY
    );

    // this.generateRandomString(64);
    const refreshToken = this.auth_guard.SIGN_TOKEN(
      payload,
      AppConfig.jwt.REFRESH_TOKEN_SECRET,
      AppConfig.jwt.REFRESH_TOKEN_EXPIRY
    );

    return {
      accessToken,
      refreshToken
    };
  }
}

export default RefreshTokenBrain;
