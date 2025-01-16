import { QueryInterface, DataTypes } from 'sequelize';
import { TaskStatus } from './../constants/enums.constants';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Tasks', {
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
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  await queryInterface.addIndex('Tasks', ['userId']);
  await queryInterface.addIndex('Tasks', ['status']);
  await queryInterface.addIndex('Tasks', ['dueDate']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('Tasks');
}
