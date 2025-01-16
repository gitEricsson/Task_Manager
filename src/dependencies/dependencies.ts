import { TaskRepository } from '../repositories/task.repository';
import UserRepository from '../repositories/user.repository';
import AuthService from '../services/auth/auth.service';
import TaskService from '../services/task.service';
import OtpService from '../services/otp.service';

import Guard from '../utils/auth/tokens.auth.util';
import HashData from '../utils/hashData.utils';
import RefreshTokenBrain from '../utils/auth/tokenBrain.auth.util';

// Utils instances
export const hash = new HashData();
export const guard = Guard.getInstance();
export const tokenBrain = RefreshTokenBrain.getInstance();

// Repository instances
export const userRepository = UserRepository.getInstance();
export const taskRepository = TaskRepository.getInstance();

// Service instances
const userService = AuthService.getInstance(userRepository, tokenBrain, guard);

// Auth dependencies array
export const authDependencies: [Guard, UserRepository, RefreshTokenBrain] = [
  guard,
  userRepository,
  tokenBrain
];

// Service instances with dependencies
const taskService = TaskService.getInstance(taskRepository);
const otpService = OtpService.getInstance(hash, guard, userService);

// Export all services
export { userService, otpService, taskService };
