import { Router } from 'express';
import { userService, otpService } from '../dependencies/dependencies';
import { UserRoles } from '../constants/enums.constants';
import AuthMiddleware from '../middlewares/authentication.middleware';
import passport from 'passport';
import AuthController from '../controllers/auth.controller';
import OtpController from '../controllers/otp.controller';

const authRoute: Router = Router();
const authController: AuthController = new AuthController(userService);
const otpController: OtpController = new OtpController(otpService, userService);

authRoute.post('/sign-up', authController.signUp.bind(authController));
authRoute.post('/login', authController.login.bind(authController));
authRoute.post(
  '/refresh_user',
  authController.getFreshTokens.bind(authController)
);

authRoute.patch(
  '/update-mfa/:email',
  AuthMiddleware.authenticateUser,
  AuthMiddleware.isUserAuthorized(Object.values(UserRoles)),
  authController.updateMFAByEmail.bind(authController)
);

authRoute.post('/send-otp', otpController.requestOtp.bind(otpController));
authRoute.post('/verify-otp', otpController.verifyOtp.bind(otpController));

authRoute
  .route('/forgot-password')
  .post(authController.forgotPassword.bind(authController))
  // Update password
  .patch(
    AuthMiddleware.authenticateUser,
    AuthMiddleware.isUserAuthorized(Object.values(UserRoles)),
    authController.updatePassword.bind(authController)
  );

authRoute.post(
  '/reset-password',
  AuthMiddleware.authenticateUser,
  authController.resetPassword.bind(authController)
);

// Redirect to Google for login
authRoute.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback authRoute
authRoute.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/login'); // Redirect to wherever after success
  }
);

export default authRoute;
