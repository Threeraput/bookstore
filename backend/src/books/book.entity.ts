import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Category } from '../categories/category.entity.js';
import { Author } from '../authors/author.entity.js';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  isbn!: string;

  @Column({ name: 'published_year', type: 'int' })
  published_year!: number;

  @Column({ name: 'category_id', type: 'int' })
  category_id!: number;

  @ManyToOne(() => Category, (category: Category) => category.books, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @ManyToMany(() => Author, (author: Author) => author.books)
  @JoinTable({
    name: 'book_authors',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'author_id', referencedColumnName: 'id' },
  })
  authors!: Author[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at!: Date;
}
