import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { OrdersRepository } from '../../infrastructure/orders.repository';
import { NotificationCode } from '@common/configuration/notificationCode';
import { NotificationException } from '@common/validators/result-notification';
import { OrderDetails } from '@orders/modules/orders/domain/order-details.entity';

export class DeleteOrderCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler
  extends BaseNotificationHandler<DeleteOrderCommand, void>
  implements ICommandHandler<DeleteOrderCommand>
{
  constructor(private readonly OrderRepository: OrdersRepository) {
    super();
  }

  async executeHandler(command: DeleteOrderCommand): Promise<void> {
    const { id } = command;

    const order = await this.validate(id);

    await this.OrderRepository.delete(order);
  }

  private async validate(id: number): Promise<OrderDetails> {
    const order = await this.OrderRepository.findById(id);
    if (!order) {
      throw new NotificationException(`Order not found`, 'order', NotificationCode.NOT_FOUND);
    }
    return order;
  }
}
