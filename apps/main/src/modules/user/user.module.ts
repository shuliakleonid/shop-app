import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/user.repository';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [];

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [UserRepository, ...useCases],
  exports: [UserRepository],
})
export class UserModule {}
