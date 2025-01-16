"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBaseUser = void 0;
const zod_1 = require("zod");
const enums_constants_1 = require("../../../constants/enums.constants");
const validator_1 = __importDefault(require("validator"));
const isSecureRole_auth_util_1 = __importDefault(require("../../auth/isSecureRole.auth.util"));
let baseUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(Object.values(enums_constants_1.UserRoles)),
    name: zod_1.z.string().optional(),
    isVerified: zod_1.z
        .boolean()
        .default(false)
        .optional(),
    MFA: zod_1.z
        .boolean()
        .default(false)
        .optional(),
    accountStatus: zod_1.z
        .enum(Object.values(enums_constants_1.AccountStatus))
        .default(enums_constants_1.AccountStatus.ACTIVE)
        .optional()
});
const passwordSchema = {
    password: zod_1.z
        .string()
        .min(8)
        .refine(data => validator_1.default.isStrongPassword(data), {
        message: 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    })
};
const validateBaseUser = (data, role) => {
    baseUserSchema = baseUserSchema.merge(zod_1.z.object({ firstName: zod_1.z.string() }));
    if ((0, isSecureRole_auth_util_1.default)(role)) {
        const schema = baseUserSchema.merge(zod_1.z.object(passwordSchema));
        schema.parse(data);
    }
    else {
        baseUserSchema.parse(data);
    }
};
exports.validateBaseUser = validateBaseUser;
