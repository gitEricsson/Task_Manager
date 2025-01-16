import { Op } from 'sequelize';
import Task from '../models/task.model';

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
  search?: string;
}

export class TaskRepository {
  private static instance: TaskRepository;
  protected constructor() {}

  public static getInstance(): TaskRepository {
    if (!TaskRepository.instance) {
      TaskRepository.instance = new TaskRepository();
    }
    return TaskRepository.instance;
  }

  async create(data: any) {
    return Task.create(data);
  }

  async findAll(params: TaskQueryParams) {
    const limit = Number(params.limit) || 10;
    const offset = ((Number(params.page) || 1) - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.userId) where.userId = params.userId;
    if (params.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${params.search}%` } },
        { description: { [Op.iLike]: `%${params.search}%` } }
      ];
    }

    return Task.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }

  async update(id: number, data: any, userId?: number) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const [updated] = await Task.update(data, { where });
    if (!updated) return null;

    return Task.findOne({ where: { id } });
  }

  async delete(id: number, userId?: number) {
    const where: any = { id };
    if (userId) where.userId = userId;

    return (await Task.destroy({ where })) > 0;
  }
}
