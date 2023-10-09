import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { OrdersRepository } from '../../infrastructure/orders.repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { OrderDetails, OrderState } from '@orders/modules/orders/domain/order-details.entity';

export class UpdateOrderPaymentCommand {
  constructor(public readonly paymentData: any) {}
}

@CommandHandler(UpdateOrderPaymentCommand)
export class UpdateOrderPaymentHandler
  extends BaseNotificationHandler<UpdateOrderPaymentCommand, void>
  implements ICommandHandler<UpdateOrderPaymentCommand>
{
  constructor(
    private readonly OrderRepository: OrdersRepository,
  ) {
    super();
  }

  async executeHandler(command: UpdateOrderPaymentCommand): Promise<void> {
    const { orderId, paymentId } = command.paymentData;
    const order = await this.orderValidate(orderId);

    OrderDetails.update(order, { state: OrderState.APPROVED, paymentId });
    await this.OrderRepository.save(order);
  }

  private async orderValidate(id: number) {
    const order = await this.OrderRepository.findById(id);
    if (!order) {
      throw new NotificationException(`Order not found`, 'order', NotificationCode.NOT_FOUND);
    }
    return order;
  }
}
