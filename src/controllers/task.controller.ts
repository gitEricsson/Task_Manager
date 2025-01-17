import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleResponse } from '../utils/helper.utils';
import { ITask } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';
import { CustomRequest } from '../interfaces/customRequest.interface';

class TaskController {
  private taskService: TaskService;

  constructor(baseService: TaskService) {
    this.taskService = baseService;
  }
  async createTask(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const task = await this.taskService.createTask(req.user!.id, req.body);
      return handleResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.role === 'admin' ? undefined : req.user?.id;
      const result = await this.taskService.getTasks({
        ...req.query,
        userId
      });
      return handleResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'Tasks retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.role === 'admin' ? undefined : req.user?.id;
      const task = await this.taskService.updateTask(
        Number(req.params.id),
        req.body,
        userId
      );
      return handleResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  deleteTask = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.role === 'admin' ? undefined : req.user?.id;
      await this.taskService.deleteTask(Number(req.params.id), userId);
      return handleResponse({
        res,
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TaskController;
