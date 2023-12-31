import { SessionEntity } from '../domain/session.entity';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@common/modules/prisma/prisma.service';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSessionByDeviceId(deviceId: number): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        deviceId,
      },
    });
    return plainToInstance(SessionEntity, session);
  }

  async saveSession(session: SessionEntity): Promise<void> {
    await this.prisma.session.update({
      where: { deviceId: session.deviceId },
      data: {
        userId: session.userId,
        exp: session.exp,
        ip: session.ip,
        deviceName: session.deviceName,
        iat: session.iat,
      },
    });
  }

  async deleteSessionByDeviceId(deviceId: number): Promise<void> {
    await this.prisma.session.delete({ where: { deviceId } });
  }

  async newDeviceId(): Promise<SessionEntity> {
    const session = await this.prisma.session.create({
      data: {},
    });
    return plainToInstance(SessionEntity, session);
  }

  async deleteAllSessionsExceptCurrent(deviceId: number, userId: number): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        AND: [{ userId: { equals: userId } }, { deviceId: { not: { equals: deviceId } } }],
      },
    });
  }
}
