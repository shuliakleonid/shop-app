import { Module } from '@nestjs/common';
import { StripeController } from './api/stripe.controller';
import { PaymentStripeService } from './application/payment-stripe.service';
import { StripePaymentWebhookService } from './application/stripe-payment-webhook.service';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { KafkaModule } from '@common/modules/kafka/kafka.module';

@Module({
  imports: [ApiConfigModule, KafkaModule],
  controllers: [StripeController],
  providers: [PaymentStripeService, StripePaymentWebhookService],
  exports: [PaymentStripeService],
})
export class PaymentsModule {}
