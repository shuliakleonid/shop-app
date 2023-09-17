import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensType } from '../types/types';
import { AuthService } from '../auth.service';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { ProducerService } from '@common/modules/kafka/producer.service';
import { UserRepository } from '@main/modules/user/infrastructure/user.repository';
import { RoleTitle } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

export class LoginCommand {
  constructor(
    public readonly user: { userId: number; roles: RoleTitle[] },
    public readonly ip: string,
    public readonly deviceName: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler
  extends BaseNotificationHandler<LoginCommand, TokensType>
  implements ICommandHandler<LoginCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    protected authService: AuthService,
    private readonly _kafka: ProducerService,
  ) {
    super();
  }

  async executeHandler(command: LoginCommand): Promise<TokensType> {
    await this.validateUser(command.user.userId);

    const token = await this.authService.loginUser(command);
    await this.create(command.user.userId);
    return token;
  }

  async validateUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async create(customerId: number) {
    console.log('create call');
    try {
      await this._kafka.produce({
        topic: 'login',
        messages: [{ value: `this customer:${customerId} is login` }],
      });
    } catch (e) {
      console.log('-> e', e);
    }
  }
}
