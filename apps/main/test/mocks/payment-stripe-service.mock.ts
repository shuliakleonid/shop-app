export class PaymentStripeServiceMock {
  constructor() {}

  async createSession(params: { customerId: string; email: string; userName: string }) {
    return;
  }
}
