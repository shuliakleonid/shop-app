import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @OneToMany(() => Product, product => product.category)
  // products: Product[];

  @Column()
  productId: number;

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
