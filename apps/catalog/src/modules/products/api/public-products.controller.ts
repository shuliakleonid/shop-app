import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsQueryRepository } from '../infrastructure/products.query-repository';
import { UseRoles } from 'nest-access-control';

@Controller('products')
export class PublicProductsController {
  constructor(private readonly productQueryRepository: ProductsQueryRepository) {}

  @UseRoles({
    resource: 'customerData',
    action: 'read',
    possession: 'any',
  })
  @Get()
  getAllProducts() {
    return this.productQueryRepository.getAll();
  }

  @UseRoles({
    resource: 'customerData',
    action: 'read',
    possession: 'any',
  })
  @Get('/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productQueryRepository.findById(id);
  }
}
