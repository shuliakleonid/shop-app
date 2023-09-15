import { TokensType } from '../types/types';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionExtendedDto } from '../../../sessions/application/dto/session-extended.dto';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { ApiJwtService } from '../../../api-jwt/api-jwt.service';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import { GenerateNewTokensDto } from '../../api/dtos/request/generate-new-token';

export class UpdateTokensCommand {
  constructor(public dto: GenerateNewTokensDto) {}
}

@CommandHandler(UpdateTokensCommand)
export class GenerateNewTokensHandler
  extends BaseNotificationHandler<UpdateTokensCommand, TokensType>
  implements ICommandHandler<UpdateTokensCommand>
{
  constructor(protected apiJwtService: ApiJwtService, protected sessionsRepository: SessionsRepository) {
    super();
  }

  async executeHandler(command: UpdateTokensCommand): Promise<TokensType> {
    const { deviceName, oldSessionData, ip } = command.dto;

    const tokens = await this.apiJwtService.createJWT(oldSessionData.userId, oldSessionData.deviceId);
    const newSessionData = await this.apiJwtService.getRefreshTokenData(tokens.refreshToken);

    await this.updateSession({ ...newSessionData, ip, deviceName });
    return tokens;
  }

  async updateSession(dto: SessionExtendedDto) {
    const foundSession = await this.sessionsRepository.findSessionByDeviceId(dto.deviceId);

    foundSession.updateSessionData(dto);
    await this.sessionsRepository.saveSession(foundSession);
  }
}
