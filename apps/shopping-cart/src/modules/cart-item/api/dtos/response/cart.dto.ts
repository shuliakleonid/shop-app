import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CartItem } from '../../../domain/cart-item.entity';

export class CartItemDto {
  @ApiProperty()
  @IsNumber()
  id: number;
  @ApiProperty()
  @IsNumber()
  productId: number;

  constructor(cart: { id: number; productId: number }) {
    this.id = cart.id;
    this.productId = cart.productId;
  }
}

export class CartDto {
  @ApiProperty({ type: CartItemDto, isArray: true })
  cartItems: CartItemDto[];

  constructor(cart: CartItem[]) {
    this.cartItems = cart.map(item => new CartItemDto(item));
  }
}
