import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/common/src/modules/prisma/prisma.service';
import { CustomerEntity } from '../domain/customer.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(customer: CustomerEntity) {
    const data = {
      email: customer.email,
      userName: customer.userName,
      password: customer.password,
    };

    const createdUser = await this.prisma.customer.create({
      data,
      select: { id: true },
    });
    return createdUser.id;
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        email: { equals: email.toLowerCase() },
      },
    });
    return plainToInstance(CustomerEntity, customer);
  }
}
