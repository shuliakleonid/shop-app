import { Module } from '@nestjs/common';
import { CreatePaymentOrderUseCase } from './application/use-cases/create-payment-order.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentStripeController } from './api/payment.controller';
import { PaymentStripeService } from '../payment-stripe/application/payment-stripe.service';
import { ApiConfigModule } from '../../../../../libs/common/src/modules/api-config/api.config.module';
import { OrdersQueryRepository } from '../../../../orders/src/modules/orders/infrastructure/orders.query-repository';
import { DatabaseModule } from '../../../../../libs/common/src/modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from '../../../../orders/src/modules/orders/domain/order-details.entity';

const useCases = [CreatePaymentOrderUseCase];

@Module({
  imports: [ApiConfigModule, CqrsModule, DatabaseModule, TypeOrmModule.forFeature([OrderDetails])],
  controllers: [PaymentStripeController],
  providers: [PaymentStripeService, OrdersQueryRepository, ...useCases],
  exports: [],
})
export class PaymentModule {}
