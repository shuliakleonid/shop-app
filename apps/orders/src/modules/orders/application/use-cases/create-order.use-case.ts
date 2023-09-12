import { CreateOrderDto } from '../../api/dtos/request/create-order.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { OrdersRepository } from '../../infrastructure/orders.repository';
import { ProducerService } from '@common/modules/kafka/producer.service';

export class CreateOrderCommand {
  constructor(public readonly createOrder: { orders: CreateOrderDto[]; customerId: number }) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderUseCase
  extends BaseNotificationUseCase<CreateOrderCommand, void>
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(private readonly orderRepository: OrdersRepository, private readonly _kafka: ProducerService) {
    super();
  }

  async executeUseCase(command: CreateOrderCommand): Promise<void> {
    await this.create();
    const { orders, customerId } = command.createOrder;

    // const orderEntity = OrderDetails.create({customerId:,total: , paimentId})

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
