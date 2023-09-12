import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@common/modules/prisma/prisma.module';
import { CartItemModule } from '@shopping-cart/modules/cart-item/cart-item.module';
import { ConfigModule } from '@nestjs/config';
import mainConfig from '@common/modules/api-config/main.config';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ load: [mainConfig] }), CartItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
