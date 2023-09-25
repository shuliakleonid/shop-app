import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDataType, TokensType } from '../auth/application/types/types';
import { SessionDto } from '../sessions/application/dto/session.dto';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '@common/modules/api-config/jwt.config';
import { RoleTitle } from '@prisma/client';

@Injectable()
export class ApiJwtService {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private jwtTokenConfig: ConfigType<typeof jwtConfig>,
  ) {}

  async createJWT(userId: number, deviceId: number, roles: RoleTitle[]): Promise<TokensType> {
    const secretRT = this.jwtTokenConfig.REFRESH_TOKEN_SECRET;
    const expiresInRT = this.jwtTokenConfig.EXPIRED_REFRESH;
    const expiresInAc = this.jwtTokenConfig.EXPIRED_ACCESS;

    const accessToken = this.jwtService.sign({ userId: userId, deviceId, roles }, { expiresIn: expiresInAc });
    const refreshToken = this.jwtService.sign(
      { userId: userId, deviceId, roles },
      { secret: secretRT, expiresIn: expiresInRT },
    );

    return { accessToken, refreshToken };
  }

  async createSessionJWTToken(userId: number, deviceId: number, roles: RoleTitle[]) {
    const secretRT = this.jwtTokenConfig.REFRESH_TOKEN_SECRET;
    const expiresInRT = this.jwtTokenConfig.EXPIRED_REFRESH;
    const refreshToken = this.jwtService.sign(
      { userId: userId, deviceId, roles },
      { secret: secretRT, expiresIn: expiresInRT },
    );
    return refreshToken;
  }

  async getRefreshTokenData(refreshToken: string): Promise<SessionDto | null> {
    try {
      const secretRT = this.jwtTokenConfig.REFRESH_TOKEN_SECRET;
      return this.jwtService.verify(refreshToken, { secret: secretRT }) as SessionDto;
    } catch (e) {
      return null;
    }
  }

  async getUserIdByAccessToken(accessToken: string): Promise<number | null> {
    try {
      const secretRT = this.jwtTokenConfig.ACCESS_TOKEN_SECRET;
      const result = this.jwtService.verify(accessToken, { secret: secretRT }) as AccessTokenDataType;
      return result.userId;
    } catch (e) {
      return null;
    }
  }
}
