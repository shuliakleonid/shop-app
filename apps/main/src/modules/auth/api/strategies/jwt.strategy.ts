import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private apiConfigService: ApiConfigService, protected securityRepository: SessionsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<{ customerId: string }> {
    const foundSession = await this.securityRepository.findSessionByDeviceId(payload.deviceId);
    if (!foundSession) {
      throw new UnauthorizedException();
    }
    return { customerId: payload.customerId };
  }
}
