import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'Page number',
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  @IsNotEmpty()
  page!: number;

  @ApiProperty({
    type: Number,
    description: 'Limit per page',
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  @IsNotEmpty()
  limit!: number;

  static intoPagination<T>(
    data: PaginationDto & { data: T } & { total: number }
  ) {
    return Builder<PaginationDto & { data: T } & { total: number }>()
      .data(data.data)
      .total(data.total)
      .page(data.page)
      .limit(data.limit)
      .build();
  }
}
