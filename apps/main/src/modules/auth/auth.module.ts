import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LocalStrategy } from './api/strategies/local.strategy';
import { JwtStrategy } from './api/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiConfigModule } from '../../../../../libs/common/src/modules/api-config/api.config.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { CustomersModule } from '../customers/customers.module';
import { ApiJwtModule } from '../api-jwt/api-jwt.module';
import { SessionsRepository } from '../sessions/infrastructure/sessions-repository';
import { LoginUseCase } from './application/use-cases/login.use-case';

const useCases = [RegisterUserUseCase, LoginUseCase];
const strategies = [LocalStrategy, JwtStrategy];

@Module({
  imports: [CqrsModule, ApiConfigModule, CustomersModule, ApiJwtModule],
  controllers: [AuthController],
  providers: [AuthService, SessionsRepository, ...useCases, ...strategies],
  exports: [AuthService],
})
export class AuthModule {}
