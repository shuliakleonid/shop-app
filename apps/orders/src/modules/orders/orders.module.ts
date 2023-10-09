import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@common/modules/database/database.module';
import { CreateOrderHandler } from './application/use-cases/create-order.handler';
import { UpdateOrderHandler } from './application/use-cases/update-order.handler';
import { DeleteOrderHandler } from './application/use-cases/delete-order.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderDetails } from './domain/order-details.entity';
import { Product } from '@catalog/modules/products/domain/product.entity';
import { OrdersController } from './api/orders.controller';
import { OrdersRepository } from './infrastructure/orders.repository';
import { OrdersQueryRepository } from './infrastructure/orders.query-repository';
import { KafkaModule } from '@common/modules/kafka/kafka.module';
import { ProductsQueryRepository } from '@catalog/modules/products/infrastructure/products.query-repository';
import { UpdateOrderPaymentHandler } from '@orders/modules/orders/application/use-cases/update-order-payment.handler';

const useCases = [CreateOrderHandler, UpdateOrderHandler, DeleteOrderHandler, UpdateOrderPaymentHandler];

@Module({
  imports: [CqrsModule, KafkaModule, DatabaseModule, TypeOrmModule.forFeature([OrderDetails, Product])],
  controllers: [OrdersController],
  providers: [OrdersRepository, ProductsQueryRepository, OrdersQueryRepository, ...useCases],
  exports: [OrdersRepository, OrdersQueryRepository],
})
export class OrdersModule {}
