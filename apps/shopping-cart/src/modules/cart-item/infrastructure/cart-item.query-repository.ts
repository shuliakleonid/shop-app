import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../domain/cart-item.entity';

@Injectable()
export class CartItemQueryRepository {
  constructor(@InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>) {}

  async getCustomerCartItems(customerId: number) {
    return this.cartItemRepository.find({ where: { customerId } });
  }
}
