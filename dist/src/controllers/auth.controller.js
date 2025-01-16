"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const helper_utils_1 = require("../utils/helper.utils");
const errors_util_1 = require("../utils/errors/errors.util");
const base_user_validation_1 = require("../utils/validation/user/base.user.validation");
class AuthController {
    constructor(baseService) {
        this.authService = baseService;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, base_user_validation_1.validateBaseUser)(Object.assign({}, req.body), req.body.role);
                const { email, password, name, role } = req.body;
                const credentials = {
                    email: email === null || email === void 0 ? void 0 : email.trim().toLowerCase(),
                    password,
                    name,
                    role: role === null || role === void 0 ? void 0 : role.trim()
                };
                const newUser = yield this.authService.signUp(credentials);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.CREATED,
                    message: 'User created successfully, kindly check your mail for otp!'
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /** @description Talent Login */
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const credentials = {
                email: email === null || email === void 0 ? void 0 : email.trim().toLowerCase(),
                password
            };
            try {
                const data = yield this.authService.login(credentials);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: data
                        ? 'Login successfully'
                        : 'MFA required, please check your mailbox for 2FA code',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getFreshTokens(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                if (!token)
                    return next(new errors_util_1.AuthenticationError('Refresh token is required'));
                const tokens = yield this.authService.getFreshTokens(token);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: 'Tokens refreshed successfully',
                    data: tokens
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            let credentials = {
                Contact: { email }
            };
            try {
                yield this.authService.forgotPassword(credentials);
                return res.status(200).json({
                    success: true,
                    message: 'Password reset code successfully sent to mail!'
                });
            }
            catch (e) {
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
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authService.updatePassword(req.body);
                if (user) {
                    return (0, helper_utils_1.handleResponse)({
                        res,
                        statusCode: http_status_codes_1.StatusCodes.OK,
                        message: 'Password updated successfully'
                    });
                }
            }
            catch (err) {
                console.log('ctrl-catch', err.name);
                next(err);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword, confirmPassword, userId } = req.body;
                let credentials = {
                    token,
                    newPassword,
                    confirmPassword,
                    userId
                };
                const user = yield this.authService.resetPassword(credentials);
                if (user) {
                    return (0, helper_utils_1.handleResponse)({
                        res,
                        statusCode: http_status_codes_1.StatusCodes.OK,
                        message: 'Password reset successfully'
                    });
                }
            }
            catch (err) {
                console.log('ctrl-catch', err.name);
                next(err);
            }
        });
    }
    updateMFAByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const data = yield this.authService.findByEmailAndUpdate2FA(email);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: 'MFA updated successfully',
                    data
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;
