import { Module } from '@nestjs/common';
import { CustomerRepository } from './infrastructure/customer.repository';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [];

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [CustomerRepository, ...useCases],
  exports: [CustomerRepository],
})
export class CustomersModule {}
