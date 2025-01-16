"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../dependencies/dependencies");
const enums_constants_1 = require("../constants/enums.constants");
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const otp_controller_1 = __importDefault(require("../controllers/otp.controller"));
const authRoute = (0, express_1.Router)();
const authController = new auth_controller_1.default(dependencies_1.userService);
const otpController = new otp_controller_1.default(dependencies_1.otpService, dependencies_1.userService);
authRoute.post('/sign-up', authController.signUp.bind(authController));
authRoute.post('/login', authController.login.bind(authController));
authRoute.post('/refresh_user', authController.getFreshTokens.bind(authController));
authRoute.patch('/update-mfa/:email', authentication_middleware_1.default.authenticateUser, authentication_middleware_1.default.isUserAuthorized(Object.values(enums_constants_1.UserRoles)), authController.updateMFAByEmail.bind(authController));
authRoute.post('/send-otp', otpController.requestOtp.bind(otpController));
authRoute.post('/verify-otp', otpController.verifyOtp.bind(otpController));
authRoute
    .route('/forgot-password')
    .post(authController.forgotPassword.bind(authController))
    // Update password
    .patch(authentication_middleware_1.default.authenticateUser, authentication_middleware_1.default.isUserAuthorized(Object.values(enums_constants_1.UserRoles)), authController.updatePassword.bind(authController));
authRoute.post('/reset-password', authentication_middleware_1.default.authenticateUser, authController.resetPassword.bind(authController));
// Redirect to Google for login
authRoute.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
// Google callback authRoute
authRoute.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication
    res.redirect('/login'); // Redirect to wherever after success
});
exports.default = authRoute;
