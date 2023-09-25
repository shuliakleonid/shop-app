import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ApiJwtService } from '@main/modules/api-jwt/api-jwt.service';
import { SessionsRepository } from '@main/modules/sessions/infrastructure/sessions-repository';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    protected apiJwtService: ApiJwtService,
    protected securityRepository: SessionsRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

    if (isPublicRoute) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const sessionData = await this.apiJwtService.getRefreshTokenData(
      req?.cookies?.refreshToken || req?.headers?.cookie.split(';')[0].split('=')[1],
    );
    if (!sessionData) throw new UnauthorizedException();

    const foundSession = await this.securityRepository.findSessionByDeviceId(sessionData.deviceId);
    if (!foundSession || sessionData.iat !== foundSession.iat || sessionData.userId !== foundSession.userId)
      throw new UnauthorizedException();
    req.user = sessionData;
    //@ts-ignore
    req.sessionData = sessionData;
    return true;
  }
}
