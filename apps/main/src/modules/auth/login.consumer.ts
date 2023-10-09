import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@common/modules/kafka/consumer.service';

@Injectable()
export class LoginConsumer implements OnModuleInit {
  constructor(private readonly _consumer: ConsumerService) {}

  async onModuleInit() {
    await this._consumer.consume(
      'login',
      { topic: 'login' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            source: 'login',
            message: JSON.parse(message.value as unknown as string),
            partition: partition.toString(),
            topic: topic.toString(),
          });
        },
      },
    );
  }
}
