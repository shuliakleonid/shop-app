import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { KafkaModule } from '@common/modules/kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import mainConfig from '@common/modules/api-config/main.config';

@Module({
  imports: [ConfigModule.forRoot({ load: [mainConfig] }), OrdersModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
