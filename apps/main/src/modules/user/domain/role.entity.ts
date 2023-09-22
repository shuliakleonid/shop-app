import { Role, RoleTitle } from '@prisma/client';
import { USER_ROLE } from '@main/modules/user/application/create-role.handler';

export class RoleEntity implements Role {
  id: number;
  code: number;
  name: RoleTitle;
  description: string | null;

  static initCreateRole(name: RoleTitle, description?: string, code?: number): RoleEntity {
    const role = new RoleEntity();
    role.code = code || USER_ROLE.CUSTOMER;
    role.name = name;
    role.description = description || null;
    return role;
  }
}
