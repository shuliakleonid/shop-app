import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { UserEntity } from '@main/modules/user/domain/user.entity';
import { UserRepository } from '@main/modules/user/infrastructure/user.repository';
import { RoleTitle } from '@prisma/client';
import { RoleRepository } from '@main/modules/user/infrastructure/role.repository';

export class AssignNewRoleCommand {
  constructor(public readonly dto: { userId: number; roleName: RoleTitle }) {}
}

@CommandHandler(AssignNewRoleCommand)
export class AssignNewRoleHandler
  extends BaseNotificationHandler<AssignNewRoleCommand, void>
  implements ICommandHandler<AssignNewRoleCommand>
{
  constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {
    super();
  }

  async executeHandler(command: AssignNewRoleCommand): Promise<void> {
    const { userId, roleName } = command.dto;
    const user = await this.validateUser(userId);
    const role = await this.validateRole(roleName);

    // user.assignRole(user, role.id);

    await this.userRepository.update(user.id, role.id);
  }

  private async validateUser(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotificationException('User not found', 'user', NotificationCode.NOT_FOUND);
    }
    return user;
  }

  private async validateRole(roleName: RoleTitle) {
    const role = await this.roleRepository.getRoleByName(roleName);
    if (!role) {
      throw new NotificationException('Role not found', 'role', NotificationCode.NOT_FOUND);
    }
    return role;
  }
}
