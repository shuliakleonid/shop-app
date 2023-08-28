import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsQueryRepository } from '../infrastructure/products.query-repository';

@Controller('products')
export class PublicProductsController {
  constructor(private readonly productQueryRepository: ProductsQueryRepository) {}

  @Get()
  getAllProducts() {
    return this.productQueryRepository.getAll();
  }

  @Get('/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productQueryRepository.findById(id);
  }
}
