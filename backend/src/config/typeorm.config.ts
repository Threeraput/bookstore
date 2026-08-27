import { DataSource, type DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Category } from '../categories/category.entity.js';
import { Author } from '../authors/author.entity.js';
import { Book } from '../books/book.entity.js';
import { User } from '../users/user.entity.js';
import { InitialSchema1700000000000 } from '../database/migrations/1700000000000-InitialSchema.js';

dotenv.config();

export const typeOrmConfigOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgrespassword',
  database: process.env.DB_DATABASE || 'bookstore_db',
  entities: [Category, Author, Book, User],
  migrations: [InitialSchema1700000000000],
  synchronize: false,
  logging: false,
};

export const AppDataSource = new DataSource(typeOrmConfigOptions);
