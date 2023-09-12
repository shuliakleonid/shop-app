import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import jwtConfig from '@common/modules/api-config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private jwtTokenConfig: ConfigType<typeof jwtConfig>,
    protected securityRepository: SessionsRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtTokenConfig.ACCESS_TOKEN_SECRET,
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
