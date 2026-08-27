import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { QueryBookDto } from './dto/query-book.dto.js';
import { CategoriesService } from '../categories/categories.service.js';
import { AuthorsService } from '../authors/authors.service.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private readonly categoriesService: CategoriesService,
    private readonly authorsService: AuthorsService,
  ) {}

  async findAll(query: QueryBookDto): Promise<Book[]> {
    const qb = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.authors', 'author');

    if (query.categoryId) {
      qb.andWhere('book.category_id = :categoryId', { categoryId: query.categoryId });
    }

    if (query.authorId) {
      qb.andWhere('author.id = :authorId', { authorId: query.authorId });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: { category: true, authors: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const category = await this.categoriesService.findById(createBookDto.category_id);
    if (!category) {
      throw new BadRequestException(`Category with ID ${createBookDto.category_id} does not exist`);
    }

    const authors = await this.authorsService.findByIds(createBookDto.author_ids);
    if (authors.length !== createBookDto.author_ids.length) {
      throw new BadRequestException('One or more referenced author IDs do not exist');
    }

    const book = this.booksRepository.create({
      title: createBookDto.title,
      isbn: createBookDto.isbn,
      published_year: createBookDto.published_year,
      category_id: createBookDto.category_id,
      category,
      authors,
    });

    return this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }
}
