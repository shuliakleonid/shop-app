import { Module } from '@nestjs/common';
import { StripeController } from './api/stripe.controller';
import { PaymentStripeService } from './application/payment-stripe.service';
import { StripePaymentWebhookService } from './application/stripe-payment-webhook.service';
import { ApiConfigModule } from '../../../../../libs/common/src/modules/api-config/api.config.module';

@Module({
  imports: [ApiConfigModule],
  controllers: [StripeController],
  providers: [PaymentStripeService, StripePaymentWebhookService],
  exports: [PaymentStripeService],
})
export class PaymentsModule {}
