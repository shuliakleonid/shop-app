import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@common/modules/kafka/consumer.service';
import { UpdateOrderPaymentCommand } from '@orders/modules/orders/application/use-cases/update-order-payment.handler';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  constructor(private readonly _consumer: ConsumerService) {}

  async onModuleInit() {
    await this._consumer.consume(
      'payment_order',
      { topic: 'payment_order' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            source: 'payment_order',
            message: message.value.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
          const paymentData = JSON.parse(message.value as unknown as string);
          new UpdateOrderPaymentCommand({ paymentData });
        },
      },
    );
  }
}
