import { TaskStatus } from '../constants/enums.constants';

export interface ITask {
  id: number;
  title: string;
  description?: string;
  dueDate?: Date;
  status: TaskStatus;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
