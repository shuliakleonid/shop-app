import { Body, Controller, Post } from '@nestjs/common';
import { ResultNotification } from '@common/validators/result-notification';
import { CurrentUser } from '@common/decorators/user.decorator';
import { CreatePaymentOrderCommand } from '../application/use-cases/create-payment-order.handler';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentOrderDto } from './dtos/request/create-payment-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { UseRoles } from 'nest-access-control';

@Controller('payment')
@ApiTags('Payment order')
export class PaymentStripeController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseRoles({
    resource: 'customerData',
    action: 'create',
    possession: 'any',
  })
  @Post('order')
  async paymentOrder(@Body() paymentOrder: CreatePaymentOrderDto, @CurrentUser() customerId: number) {
    const notification = await this.commandBus.execute<CreatePaymentOrderCommand, ResultNotification<string>>(
      new CreatePaymentOrderCommand(customerId, paymentOrder),
    );
    return notification.getData();
  }
}
