import { Module } from '@nestjs/common';
import { CreatePaymentOrderUseCase } from './application/use-cases/create-payment-order.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentStripeController } from './api/payment.controller';
import { PaymentStripeService } from '../payment-stripe/application/payment-stripe.service';
import { ApiConfigModule } from '../../../../../libs/common/src/modules/api-config/api.config.module';

const useCases = [CreatePaymentOrderUseCase];

@Module({
  imports: [ApiConfigModule, CqrsModule],
  controllers: [PaymentStripeController],
  providers: [PaymentStripeService, ...useCases],
  exports: [],
})
export class PaymentModule {}
