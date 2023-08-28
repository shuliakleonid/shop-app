import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
