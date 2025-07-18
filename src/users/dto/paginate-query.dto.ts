import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'page має бути цілим числом' })
  @Min(1, { message: 'page не може бути < 1' })
  page: number = 1;

  @Type(() => Number)
  @IsInt({ message: 'limit має бути цілим числом' })
  @Min(1, { message: 'limit не може бути < 1' })
  @Max(100, { message: 'limit не може бути > 100' })
  limit: number = 20;
}
