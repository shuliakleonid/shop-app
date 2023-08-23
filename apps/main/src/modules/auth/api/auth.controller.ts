import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Ip, Post, Res, Headers, UseGuards, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  SwaggerDecoratorsByLogin,
  SwaggerDecoratorsByLogout,
  SwaggerDecoratorsByMe,
  SwaggerDecoratorsByRegistration,
  SwaggerDecoratorsByUpdateTokens,
} from '../swagger/swagger.auth.decorators';
import { RegisterInputDto } from './dtos/request/register.dto';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';
import { ResultNotification } from '../../../../../../libs/common/src/validators/result-notification';
import { CurrentCustomerId } from '../../../../../../libs/common/src/decorators/user.decorator';
import { TokensType } from '../application/types/types';
import { LoginCommand } from '../application/use-cases/login.use-case';
import { LoginInputDto } from './dtos/request/login.dto';
import { LoginSuccessViewDto } from './dtos/response/login-success.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CheckLoginBodyFieldsGuard } from '../../../guards/check-login-body-fields.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { SessionData } from '../../../decorators/session-data.decorator';
import { SessionDto } from '../../sessions/application/dto/session.dto';
import { LogoutCommand } from '../application/use-cases/logout.use-case';
import { UpdateTokensCommand } from '../application/use-cases/update-tokens.use-case';
import { MeViewDto } from './dtos/response/me.dto';
import { CustomerQueryRepository } from '../../customers/infrastructure/users.query-repository';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly customerQueryRepository: CustomerQueryRepository,
  ) {}

  @SwaggerDecoratorsByRegistration()
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: RegisterInputDto) {
    const notification = await this.commandBus.execute<RegisterUserCommand, ResultNotification<null>>(
      new RegisterUserCommand(body),
    );
    return notification.getData();
  }
  @SwaggerDecoratorsByLogin()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseGuards(CheckLoginBodyFieldsGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Res({ passthrough: true }) res: Response,
    @CurrentCustomerId() customerId: number,
    @Body() body: LoginInputDto,
  ): Promise<LoginSuccessViewDto> {
    const notification = await this.commandBus.execute<LoginCommand, ResultNotification<TokensType>>(
      new LoginCommand(customerId, ip, deviceName),
    );
    const { accessToken, refreshToken } = notification.getData();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    return { accessToken };
  }

  @SwaggerDecoratorsByLogout()
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@SessionData() sessionData: SessionDto, @Res({ passthrough: true }) res: Response): Promise<null> {
    const notification = await this.commandBus.execute<LogoutCommand, ResultNotification<null>>(
      new LogoutCommand(sessionData.customerId, sessionData.deviceId),
    );
    res.clearCookie('refreshToken');
    return notification.getData();
  }

  @SwaggerDecoratorsByUpdateTokens()
  @Post('update-tokens')
  @UseGuards(RefreshTokenGuard)
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
  async getMyInfo(@CurrentCustomerId() customerId: number): Promise<MeViewDto> {
    const user = await this.customerQueryRepository.findUserById(customerId);
    if (!user) return;
    return new MeViewDto(user);
  }
}
