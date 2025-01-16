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
exports.closeConnection = exports.connectToDatabase = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const app_config_1 = __importDefault(require("../app.config"));
const sequelize = new sequelize_1.Sequelize({
    dialect: 'postgres',
    host: app_config_1.default.db.host,
    username: app_config_1.default.db.username,
    password: app_config_1.default.db.password,
    database: app_config_1.default.db.database,
    port: app_config_1.default.db.port,
    logging: app_config_1.default.db.logging,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
exports.sequelize = sequelize;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log(`Database Connection Established Successfully\nHOST: ${app_config_1.default.db.host}\nPORT: ${app_config_1.default.db.port}\nDATABASE: ${app_config_1.default.db.database}`);
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
});
exports.connectToDatabase = connectToDatabase;
const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.close();
});
exports.closeConnection = closeConnection;
