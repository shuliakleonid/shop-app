import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetails } from '../../../../../orders/src/modules/orders/domain/order-details.entity';
import { Product } from '../../../../../catalog/src/modules/products/domain/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  @ManyToOne(() => OrderDetails, OrderDetails => OrderDetails.cartItem)
  @JoinColumn({ name: 'orderDetailsId' })
  orderDetails: OrderDetails;

  @Column()
  customerId: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  static create(cartItem: { quantity: number; productId: number; customerId: number }) {
    const instanceCartItem = new CartItem();
    instanceCartItem.id = null;
    instanceCartItem.quantity = cartItem.quantity;
    instanceCartItem.product.id = cartItem.productId;
    instanceCartItem.customerId = cartItem.customerId;
    return instanceCartItem;
  }

  static update(cartProduct: CartItem, quantity: number) {
    cartProduct.quantity = quantity;
    return cartProduct;
  }
}
