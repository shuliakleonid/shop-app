import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../sessions.service';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { SessionsRepository } from '../../infrastructure/sessions-repository';

export class TerminateAllSessionsExceptCurrentCommand {
  constructor(public readonly userId: number, public readonly deviceId: number) {}
}

@CommandHandler(TerminateAllSessionsExceptCurrentCommand)
export class TerminateAllSessionsExceptCurrentUseCase
  extends BaseNotificationUseCase<TerminateAllSessionsExceptCurrentCommand, void>
  implements ICommandHandler<TerminateAllSessionsExceptCurrentCommand>
{
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly sessionsRepository: SessionsRepository,
  ) {
    super();
  }

  async executeUseCase(command: TerminateAllSessionsExceptCurrentCommand): Promise<void> {
    const { userId, deviceId } = command;
    await this.sessionsService.findSessionByDeviceId(deviceId, userId);
    await this.sessionsRepository.deleteAllSessionsExceptCurrent(deviceId, userId);
  }
}
