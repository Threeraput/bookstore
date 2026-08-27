import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Book } from '../books/book.entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @OneToMany('Book', (book: Book) => book.category)
  books!: Book[];
}
