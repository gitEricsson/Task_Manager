import { Model } from 'sequelize';

export interface IToken extends Model {
  id: string | number;
  otp: number;
  role: string;
  email: string;
}

export type ITokenResult = {
  accessToken: string;
  refreshToken: string;
};
