import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../../../libs/common/src/modules/prisma/prisma.module';
import { ApiConfigModule } from '../../../libs/common/src/modules/api-config/api.config.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';

@Module({
  imports: [PrismaModule, ApiConfigModule, CartItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
