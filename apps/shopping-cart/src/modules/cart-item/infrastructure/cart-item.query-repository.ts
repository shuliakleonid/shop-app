import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../domain/cart-item.entity';
import { Product } from '@catalog/modules/products/domain/product.entity';

@Injectable()
export class CartItemQueryRepository {
  constructor(
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  async getCustomerCartItems(customerId: number) {
    return this.cartItemRepository.find({ where: { customerId } });
  }

  async findAllProductsInOrder(id: number) {
    const cartItems = await this.cartItemRepository.find({ where: { orderId: id } });

    const productPromises = cartItems.map(cartItem =>
      this.productRepository.findOne({ where: { id: cartItem.productId } }).then(product => {
        if (product) {
          return cartItem.quantity * product.price;
        }
        return 0;
      }),
    );

    const itemCosts = await Promise.all(productPromises);

    const totalCost = itemCosts.reduce((acc, cost) => acc + cost, 0);

    return totalCost;
  }
}
