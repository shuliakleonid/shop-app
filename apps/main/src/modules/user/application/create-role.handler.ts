import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { NotificationCode } from '@common/configuration/notificationCode';
import { NotificationException } from '@common/validators/result-notification';
import { CreateRoleDto } from '@main/modules/user/api/dtos/request/create-role.dto';
import { RoleTitle } from '@prisma/client';
import { RoleRepository } from '@main/modules/user/infrastructure/role.repository';
import { RoleEntity } from '@main/modules/user/domain/role.entity';

export enum USER_ROLE {
  CUSTOMER = 1,
  ADMINISTRATOR,
}

export class CreateRoleCommand {
  constructor(public readonly dto: CreateRoleDto) {}
}

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler
  extends BaseNotificationHandler<CreateRoleCommand, void>
  implements ICommandHandler<CreateRoleCommand>
{
  constructor(private readonly roleRepository: RoleRepository) {
    super();
  }

  async executeHandler(command: CreateRoleCommand): Promise<void> {
    const { name, description } = command.dto;
    await this.validateRole(name);

    const role = RoleEntity.initCreateRole(name, description, USER_ROLE.ADMINISTRATOR);
    await this.roleRepository.save(role);
  }

  private async validateRole(roleName: RoleTitle): Promise<void> {
    const role = await this.roleRepository.getRoleByName(roleName);
    if (role) {
      throw new NotificationException('Role is already registered', 'role', NotificationCode.NOT_FOUND);
    }
  }
}
