import { UserRoles } from "../../constants/enums.constants";

const isSecureRole = (role: string): boolean => {
  return Object.values(UserRoles).includes(role as UserRoles);
};

export default isSecureRole;
