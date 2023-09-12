import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
