import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentEventType } from '../type/payment-event.type';
import { ProducerService } from '@common/modules/kafka/producer.service';
import stripeConfig from '@common/modules/api-config/stripe.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class StripePaymentWebhookService {
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2023-08-16' });
  private secretHook = this.configService.SECRET_HOOK_STRIPE;

  constructor(
    @Inject(stripeConfig.KEY) private configService: ConfigType<typeof stripeConfig>,
    private readonly eventEmitter: EventEmitter2,
    private readonly _kafka: ProducerService,
  ) {}

  async createEventSession(signature: string | string[], body: Buffer) {
    let data;
    let eventType;
    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, this.secretHook);
      data = event.data.object;
      eventType = event.type;
      console.log('-> eventType', eventType);
      switch (eventType) {
        case 'checkout.session.completed':
          console.log('-> data', data);
          await this._kafka.produce({
            topic: 'payment_order',
            messages: [{ value: `We pay  ${JSON.stringify(data)} ` }],
          });
          break;
        case 'invoice.paid':
          break;
        case 'invoice.payment_failed':
          console.log('-> data', data);
          this.eventEmitter.emit(PaymentEventType.failedPayment, data);
          break;
        default:
      }
      return;
    } catch (e) {
      console.log('-> error', e);

      throw new BadRequestException([{ message: 'Webhook Error', field: 'stripe' }]);
    }
  }
}
