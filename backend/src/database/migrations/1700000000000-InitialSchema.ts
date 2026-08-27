import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create Users Table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" character varying(100) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // 2. Create Categories Table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      )
    `);

    // 3. Create Authors Table
    await queryRunner.query(`
      CREATE TABLE "authors" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "bio" text,
        CONSTRAINT "PK_authors_id" PRIMARY KEY ("id")
      )
    `);

    // 4. Create Books Table
    await queryRunner.query(`
      CREATE TABLE "books" (
        "id" SERIAL NOT NULL,
        "title" character varying(255) NOT NULL,
        "isbn" character varying(20) NOT NULL,
        "published_year" integer NOT NULL,
        "category_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_books_isbn" UNIQUE ("isbn"),
        CONSTRAINT "PK_books_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_books_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);

    // 5. Create Book-Authors Junction Table
    await queryRunner.query(`
      CREATE TABLE "book_authors" (
        "book_id" integer NOT NULL,
        "author_id" integer NOT NULL,
        CONSTRAINT "PK_book_authors" PRIMARY KEY ("book_id", "author_id"),
        CONSTRAINT "FK_book_authors_book_id" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_book_authors_author_id" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Create Index on foreign keys
    await queryRunner.query(`CREATE INDEX "IDX_books_category_id" ON "books" ("category_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_book_authors_book_id" ON "book_authors" ("book_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_book_authors_author_id" ON "book_authors" ("author_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_book_authors_author_id"`);
    await queryRunner.query(`DROP INDEX "IDX_book_authors_book_id"`);
    await queryRunner.query(`DROP INDEX "IDX_books_category_id"`);
    await queryRunner.query(`DROP TABLE "book_authors"`);
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "authors"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
