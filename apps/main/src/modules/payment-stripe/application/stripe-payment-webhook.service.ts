import { BadRequestException, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../../../../libs/common/src/modules/api-config/api.config.service';

@Injectable()
export class StripePaymentWebhookService {
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2023-08-16' });
  private secretHook = this.configService.SECRET_HOOK_STRIPE;

  constructor(private readonly configService: ApiConfigService) {}

  async createEventSession(signature: string | string[], body: Buffer) {
    let data;
    let eventType;
    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, this.secretHook);
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
      console.log('-> eventType', eventType);
      // this.eventEmitter.emit(PaymentEventType.someOtherEvent, event);
      switch (eventType) {
        case 'checkout.session.completed':
          console.log('-> data', data);
          // this.eventEmitter.emit(PaymentEventType.successPayment, data);
          break;
        case 'invoice.paid':

          break;
        case 'invoice.payment_failed':
          // this.eventEmitter.emit(PaymentEventType.failedPayment, data);
          console.log('-> data', data);
          break;
        default:
      }
      return;
    } catch (e) {
      throw new BadRequestException([{ message: 'Webhook Error', field: 'stripe' }]);
    }
  }
}
