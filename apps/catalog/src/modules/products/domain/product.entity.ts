import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/domain/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  static create(product: { price: number; name: string; description: string }): Product {
    const instanceProduct = new Product();
    instanceProduct.id = null;
    instanceProduct.name = product.name;
    instanceProduct.price = product.price;
    instanceProduct.quantity = 0;
    instanceProduct.description = product.description;
    return instanceProduct;
  }

  static update(
    product: Product,
    updatedData: { quantity: number; price: number; name: string; description: string },
  ): void {
    if (updatedData.price !== undefined) {
      product.price = updatedData.price;
    }
    if (updatedData.name !== undefined) {
      product.name = updatedData.name;
    }
    if (updatedData.description !== undefined) {
      product.description = updatedData.description;
    }
    if (updatedData.quantity !== undefined) {
      product.quantity = updatedData.quantity;
    }
  }
}
