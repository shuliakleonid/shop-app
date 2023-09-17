import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { RoleEntity } from '@main/modules/user/domain/role.entity';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRoleByCode(code: number): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({
      where: { code },
    });

    return role;
  }
}
