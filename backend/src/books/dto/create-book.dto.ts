import { IsArray, IsInt, IsNotEmpty, IsString, Max, Min, ArrayNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @IsInt()
  @Min(1000)
  @Max(9999)
  published_year!: number;

  @IsInt()
  @IsNotEmpty()
  category_id!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  author_ids!: number[];
}
