import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@common/modules/database/database.module';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { UpdateOrderUseCase } from './application/use-cases/update-order.use-case';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderDetails } from './domain/order-details.entity';
import { Product } from '@catalog/modules/products/domain/product.entity';
import { OrdersController } from './api/orders.controller';
import { OrdersRepository } from './infrastructure/orders.repository';
import { OrdersQueryRepository } from './infrastructure/orders.query-repository';
import { KafkaModule } from '@common/modules/kafka/kafka.module';

const useCases = [CreateOrderUseCase, UpdateOrderUseCase, DeleteOrderUseCase];

@Module({
  imports: [CqrsModule, KafkaModule, DatabaseModule, TypeOrmModule.forFeature([OrderDetails, Product])],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersQueryRepository, ...useCases],
  exports: [OrdersRepository, OrdersQueryRepository],
})
export class OrdersModule {}
