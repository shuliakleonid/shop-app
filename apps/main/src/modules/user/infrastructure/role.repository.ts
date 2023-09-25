import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { RoleEntity } from '@main/modules/user/domain/role.entity';
import { RoleTitle } from '@prisma/client';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRoleByCode(code: number): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({
      where: { code },
    });

    return role;
  }

  async getRoleByName(name: RoleTitle): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findFirst({
      where: { name },
    });
    return role;
  }

  async save(role: RoleEntity) {
    await this.prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
        code: role.code,
      },
    });
  }
}
