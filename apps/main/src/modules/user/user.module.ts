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

const useCases = [CreateRoleHandler, AssignNewRoleHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UserController, PrivateUserController, PrivateRoleController],
  providers: [UserRepository, UserQueryRepository, RoleRepository, ...useCases],
  exports: [UserRepository, RoleRepository],
})
export class UserModule {}
