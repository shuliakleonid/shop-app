import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../sessions.service';
import { SessionsRepository } from '../../infrastructure/sessions-repository';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';

/**
 * @description Delete selected session command
 */
export class DeleteSelectedSessionCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceIdForDelete: number,
    public readonly deviceId: number,
  ) {}
}

@CommandHandler(DeleteSelectedSessionCommand)
export class DeleteSelectedSessionUseCase
  extends BaseNotificationUseCase<DeleteSelectedSessionCommand, void>
  implements ICommandHandler<DeleteSelectedSessionCommand>
{
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly sessionsRepository: SessionsRepository,
  ) {
    super();
  }

  /**
   * @description Delete selected session
   * @param command
   */
  async executeUseCase(command: DeleteSelectedSessionCommand): Promise<void> {
    const { userId, deviceIdForDelete, deviceId } = command;
    //finding device by id from uri params
    await this.sessionsService.findSessionByDeviceId(deviceIdForDelete, userId);
    //find current session
    await this.sessionsService.findSessionByDeviceId(deviceId, userId);
    //delete session by id
    await this.sessionsRepository.deleteSessionByDeviceId(deviceIdForDelete);
  }
}
