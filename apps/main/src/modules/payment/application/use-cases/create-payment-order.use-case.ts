import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Customer } from '@prisma/client';
import { CreatePaymentOrderDto } from '../../api/dtos/request/create-payment-order.dto';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';
import { PaymentStripeService } from '../../../payment-stripe/application/payment-stripe.service';

export class CreatePaymentOrderCommand {
  constructor(public readonly customerId: Customer, public readonly paymentOrder: CreatePaymentOrderDto) {}
}

@CommandHandler(CreatePaymentOrderCommand)
export class CreatePaymentOrderUseCase
  extends BaseNotificationUseCase<CreatePaymentOrderCommand, void>
  implements ICommandHandler<CreatePaymentOrderCommand>
{
  constructor(private readonly paymentStripeService: PaymentStripeService) {
    super();
  }
  async executeUseCase(command: CreatePaymentOrderCommand): Promise<void> {
    const { customerId, paymentOrder } = command;
    const order = await this.validateOrder(paymentOrder);

    await this.paymentStripeService.createPaymentSession({
      customerId: 1,
      email: 'XXXXXXXXXXXXX',
      userName: 'XXXXXXXXXXXXX',
      totalAmount: 1000,
      orderId: 'XXXXXXXXXXXXX',
    });
  }

  validateOrder(paymentOrder: CreatePaymentOrderDto) {}
}
