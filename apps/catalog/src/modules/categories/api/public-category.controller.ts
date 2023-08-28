import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryQueryRepository } from '../infrastructure/category.query-repository';

@Controller('category')
export class PublicCategoryController {
  constructor(private readonly categoryQueryRepository: CategoryQueryRepository) {}

  @Get()
  getAllProducts() {
    return this.categoryQueryRepository.getAll();
  }

  @Get('/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.categoryQueryRepository.findById(id);
  }
}
