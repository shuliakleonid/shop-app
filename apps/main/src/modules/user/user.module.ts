import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/user.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from '@main/modules/user/api/user.controller';
import { UserQueryRepository } from '@main/modules/user/infrastructure/user.query-repository';
import { RoleRepository } from '@main/modules/user/infrastructure/role.repository';
import { CreateRoleHandler } from '@main/modules/user/application/create-role.handler';
import { AssignNewRoleHandler } from '@main/modules/user/application/assign-new-role.handler';
import { PrivateUserController } from '@main/modules/user/api/private-user.controller';
import { PrivateRoleController } from '@main/modules/user/api/private-role.controller';
import { UpdateSessionHandler } from '@main/modules/auth/application/use-cases/update-session-token.handle';
import { ApiJwtService } from '@main/modules/api-jwt/api-jwt.service';
import { ConfigModule } from '@nestjs/config';
import mainConfig from '@common/modules/api-config/main.config';
import jwtConfig from '@common/modules/api-config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '@main/modules/sessions/infrastructure/sessions-repository';

const useCases = [CreateRoleHandler, AssignNewRoleHandler, UpdateSessionHandler];

@Module({
  imports: [CqrsModule, ConfigModule.forRoot({ load: [mainConfig, jwtConfig] })],
  controllers: [UserController, PrivateUserController, PrivateRoleController],
  providers: [
    UserRepository,
    UserQueryRepository,
    RoleRepository,
    ApiJwtService,
    JwtService,
    SessionsRepository,
    ...useCases,
  ],
  exports: [UserRepository, RoleRepository],
})
export class UserModule {}
