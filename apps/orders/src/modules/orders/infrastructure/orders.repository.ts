import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetails } from '../domain/order-details.entity';

@Injectable()
export class OrdersRepository {
  constructor(@InjectRepository(OrderDetails) private readonly orderRepository: Repository<OrderDetails>) {}

  async save(order: OrderDetails) {
    await this.orderRepository.save(order);
  }

  async findById(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  async delete(order: OrderDetails) {
    await this.orderRepository.remove(order);
  }
}
