import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Builder } from 'builder-pattern';
import { GetProjectsSortByEnum, ICreateProjectResponse } from '../types';
import { Project } from 'entity';
import { Order } from 'types';
import { PaginationDto } from 'dto';

export class CreateProjectDto {
  @ApiProperty({
    type: String,
    description: 'project name',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim().toLowerCase())
  name: string;

  @ApiProperty({
    type: String,
    description: 'project description',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim().toLowerCase())
  description: string;

  static intoCreateProjectResponse(data: Project) {
    return Builder<ICreateProjectResponse>()
      .id(data.id)
      .name(data.name)
      .description(data.description)
      .build();
  }
}

export class GetProjectsDto extends PaginationDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'sort by',
    enum: GetProjectsSortByEnum,
    default: GetProjectsSortByEnum.Id,
  })
  @IsEnum(GetProjectsSortByEnum)
  @IsString()
  @IsNotEmpty()
  sortBy: string;

  @ApiProperty({
    type: 'enum',
    required: true,
    description: 'Order in projects will be sort',
    enum: Order,
    default: Order.Asc,
  })
  @IsEnum(Order)
  @IsString()
  @IsNotEmpty()
  order: Order;

  static intoGetProjectResponse(data: Project) {
    return Builder<ICreateProjectResponse>()
      .id(data.id)
      .name(data.name)
      .description(data.description)
      .build();
  }
}
