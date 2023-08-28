import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../domain/category.entity';

@Injectable()
export class CategoryQueryRepository {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}
  async getAll() {
    return this.categoryRepository.find();
  }

  async findById(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }
}
