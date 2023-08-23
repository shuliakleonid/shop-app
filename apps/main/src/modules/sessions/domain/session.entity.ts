import { Session } from '@prisma/client';
import { CustomerEntity } from '../../customers/domain/customer.entity';
import { SessionExtendedDto } from '../application/dto/session-extended.dto';

export class SessionEntity implements Session {
  deviceId: number;
  customerId: number;
  exp: number;
  ip: string;
  deviceName: string;
  iat: number;
  customer: CustomerEntity;

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
    customerId: number;
    iat: number;
    deviceName: string;
  }) {
    const session = new SessionEntity();
    session.ip = param.ip;
    session.exp = param.exp;
    session.deviceId = param.deviceId;
    session.customerId = param.customerId;
    session.iat = param.iat;
    session.deviceName = param.deviceName;
    return session;
  }

  hasOwner(customerId: number) {
    return this.customerId === customerId;
  }
}
