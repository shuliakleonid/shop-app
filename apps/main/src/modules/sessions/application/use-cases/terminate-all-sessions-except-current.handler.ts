import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../sessions.service';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { SessionsRepository } from '../../infrastructure/sessions-repository';

export class TerminateAllSessionsExceptCurrentCommand {
  constructor(public readonly userId: number, public readonly deviceId: number) {}
}

@CommandHandler(TerminateAllSessionsExceptCurrentCommand)
export class TerminateAllSessionsExceptCurrentHandler
  extends BaseNotificationHandler<TerminateAllSessionsExceptCurrentCommand, void>
  implements ICommandHandler<TerminateAllSessionsExceptCurrentCommand>
{
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly sessionsRepository: SessionsRepository,
  ) {
    super();
  }

  async executeHandler(command: TerminateAllSessionsExceptCurrentCommand): Promise<void> {
    const { userId, deviceId } = command;
    await this.sessionsService.findSessionByDeviceId(deviceId, userId);
    await this.sessionsRepository.deleteAllSessionsExceptCurrent(deviceId, userId);
  }
}
