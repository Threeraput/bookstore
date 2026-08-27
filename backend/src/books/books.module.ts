import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { Book } from './book.entity.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { AuthorsModule } from '../authors/authors.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    CategoriesModule,
    AuthorsModule,
    AuthModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
