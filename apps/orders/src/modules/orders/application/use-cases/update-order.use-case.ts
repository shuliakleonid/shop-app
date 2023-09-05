import { UpdateOrderDto } from '../../api/dtos/request/update-order.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { OrdersRepository } from '../../infrastructure/orders.repository';

export class UpdateOrderCommand {
  constructor(public readonly dto: UpdateOrderDto & { id: number }) {}
}

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderUseCase
  extends BaseNotificationUseCase<UpdateOrderCommand, void>
  implements ICommandHandler<UpdateOrderCommand>
{
  constructor(private readonly OrderRepository: OrdersRepository) {
    super();
  }

  async executeUseCase(command: UpdateOrderCommand): Promise<void> {
    //   const { name, price, description, id, quantity } = command.dto;
    //   const product = await this.validate(id);
    //
    //   Product.update(product, { name, description, price, quantity });
    //   await this.OrderRepository.save(product);
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
