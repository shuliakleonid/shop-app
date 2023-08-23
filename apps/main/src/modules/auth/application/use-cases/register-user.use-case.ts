import { RegisterInputDto } from '../../api/dtos/request/register.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { CustomerEntity } from '../../../customers/domain/customer.entity';
import { CustomerRepository } from '../../../customers/infrastructure/customer.repository';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../../../../libs/common/src/validators/result-notification';
import { NotificationCode } from '../../../../../../../libs/common/src/configuration/notificationCode';

export class RegisterUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  extends BaseNotificationUseCase<RegisterUserCommand, void>
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly authService: AuthService, private readonly customerRepository: CustomerRepository) {
    super();
  }

  async executeUseCase(command: RegisterUserCommand) {
    const { userName, email, password } = command.userInputModel;

    const foundCustomer = await this.customerRepository.findByEmail(email);

    if (foundCustomer) {
      throw new NotificationException(`User with this email is already exist`, email, NotificationCode.BAD_REQUEST);
    }

    const passwordHash = await this.authService.getPasswordHash(password);
    const user = CustomerEntity.initCreateUser(userName, email, passwordHash);

    await this.customerRepository.save(user);
  }
}
