import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db/db.config';
import { TaskStatus } from '../constants/enums.constants';

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public dueDate!: Date;
  public status!: 'pending' | 'in-progress' | 'completed';
  public userId!: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TaskStatus)),
      defaultValue: TaskStatus.PENDING
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Task'
  }
);

export default Task;
