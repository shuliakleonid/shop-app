import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensType } from '../types/types';
import { AuthService } from '../auth.service';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';

export class LoginCommand {
  constructor(public readonly customerId: number, public readonly ip: string, public readonly deviceName: string) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase
  extends BaseNotificationUseCase<LoginCommand, TokensType>
  implements ICommandHandler<LoginCommand>
{
  constructor(protected authService: AuthService) {
    super();
  }

  async executeUseCase(command: LoginCommand): Promise<TokensType> {
    return this.authService.loginUser(command);
  }
}
