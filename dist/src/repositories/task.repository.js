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
exports.TaskRepository = void 0;
const sequelize_1 = require("sequelize");
const task_model_1 = __importDefault(require("../models/task.model"));
class TaskRepository {
    constructor() { }
    static getInstance() {
        if (!TaskRepository.instance) {
            TaskRepository.instance = new TaskRepository();
        }
        return TaskRepository.instance;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.default.create(data);
        });
    }
    findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = Number(params.limit) || 10;
            const offset = ((Number(params.page) || 1) - 1) * limit;
            const where = {};
            if (params.status)
                where.status = params.status;
            if (params.userId)
                where.userId = params.userId;
            if (params.search) {
                where[sequelize_1.Op.or] = [
                    { title: { [sequelize_1.Op.iLike]: `%${params.search}%` } },
                    { description: { [sequelize_1.Op.iLike]: `%${params.search}%` } }
                ];
            }
            return task_model_1.default.findAndCountAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });
        });
    }
    update(id, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { id };
            if (userId)
                where.userId = userId;
            const [updated] = yield task_model_1.default.update(data, { where });
            if (!updated)
                return null;
            return task_model_1.default.findOne({ where: { id } });
        });
    }
    delete(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { id };
            if (userId)
                where.userId = userId;
            return (yield task_model_1.default.destroy({ where })) > 0;
        });
    }
}
exports.TaskRepository = TaskRepository;
