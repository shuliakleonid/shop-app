import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SessionsController } from './api/sessions.controller';
import { ApiJwtModule } from '../api-jwt/api-jwt.module';
import { SessionsService } from './application/sessions.service';
import { TerminateAllSessionsExceptCurrentHandler } from './application/use-cases/terminate-all-sessions-except-current.handler';
import { DeleteSelectedSessionHandler } from './application/use-cases/delete-selected-session.handler';
import { SessionsRepository } from '@main/modules/sessions/infrastructure/sessions-repository';
import { SessionsQueryRepository } from '@main/modules/sessions/infrastructure/sessions-query-repository';

const useCases = [DeleteSelectedSessionHandler, TerminateAllSessionsExceptCurrentHandler];

@Module({
  imports: [CqrsModule, ApiJwtModule],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository, SessionsQueryRepository, ...useCases],
  exports: [SessionsRepository],
})
export class SessionsModule {}
