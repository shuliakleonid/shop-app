import { Role, RoleTitle } from '@prisma/client';

export class RoleEntity implements Role {
  id: number;
  code: number;
  name: RoleTitle;
  description: string | null;

  static initCreateRole(name: RoleTitle, description?: string): RoleEntity {
    const role = new RoleEntity();
    role.name = name;
    role.description = description || null;
    return role;
  }
}
