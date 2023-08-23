import { Customer } from '@prisma/client';
import { BaseDateEntity } from '../../../../../../libs/common/src/entities/base-date.entity';

export const customerFieldParameters = {
  userNameLength: {
    min: 3,
    max: 30,
  },
};

export class CustomerEntity extends BaseDateEntity implements Customer {
  id: number;
  userName: string;
  email: string;
  password: string;

  constructor() {
    super();
  }

  static initCreateUser(userName: string, email: string, password: string): CustomerEntity {
    const instanceUser = new CustomerEntity();
    instanceUser.userName = userName;
    instanceUser.email = email.toLowerCase();
    instanceUser.password = password;
    return instanceUser;
  }
}
