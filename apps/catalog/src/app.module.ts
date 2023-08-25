import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../../../libs/common/src/modules/prisma/prisma.module';
import { ApiConfigModule } from '../../../libs/common/src/modules/api-config/api.config.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [ApiConfigModule, PrismaModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
