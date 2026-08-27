import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Author } from './author.entity.js';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async findAll(): Promise<Author[]> {
    return this.authorsRepository.find();
  }

  async findById(id: number): Promise<Author | null> {
    return this.authorsRepository.findOne({ where: { id } });
  }

  async findByIds(ids: number[]): Promise<Author[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.authorsRepository.find({
      where: { id: In(ids) },
    });
  }
}
