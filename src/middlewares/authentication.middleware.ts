import { Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/customRequest.interface';
import { StatusCodes } from 'http-status-codes';
import { UserRoles } from '../constants/enums.constants';
import { userService, guard } from '../dependencies/dependencies';
import User from '../models/user.model';
import {
  AuthenticationError,
  AuthorizationError
} from '../utils/errors/errors.util';
import { IToken } from '../interfaces/auth-token.interface';
import { UserDoc } from '../interfaces/userDoc.interface';

const jwtGuard = guard;
const userDB = userService;

class AuthMiddleware {
  constructor() {}
  static async authenticateUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authHeader = req.headers.authorization as string;

      let token: string;
      if (authHeader?.startsWith('Bearer') && authHeader?.split(' ')[1]) {
        token = authHeader.split(' ')[1];

        const user = (await AuthMiddleware.verifyToken(token, next)) as UserDoc;

        req.user = user;

        return next();
      }
      return next(new AuthorizationError('Unauthorized access❗'));
    } catch (error) {
      if (error instanceof Error) {
        switch (error.name) {
          // Expired token
          case 'TokenExpiredError': {
            error.message = 'Session expired!: Login and try again';
            res.status(403).json({
              status: false,
              message: error.message
            });
            break;
          }

          // Invalid token
          case 'JsonWebTokenError': {
            error.message = 'Invalid token!: Login and try again';
            res.status(401).json({
              status: false,
              message: error.message
            });
            break;
          }

          //Inactive token
          case 'NotBeforeError': {
            error.message = 'Inactive token!: Login and try again';
            res.status(401).json({
              status: false,
              message: error.message
            });
            break;
          }

          default:
            next(error);
            break;
        }
      }
    }
  }

  private static async verifyToken(
    token: string,
    next: NextFunction | ((err?: Error) => void)
  ): Promise<UserDoc | void | ((err?: Error) => void)> {
    const payload: IToken = await jwtGuard.verifyAccessToken(token);
    if (!payload)
      return next(
        new AuthenticationError(
          'Invalid access or Expired token, Kindly sign-in❗'
        )
      );

    const query = {
      _id: payload.id,
      role: payload.role,
      'Contact.email': payload.email
    };
    const userData = await userDB.findOne(query);

    if (!userData) return next(new AuthenticationError('User not found❗'));

    // Create user credentials for request
    const user = jwtGuard.createUserDoc(userData);

    return user;
  }

  public static isUserAuthorized(roles: UserRoles[]) {
    return async (
      req: CustomRequest,
      res: Response,
      next: NextFunction
    ): Promise<NextFunction | any> => {
      let roleValue = req.user?.role as UserRoles;

      if (!roles.some(role => roleValue === role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: 'Restricted Action, Unauthorized Access❗',
          statusCodes: 403
        });
      }
      console.log('USER AUTHORIZED TO PROCEED');
      return next();
    };
  }
}

export default AuthMiddleware;
