import { Model, Op, WhereOptions } from 'sequelize';
import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import CustomAPIError from '../utils/errors/customAPIError.util';

class UserRepository {
  private static instance: UserRepository;
  protected constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = await User.create(data);
    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  }

  async findMe(userId: number): Promise<IUser | null> {
    return User.findOne({
      where: { id: userId },
      include: ['profile'] // Adjust based on your associations
    });
  }

  async findOne(filter: WhereOptions): Promise<IUser | null> {
    return User.findOne({ where: filter });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const baseUser = await User.findOne({ where: { email } });
    return baseUser;
  }

  async findCredentialsByEmail(email: string) {
    return User.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'role', 'mfa']
    });
  }

  async findById(userId: number): Promise<IUser | null> {
    return User.findByPk(userId);
  }

  async findAndUpdateEmailVerificationStatus(email: string) {
    return User.update(
      { isVerified: true },
      { where: { email }, returning: true }
    ).then(([_, users]) => users[0]);
  }

  async findByEmailAndUpdate2FA_Status(email: string, state: boolean) {
    return User.update(
      { mfa: state },
      { where: { email }, returning: true }
    ).then(([_, users]) => users[0]);
  }

  async findByIdAndUpdateTelephone(id: number, telephone: string) {
    return User.update({ telephone }, { where: { id }, returning: true }).then(
      ([_, users]) => users[0]
    );
  }

  async findByIdAndUpdateName(id: number, firstName: string, lastName: string) {
    return User.update(
      { firstName, lastName },
      { where: { id }, returning: true }
    ).then(([_, users]) => users[0]);
  }

  async findByIdAndUpdatePassword(id: number, password: string) {
    return User.update({ password }, { where: { id }, returning: true }).then(
      ([_, users]) => users[0]
    );
  }

  async findAll(pageNumber: number, limit: number, query: WhereOptions = {}) {
    return User.findAndCountAll({
      where: query,
      limit,
      offset: (pageNumber - 1) * limit,
      order: [['createdAt', 'DESC']]
    });
  }

  async findByIdAndUpdate(userId: number, fields: object) {
    return User.update(fields, {
      where: { id: userId },
      returning: true
    }).then(([_, users]) => users[0]);
  }

  async findOneAndUpdate(filter: WhereOptions, payload: object) {
    return User.update(payload, {
      where: filter,
      returning: true
    }).then(([_, users]) => users[0]);
  }

  async findByIdAndUpdateAccountStatus(id: number, accountStatus: string) {
    return User.update(
      { accountStatus },
      { where: { id }, returning: true }
    ).then(([_, users]) => users[0]);
  }

  async findByLocation(location: {
    country?: string;
    state?: string;
    city?: string;
  }) {
    const where: WhereOptions = {};
    if (location.country) where['country'] = location.country;
    if (location.state) where['state'] = location.state;
    if (location.city) where['city'] = location.city;

    return User.findAll({
      where,
      attributes: { exclude: ['password'] }
    });
  }

  async findByRole(role: string) {
    return User.findAll({
      where: { role },
      attributes: { exclude: ['password'] }
    });
  }

  async findByIdAndDelete(userId: number) {
    const deleted = await User.destroy({ where: { id: userId } });
    return deleted > 0;
  }
}

export default UserRepository;
