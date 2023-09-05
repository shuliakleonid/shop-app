import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
