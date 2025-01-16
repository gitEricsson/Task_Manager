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
const enums_constants_1 = require("../constants/enums.constants");
class OtpController {
    constructor(otpService, authService) {
        this.otpService = otpService;
        this.authService = authService;
    }
    /**@description Otp request */
    requestOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, type } = req.body;
                if (!(email && type)) {
                    return next(new errors_util_1.BadRequestError('Email and type are required'));
                }
                const user = yield this.authService.getCredentials(email);
                // Handle verified and non-MFA users
                if (type === enums_constants_1.OTPTypes.Email && (user === null || user === void 0 ? void 0 : user.isVerified))
                    return next(new errors_util_1.BadRequestError('User already verified'));
                if (type === enums_constants_1.OTPTypes.MFA && !(user === null || user === void 0 ? void 0 : user.MFA))
                    return next(new errors_util_1.BadRequestError('User not MFA enabled'));
                yield this.otpService.requestOtp(email, type);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.CREATED,
                    message: 'Otp sent successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**@description Verify Otp */
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, type } = req.body;
                if (!(email && type)) {
                    return next(new errors_util_1.BadRequestError('Email and type are required'));
                }
                const user = yield this.authService.getCredentials(email);
                // Handle verified and non-MFA users
                if (type === enums_constants_1.OTPTypes.Email && (user === null || user === void 0 ? void 0 : user.isVerified))
                    return next(new errors_util_1.BadRequestError('User already verified'));
                if (type === enums_constants_1.OTPTypes.MFA && !(user === null || user === void 0 ? void 0 : user.MFA))
                    return next(new errors_util_1.BadRequestError('User not currently MFA enabled'));
                const role = user === null || user === void 0 ? void 0 : user.role;
                if (!role) {
                    return next(new errors_util_1.BadRequestError('User role not found'));
                }
                const data = yield this.otpService.verifyOtp(email, otp, type, role);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.CREATED,
                    message: 'OTP verified successfully',
                    data
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = OtpController;
