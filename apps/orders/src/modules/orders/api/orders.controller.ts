import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/validators/result-notification';
import { CreateOrderDto } from './dtos/request/create-order.dto';
import { CreateOrderCommand } from '../application/use-cases/create-order.handler';
import { UpdateOrderDto } from './dtos/request/update-order.dto';

import { CurrentUserId } from '@common/decorators/user.decorator';
import { UpdateOrderCommand } from '../application/use-cases/update-order.handler';
import { DeleteOrderCommand } from '../application/use-cases/delete-order.handler';
import { OrdersQueryRepository } from '../infrastructure/orders.query-repository';

@Controller('orders')
export class OrdersController {
  constructor(private readonly commandBus: CommandBus, private readonly orderQueryRepository: OrdersQueryRepository) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDto[], @CurrentUserId() customerId: number) {
    const notification = await this.commandBus.execute<CreateOrderCommand, ResultNotification<null>>(
      new CreateOrderCommand({ orders: body, customerId }),
    );
    return notification.getCode();
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() body: UpdateOrderDto, @Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<UpdateOrderCommand, ResultNotification<null>>(
      new UpdateOrderCommand({ ...body, id }),
    );
    notification.getCode();
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.commandBus.execute<DeleteOrderCommand, ResultNotification<null>>(
      new DeleteOrderCommand(id),
    );
    notification.getCode();
  }

  @Get()
  async getOrder(@CurrentUserId() customerId: number) {
    return await this.orderQueryRepository.findById(customerId);
  }
}
