import { IsInt, IsOptional } from 'class-validator';

export class QueryBookDto {
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsInt()
  authorId?: number;
}
