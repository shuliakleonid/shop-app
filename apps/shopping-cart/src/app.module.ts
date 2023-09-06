import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@common/modules/prisma/prisma.module';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { CartItemModule } from '@shopping-cart/modules/cart-item/cart-item.module';

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
