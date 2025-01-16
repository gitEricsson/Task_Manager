import { z, ZodObject, ZodRawShape } from 'zod';
import { UserRoles, AccountStatus } from '../../../constants/enums.constants';
import validator from 'validator';
import isSecureRole from '../../auth/isSecureRole.auth.util';

let baseUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(Object.values(UserRoles) as [string, ...string[]]),
  name: z.string().optional(),
  isVerified: z
    .boolean()
    .default(false)
    .optional(),
  MFA: z
    .boolean()
    .default(false)
    .optional(),
  accountStatus: z
    .enum(Object.values(AccountStatus) as [AccountStatus, ...AccountStatus[]])
    .default(AccountStatus.ACTIVE)
    .optional()
});

const passwordSchema = {
  password: z
    .string()
    .min(8)
    .refine(data => validator.isStrongPassword(data), {
      message:
        'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    })
};

export const validateBaseUser = (data: any, role: string) => {
  baseUserSchema = baseUserSchema.merge(z.object({ firstName: z.string() }));

  if (isSecureRole(role)) {
    const schema = baseUserSchema.merge(z.object(passwordSchema));
    schema.parse(data);
  } else {
    baseUserSchema.parse(data);
  }
};
