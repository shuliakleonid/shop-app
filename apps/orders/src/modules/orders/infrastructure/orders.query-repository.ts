import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetails } from '../domain/order-details.entity';

@Injectable()
export class OrdersQueryRepository {
  constructor(@InjectRepository(OrderDetails) private readonly orderRepository: Repository<OrderDetails>) {}
  async getAll() {
    return this.orderRepository.find();
  }

  async findById(id: number) {
    return this.orderRepository.findOneBy({ customerId: id });
  }
}
