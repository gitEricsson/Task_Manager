import { TaskService } from '../../../services/task.service';
import { TaskRepository } from '../../../repositories/task.repository';
import { TaskStatus } from '../../../constants/enums.constants';
import CustomAPIError from '../../../utils/errors/customAPIError.util';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    userId: 1,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    taskService = new TaskService(mockTaskRepository);
  });

  describe('createTask', () => {
    it('should create a task with default status', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Description'
      };

      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(1, taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...taskData,
        userId: 1,
        status: TaskStatus.PENDING
      });
      expect(result).toEqual(mockTask);
    });

    it('should create a task with provided status', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        status: TaskStatus.IN_PROGRESS
      };

      mockTaskRepository.create.mockResolvedValue({
        ...mockTask,
        status: TaskStatus.IN_PROGRESS
      });

      const result = await taskService.createTask(1, taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...taskData,
        userId: 1
      });
      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });
  });

  describe('getTasks', () => {
    it('should get tasks with pagination', async () => {
      const mockPaginatedResult = {
        rows: [mockTask],
        count: 1
      };

      mockTaskRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await taskService.getTasks({ page: 1, limit: 10 });

      expect(result).toEqual({
        tasks: [mockTask],
        total: 1,
        currentPage: 1,
        totalPages: 1
      });
    });

    it('should handle empty results', async () => {
      mockTaskRepository.findAll.mockResolvedValue({ rows: [], count: 0 });

      const result = await taskService.getTasks({});

      expect(result).toEqual({
        tasks: [],
        total: 0,
        currentPage: 1,
        totalPages: 0
      });
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedTask = { ...mockTask, ...updateData };

      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, updateData, 1);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(1, updateData, 1);
      expect(result).toEqual(updatedTask);
    });

    it('should throw error when task not found', async () => {
      mockTaskRepository.update.mockResolvedValue(null);

      await expect(taskService.updateTask(1, {}, 1)).rejects.toThrow(
        new CustomAPIError('Task not found', 404)
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockTaskRepository.delete.mockResolvedValue(true);

      const result = await taskService.deleteTask(1, 1);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(1, 1);
      expect(result).toBe(true);
    });

    it('should throw error when task not found', async () => {
      mockTaskRepository.delete.mockResolvedValue(false);

      await expect(taskService.deleteTask(1, 1)).rejects.toThrow(
        new CustomAPIError('Task not found', 404)
      );
    });
  });
});
