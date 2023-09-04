import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePaymentOrderDto {
  @ApiProperty()
  @IsNumber()
  orderId: number;
}
