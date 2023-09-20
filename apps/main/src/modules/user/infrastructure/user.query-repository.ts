import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';

@Injectable()
export class UserQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findRoles() {
    return this.prisma.role.findMany();
  }

  getAllCustomers() {
    return 'all customer';
  }
}
