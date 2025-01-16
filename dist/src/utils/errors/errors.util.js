"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.DuplicateError = exports.BadRequestError = exports.AuthorizationError = exports.AuthenticationError = void 0;
const customAPIError_util_1 = __importDefault(require("./customAPIError.util"));
const http_status_codes_1 = require("http-status-codes");
class AuthenticationError extends customAPIError_util_1.default {
    constructor(message) {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends customAPIError_util_1.default {
    constructor(message) {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
}
exports.AuthorizationError = AuthorizationError;
class BadRequestError extends customAPIError_util_1.default {
    constructor(message) {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}
exports.BadRequestError = BadRequestError;
class DuplicateError extends customAPIError_util_1.default {
    constructor(message) {
        super(message, http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS);
    }
}
exports.DuplicateError = DuplicateError;
class NotFoundError extends customAPIError_util_1.default {
    constructor(message) {
        super(message, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
