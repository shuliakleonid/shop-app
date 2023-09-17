import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/user.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from '@main/modules/user/api/user.controller';
import { UserQueryRepository } from '@main/modules/user/infrastructure/user.query-repository';
import { RoleRepository } from '@main/modules/user/infrastructure/role.repository';

const useCases = [];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [UserRepository, UserQueryRepository, RoleRepository, ...useCases],
  exports: [UserRepository, RoleRepository],
})
export class UserModule {}
