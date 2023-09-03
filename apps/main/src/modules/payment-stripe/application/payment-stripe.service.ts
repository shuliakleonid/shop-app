import { Injectable, Logger } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../../../../libs/common/src/modules/api-config/api.config.service';

@Injectable()
export class PaymentStripeService {
  private logger = new Logger(PaymentStripeService.name);
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2023-08-16' });
  serverUrl: string;
  currency = 'usd';

  constructor(private readonly configService: ApiConfigService) {
    this.serverUrl = this.configService.TEST_CLIENT_URL;
    this.currency = this.configService.STRIPE_CURRENCY;
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({ name, email });
  }

  async createPaymentSession(params: {
    customerId: number;
    email: string;
    userName: string;
    totalAmount: number;
    orderId: string;
  }) {
    const defaultParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      success_url: `${this.serverUrl}` + '/profile/settings/edit?success=true',
      cancel_url: `${this.serverUrl}/profile/settings/edit?success=false`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Configured to expire after 30 minutes.
      customer: params.customerId.toString(),
      amount: Number(params.totalAmount) * 100,
      currency: this.currency,
      metadata: { orderId: params.orderId },
    } as Stripe.Checkout.SessionCreateParams;

    if (!params.customerId) {
      const customer = await this.createCustomer(params.userName, params.email);
      defaultParams['customer'] = customer.id;
    }
    try {
      const session = await this.stripe.checkout.sessions.create(defaultParams);
      return session;
    } catch (error) {
      this.logger.error(error, 'error');
      console.log(error, 'error');
    }
  }
}