import { Module } from '@nestjs/common';
import { StripeController } from './api/stripe.controller';
import { PaymentStripeService } from './application/payment-stripe.service';
import { StripePaymentWebhookService } from './application/stripe-payment-webhook.service';
import { KafkaModule } from '@common/modules/kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import stripe from '@common/modules/api-config/stripe.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [stripe],
    }),
    KafkaModule,
  ],
  controllers: [StripeController],
  providers: [PaymentStripeService, StripePaymentWebhookService],
  exports: [PaymentStripeService],
})
export class PaymentsModule {}
