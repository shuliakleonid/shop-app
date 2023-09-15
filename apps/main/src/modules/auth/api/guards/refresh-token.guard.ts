import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import { ApiJwtService } from '../../../api-jwt/api-jwt.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(protected apiJwtService: ApiJwtService, protected securityRepository: SessionsRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const sessionData = await this.apiJwtService.getRefreshTokenData(req.cookies.refreshToken);
    if (!sessionData) throw new UnauthorizedException();

    const foundSession = await this.securityRepository.findSessionByDeviceId(sessionData.deviceId);
    if (!foundSession || sessionData.iat !== foundSession.iat || sessionData.userId !== foundSession.userId)
      throw new UnauthorizedException();

    req.sessionData = sessionData;
    return true;
  }
}
