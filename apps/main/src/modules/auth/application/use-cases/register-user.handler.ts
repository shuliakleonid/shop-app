import { RegisterInputDto } from '../../api/dtos/request/register.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { UserEntity } from '@main/modules/user/domain/user.entity';
import { UserRepository } from '@main/modules/user/infrastructure/user.repository';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { RoleRepository } from '@main/modules/user/infrastructure/role.repository';
import { RoleTitle } from '@prisma/client';
import { RoleEntity } from '@main/modules/user/domain/role.entity';

export class RegisterUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  extends BaseNotificationHandler<RegisterUserCommand, void>
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly customerRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {
    super();
  }

  async executeHandler(command: RegisterUserCommand) {
    const { userName, email, password } = command.userInputModel;
    let role: RoleEntity;
    const foundCustomer = await this.customerRepository.findByEmail(email);
    role = await this.roleRepository.getRoleByName(RoleTitle.CUSTOMER);

    if (!role) {
      role = RoleEntity.initCreateRole(RoleTitle.CUSTOMER);
      await this.roleRepository.save(role);
    }

    if (foundCustomer) {
      throw new NotificationException(`User with this email is already exist`, email, NotificationCode.BAD_REQUEST);
    }

    const passwordHash = await this.authService.getPasswordHash(password);
    const user = UserEntity.initCreateUser(userName, email, passwordHash, role.code);

    await this.customerRepository.save(user);
  }
}
