import { Session } from '@prisma/client';
import { UserEntity } from '@main/modules/user/domain/user.entity';
import { SessionExtendedDto } from '../application/dto/session-extended.dto';

export class SessionEntity implements Session {
  deviceId: number;
  userId: number;
  exp: number;
  ip: string;
  deviceName: string;
  iat: number;
  user: UserEntity;

  updateSessionData(dto: SessionExtendedDto) {
    this.ip = dto.ip;
    this.deviceName = dto.deviceName;
    this.exp = dto.exp;
    this.iat = dto.iat;
  }

  static initCreate(param: {
    ip: string;
    exp: number;
    deviceId: number;
    userId: number;
    iat: number;
    deviceName: string;
  }) {
    const session = new SessionEntity();
    session.ip = param.ip;
    session.exp = param.exp;
    session.deviceId = param.deviceId;
    session.userId = param.userId;
    session.iat = param.iat;
    session.deviceName = param.deviceName;
    return session;
  }

  hasOwner(userId: number) {
    return this.userId === userId;
  }
}
