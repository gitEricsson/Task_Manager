"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = __importDefault(require("../../config/app.config"));
const dependencies_1 = require("../../dependencies/dependencies");
// const jwt_key = AppConfig.jwt.JWT_SECRET;
class RefreshTokenBrain {
    constructor() {
        this.auth_guard = dependencies_1.guard;
    }
    static getInstance() {
        if (!RefreshTokenBrain.instance) {
            RefreshTokenBrain.instance = new RefreshTokenBrain();
        }
        return RefreshTokenBrain.instance;
    }
    createToken(payload) {
        const accessToken = this.auth_guard.SIGN_TOKEN(payload, app_config_1.default.jwt.ACCESS_TOKEN_SECRET, app_config_1.default.jwt.ACCESS_TOKEN_EXPIRY);
        // this.generateRandomString(64);
        const refreshToken = this.auth_guard.SIGN_TOKEN(payload, app_config_1.default.jwt.REFRESH_TOKEN_SECRET, app_config_1.default.jwt.REFRESH_TOKEN_EXPIRY);
        return {
            accessToken,
            refreshToken
        };
    }
}
exports.default = RefreshTokenBrain;
