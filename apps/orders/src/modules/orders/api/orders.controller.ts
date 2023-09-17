import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/validators/result-notification';
import { CreateOrderDto } from './dtos/request/create-order.dto';
import { CreateOrderCommand } from '../application/use-cases/create-order.handler';
import { UpdateOrderDto } from './dtos/request/update-order.dto';

import { CurrentUser } from '@common/decorators/user.decorator';
import { UpdateOrderCommand } from '../application/use-cases/update-order.handler';
import { DeleteOrderCommand } from '../application/use-cases/delete-order.handler';
import { OrdersQueryRepository } from '../infrastructure/orders.query-repository';
import { JwtAuthGuard } from '@main/modules/auth/api/guards/jwt-auth.guard';
import { UseRoles } from 'nest-access-control';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly commandBus: CommandBus, private readonly orderQueryRepository: OrdersQueryRepository) {}

  @UseRoles({
    resource: 'customerData',
    action: 'create',
    possession: 'any',
  })
  @Post()
  async createOrder(@Body() body: CreateOrderDto[], @CurrentUser() customerId: number) {
    const notification = await this.commandBus.execute<CreateOrderCommand, ResultNotification<null>>(
      new CreateOrderCommand({ orders: body, customerId }),
    );
    return notification.getCode();
  }

  @UseRoles({
    resource: 'customerData',
    action: 'update',
    possession: 'any',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() body: UpdateOrderDto, @Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<UpdateOrderCommand, ResultNotification<null>>(
      new UpdateOrderCommand({ ...body, id }),
    );
    notification.getCode();
  }

  @UseRoles({
    resource: 'customerData',
    action: 'delete',
    possession: 'any',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<DeleteOrderCommand, ResultNotification<null>>(
      new DeleteOrderCommand(id),
    );
    notification.getCode();
  }

  @Get()
  async getOrder(@CurrentUser() customerId: number) {
    return await this.orderQueryRepository.findById(customerId);
  }
}
