import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { SessionData } from '@main/decorators/session-data.decorator';
import { SessionsQueryRepository } from '../infrastructure/sessions-query-repository';
import { SessionDto } from '../application/dto/session.dto';
import { DeleteSelectedSessionCommand } from '../application/use-cases/delete-selected-session-use.case';
import { ResultNotification } from '@common/validators/result-notification';
import { TerminateAllSessionsExceptCurrentCommand } from '../application/use-cases/terminate-all-sessions-except-current-use.case';
import { DevicesViewModel } from './session.view.dto';
import { RefreshTokenGuard } from '../../auth/api/guards/refresh-token.guard';

@ApiTags(`Device's`)
@ApiBearerAuth()
@UseGuards(RefreshTokenGuard)
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsQueryRepository: SessionsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @SwaggerDecoratorsByGetUserSessions()
  @Get()
  async getUserSessions(@SessionData() sessionData: SessionDto): Promise<DevicesViewModel> {
    const sessions = await this.sessionsQueryRepository.findSessionsByUserId(sessionData.customerId);
    return new DevicesViewModel(sessions, sessionData.deviceId);
  }

  @SwaggerDecoratorsByDeleteSelectedSession()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':deviceId')
  async deleteSelectedSession(
    @Param('deviceId') deviceId: number,
    @SessionData() sessionData: SessionDto,
  ): Promise<void> {
    await this.commandBus.execute<DeleteSelectedSessionCommand, ResultNotification<void>>(
      new DeleteSelectedSessionCommand(sessionData.customerId, deviceId, sessionData.deviceId),
    );
  }

  @SwaggerDecoratorsByDeleteAllSessionsExceptCurrent()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateAllSessionsExceptCurrent(@SessionData() sessionData: SessionDto): Promise<void> {
    await this.commandBus.execute<TerminateAllSessionsExceptCurrentCommand, ResultNotification<void>>(
      new TerminateAllSessionsExceptCurrentCommand(sessionData.customerId, sessionData.deviceId),
    );
  }
}
