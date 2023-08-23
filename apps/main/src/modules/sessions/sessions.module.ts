import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SessionsController } from './api/sessions.controller';
import { ApiJwtModule } from '../api-jwt/api-jwt.module';
import { SessionsService } from './application/sessions.service';
import { TerminateAllSessionsExceptCurrentUseCase } from './application/use-cases/terminate-all-sessions-except-current-use.case';
import { DeleteSelectedSessionUseCase } from './application/use-cases/delete-selected-session-use.case';

const useCases = [DeleteSelectedSessionUseCase, TerminateAllSessionsExceptCurrentUseCase];

@Module({
  imports: [CqrsModule, ApiJwtModule],
  controllers: [SessionsController],
  providers: [SessionsService, ...useCases],
  exports: [],
})
export class SessionsModule {}
