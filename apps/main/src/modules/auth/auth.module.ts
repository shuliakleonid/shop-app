import { RegisterUserHandler } from './application/use-cases/register-user.handler';
import { LocalStrategy } from './api/strategies/local.strategy';
import { JwtStrategy } from './api/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UserModule } from '@main/modules/user/user.module';
import { ApiJwtModule } from '../api-jwt/api-jwt.module';
import { SessionsRepository } from '../sessions/infrastructure/sessions-repository';
import { LoginHandler } from './application/use-cases/login.handler';
import { LogoutHandler } from './application/use-cases/logout.handler';
import { GenerateNewTokensHandler } from './application/use-cases/update-tokens.handler';
import { UserQueryRepository } from '@main/modules/user/infrastructure/user.query-repository';
import { KafkaModule } from '@common/modules/kafka/kafka.module';
import { LoginConsumer } from './login.consumer';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@common/modules/api-config/jwt.config';

const useCases = [RegisterUserHandler, LoginHandler, LogoutHandler, GenerateNewTokensHandler];
const strategies = [LocalStrategy, JwtStrategy];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
    }),

    CqrsModule,
    KafkaModule,
    ApiConfigModule,
    UserModule,
    ApiJwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionsRepository, UserQueryRepository, LoginConsumer, ...useCases, ...strategies],
  exports: [AuthService],
})
export class AuthModule {}
