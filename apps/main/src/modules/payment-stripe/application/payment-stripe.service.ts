import { Inject, Injectable, Logger } from '@nestjs/common';
import { Stripe } from 'stripe';
import stripeConfig from '@common/modules/api-config/stripe.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class PaymentStripeService {
  private logger = new Logger(PaymentStripeService.name);
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2023-08-16' });
  serverUrl: string;
  currency = 'usd';

  constructor(@Inject(stripeConfig.KEY) private configService: ConfigType<typeof stripeConfig>) {
    this.serverUrl = this.configService.TEST_CLIENT_URL;
    this.currency = this.configService.STRIPE_CURRENCY;
  }

  async createPaymentSession(params: { customerId: number; totalAmount: number; orderId: number }) {
    const defaultParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${this.serverUrl}/profile/settings/edit?success=true`,
      cancel_url: `${this.serverUrl}/profile/settings/edit?success=false`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          price_data: {
            currency: this.currency,
            product_data: {
              name: 'Product',
            },
            unit_amount: params.totalAmount,
          },
          quantity: 1,
        },
      ],
      customer: params.customerId.toString(),
      currency: this.currency,
      metadata: { orderId: params.orderId },
    } as unknown as Stripe.Checkout.SessionCreateParams;

    try {
      const session = await this.stripe.checkout.sessions.create(defaultParams);
      console.log('-> session', session);
      return session;
    } catch (error) {
      this.logger.error(error, 'error');
      console.log(error, 'error');
    }
  }
}
