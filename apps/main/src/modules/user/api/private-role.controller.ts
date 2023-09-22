import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateRoleDto } from '@main/modules/user/api/dtos/request/create-role.dto';
import { CreateRoleCommand } from '@main/modules/user/application/create-role.handler';

@Controller('role')
export class PrivateRoleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/new')
  async createRole(@Body() body: CreateRoleDto) {
    const notification = await this.commandBus.execute(new CreateRoleCommand(body));
    return notification.getCode();
  }
}
