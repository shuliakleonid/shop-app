import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/common/src/modules/prisma/prisma.service';
import { Product } from '../domain/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly prisma: PrismaService,
  ) {}

  async save(product: Product) {
    await this.productRepository.save(product);
  }
}
