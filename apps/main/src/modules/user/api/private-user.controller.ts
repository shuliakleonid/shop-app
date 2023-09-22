import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AssignNewRoleCommand } from '@main/modules/user/application/assign-new-role.handler';
import { AssignNewRoleDto } from '@main/modules/user/api/dtos/request/assign-new-role.dto';

@Controller('user')
export class PrivateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/:id')
  async assignUserNewRole(@Body() body: AssignNewRoleDto) {
    const notification = await this.commandBus.execute(new AssignNewRoleCommand(body));
    return notification.getCode();
  }

}
