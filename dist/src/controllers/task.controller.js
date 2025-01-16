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
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const helper_utils_1 = require("../utils/helper.utils");
class TaskController {
    constructor(baseService) {
        this.deleteTask = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                yield this.taskService.deleteTask(Number(req.params.id), userId);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.NO_CONTENT,
                    message: 'Task deleted successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.taskService = baseService;
    }
    createTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield this.taskService.createTask(req.user.id, req.body);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.CREATED,
                    message: 'Task created successfully',
                    data: task
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTasks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                const result = yield this.taskService.getTasks(Object.assign(Object.assign({}, req.query), { userId }));
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: 'Tasks retrieved successfully',
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                const task = yield this.taskService.updateTask(Number(req.params.id), req.body, userId);
                return (0, helper_utils_1.handleResponse)({
                    res,
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: 'Task updated successfully',
                    data: task
                });
            }
            catch (error) {
                if (error.message === 'Task not found') {
                    return res.status(404).json({ error: error.message });
                }
                next(error);
            }
        });
    }
}
exports.default = TaskController;
