import { Injectable } from '@nestjs/common';
import { CartItem } from '../domain/cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartItemRepository {
  constructor(@InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>) {}

  async save(cartItem: CartItem) {
    await this.cartItemRepository.save(cartItem);
  }

  async findById(id: number) {
    return this.cartItemRepository.findOneBy({ id });
  }

  async delete(cartItem: CartItem) {
    await this.cartItemRepository.remove(cartItem);
  }

  async findOneByProduct(productId: number, customerId: number) {
    return await this.cartItemRepository.findOneBy({ productId, customerId });
    return null;
  }
}
