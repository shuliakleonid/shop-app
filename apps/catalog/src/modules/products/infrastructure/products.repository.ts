import { Injectable } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

  async save(product: Product) {
    await this.productRepository.save(product);
  }

  async findById(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async delete(product: Product) {
    await this.productRepository.remove(product);
  }
}
