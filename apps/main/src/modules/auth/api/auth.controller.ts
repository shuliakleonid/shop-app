import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  SwaggerDecoratorsByLogin,
  SwaggerDecoratorsByLogout,
  SwaggerDecoratorsByMe,
  SwaggerDecoratorsByRegistration,
  SwaggerDecoratorsByUpdateTokens,
} from '../swagger/swagger.auth.decorators';
import { RegisterInputDto } from './dtos/request/register.dto';
import { RegisterUserCommand } from '../application/use-cases/register-user.handler';
import { ResultNotification } from '@common/validators/result-notification';
import { TokensType } from '../application/types/types';
import { LoginCommand } from '../application/use-cases/login.handler';
import { LoginInputDto } from './dtos/request/login.dto';
import { LoginSuccessViewDto } from './dtos/response/login-success.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CheckLoginBodyFieldsGuard } from '@main/guards/check-login-body-fields.guard';
import { SessionData } from '@main/decorators/session-data.decorator';
import { SessionDto } from '../../sessions/application/dto/session.dto';
import { LogoutCommand } from '../application/use-cases/logout.handler';
import { MeViewDto } from './dtos/response/me.dto';
import { UserQueryRepository } from '@main/modules/user/infrastructure/user.query-repository';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateTokensCommand } from '@main/modules/auth/application/use-cases/update-tokens.handler';
import { CurrentUser } from '@common/decorators/user.decorator';
import { RoleTitle } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus, private readonly customerQueryRepository: UserQueryRepository) {}

  @Post('registration')
  @SwaggerDecoratorsByRegistration()
  @SetMetadata('isPublic', true)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: RegisterInputDto) {
    const notification = await this.commandBus.execute<RegisterUserCommand, ResultNotification<null>>(
      new RegisterUserCommand(body),
    );
    return notification.getData();
  }

  @Post('login')
  @SwaggerDecoratorsByLogin()
  @SetMetadata('isPublic', true)
  @UseGuards(LocalAuthGuard)
  @UseGuards(CheckLoginBodyFieldsGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: { userId: number; roles: RoleTitle[] },
    @Body() body: LoginInputDto,
  ): Promise<LoginSuccessViewDto> {
    const notification = await this.commandBus.execute<LoginCommand, ResultNotification<TokensType>>(
      new LoginCommand(user, ip, deviceName),
    );
    const { accessToken, refreshToken } = notification.getData();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    return { accessToken };
  }

  @SwaggerDecoratorsByLogout()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@SessionData() sessionData: SessionDto, @Res({ passthrough: true }) res: Response): Promise<null> {
    const notification = await this.commandBus.execute<LogoutCommand, ResultNotification<null>>(
      new LogoutCommand(sessionData.userId, sessionData.deviceId),
    );
    res.clearCookie('refreshToken');
    return notification.getData();
  }

  @SwaggerDecoratorsByUpdateTokens()
  @Post('update-tokens')
  @HttpCode(HttpStatus.OK)
  async updateTokens(
    @SessionData() sessionData: SessionDto,
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginSuccessViewDto> {
    const notification = await this.commandBus.execute<UpdateTokensCommand, ResultNotification<TokensType>>(
      new UpdateTokensCommand({ oldSessionData: sessionData, ip, deviceName }),
    );

    const { accessToken, refreshToken } = notification.getData();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

    return { accessToken };
  }

  @SwaggerDecoratorsByMe()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@CurrentUser() userId: number): Promise<MeViewDto> {
    const user = await this.customerQueryRepository.findUserById(userId);
    if (!user) return;
    return new MeViewDto(user);
  }
}
