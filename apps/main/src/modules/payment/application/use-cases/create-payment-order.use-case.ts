import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentOrderDto } from '../../api/dtos/request/create-payment-order.dto';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { PaymentStripeService } from '../../../payment-stripe/application/payment-stripe.service';
import { OrdersQueryRepository } from '@orders/modules/orders/infrastructure/orders.query-repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';

export class CreatePaymentOrderCommand {
  constructor(public readonly customerId: number, public readonly paymentOrder: CreatePaymentOrderDto) {}
}

@CommandHandler(CreatePaymentOrderCommand)
export class CreatePaymentOrderUseCase
  extends BaseNotificationUseCase<CreatePaymentOrderCommand, { url: string }>
  implements ICommandHandler<CreatePaymentOrderCommand>
{
  constructor(
    private readonly paymentStripeService: PaymentStripeService,
    private readonly orderQueryRepository: OrdersQueryRepository,
  ) {
    super();
  }

  async executeUseCase(command: CreatePaymentOrderCommand) {
    const { customerId, paymentOrder } = command;
    const order = await this.validateOrder(paymentOrder.orderId, customerId);
    const allProductsInOrder = await this.cartItemQueryRepository.findAllProductsInOrder(order.id);

    await this.paymentStripeService.createPaymentSession({
      customerId,
      orderDetails: order,
      productsInOrder: order,
    });

    const { url } = await this.paymentStripeService.createPaymentSession({
      customerId: 1,
      totalAmount: 1000,
      orderId: 12,
    });

    return { url };
  }

  async validateOrder(orderId: number, customerId: number) {
    const order = await this.orderQueryRepository.findByOrderAndCustomerId(orderId, customerId);
    if (!order) {
      throw new NotificationException('Order not found', 'order', NotificationCode.NOT_FOUND);
    }
    return order;
  }
}
