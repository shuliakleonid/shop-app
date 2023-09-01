import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../../../../libs/common/src/main/use-cases/base-notification.use-case';
import { OrdersRepository } from '../../infrastructure/orders.repository';

export class DeleteOrderCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderUseCase
  extends BaseNotificationUseCase<DeleteOrderCommand, void>
  implements ICommandHandler<DeleteOrderCommand>
{
  constructor(private readonly OrderRepository: OrdersRepository) {
    super();
  }

  async executeUseCase(command: DeleteOrderCommand): Promise<void> {
    //   const { id } = command;
    //
    //   const product = await this.validate(id);
    //
    //   await this.OrderRepository.delete(product);
    // }
    //
    // private async validate(id: number): Promise<Product> {
    //   const product = await this.OrderRepository.findById(id);
    //   if (!product) {
    //     throw new NotificationException(`Product not found`, 'product', NotificationCode.NOT_FOUND);
    //   }
    //   return product;
  }
}
