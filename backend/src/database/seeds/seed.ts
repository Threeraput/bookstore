import { AppDataSource } from '../../config/typeorm.config.js';
import { User } from '../../users/user.entity.js';
import { Category } from '../../categories/category.entity.js';
import { Author } from '../../authors/author.entity.js';
import { Book } from '../../books/book.entity.js';
import * as bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // 1. Seed Admin User
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({ where: { username: 'admin' } });
    if (!existingUser) {
      const password_hash = await bcrypt.hash('admin123', 10);
      const user = userRepo.create({
        username: 'admin',
        password_hash,
      });
      await userRepo.save(user);
      console.log('✅ Admin user created (username: admin, password: admin123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // 2. Seed Categories
    const categoryRepo = AppDataSource.getRepository(Category);
    const categoriesData = [
      { name: 'Fiction' },
      { name: 'Technology' },
      { name: 'Science' },
      { name: 'History' },
    ];

    const savedCategories: Category[] = [];
    for (const catData of categoriesData) {
      let cat = await categoryRepo.findOne({ where: { name: catData.name } });
      if (!cat) {
        cat = categoryRepo.create(catData);
        cat = await categoryRepo.save(cat);
        console.log(`✅ Category created: ${cat.name}`);
      }
      savedCategories.push(cat);
    }

    // 3. Seed Authors
    const authorRepo = AppDataSource.getRepository(Author);
    const authorsData = [
      { name: 'Robert C. Martin', bio: 'Author of Clean Code and Clean Architecture' },
      { name: 'J.K. Rowling', bio: 'Author of Harry Potter series' },
      { name: 'Martin Fowler', bio: 'Author of Refactoring' },
    ];

    const savedAuthors: Author[] = [];
    for (const authData of authorsData) {
      let author = await authorRepo.findOne({ where: { name: authData.name } });
      if (!author) {
        author = authorRepo.create(authData);
        author = await authorRepo.save(author);
        console.log(`✅ Author created: ${author.name}`);
      }
      savedAuthors.push(author);
    }

    // 4. Seed Books
    const bookRepo = AppDataSource.getRepository(Book);
    const existingBook = await bookRepo.findOne({ where: { isbn: '978-0132350884' } });
    if (!existingBook && savedCategories.length > 1 && savedAuthors.length > 0) {
      const cleanCode = bookRepo.create({
        title: 'Clean Code',
        isbn: '978-0132350884',
        published_year: 2008,
        category_id: savedCategories[1].id, // Technology
        category: savedCategories[1],
        authors: [savedAuthors[0]], // Robert C. Martin
      });
      await bookRepo.save(cleanCode);
      console.log('✅ Sample book created: Clean Code');
    }

    console.log('✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
