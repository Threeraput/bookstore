import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { Category } from './category.entity.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }
}
