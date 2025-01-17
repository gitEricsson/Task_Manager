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
exports.getUserData = exports.createUserProfile = void 0;
const enums_constants_1 = require("../constants/enums.constants");
const user_model_1 = __importDefault(require("../models/user.model"));
const dependencies_1 = require("../dependencies/dependencies");
/**
 * Mapping User Roles to their respective models
 */
const RoleToModelMap = {
    [enums_constants_1.UserRoles.ADMIN]: user_model_1.default,
    [enums_constants_1.UserRoles.USER]: user_model_1.default,
    [enums_constants_1.UserRoles.MANAGER]: user_model_1.default
};
/**
 * Logic to handle the creation of a user profile
 *
 * @param base - Base user data containing `_id` and role
 * @param credentials - Partial user data for the profile
 * @param model - Repository to handle database operations
 */
const createUserProfile = (base, credentials, model) => __awaiter(void 0, void 0, void 0, function* () {
    const ProfileModel = RoleToModelMap[base.role];
    if (!ProfileModel) {
        throw new Error('Unable to identify user role for profile creation.');
    }
    try {
        const newUser = yield model.create(Object.assign({ id: base.id }, credentials));
        return newUser;
    }
    catch (error) {
        throw new Error(`Failed to create user profile: ${error.message}`);
    }
});
exports.createUserProfile = createUserProfile;
/**
 * Logic to fetch user data by role
 *
 * @param userId - Unique ID of the user
 * @param credentials - User credentials containing role
 * @param model - Repository to handle database operations
 */
const getUserData = (userId, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const ProfileModel = RoleToModelMap[credentials.role];
    if (!ProfileModel) {
        throw new Error('Unable to identify user role for fetching data.');
    }
    try {
        const userData = yield dependencies_1.userRepository.findMe(userId);
        return userData;
    }
    catch (error) {
        throw new Error(`Failed to fetch user data: ${error.message}`);
    }
});
exports.getUserData = getUserData;
