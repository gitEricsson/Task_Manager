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
const hashData_utils_1 = __importDefault(require("../../utils/hashData.utils"));
const dependencies_1 = require("../../dependencies/dependencies");
const errors_util_1 = require("../../utils/errors/errors.util");
const enums_constants_1 = require("../../constants/enums.constants");
const userMessages_template_1 = __importDefault(require("../../utils/templates/userMessages.template"));
const app_config_1 = __importDefault(require("../../config/app.config"));
const ms_1 = __importDefault(require("ms"));
const user_model_1 = __importDefault(require("../../models/user.model"));
class AuthService {
    constructor(repo, tokenBrain, authGuard) {
        this.hash = new hashData_utils_1.default();
        this.baseRepo = repo;
        this.tokenBrain = tokenBrain;
        this.authGuard = authGuard;
    }
    static getInstance(repo, tokenBrain, authGuard) {
        if (!AuthService.instanceBase) {
            AuthService.instanceBase = new AuthService(repo, tokenBrain, authGuard);
        }
        return AuthService.instanceBase;
    }
    issueToken(id, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken, refreshToken } = this.tokenBrain.createToken({
                id,
                email,
                role
            });
            return {
                accessToken,
                refreshToken,
                expiresIn: `${(0, ms_1.default)(app_config_1.default.jwt.ACCESS_TOKEN_EXPIRY)} milliseconds`
            };
        });
    }
    signUp(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            let newUser = null;
            const { email, role, isVerified } = credentials;
            let { password } = credentials;
            if (!email)
                throw new errors_util_1.BadRequestError('Missing email!');
            // Check if user already exists on the platform
            const user = yield this.getCredentials(email);
            if (user)
                throw new errors_util_1.BadRequestError(`User already exists as ${user.role}`);
            if (role && Object.values(enums_constants_1.UserRoles).includes(role)) {
                if (!password)
                    throw new errors_util_1.BadRequestError('Missing password!');
                password = yield this.hash.hash(password);
            }
            const baseData = {
                name,
                password,
                role,
                isVerified: isVerified ? isVerified : false
            };
            // Create a base user first
            const baseUser = yield user_model_1.default.create(baseData);
            // Generate OTP and send to user
            yield dependencies_1.otpService.requestOtp(email, enums_constants_1.OTPTypes.Email);
            return newUser;
        });
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { password } = credentials;
            const email = (_a = credentials.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            const user = yield this.getCredentials(email);
            if (!user)
                throw new errors_util_1.AuthenticationError('Invalid email or password');
            if (!password)
                throw new errors_util_1.BadRequestError('Password is required');
            // Handle user account verification
            yield this.isVerifiedUserAccount(user, email, enums_constants_1.OTPTypes.Email);
            // Verify user password
            const secureData = yield this.getCredentials(email);
            const isValidPassword = yield this.hash.verifyHashedData(password, secureData === null || secureData === void 0 ? void 0 : secureData.password);
            if (!isValidPassword)
                throw new errors_util_1.AuthenticationError('Invalid email or password');
            // Handle MFA
            if (user.MFA) {
                yield dependencies_1.otpService.requestOtp(user.email, enums_constants_1.OTPTypes.MFA);
                return;
            }
            // Issue token for non MFA users
            const accesses = yield this.issueToken(user.id, user.email, user.role);
            const { password: userPassword } = user, rest = __rest(user, ["password"]); // Remove the password from the user object
            const data = Object.assign(Object.assign({}, rest), accesses);
            return data;
        });
    }
    findByEmailAndUpdate2FA(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getCredentials(email);
            if (!user) {
                throw new errors_util_1.NotFoundError('User not found');
            }
            // Check if user account is verified
            yield this.isVerifiedUserAccount(user, email, enums_constants_1.OTPTypes.Email);
            const state = !user.MFA; // Toggle MFA state
            const updatedUser = yield this.baseRepo.findByEmailAndUpdate2FA_Status(email, state);
            const status = state ? 'Enabled' : 'Disabled';
            // Send notification email to user
            const userName = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name;
            const subject = 'Multi-Factor Authentication Status Update';
            const htmlContent = userMessages_template_1.default.mfaStatusUpdateContent(userName, status);
            const emailTo = email;
            return updatedUser;
        });
    }
    forgotPassword(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = credentials.Contact;
            if (!email) {
                throw new errors_util_1.BadRequestError('Email is required');
            }
            const user = yield this.baseRepo.findByEmail(email);
            const fpType = enums_constants_1.OTPTypes.ForgotPassword;
            yield dependencies_1.otpService.requestOtp(credentials.Contact.email, fpType
            // user?.role as string
            );
        });
    }
    updatePassword(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, password } = credentials;
            const hashedPassword = yield this.hash.hash(password);
            const update = yield this.baseRepo.findByIdAndUpdatePassword(id, hashedPassword);
            return update;
        });
    }
    resetPassword(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            if (credentials.newPassword !== credentials.confirmPassword) {
                return new errors_util_1.AuthenticationError('Confirm Password must be same as New Password');
            }
            const payload = yield dependencies_1.guard.verifyAccessToken(credentials.token);
            if (!payload)
                return new errors_util_1.AuthenticationError('Invalid reset or Expired token❗');
            return yield this.updatePassword({
                password: credentials.confirmPassword,
                id: credentials.userId
            });
        });
    }
    findUserByGoogle(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
            if (!email) {
                throw new Error('Email not found');
            }
            let user = yield this.baseRepo.findByEmail(email);
            if (!user)
                return;
            return user;
        });
    }
    isVerifiedUserAccount(user, email, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.isVerified) {
                // await otpService.requestOtp(email, type); // Till further notice
                throw new errors_util_1.AuthorizationError('Account not verified, OTP sent to mail');
            }
        });
    }
    getFreshTokens(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.authGuard.verifyRefreshToken(token);
            if (!data)
                throw new errors_util_1.AuthorizationError('Invalid token');
            const newTokens = yield this.issueToken(data.userId, data.email, data.role);
            return newTokens;
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.baseRepo.findOne(query);
            if (!user)
                throw new errors_util_1.NotFoundError('User not found');
            return user;
        });
    }
    findByEmailAndGenerateResetToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getCredentials(email);
            if (!user)
                throw new errors_util_1.AuthenticationError('Invalid email');
            const tokens = yield this.issueToken(user.id, user.email, user.role);
            const data = {
                userId: String(user.id),
                resetToken: tokens.accessToken
            };
            return data;
        });
    }
    findByEmailAndUpdateAccountStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.baseRepo.findByIdAndUpdateAccountStatus(id, status);
            if (!update)
                throw new errors_util_1.NotFoundError('User not found');
            return update;
        });
    }
    findByEmailAndUpdateVerifiedStatus(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new errors_util_1.BadRequestError('No email provided');
            const update = yield this.baseRepo.findAndUpdateEmailVerificationStatus(email);
            if (!update)
                throw new errors_util_1.NotFoundError('User not found');
            return update;
        });
    }
    getCredentials(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.baseRepo.findCredentialsByEmail(email);
        });
    }
}
exports.default = AuthService;
