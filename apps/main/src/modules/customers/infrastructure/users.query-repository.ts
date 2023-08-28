import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/common/src/modules/prisma/prisma.service';

@Injectable()
export class CustomerQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.customer.findFirst({ where: { id } });
  }
}