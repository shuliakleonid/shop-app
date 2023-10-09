import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetails, OrderState } from '../domain/order-details.entity';

@Injectable()
export class OrdersQueryRepository {
  constructor(@InjectRepository(OrderDetails) private readonly orderRepository: Repository<OrderDetails>) {}
  async getAll() {
    return this.orderRepository.find();
  }

  async findById(id: number) {
    return this.orderRepository.findOneBy({ customerId: id, state: OrderState.PENDING });
  }

  async findByOrderAndCustomerId(orderId: number, customerId: number) {
    return this.orderRepository.findOneBy({ id: orderId, customerId });
  }

  async findAllProductsInOrder(orderId: number) {}
}
