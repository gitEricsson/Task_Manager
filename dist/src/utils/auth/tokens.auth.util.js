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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = __importDefault(require("../../config/app.config"));
/**
 * @description JWT Authentication, Authorization
 * and OTP token generation
 */
class Guard {
    constructor() { }
    static getInstance() {
        if (!Guard.instance) {
            Guard.instance = new Guard();
        }
        return Guard.instance;
    }
    verifyAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, app_config_1.default.jwt.ACCESS_TOKEN_SECRET);
                return decodedToken;
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, app_config_1.default.jwt.REFRESH_TOKEN_SECRET);
                return decodedToken;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Issue authorization token
     * @param payload data to encrypted
     * @param key JWT key
     * @returns base64 string
     */
    SIGN_TOKEN(payload, key, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, key, {
            expiresIn
        });
    }
    createUserDoc(user) {
        return {
            id: user.id,
            role: user.role,
            isVerified: user.isVerified,
            email: user.Contact.email
        };
    }
    /**
     *@description Creates random 6 digit otp
     * @returns string
     */
    static generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
exports.default = Guard;
