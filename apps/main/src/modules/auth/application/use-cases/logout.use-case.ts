import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../../../../libs/common/src/validators/result-notification';
import { NotificationCode } from '../../../../../../../libs/common/src/configuration/notificationCode';

export class LogoutCommand {
  constructor(public userId: number, public deviceId: number) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase
  extends BaseNotificationUseCase<LogoutCommand, void>
  implements ICommandHandler<LogoutCommand>
{
  constructor(protected sessionsRepository: SessionsRepository) {
    super();
  }

  async executeUseCase(command: LogoutCommand) {
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
