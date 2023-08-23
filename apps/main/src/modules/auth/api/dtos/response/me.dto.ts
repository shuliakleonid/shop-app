import { Customer } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MeViewDto {
  @ApiProperty()
  customerId: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  constructor(customer: Customer) {
    this.customerId = customer.id;
    this.userName = customer.userName;
    this.email = customer.email;
  }
}
