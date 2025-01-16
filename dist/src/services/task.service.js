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
exports.TaskService = void 0;
const enums_constants_1 = require("../constants/enums.constants");
const customAPIError_util_1 = __importDefault(require("../utils/errors/customAPIError.util"));
class TaskService {
    constructor(repo) {
        this.taskRepository = repo;
    }
    static getInstance(repo) {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService(repo);
        }
        return TaskService.instance;
    }
    createTask(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.taskRepository.create(Object.assign(Object.assign({}, data), { userId, status: data.status || enums_constants_1.TaskStatus.PENDING }));
        });
    }
    getTasks(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskRepository.findAll(params);
            return {
                tasks: result.rows,
                total: result.count,
                currentPage: Number(params.page) || 1,
                totalPages: Math.ceil(result.count / (Number(params.limit) || 10))
            };
        });
    }
    updateTask(id, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.update(id, data, userId);
            if (!task)
                throw new customAPIError_util_1.default('Task not found', 404);
            return task;
        });
    }
    deleteTask(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.taskRepository.delete(id, userId);
            if (!deleted)
                throw new customAPIError_util_1.default('Task not found', 404);
            return true;
        });
    }
}
exports.TaskService = TaskService;
exports.default = TaskService;
