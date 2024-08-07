import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsNumber,
  IsDateString,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Builder } from 'builder-pattern';
import { regex } from 'constant';
import { ILogStartTimeResponse, ILogStopTimeResponse } from '../types';
import { TimeLog } from 'entity';

export class LogStartTimeDto {
  @ApiProperty({
    type: String,
    description: 'description of task',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim().toLowerCase())
  description: string;

  @ApiProperty({
    type: String,
    description: 'Start time of the task',
    example: '2024-08-06T10:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    type: Number,
    description: 'project id',
  })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  static intoLogStartTimeResponse(data: TimeLog) {
    return Builder<ILogStartTimeResponse>()
      .id(data.id)
      .description(data.description)
      .startTime(data.start_time)
      .endTime(data.end_time)
      .project(data.project)
      .build();
  }
}

export class LogStopTimeDto {
  @ApiProperty({
    type: String,
    description: 'End time of the task',
    example: '2024-08-06T12:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  static intoLogStopTimeResponse(data: TimeLog) {
    return Builder<ILogStopTimeResponse>()
      .id(data.id)
      .description(data.description)
      .startTime(data.start_time)
      .endTime(data.end_time)
      .build();
  }
}

export class GetLogTimeDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the time log to stop',
  })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  timeLogId: number;
}

export class GetTotalWorkTimeForAllUsersDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'user ids (comma-separated)',
  })
  @IsString()
  @IsOptional()
  @Matches(regex.commaSeperatedNumbers, { message: 'Invalid userId format' })
  userId: string;
}
