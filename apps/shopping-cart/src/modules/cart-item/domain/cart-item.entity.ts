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

  // @ManyToOne(() => OrderDetails, OrderDetails => OrderDetails)
  // @JoinColumn({ name: 'id' })
  // orderDetails: OrderDetails;
  @Column()
  orderId: number;

  @Column()
  customerId: number;

  // @OneToOne(() => Product)
  // @JoinColumn({ name: 'productId' })
  @Column()
  productId: number;

  static create(cartItem: { quantity: number; productId: number; customerId: number }) {
    const instanceCartItem = new CartItem();
    instanceCartItem.id = null;
    instanceCartItem.quantity = cartItem.quantity;
    instanceCartItem.productId = cartItem.productId;
    instanceCartItem.customerId = cartItem.customerId;
    return instanceCartItem;
  }

  static update(cartProduct: CartItem, quantity: number) {
    cartProduct.quantity = quantity;
    return cartProduct;
  }
}
