import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/domain/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  static create(category: { name: string }): Category {
    const instanceCategory = new Category();
    instanceCategory.id = null;
    instanceCategory.name = category.name;
    return instanceCategory;
  }

  static update(category: Category, updatedData: { name: string }): void {
    if (updatedData.name !== undefined) {
      category.name = updatedData.name;
    }
  }
}
