import { UpdateOrderDto } from '../../api/dtos/request/update-order.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { OrdersRepository } from '../../infrastructure/orders.repository';
import { NotificationException } from '@common/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { ProductsQueryRepository } from '@catalog/modules/products/infrastructure/products.query-repository';
import { OrderDetails } from '@orders/modules/orders/domain/order-details.entity';

export class UpdateOrderCommand {
  constructor(public readonly dto: { products: UpdateOrderDto[]; id: number }) {}
}

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler
  extends BaseNotificationHandler<UpdateOrderCommand, void>
  implements ICommandHandler<UpdateOrderCommand>
{
  constructor(
    private readonly OrderRepository: OrdersRepository,
    private readonly productQueryRepository: ProductsQueryRepository,
  ) {
    super();
  }

  async executeHandler(command: UpdateOrderCommand): Promise<void> {
    const { products, id } = command.dto;
    const order = await this.OrderRepository.findById(id);
    await this.validate(products);

    const productsIds = products.reduce((acc, val) => {
      acc.push(val.productId);
      return acc;
    }, [] as number[]);
    const totalSum = await this.productQueryRepository.getTotalPrice(productsIds);
    OrderDetails.update(order, { total: totalSum });
    await this.OrderRepository.save(order);
  }

  private async validate(products: UpdateOrderDto[]) {
    const productsFinds = [];
    for (const product of products) {
      productsFinds.push(this.OrderRepository.findById(product.productId));
    }
    const productsFound = await Promise.all(productsFinds);
    if (productsFound.length !== products.length) {
      throw new NotificationException(`Product not found`, 'product', NotificationCode.NOT_FOUND);
    }
  }
}
