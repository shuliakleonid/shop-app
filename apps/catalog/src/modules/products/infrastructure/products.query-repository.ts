import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../domain/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsQueryRepository {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}
  async getAll() {
    return this.productRepository.find();
  }

  async findById(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async getTotalPrice(productsIds: number[]) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...ids)', { ids: productsIds })
      .getMany();

    return products.reduce((acc, product) => acc + product.price, 0);
  }
}
