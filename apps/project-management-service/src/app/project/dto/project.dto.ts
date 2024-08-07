import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { Builder } from 'builder-pattern';
import { ICreateProjectResponse } from '../types';
import { Project } from 'entity';

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

  static intoRegisterUserResponse(data: Project) {
    return Builder<ICreateProjectResponse>()
      .id(data.id)
      .name(data.name)
      .description(data.description)
      .build();
  }
}
