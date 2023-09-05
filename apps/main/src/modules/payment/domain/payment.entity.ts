import { BaseDateEntity } from '@common/entities/base-date.entity';
import { Payment, PaymentStatus } from '@prisma/client';

export class PaymentEntity extends BaseDateEntity implements Payment {
  id: number;
  orderId: number;
  total: number;
  customerId: number;
  provider: string;
  status: PaymentStatus;

  static initCreatePayment(payment: any): any {
    const instancePayment = new PaymentEntity();
    instancePayment.orderId = payment.orderId;
    instancePayment.total = payment.total;
    instancePayment.customerId = payment.customerId;
    instancePayment.provider = payment.provider;
    return instancePayment;
  }
}
