import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SessionsController } from './api/sessions.controller';
import { ApiJwtModule } from '../api-jwt/api-jwt.module';
import { SessionsService } from './application/sessions.service';
import { TerminateAllSessionsExceptCurrentHandler } from './application/use-cases/terminate-all-sessions-except-current.handler';
import { DeleteSelectedSessionHandler } from './application/use-cases/delete-selected-session.handler';

const useCases = [DeleteSelectedSessionHandler, TerminateAllSessionsExceptCurrentHandler];

@Module({
  imports: [CqrsModule, ApiJwtModule],
  controllers: [SessionsController],
  providers: [SessionsService, ...useCases],
  exports: [],
})
export class SessionsModule {}
