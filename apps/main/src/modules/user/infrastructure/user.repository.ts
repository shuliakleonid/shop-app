import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { UserEntity } from '../domain/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: UserEntity) {
    const data = {
      email: user.email,
      userName: user.userName,
      password: user.password,
      roleId: user.roleId,
    };

    const createdUser = await this.prisma.user.create({
      data,
      select: { id: true },
    });
    return createdUser.id;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: { equals: email.toLowerCase() },
      },
    });
    return plainToInstance(UserEntity, user);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: { equals: id },
      },
    });
    return plainToInstance(UserEntity, user);
  }
}
