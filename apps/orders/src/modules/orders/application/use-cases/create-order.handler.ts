import { CreateOrderDto } from '../../api/dtos/request/create-order.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationHandler } from '@common/main/use-cases/base-notification.use-case';
import { OrdersRepository } from '../../infrastructure/orders.repository';
import { ProducerService } from '@common/modules/kafka/producer.service';
import { OrderDetails } from '@orders/modules/orders/domain/order-details.entity';
import { ProductsRepository } from '@catalog/modules/products/infrastructure/products.repository';
import { ProductsQueryRepository } from '@catalog/modules/products/infrastructure/products.query-repository';

export class CreateOrderCommand {
  constructor(public readonly createOrder: { orders: CreateOrderDto[]; customerId: number }) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler
  extends BaseNotificationHandler<CreateOrderCommand, void>
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly productQueryRepository: ProductsQueryRepository,
    private readonly _kafka: ProducerService,
  ) {
    super();
  }

  async executeHandler(command: CreateOrderCommand): Promise<void> {
    await this.create();
    const { orders, customerId } = command.createOrder;

    const productsIds = orders.reduce((acc, val) => {
      acc.push(val.productId);
      return acc;
    }, [] as number[]);

    const totalSum = await this.productQueryRepository.getTotalPrice(productsIds);
    //@ts-ignore
    return totalSum;
    // const orderEntity = OrderDetails.create({ customerId, total:, paimentId });

    // await this.orderRepository.save(orderEntity);
  }

  async create() {
    console.log('create call');
    try {
      await this._kafka.produce({
        topic: 'login',
        messages: [{ value: `Payment order` }],
      });
    } catch (e) {
      console.log('-> e', e);
    }
  }
}
