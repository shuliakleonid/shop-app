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

  @Column({ nullable: true })
  cartItemId: number;

  @CreateDateColumn({ type: 'timestamp' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  static create(param: { total: number; customerId: number }) {
    const orderDetails = new OrderDetails();
    orderDetails.id = null;
    orderDetails.state = OrderState.PENDING;
    orderDetails.paymentId = null;
    orderDetails.cartItemId = null;
    orderDetails.creationDate = new Date();
    orderDetails.total = param.total;
    orderDetails.customerId = param.customerId;
    return orderDetails;
  }

  static update(order: OrderDetails, param: { total?: number; state?: OrderState; paymentId?: number }) {
    if (param.total) {
      order.total = param.total;
    }
    if (param.state) {
      order.state = param.state;
    }
    if (param.paymentId) {
      order.paymentId = param.paymentId;
    }
  }
}
