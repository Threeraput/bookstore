import { Controller, Get } from '@nestjs/common';
import { AuthorsService } from './authors.service.js';
import { Author } from './author.entity.js';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  async findAll(): Promise<Author[]> {
    return this.authorsService.findAll();
  }
}
