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
}
