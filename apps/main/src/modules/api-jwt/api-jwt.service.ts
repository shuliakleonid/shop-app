import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDataType, TokensType } from '../auth/application/types/types';
import { SessionDto } from '../sessions/application/dto/session.dto';
import { ApiConfigService } from '../../../../../libs/common/src/modules/api-config/api.config.service';

@Injectable()
export class ApiJwtService {
  constructor(private jwtService: JwtService, private apiConfigService: ApiConfigService) {}

  async createJWT(customerId: number, deviceId: number): Promise<TokensType> {
    const secretRT = this.apiConfigService.REFRESH_TOKEN_SECRET;
    const expiresInRT = this.apiConfigService.EXPIRED_REFRESH;
    const expiresInAc = this.apiConfigService.EXPIRED_ACCESS;

    const accessToken = this.jwtService.sign({ customerId, deviceId }, { expiresIn: expiresInAc });
    const refreshToken = this.jwtService.sign({ customerId, deviceId }, { secret: secretRT, expiresIn: expiresInRT });

    return { accessToken, refreshToken };
  }

  async getRefreshTokenData(refreshToken: string): Promise<SessionDto | null> {
    try {
      const secretRT = this.apiConfigService.REFRESH_TOKEN_SECRET;
      return this.jwtService.verify(refreshToken, { secret: secretRT }) as SessionDto;
    } catch (e) {
      return null;
    }
  }

  async getUserIdByAccessToken(accessToken: string): Promise<number | null> {
    try {
      const secretRT = this.apiConfigService.ACCESS_TOKEN_SECRET;
      const result = this.jwtService.verify(accessToken, { secret: secretRT }) as AccessTokenDataType;
      return result.userId;
    } catch (e) {
      return null;
    }
  }
}
