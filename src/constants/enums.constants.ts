export enum UserRoleAbr {
  ADMIN = 'AD',
  USER = 'US',
  MANAGER = 'MG'
}

export enum EmailSubject {
  SUCCESS = '',
  FAILED = '',
  SUBSCRIPTION_SUCCESS = '',
  CANCELLED = '',
  PENDING = '',
  CARD_EXPIRATION = '',
  SUBSCRIPTION_FAILED = ''
}

enum EHTTPMethods {
  POST = 'POST',
  GET = 'GET',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export enum UserRoles {
  ADMIN = 'Admin',
  USER = 'User',
  MANAGER = 'Manager'
}

export enum NotificationList {
  EMAIL = 'Email',
  PUSH = 'Push',
  SMS = 'Sms'
}

export enum OTPTypes {
  Email = 'emailOtp',
  MFA = '2FAOtp',
  ForgotPassword = 'forgotPasswordOtp'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export enum AccountStatus {
  SUSPENDED = 'Suspended',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}
