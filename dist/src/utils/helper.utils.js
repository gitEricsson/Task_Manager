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
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeEachWord = exports.randomKey = exports.validateInput = exports.handleResponse = exports.UserDataPasswordRemover = exports.uniqueId = void 0;
const uuid_1 = require("uuid");
const uniqueId = () => (0, uuid_1.v4)();
exports.uniqueId = uniqueId;
const UserDataPasswordRemover = function (data) {
    const { password } = data, others = __rest(data, ["password"]);
    return others;
};
exports.UserDataPasswordRemover = UserDataPasswordRemover;
const handleResponse = function ({ res, statusCode, message, data }) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};
exports.handleResponse = handleResponse;
const validateInput = (_a) => __awaiter(void 0, [_a], void 0, function* ({ modelObject, componentModel }) {
    try {
        yield componentModel.validate(modelObject);
        const successData = {
            message: 'Validation successful'
        };
        return successData;
    }
    catch (validationError) {
        if (validationError) {
            const errorMessages = Object.entries(validationError.errors).map(([field, error]) => {
                const errorMessage = error.message; // Type assertion to ensure 'message' exists
                return {
                    field,
                    message: errorMessage
                };
            });
            const errorData = {
                message: 'Validation failed',
                errors: errorMessages
            };
            throw errorData;
        }
    }
});
exports.validateInput = validateInput;
const randomKey = function (length) {
    let result = '';
    let stringValue = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ1234567890';
    for (let i = 0; i < length; i++) {
        result += stringValue.charAt(Math.floor(Math.random()) * length);
    }
    return result;
};
exports.randomKey = randomKey;
const capitalizeEachWord = function (input) {
    const convertToLowercase = input.toLowerCase();
    return convertToLowercase.replace(/\b\w/g, match => match.toUpperCase());
};
exports.capitalizeEachWord = capitalizeEachWord;
