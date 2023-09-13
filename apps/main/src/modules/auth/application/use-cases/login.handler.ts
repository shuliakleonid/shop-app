import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensType } from '../types/types';
import { AuthService } from '../auth.service';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { ProducerService } from '@common/modules/kafka/producer.service';

export class LoginCommand {
  constructor(public readonly customerId: number, public readonly ip: string, public readonly deviceName: string) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler
  extends BaseNotificationHandler<LoginCommand, TokensType>
  implements ICommandHandler<LoginCommand>
{
  constructor(protected authService: AuthService, private readonly _kafka: ProducerService) {
    super();
  }

  async executeHandler(command: LoginCommand): Promise<TokensType> {
    const token = await this.authService.loginUser(command);
    await this.create(command.customerId);
    return token;
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
