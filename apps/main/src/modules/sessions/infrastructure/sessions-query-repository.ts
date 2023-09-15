import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { SessionEntity } from '../domain/session.entity';

export abstract class ISessionsQueryRepository {
  abstract findSessionsByUserId(userId: number): Promise<SessionEntity[]>;
}

@Injectable()
export class SessionsQueryRepository implements ISessionsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findSessionsByUserId(userId: number): Promise<SessionEntity[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
      },
    });
    return sessions.map(session => plainToInstance(SessionEntity, session));
  }
}
