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
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_config_1 = require("../config/db/db.config");
const enums_constants_1 = require("../constants/enums.constants");
class User extends sequelize_1.Model {
    comparePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(candidatePassword, this.password);
        });
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_constants_1.UserRoles)),
        defaultValue: enums_constants_1.UserRoles.USER
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    MFA: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    accountStatus: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            isIn: [Object.values(enums_constants_1.AccountStatus)]
        },
        defaultValue: enums_constants_1.AccountStatus.ACTIVE
    },
    notificationPreference: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        validate: {
            isIn: {
                args: [Object.values(enums_constants_1.NotificationList)],
                msg: 'Notification preference must be one of the allowed values.'
            }
        },
        defaultValue: Object.values(enums_constants_1.NotificationList)
    },
    otp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    otpExpiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: db_config_1.sequelize,
    modelName: 'User',
    // hooks: {
    //   beforeSave: async (user: User) => {
    //     if (user.changed('password')) {
    //       const salt = await bcrypt.genSalt(10);
    //       user.password = await bcrypt.hash(user.password, salt);
    //     }
    //   }
    // }
});
exports.default = User;
