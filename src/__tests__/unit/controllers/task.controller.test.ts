import { Request, Response } from 'express';
import TaskController from '../../../controllers/task.controller';
import { TaskService } from '../../../services/task.service';
import { TaskStatus } from '../../../constants/enums.constants';
import CustomAPIError from '../../../utils/errors/customAPIError.util';

describe('TaskController', () => {
  let taskController: TaskController;
  let mockTaskService: jest.Mocked<TaskService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockTaskService = {
      createTask: jest.fn(),
      getTasks: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn()
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();

    taskController = new TaskController(mockTaskService);
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Description'
      };

      mockRequest = {
        body: taskData,
        user: { id: 1 }
      };

      const mockCreatedTask = {
        id: 1,
        ...taskData,
        userId: 1,
        status: TaskStatus.PENDING
      };

      mockTaskService.createTask.mockResolvedValue(mockCreatedTask);

      await taskController.createTask(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockTaskService.createTask).toHaveBeenCalledWith(1, taskData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedTask
      });
    });
  });

  describe('getTasks', () => {
    it('should get tasks with pagination', async () => {
      mockRequest = {
        query: { page: '1', limit: '10' },
        user: { id: 1 }
      };

      const mockTasks = {
        tasks: [{ id: 1, title: 'Task 1' }],
        total: 1,
        currentPage: 1,
        totalPages: 1
      };

      mockTaskService.getTasks.mockResolvedValue(mockTasks);

      await taskController.getTasks(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockTaskService.getTasks).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        userId: 1
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTasks
      });
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData = { title: 'Updated Task' };
      mockRequest = {
        params: { id: '1' },
        body: updateData,
        user: { id: 1 }
      };

      const mockUpdatedTask = { id: 1, ...updateData };
      mockTaskService.updateTask.mockResolvedValue(mockUpdatedTask);

      await taskController.updateTask(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, updateData, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedTask
      });
    });

    it('should handle task not found', async () => {
      mockRequest = {
        params: { id: '999' },
        body: {},
        user: { id: 1 }
      };

      mockTaskService.updateTask.mockRejectedValue(
        new CustomAPIError('Task not found', 404)
      );

      await taskController.updateTask(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(CustomAPIError));
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockRequest = {
        params: { id: '1' },
        user: { id: 1 }
      };

      mockTaskService.deleteTask.mockResolvedValue(true);

      await taskController.deleteTask(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: null
      });
    });
  });
});
