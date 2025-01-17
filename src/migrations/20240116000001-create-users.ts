import { QueryInterface, DataTypes } from 'sequelize';
import {
  UserRoles,
  AccountStatus,
  NotificationList
} from '../constants/enums.constants';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRoles)),
      defaultValue: UserRoles.USER
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    MFA: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accountStatus: {
      type: DataTypes.STRING,
      validate: {
        isIn: [Object.values(AccountStatus)]
      },
      defaultValue: AccountStatus.ACTIVE
    },
    notificationPreference: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      validate: {
        isIn: {
          args: [Object.values(NotificationList)],
          msg: 'Notification preference must be one of the allowed values.'
        }
      },
      defaultValue: Object.values(NotificationList)
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true
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

  await queryInterface.addIndex('Users', ['email']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('Users');
}
