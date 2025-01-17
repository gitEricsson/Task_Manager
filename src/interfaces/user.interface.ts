import {
  AccountStatus,
  UserRoles,
  NotificationList
} from '../constants/enums.constants';

export interface IUser {
  id: number;
  email: string;
  password: string;
  name?: string;
  role: UserRoles;
  isVerified: boolean;
  MFA: boolean;
  accountStatus: AccountStatus;
  notificationPreference: NotificationList;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
