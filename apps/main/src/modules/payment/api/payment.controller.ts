import { Body, Controller, Get, Post } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { ResultNotification } from '../../../../../../libs/common/src/validators/result-notification';
import { CurrentCustomerId } from '../../../../../../libs/common/src/decorators/user.decorator';
import { CreatePaymentOrderCommand } from '../application/use-cases/create-payment-order.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentOrderDto } from './dtos/request/create-payment-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('payment')
@ApiTags('Payment order')
export class PaymentStripeController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('order')
  async paymentOrder(@Body() paymentOrder: CreatePaymentOrderDto, @CurrentCustomerId() customerId: number) {
    const notification = await this.commandBus.execute<CreatePaymentOrderCommand, ResultNotification<string>>(
      new CreatePaymentOrderCommand(customerId, paymentOrder),
    );
    return notification.getData();
  }

  @Get('order')
  async getOrders(@CurrentCustomerId() customerId: Customer) {
    // return this.paymentOrderQueryRepository.getCustomersOrders(customerId);
  }
}
