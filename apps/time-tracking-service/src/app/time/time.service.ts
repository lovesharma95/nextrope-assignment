import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, TimeLog, User } from 'entity';
import { LogStartTimeDto, LogStopTimeDto } from './dto/time.dto';
import { ErrorResponse } from 'handlers';
import { error, rawQuery } from 'constant';

@Injectable()
export class TimeService {
  private readonly logger = new Logger(TimeService.name);

  constructor(
    @InjectRepository(TimeLog)
    private timeRepository: Repository<TimeLog>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async startTimeLog(data: LogStartTimeDto, user: User, project: Project) {
    try {
      const { description, startTime } = data;

      const timeLog = new TimeLog({
        description,
        start_time: startTime,
        project,
        user,
      });

      return this.timeRepository.save(timeLog);
    } catch (err) {
      this.logger.error(`Error in save function in TimeService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  async stopTimeLog(timeLog: TimeLog, data: LogStopTimeDto) {
    try {
      const { endTime } = data;
      timeLog.end_time = endTime;
      return this.timeRepository.save(timeLog);
    } catch (err) {
      this.logger.error(`Error in stopTimeLog function in TimeService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  async getTotalWorkTimeForAUser(userId: number) {
    try {
      return this.timeRepository.query(
        rawQuery.queryToSelectTotalWorkingTimeForAUser,
        [userId]
      );
    } catch (err) {
      this.logger.error(
        `Error in getTotalWorkTime function in TimeService: ${err}`
      );
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  async getByIdAndUserId(timeLogId: number, userId: number) {
    try {
      return this.timeRepository.findOneBy({
        id: timeLogId,
        user: { id: userId },
      });
    } catch (err) {
      this.logger.error(
        `Error in getByIdAndUserId function in TimeService: ${err}`
      );
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  // this function does not belong here instead it should be part of project-management service and from there we should get its data using TCP or HTTP
  // for simplicity i have kept it here
  async getProjectById(id: number) {
    try {
      return this.projectRepository.findOneBy({
        id: id,
      });
    } catch (err) {
      this.logger.error(
        `Error in getProjectById function in TimeService: ${err}`
      );
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  // this function does not belong here instead it should be part of authentication service and from there we should get its data using TCP or HTTP
  // for simplicity i have kept it here
  async getUserById(id: number) {
    try {
      return this.userRepository.findOneBy({
        id: id,
      });
    } catch (err) {
      this.logger.error(`Error in getUserById function in TimeService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }
}
