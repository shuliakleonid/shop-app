import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from '../../../../../shopping-cart/src/modules/cart-item/domain/cart-item.entity';

export enum OrderState {
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.PENDING,
  })
  state: OrderState;

  @Column()
  total: number;

  @Column()
  customerId: number;

  @Column({ nullable: true })
  paymentId: number;

  @OneToMany(() => CartItem, CartItem => CartItem)
  cartItem: CartItem[];

  @CreateDateColumn({ type: 'timestamp' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;
}
