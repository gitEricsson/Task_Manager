import { Model } from 'sequelize';
import { UserRoles } from '../constants/enums.constants';
import { IUser } from '../interfaces/user.interface';
import User from '../models/user.model';
import BaseUserRepository from '../repositories/user.repository';
import { userRepository } from '../dependencies/dependencies';

/**
 * Mapping User Roles to their respective models
 */
const RoleToModelMap: { [k: string]: typeof User } = {
  [UserRoles.ADMIN]: User,
  [UserRoles.USER]: User,
  [UserRoles.MANAGER]: User
};

/**
 * Logic to handle the creation of a user profile
 *
 * @param base - Base user data containing `_id` and role
 * @param credentials - Partial user data for the profile
 * @param model - Repository to handle database operations
 */
export const createUserProfile = async (
  base: { id: number; role: UserRoles } | IUser,
  credentials: Partial<IUser>,
  model: BaseUserRepository
): Promise<IUser> => {
  const ProfileModel = RoleToModelMap[base.role];

  if (!ProfileModel) {
    throw new Error('Unable to identify user role for profile creation.');
  }
  try {
    const newUser = await model.create({
      id: base.id,
      ...credentials
    });

    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    } else {
      throw new Error('Failed to create user profile: Unknown error');
    }
  }
};

/**
 * Logic to fetch user data by role
 *
 * @param userId - Unique ID of the user
 * @param credentials - User credentials containing role
 * @param model - Repository to handle database operations
 */
export const getUserData = async (
  userId: number,
  credentials: IUser
): Promise<IUser | null> => {
  const ProfileModel = RoleToModelMap[credentials.role];

  if (!ProfileModel) {
    throw new Error('Unable to identify user role for fetching data.');
  }

  try {
    const userData = await userRepository.findMe(userId);
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user data: ${error.message}`);
    } else {
      throw new Error('Failed to fetch user data: Unknown error');
    }
  }
};
