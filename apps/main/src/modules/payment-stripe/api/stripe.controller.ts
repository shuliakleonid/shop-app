import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StripePaymentWebhookService } from '../application/stripe-payment-webhook.service';
import { PaymentInputData, Signature } from '../../../decorators/signature-data.decorator';

@ApiTags('Payments')
@Controller('payments')
export class StripeController {
  constructor(private readonly stripePaymentWebhookService: StripePaymentWebhookService) {}

  @ApiOperation({ summary: 'Webhook for Stripe Api (see stripe official documentation)' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('stripe/webhook')
  async stripeHook(@Signature() inputData: PaymentInputData) {

    console.log("=>(stripe.controller.ts:21) inputData", inputData);

    await this.stripePaymentWebhookService.createEventSession(inputData.signature, inputData.body);
  }
}
