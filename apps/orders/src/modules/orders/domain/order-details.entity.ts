import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  // @OneToMany(() => CartItem, CartItem => CartItem)
  // cartItem: CartItem[];

  @Column()
  cartItemId: number;

  @CreateDateColumn({ type: 'timestamp' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;
}
