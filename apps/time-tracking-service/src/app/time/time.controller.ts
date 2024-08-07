import {
  Body,
  Controller,
  Post,
  Injectable,
  UseInterceptors,
  Scope,
  Logger,
  UseGuards,
  Inject,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { TimeService } from './time.service';
import { GetLogTimeDto, LogStartTimeDto, LogStopTimeDto } from './dto/time.dto';
import {
  SuccessHandler,
  TransformationInterceptor,
  ErrorResponse,
} from 'handlers';
import { error } from 'constant';
import { UserAuthGuard } from 'guards';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(TransformationInterceptor)
@Controller()
@ApiTags('Time')
export class TimeController {
  private readonly logger = new Logger(TimeController.name);
  constructor(
    private readonly timeService: TimeService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request
  ) {}

  @Post('start')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async logStartTime(@Body() body: LogStartTimeDto) {
    // get project by id
    const project = await this.timeService.getProjectById(body.projectId);
    if (!project)
      throw new ErrorResponse.ParamsNotFoundException(error.projectNotFound);

    // get user by id
    const user = await this.timeService.getUserById(this.request.jwt.userId);
    if (!user)
      throw new ErrorResponse.ParamsNotFoundException(error.projectNotFound);

    // update DB
    const timeLog = await this.timeService.startTimeLog(body, user, project);

    return {
      message: SuccessHandler.getSuccessMessage('POST', 'Time log'),
      data: LogStartTimeDto.intoLogStartTimeResponse(timeLog),
    };
  }

  @Put('stop/:timeLogId')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async logStopTime(
    @Param() param: GetLogTimeDto,
    @Body() body: LogStopTimeDto
  ) {
    const userId = this.request.jwt.userId;

    const timeLog = await this.timeService.getByIdAndUserId(
      param.timeLogId,
      userId
    );
    if (!timeLog)
      throw new ErrorResponse.ParamsNotFoundException(error.notFound);

    if (timeLog.end_time)
      throw new ErrorResponse.BadRequest(error.timeLogAlreadyStopped);

    const updateTimeLog = await this.timeService.stopTimeLog(timeLog, body);

    return {
      message: SuccessHandler.getSuccessMessage('Put', 'Time log'),
      data: LogStopTimeDto.intoLogStopTimeResponse(updateTimeLog),
    };
  }
}
