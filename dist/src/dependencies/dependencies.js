"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.otpService = exports.userService = exports.authDependencies = exports.taskRepository = exports.userRepository = exports.tokenBrain = exports.guard = exports.hash = void 0;
const task_repository_1 = require("../repositories/task.repository");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const auth_service_1 = __importDefault(require("../services/auth/auth.service"));
const task_service_1 = __importDefault(require("../services/task.service"));
const otp_service_1 = __importDefault(require("../services/otp.service"));
const tokens_auth_util_1 = __importDefault(require("../utils/auth/tokens.auth.util"));
const hashData_utils_1 = __importDefault(require("../utils/hashData.utils"));
const tokenBrain_auth_util_1 = __importDefault(require("../utils/auth/tokenBrain.auth.util"));
// Utils instances
exports.hash = new hashData_utils_1.default();
exports.guard = tokens_auth_util_1.default.getInstance();
exports.tokenBrain = tokenBrain_auth_util_1.default.getInstance();
// Repository instances
exports.userRepository = user_repository_1.default.getInstance();
exports.taskRepository = task_repository_1.TaskRepository.getInstance();
// Service instances
const userService = auth_service_1.default.getInstance(exports.userRepository, exports.tokenBrain, exports.guard);
exports.userService = userService;
// Auth dependencies array
exports.authDependencies = [
    exports.guard,
    exports.userRepository,
    exports.tokenBrain
];
// Service instances with dependencies
const taskService = task_service_1.default.getInstance(exports.taskRepository);
exports.taskService = taskService;
const otpService = otp_service_1.default.getInstance(exports.hash, exports.guard, userService, exports.userRepository);
exports.otpService = otpService;
