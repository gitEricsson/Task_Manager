import { Router } from 'express';
import { UserRoles } from '../constants/enums.constants';
import AuthMiddleware from '../middlewares/authentication.middleware';
import TaskController from '../controllers/task.controller';
import { taskService } from '../dependencies/dependencies';
import { TaskRepository } from '../repositories/task.repository';

const taskRoute: Router = Router();
const taskController: TaskController = new TaskController(taskService);

// Create task - accessible to all authenticated users
taskRoute.post(
  '/',
  AuthMiddleware.authenticateUser,
  AuthMiddleware.isUserAuthorized(Object.values(UserRoles)),
  taskController.createTask.bind(taskController)
);

// Get tasks - accessible to all authenticated users
taskRoute.get(
  '/',
  AuthMiddleware.authenticateUser,
  AuthMiddleware.isUserAuthorized(Object.values(UserRoles)),
  taskController.getTasks.bind(taskController)
);

// Update task - accessible to all authenticated users
taskRoute.put(
  '/:id',
  AuthMiddleware.authenticateUser,
  AuthMiddleware.isUserAuthorized(Object.values(UserRoles)),
  taskController.updateTask.bind(taskController)
);

// Delete task - accessible to all authenticated users
taskRoute.delete(
  '/:id',
  AuthMiddleware.authenticateUser,
  AuthMiddleware.isUserAuthorized(Object.values(UserRoles)),
  taskController.deleteTask.bind(taskController)
);

export default taskRoute;
