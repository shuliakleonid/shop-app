import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { LoginCommand } from './use-cases/login.handler';
import { TokensType } from './types/types';
import { ApiJwtService } from '../../api-jwt/api-jwt.service';
import { SessionsRepository } from '../../sessions/infrastructure/sessions-repository';
import { SessionEntity } from '../../sessions/domain/session.entity';
import { LoginInputDto } from '../api/dtos/request/login.dto';
import { UserRepository } from '@main/modules/user/infrastructure/user.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly apiJwtService: ApiJwtService,
    private readonly sessionsRepository: SessionsRepository,
    private readonly customerRepository: UserRepository,
  ) {}

  async checkCredentialsOfCustomer(dto: LoginInputDto): Promise<number | null> {
    const foundCustomer = await this.customerRepository.findByEmail(dto.email);

    if (!foundCustomer || !(await this.passwordIsCorrect(dto.password, foundCustomer.password))) return null;
    return foundCustomer.id;
  }

  private async passwordIsCorrect(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash);
  }

  async getPasswordHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, passwordSalt);
  }

  async loginUser(command: LoginCommand): Promise<TokensType> {
    const { customerId, deviceName, ip } = command;

    let session = await this.sessionsRepository.newDeviceId();
    const tokens = await this.apiJwtService.createJWT(customerId, session.deviceId);
    const refreshTokenData = await this.apiJwtService.getRefreshTokenData(tokens.refreshToken);

    session = SessionEntity.initCreate({ ...refreshTokenData, ip, deviceName });
    await this.sessionsRepository.saveSession(session);

    return tokens;
  }
}
