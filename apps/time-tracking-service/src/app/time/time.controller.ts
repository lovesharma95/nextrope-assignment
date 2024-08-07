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
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { TimeService } from './time.service';
import {
  GetLogTimeDto,
  GetTotalWorkTimeForAllUsersDto,
  LogStartTimeDto,
  LogStopTimeDto,
} from './dto/time.dto';
import {
  SuccessHandler,
  TransformationInterceptor,
  ErrorResponse,
} from 'handlers';
import { error } from 'constant';
import { AdminAuthGuard, UserAuthGuard } from 'guards';
import { REQUEST } from '@nestjs/core';
import moment from 'moment';
import { IWorkTimeByDay } from './types';

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
      message: SuccessHandler.getSuccessMessage('PUT', 'Time log'),
      data: LogStopTimeDto.intoLogStopTimeResponse(updateTimeLog),
    };
  }

  @Get('user/total-work-time')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async getTotalWorkTimeForAUser() {
    const userId = this.request.jwt.userId;

    const timeLogs = await this.timeService.getTotalWorkTimeForAUser(userId);

    // response object
    const workTimeData = timeLogs.map((row) => ({
      date: moment(row.date).format('YYYY-MM-DD'),
      hours: parseFloat(row.hours),
      descriptions: row.descriptions || [],
    }));

    return {
      message: SuccessHandler.getSuccessMessage('GET', 'Time log'),
      data: workTimeData,
    };
  }

  @Get('all-user/total-work-time')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async getTotalWorkTimeForAllUsers(
    @Query() query: GetTotalWorkTimeForAllUsersDto
  ) {
    const timeLogs = await this.timeService.getTotalWorkTimeByAllUsers(
      query.userId
    );

    // Format the results
    const formattedResult = timeLogs.reduce((acc, row) => {
      const date = moment(row.date).format('YYYY-MM-DD');
      const userId = row.user_id;

      if (!acc[date]) {
        acc[date] = {};
      }

      if (!acc[date][userId]) {
        acc[date][userId] = { hours: 0, descriptions: [] };
      }

      acc[date][userId].hours += parseFloat(row.hours);
      acc[date][userId].descriptions = acc[date][userId].descriptions.concat(
        row.descriptions || []
      );

      return acc;
    }, {} as Record<string, Record<number, { hours: number; descriptions: string[] }>>);

    // Convert to desired format
    const workTimeData = Object.entries(formattedResult).map(
      ([date, users]) => ({
        date,
        totalHours: Object.values(users).reduce(
          (sum, user) => sum + user.hours,
          0
        ),
        users: Object.entries(users).map(
          ([userId, { hours, descriptions }]) => ({
            userId: parseInt(userId, 10),
            hours,
            descriptions,
          })
        ),
      })
    );

    return {
      message: SuccessHandler.getSuccessMessage('GET', 'Time log'),
      data: workTimeData,
    };
  }
}
