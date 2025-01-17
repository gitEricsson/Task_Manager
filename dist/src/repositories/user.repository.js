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
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const customAPIError_util_1 = __importDefault(require("../utils/errors/customAPIError.util"));
class UserRepository {
    constructor() { }
    static getInstance() {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.create(data);
            const userJson = user.toJSON();
            delete userJson.password;
            return userJson;
        });
    }
    findMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({
                where: { id: userId },
                include: ['profile'] // Adjust based on your associations
            });
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ where: filter });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUser = yield user_model_1.default.findOne({ where: { email } });
            return baseUser;
        });
    }
    findCredentialsByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({
                where: { email },
                attributes: ['id', 'email', 'password', 'role', 'mfa']
            });
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findByPk(userId);
        });
    }
    findAndUpdateEmailVerificationStatus(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update({ isVerified: true }, { where: { email }, returning: true }).then(([_, users]) => users[0]);
        });
    }
    findByEmailAndUpdate2FA_Status(email, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update({ mfa: state }, { where: { email }, returning: true }).then(([_, users]) => users[0]);
        });
    }
    findByIdAndUpdateTelephone(id, telephone) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update({ telephone }, { where: { id }, returning: true }).then(([_, users]) => users[0]);
        });
    }
    findByIdAndUpdateName(id, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update({ firstName, lastName }, { where: { id }, returning: true }).then(([_, users]) => users[0]);
        });
    }
    findByIdAndUpdatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update({ password }, { where: { id }, returning: true }).then(([_, users]) => users[0]);
        });
    }
    findAll(pageNumber_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (pageNumber, limit, query = {}) {
            return user_model_1.default.findAndCountAll({
                where: query,
                limit,
                offset: (pageNumber - 1) * limit,
                order: [['createdAt', 'DESC']]
            });
        });
    }
    findByIdAndUpdate(userId, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update(fields, {
                where: { id: userId },
                returning: true
            }).then(([_, users]) => users[0]);
        });
    }
    findOneAndUpdate(filter, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update(payload, {
                where: filter,
                returning: true
            }).then(([_, users]) => users[0]);
        });
    }
    findByIdAndUpdateAccountStatus(id, accountStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.update({ accountStatus }, { where: { id }, returning: true }).then(([_, users]) => users[0]);
        });
    }
    findByLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (location.country)
                where['country'] = location.country;
            if (location.state)
                where['state'] = location.state;
            if (location.city)
                where['city'] = location.city;
            return user_model_1.default.findAll({
                where,
                attributes: { exclude: ['password'] }
            });
        });
    }
    findByRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findAll({
                where: { role },
                attributes: { exclude: ['password'] }
            });
        });
    }
    findByIdAndDelete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield user_model_1.default.destroy({ where: { id: userId } });
            return deleted > 0;
        });
    }
    findAndUpdateOTP(email, otp, otpExpiry) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedCount, [updatedUser]] = yield user_model_1.default.update({
                otp,
                otpExpiry
            }, {
                where: { email },
                returning: true
            });
            if (!updatedCount) {
                throw new customAPIError_util_1.default('User not found', 404);
            }
            return updatedUser;
        });
    }
    getOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({
                where: {
                    email,
                    otpExpiry: {
                        [sequelize_1.Op.gt]: new Date() // Check if OTP hasn't expired
                    }
                },
                attributes: ['otp', 'otpExpiry']
            });
            if (!user) {
                throw new customAPIError_util_1.default('Invalid or expired OTP', 400);
            }
            return {
                otp: user.otp,
                otpExpiry: user.otpExpiry
            };
        });
    }
}
exports.default = UserRepository;
