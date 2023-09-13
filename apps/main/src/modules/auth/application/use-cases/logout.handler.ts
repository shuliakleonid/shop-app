import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';

export class LogoutCommand {
  constructor(public userId: number, public deviceId: number) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler
  extends BaseNotificationHandler<LogoutCommand, void>
  implements ICommandHandler<LogoutCommand>
{
  constructor(protected sessionsRepository: SessionsRepository) {
    super();
  }

  async executeHandler(command: LogoutCommand) {
    const { userId, deviceId } = command;

    const foundSession = await this.sessionsRepository.findSessionByDeviceId(deviceId);
    if (!foundSession) throw new NotificationException('Session not found', 'session', NotificationCode.NOT_FOUND);
    if (!foundSession.hasOwner(userId))
      throw new NotificationException(
        "You don't have permission to delete this session",
        'session',
        NotificationCode.FORBIDDEN,
      );

    await this.sessionsRepository.deleteSessionByDeviceId(deviceId);
  }
}
