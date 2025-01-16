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
const dependencies_1 = require("../dependencies/dependencies");
const errors_util_1 = require("../utils/errors/errors.util");
const jwtGuard = dependencies_1.guard;
const userDB = dependencies_1.userService;
class AuthMiddleware {
    constructor() { }
    static authenticateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                let token;
                if ((authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer')) && (authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1])) {
                    token = authHeader.split(' ')[1];
                    const user = (yield AuthMiddleware.verifyToken(token, next));
                    req.user = user;
                    return next();
                }
                return next(new errors_util_1.AuthorizationError('Unauthorized access❗'));
            }
            catch (error) {
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
        });
    }
    static verifyToken(token, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwtGuard.verifyAccessToken(token);
            if (!payload)
                return next(new errors_util_1.AuthenticationError('Invalid access or Expired token, Kindly sign-in❗'));
            const query = {
                _id: payload.id,
                role: payload.role,
                'Contact.email': payload.email
            };
            const userData = yield userDB.findOne(query);
            if (!userData)
                return next(new errors_util_1.AuthenticationError('User not found❗'));
            // Create user credentials for request
            const user = jwtGuard.createUserDoc(userData);
            return user;
        });
    }
    static isUserAuthorized(roles) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let roleValue = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
            if (!roles.some(role => roleValue === role)) {
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                    message: 'Restricted Action, Unauthorized Access❗',
                    statusCodes: 403
                });
            }
            console.log('USER AUTHORIZED TO PROCEED');
            return next();
        });
    }
}
exports.default = AuthMiddleware;
