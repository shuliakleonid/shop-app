import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsQueryRepository } from '../infrastructure/products.query-repository';
import { JwtAuthGuard } from '@main/modules/auth/api/guards/jwt-auth.guard';
import { UseRoles } from 'nest-access-control';

@Controller('products')
@UseGuards(JwtAuthGuard)
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
