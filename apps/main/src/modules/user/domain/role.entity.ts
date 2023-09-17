import { Role, RoleTitle } from '@prisma/client';

export class RoleEntity implements Role {
  id: number;
  code: number;
  name: RoleTitle;
  description: string;

}
