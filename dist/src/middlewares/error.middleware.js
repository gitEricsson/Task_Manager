"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = __importDefault(require("zod"));
const errorHandler = (error, req, res, next) => {
    // Log the error to the console
    console.error(error);
    let statusCode = undefined;
    if (!error.statusCode) {
        statusCode = res.statusCode === 200 ? 500 : error.statusCode;
    }
    else {
        statusCode = error.statusCode;
    }
    let errorMessage = error.message;
    if (Array.isArray(error.errors)) {
        if (error.errors) {
            const formattedErrors = error.errors.map((err) => `${err.message}`);
            errorMessage += `: ${formattedErrors.join(', ')}`;
        }
    }
    // Handle zod validation errors
    if (error instanceof zod_1.default.ZodError) {
        statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        errorMessage = error.errors
            .map((err) => `${err.path.join(', ')} ${err.message.toLowerCase()}`)
            .join(', ');
    }
    return res.status(statusCode).json({
        success: false,
        error: errorMessage,
    });
};
exports.errorHandler = errorHandler;
