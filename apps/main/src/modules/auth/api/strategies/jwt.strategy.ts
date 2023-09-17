import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import jwtConfig from '@common/modules/api-config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RoleTitle } from '@prisma/client';
import { UserRepository } from '@main/modules/user/infrastructure/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private jwtTokenConfig: ConfigType<typeof jwtConfig>,
    protected securityRepository: SessionsRepository,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtTokenConfig.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<{ userId: number; roles: RoleTitle[] }> {
    const foundSession = await this.securityRepository.findSessionByDeviceId(payload.deviceId);
    if (!foundSession) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findById(foundSession.userId);
    if (!user) throw new UnauthorizedException('');

    const userIsAdmin = user.roleId === 2;

    let userRole: RoleTitle = RoleTitle.CUSTOMER;
    if (userIsAdmin) userRole = RoleTitle.ADMINISTRATOR;

    return {
      userId: user.id,
      roles: [userRole],
    };
    // return { : payload.customerId };
  }
}
