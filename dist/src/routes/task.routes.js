"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enums_constants_1 = require("../constants/enums.constants");
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const dependencies_1 = require("../dependencies/dependencies");
const taskRoute = (0, express_1.Router)();
const taskController = new task_controller_1.default(dependencies_1.taskService);
// Create task - accessible to all authenticated users
taskRoute.post('/', authentication_middleware_1.default.authenticateUser, authentication_middleware_1.default.isUserAuthorized(Object.values(enums_constants_1.UserRoles)), taskController.createTask.bind(taskController));
// Get tasks - accessible to all authenticated users
taskRoute.get('/', authentication_middleware_1.default.authenticateUser, authentication_middleware_1.default.isUserAuthorized(Object.values(enums_constants_1.UserRoles)), taskController.getTasks.bind(taskController));
// Update task - accessible to all authenticated users
taskRoute.put('/:id', authentication_middleware_1.default.authenticateUser, authentication_middleware_1.default.isUserAuthorized(Object.values(enums_constants_1.UserRoles)), taskController.updateTask.bind(taskController));
// Delete task - accessible to all authenticated users
taskRoute.delete('/:id', authentication_middleware_1.default.authenticateUser, authentication_middleware_1.default.isUserAuthorized(Object.values(enums_constants_1.UserRoles)), taskController.deleteTask.bind(taskController));
exports.default = taskRoute;
