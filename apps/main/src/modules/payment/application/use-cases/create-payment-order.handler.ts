import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentOrderDto } from '../../api/dtos/request/create-payment-order.dto';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { PaymentStripeService } from '../../../payment-stripe/application/payment-stripe.service';
import { OrdersQueryRepository } from '@orders/modules/orders/infrastructure/orders.query-repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { CartItemQueryRepository } from '@shopping-cart/modules/cart-item/infrastructure/cart-item.query-repository';

export class CreatePaymentOrderCommand {
  constructor(public readonly customerId: number, public readonly paymentOrder: CreatePaymentOrderDto) {}
}

@CommandHandler(CreatePaymentOrderCommand)
export class CreatePaymentOrderHandler
  extends BaseNotificationHandler<CreatePaymentOrderCommand, { url: string }>
  implements ICommandHandler<CreatePaymentOrderCommand>
{
  constructor(
    private readonly paymentStripeService: PaymentStripeService,
    private readonly orderQueryRepository: OrdersQueryRepository,
    private readonly cartItemQueryRepository: CartItemQueryRepository,
  ) {
    super();
  }

  async executeHandler(command: CreatePaymentOrderCommand) {
    const { customerId, paymentOrder } = command;
    const order = await this.validateOrder(paymentOrder.orderId, customerId);
    const totalAmount = await this.cartItemQueryRepository.findAllProductsInOrder(order.id);

    const { url } = await this.paymentStripeService.createPaymentSession({
      customerId,
      totalAmount,
      orderId: order.id,
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
