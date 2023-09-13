import { RegisterInputDto } from '../../api/dtos/request/register.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { CustomerEntity } from '../../../customers/domain/customer.entity';
import { CustomerRepository } from '../../../customers/infrastructure/customer.repository';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';

export class RegisterUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  extends BaseNotificationHandler<RegisterUserCommand, void>
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly authService: AuthService, private readonly customerRepository: CustomerRepository) {
    super();
  }

  async executeHandler(command: RegisterUserCommand) {
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
