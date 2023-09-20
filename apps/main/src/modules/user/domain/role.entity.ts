import { Role, RoleTitle } from '@prisma/client';

export class RoleEntity implements Role {
  id: number;
  code: number;
  name: RoleTitle;
  description: string;

  static initCreateRole(name: RoleTitle): RoleEntity {
    const role = new RoleEntity();
    role.code = 1;
    role.name = name;
    return role;
  }
}
