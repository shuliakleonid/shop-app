import { Module } from '@nestjs/common';
import { CreatePaymentOrderHandler } from './application/use-cases/create-payment-order.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentStripeController } from './api/payment.controller';
import { PaymentStripeService } from '../payment-stripe/application/payment-stripe.service';
import { OrdersQueryRepository } from '@orders/modules/orders/infrastructure/orders.query-repository';
import { DatabaseModule } from '@common/modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from '@orders/modules/orders/domain/order-details.entity';
import { StripePaymentWebhookService } from '../payment-stripe/application/stripe-payment-webhook.service';
import { KafkaModule } from '@common/modules/kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import stripe from '@common/modules/api-config/stripe.config';
import { CartItemQueryRepository } from '@shopping-cart/modules/cart-item/infrastructure/cart-item.query-repository';
import { CartItemRepository } from '@shopping-cart/modules/cart-item/infrastructure/cart-item.repository';
import { CartItem } from '@shopping-cart/modules/cart-item/domain/cart-item.entity';
import { Product } from '@catalog/modules/products/domain/product.entity';
import { Category } from '@catalog/modules/categories/domain/category.entity';

const useCases = [CreatePaymentOrderHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [stripe],
    }),
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([OrderDetails, CartItem, Product, Category]),
    KafkaModule,
  ],
  controllers: [PaymentStripeController],
  providers: [
    PaymentStripeService,
    OrdersQueryRepository,
    StripePaymentWebhookService,
    CartItemQueryRepository,
    CartItemRepository,
    ...useCases,
  ],
  exports: [],
})
export class PaymentModule {}
