import {
  TaskRepository,
  TaskQueryParams
} from '../repositories/task.repository';
import { TaskStatus } from '../constants/enums.constants';
import CustomAPIError from '../utils/errors/customAPIError.util';

export class TaskService {
  private taskRepository: TaskRepository;
  private static instance: TaskService;

  constructor(repo: TaskRepository) {
    this.taskRepository = repo;
  }

  public static getInstance(repo: TaskRepository): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService(repo);
    }
    return TaskService.instance;
  }

  async createTask(userId: number, data: any) {
    return this.taskRepository.create({
      ...data,
      userId,
      status: data.status || TaskStatus.PENDING
    });
  }

  async getTasks(params: TaskQueryParams) {
    const result = await this.taskRepository.findAll(params);
    return {
      tasks: result.rows,
      total: result.count,
      currentPage: Number(params.page) || 1,
      totalPages: Math.ceil(result.count / (Number(params.limit) || 10))
    };
  }

  async updateTask(id: number, data: any, userId?: number) {
    const task = await this.taskRepository.update(id, data, userId);
    if (!task) throw new CustomAPIError('Task not found', 404);
    return task;
  }

  async deleteTask(id: number, userId?: number) {
    const deleted = await this.taskRepository.delete(id, userId);
    if (!deleted) throw new CustomAPIError('Task not found', 404);
    return true;
  }
}

export default TaskService;
