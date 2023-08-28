import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../domain/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  async save(category: Category) {
    await this.categoryRepository.save(category);
  }

  async findById(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  async delete(category: Category) {
    await this.categoryRepository.remove(category);
  }
}
