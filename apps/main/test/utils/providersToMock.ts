import { PaymentStripeService } from '@main/modules/payment-stripe/application/payment-stripe.service';
import { PaymentStripeServiceMock } from '../mocks/payment-stripe-service.mock';

export interface E2ETestingOptions {
  useStripeService?: boolean;
}

export const defaultE2ETestingOptions: E2ETestingOptions = {
  useStripeService: false,
};

interface ProviderToMock {
  typeMock: boolean;
  typeOverride: 'provider' | 'guard';
  useType: 'value' | 'class';
  classToMock: any;
  mockValue: any;
}

export const providersToMock: ProviderToMock[] = [
  {
    typeMock: defaultE2ETestingOptions.useStripeService,
    typeOverride: 'provider',
    useType: 'class',
    classToMock: PaymentStripeService,
    mockValue: PaymentStripeServiceMock,
  },
];
