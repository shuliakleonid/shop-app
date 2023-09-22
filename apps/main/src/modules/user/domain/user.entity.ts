import { BaseDateEntity } from '@common/entities/base-date.entity';
import { User } from '@prisma/client';

export const customerFieldParameters = {
  userNameLength: {
    min: 3,
    max: 30,
  },
};

export class UserEntity extends BaseDateEntity implements User {
  id: number;
  roleId: number;
  userName: string;
  email: string;
  password: string;

  constructor() {
    super();
  }

  static initCreateUser(userName: string, email: string, password: string, code: number): UserEntity {
    const instanceUser = new UserEntity();
    instanceUser.roleId = code;
    instanceUser.userName = userName;
    instanceUser.email = email.toLowerCase();
    instanceUser.password = password;
    return instanceUser;
  }

  assignRole(user: UserEntity, roleId: number) {
    user.roleId = roleId;
  }
}
