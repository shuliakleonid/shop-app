import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../../../libs/common/src/validators/result-notification';
import { CreateOrderDto } from './dtos/request/create-order.dto';
import { CreateOrderCommand } from '../application/use-cases/create-order.use-case';
import { UpdateOrderDto } from './dtos/request/update-order.dto';

import { CurrentCustomerId } from '../../../../../../libs/common/src/decorators/user.decorator';
import { UpdateOrderCommand } from '../application/use-cases/update-order.use-case';
import { DeleteOrderCommand } from '../application/use-cases/delete-order.use-case';
import { OrdersQueryRepository } from '../infrastructure/orders.query-repository';

@Controller('orders')
export class OrdersController {
  constructor(private readonly commandBus: CommandBus, private readonly orderQueryRepository: OrdersQueryRepository) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDto[], @CurrentCustomerId() customerId: number) {
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
  async getOrder(@CurrentCustomerId() customerId: number) {
    return await this.orderQueryRepository.findById(customerId);
  }
}