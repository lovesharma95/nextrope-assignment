import {
  Body,
  Controller,
  Post,
  Injectable,
  UseInterceptors,
  Scope,
  Logger,
  Param,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { ProjectService } from './project.service';
import {} from './dto/project.dto';
import {
  SuccessHandler,
  TransformationInterceptor,
  ErrorResponse,
} from 'handlers';
import { error } from 'constant';

@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(TransformationInterceptor)
@Controller()
@ApiTags('Project')
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);
  constructor(
    private readonly projectService: ProjectService,
    private readonly configService: ConfigService
  ) {}
}
