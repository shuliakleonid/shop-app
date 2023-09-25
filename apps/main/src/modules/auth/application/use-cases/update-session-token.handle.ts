import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionExtendedDto } from '../../../sessions/application/dto/session-extended.dto';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { ApiJwtService } from '../../../api-jwt/api-jwt.service';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import { GenerateNewTokensDto } from '../../api/dtos/request/generate-new-token';
import { UserRepository } from '@main/modules/user/infrastructure/user.repository';
import { RoleRepository } from '@main/modules/user/infrastructure/role.repository';

export class UpdateSessionCommand {
  constructor(public dto: GenerateNewTokensDto) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionHandler
  extends BaseNotificationHandler<UpdateSessionCommand, { refreshToken: string }>
  implements ICommandHandler<UpdateSessionCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    protected apiJwtService: ApiJwtService,
    protected sessionsRepository: SessionsRepository,
  ) {
    super();
  }

  async executeHandler(command: UpdateSessionCommand): Promise<{ refreshToken: string }> {
    const { deviceName, oldSessionData, ip } = command.dto;
    const user = await this.userRepository.findById(oldSessionData.userId);
    const userRoles = await this.roleRepository.getRoleByCode(user.roleId);
    const sessionToken = await this.apiJwtService.createSessionJWTToken(
      oldSessionData.userId,
      oldSessionData.deviceId,
      [userRoles.name],
    );
    const newSessionData = await this.apiJwtService.getRefreshTokenData(sessionToken);

    await this.updateSession({ ...newSessionData, ip, deviceName });
    return { refreshToken: sessionToken };
  }

  async updateSession(dto: SessionExtendedDto) {
    const foundSession = await this.sessionsRepository.findSessionByDeviceId(dto.deviceId);

    foundSession.updateSessionData(dto);
    await this.sessionsRepository.saveSession(foundSession);
  }
}
