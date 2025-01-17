import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db/db.config';
import {
  UserRoles,
  NotificationList,
  AccountStatus
} from '../constants/enums.constants';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public role!: UserRoles;
  public isVerified!: boolean;
  public MFA!: boolean;
  public accountStatus!: AccountStatus;
  public notificationPreference!: NotificationList;
  public otp?: string;
  public otpExpiry?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
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
    }
  },
  {
    sequelize,
    modelName: 'User',
    // hooks: {
    //   beforeSave: async (user: User) => {
    //     if (user.changed('password')) {
    //       const salt = await bcrypt.genSalt(10);
    //       user.password = await bcrypt.hash(user.password, salt);
    //     }
    //   }
    // }
  }
);

export default User;
