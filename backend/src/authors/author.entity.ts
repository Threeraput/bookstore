import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import type { Book } from '../books/book.entity.js';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  bio?: string | null;

  @ManyToMany('Book', (book: Book) => book.authors)
  books!: Book[];
}
