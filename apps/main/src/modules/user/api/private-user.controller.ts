import { Body, Controller, Headers, Ip, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AssignNewRoleCommand } from '@main/modules/user/application/assign-new-role.handler';
import { AssignNewRoleDto } from '@main/modules/user/api/dtos/request/assign-new-role.dto';
import { SessionData } from '@main/decorators/session-data.decorator';
import { SessionDto } from '@main/modules/sessions/application/dto/session.dto';
import { Response } from 'express';
import { UpdateTokensCommand } from '@main/modules/auth/application/use-cases/update-tokens.handler';
import { ResultNotification } from '@common/validators/result-notification';
import { TokensType } from '@main/modules/auth/application/types/types';
import { UpdateSessionCommand } from '@main/modules/auth/application/use-cases/update-session-token.handle';

@Controller('user')
export class PrivateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async assignUserNewRole(
    @Body() body: AssignNewRoleDto,
    @SessionData() sessionData: SessionDto,
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.commandBus.execute(new AssignNewRoleCommand(body));
    const notification = await this.commandBus.execute<UpdateTokensCommand, ResultNotification<TokensType>>(
      new UpdateSessionCommand({ oldSessionData: sessionData, ip, deviceName }),
    );

    const { accessToken, refreshToken } = notification.getData();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'none' });

    return { accessToken };
  }
}
