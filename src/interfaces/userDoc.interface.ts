import { UserRoles } from '../constants/enums.constants';

export type UserDoc = {
  id: string | number;
  name: string;
  role: UserRoles;
  isVerified: boolean;
  email: string;
};
