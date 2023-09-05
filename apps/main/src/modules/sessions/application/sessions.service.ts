import { Injectable } from '@nestjs/common';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { SessionsRepository } from '../infrastructure/sessions-repository';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async findSessionByDeviceId(deviceId: number, userId: number) {
    const foundSession = await this.sessionsRepository.findSessionByDeviceId(deviceId);
    if (!foundSession) throw new NotificationException('Session not found', 'session', NotificationCode.NOT_FOUND);
    if (!foundSession.hasOwner(userId))
      throw new NotificationException(
        "You don't have permission to delete this session",
        'session',
        NotificationCode.FORBIDDEN,
      );
    return foundSession;
  }
}
