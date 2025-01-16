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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userMessages_template_1 = __importDefault(require("../utils/templates/userMessages.template"));
const tokens_auth_util_1 = __importDefault(require("../utils/auth/tokens.auth.util"));
const errors_util_1 = require("../utils/errors/errors.util");
const app_config_1 = __importDefault(require("../config/app.config"));
const enums_constants_1 = require("../constants/enums.constants");
const switch_utils_1 = require("../utils/switch.utils");
const email_1 = __importDefault(require("../utils/email"));
class OtpService {
    constructor(hashData, guard, authService) {
        this.hashData = hashData;
        this.guard = guard;
        this.authService = authService;
    }
    static getInstance(hashData, guard, authService) {
        if (!OtpService.instance) {
            OtpService.instance = new OtpService(hashData, guard, authService);
        }
        return OtpService.instance;
    }
    requestOtp(email, type) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the base user
            const baseUser = yield this.authService.getCredentials(email);
            if (!baseUser) {
                throw new errors_util_1.NotFoundError('User not found');
            }
            const otp = tokens_auth_util_1.default.generateOtp();
            let subject;
            let htmlContent;
            let duration = 1 / 60; // For duration conversion to minutes
            const firstName = baseUser.name;
            if (!type)
                throw new errors_util_1.BadRequestError('Provide an otp type');
            switch (type) {
                case enums_constants_1.OTPTypes.Email:
                    subject = 'Email Verification';
                    duration *= app_config_1.default.TTL.EMAIL_DURATION;
                    htmlContent = userMessages_template_1.default.verifyEmailContent(firstName, otp, duration);
                    break;
                case enums_constants_1.OTPTypes.ForgotPassword:
                    yield this.authService.isVerifiedUserAccount(baseUser, email, enums_constants_1.OTPTypes.Email);
                    subject = 'Password Reset';
                    duration *= app_config_1.default.TTL.PASSWORD_DURATION;
                    htmlContent = userMessages_template_1.default.forgotPasswordContent(firstName, otp, duration);
                    break;
                case enums_constants_1.OTPTypes.MFA:
                    yield this.authService.isVerifiedUserAccount(baseUser, email, enums_constants_1.OTPTypes.Email);
                    subject = '2-Factor Authentication';
                    duration *= app_config_1.default.TTL.MFA_DURATION;
                    htmlContent = userMessages_template_1.default.MFAContent(firstName, otp, duration);
                    break;
                default:
                    throw new errors_util_1.BadRequestError('Invalid otp type');
            }
            const emailTo = email;
            const mail = new email_1.default(emailTo);
            yield mail.send(htmlContent, subject);
        });
    }
    verifyOtp(email, otp, type, role) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the base user
            const user = yield this.authService.getCredentials(email);
            if (!user) {
                throw new errors_util_1.NotFoundError('User not found');
            }
            const { id } = user;
            // Get the otp from the redis cache
            const hashedOtp = yield redis.get(`${type}:${id}`);
            if (!hashedOtp) {
                throw new errors_util_1.BadRequestError('Expired or invalid OTP');
            }
            const isValidOtp = yield this.hashData.verifyHashedData(otp, hashedOtp);
            if (!isValidOtp) {
                throw new errors_util_1.BadRequestError('Invalid OTP');
            }
            let generatedId = null;
            switch (type) {
                case enums_constants_1.OTPTypes.Email:
                    yield this.authService.findByEmailAndUpdateVerifiedStatus(email);
                    // Send a welcome email
                    const name = user.name;
                    const subject = 'Welcome Mail';
                    const htmlContent = userMessages_template_1.default.welcomeContent(name);
                    const emailTo = email;
                    const mail = new email_1.default(emailTo);
                    yield mail.send(htmlContent, subject);
                    break;
                case enums_constants_1.OTPTypes.MFA:
                    if (user.MFA) {
                        // Now issue a token for the user to login
                        const access = yield this.authService.issueToken(id, email, role);
                        const { password } = user, rest = __rest(user, ["password"]); // Remove the password from the user object
                        return Object.assign(Object.assign({}, rest), access);
                    }
                    break;
                case enums_constants_1.OTPTypes.ForgotPassword:
                    const resetData = yield this.authService.findByEmailAndGenerateResetToken(email);
                    return resetData;
            }
            const data = yield (0, switch_utils_1.getUserData)(id, user);
            return {
                generatedId: generatedId,
                data
            };
        });
    }
}
exports.default = OtpService;
