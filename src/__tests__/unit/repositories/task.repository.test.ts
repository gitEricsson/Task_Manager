import { taskRepository } from '../../../dependencies/dependencies';
import { TaskRepository } from '../../../repositories/task.repository';
import Task from '../../../models/task.model';
import { TaskStatus } from '../../../constants/enums.constants';
import { Op } from 'sequelize';

jest.mock('../../../models/task.model');

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  const MockTask = Task as jest.MockedClass<typeof Task>;

  beforeEach(() => {
    jest.clearAllMocks();
    taskRepository = taskRepository;
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Description',
        userId: 1
      };

      MockTask.create = jest.fn().mockResolvedValue(taskData as any);

      const result = await taskRepository.create(taskData);

      expect(MockTask.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(taskData);
    });
  });

  describe('findAll', () => {
    it('should find tasks with pagination', async () => {
      const params = {
        page: 1,
        limit: 10,
        userId: 1
      };

      const mockResult = {
        rows: [{ id: 1, title: 'Task 1' }],
        count: 1
      };

      MockTask.findAndCountAll = jest.fn().mockResolvedValue(mockResult as any);

      const result = await taskRepository.findAll(params);

      expect(MockTask.findAndCountAll).toHaveBeenCalledWith({
        where: { userId: 1 },
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockResult);
    });

    it('should include search in query', async () => {
      const params = {
        search: 'test',
        userId: 1
      };

      await taskRepository.findAll(params);

      expect(MockTask.findAndCountAll).toHaveBeenCalledWith({
        where: {
          userId: 1,
          [Op.or]: [
            { title: { [Op.iLike]: '%test%' } },
            { description: { [Op.iLike]: '%test%' } }
          ]
        },
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']]
      });
    });
  });

  describe('update', () => {
    it('should update task', async () => {
      const updateData = { title: 'Updated' };
      const mockUpdatedTask = { id: 1, ...updateData };

      MockTask.update = jest.fn().mockResolvedValue([1]);
      MockTask.findOne = jest.fn().mockResolvedValue(mockUpdatedTask as any);

      const result = await taskRepository.update(1, updateData, 1);

      expect(MockTask.update).toHaveBeenCalledWith(updateData, {
        where: { id: 1, userId: 1 }
      });
      expect(MockTask.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should return null if task not found', async () => {
      MockTask.update = jest.fn().mockResolvedValue([0]);

      const result = await taskRepository.update(1, {}, 1);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete task', async () => {
      MockTask.destroy = jest.fn().mockResolvedValue(1);

      const result = await taskRepository.delete(1, 1);

      expect(MockTask.destroy).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 }
      });
      expect(result).toBe(true);
    });

    it('should return false if task not found', async () => {
      MockTask.destroy = jest.fn().mockResolvedValue(0);

      const result = await taskRepository.delete(1, 1);

      expect(result).toBe(false);
    });
  });
});
