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
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { ProjectService } from './project.service';
import { CreateProjectDto, GetProjectsDto } from './dto/project.dto';
import {
  SuccessHandler,
  TransformationInterceptor,
  ErrorResponse,
} from 'handlers';
import { error } from 'constant';
import { AdminAuthGuard, UserAuthGuard } from 'guards';
import { PaginationDto } from 'dto';

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

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async createProject(@Body() body: CreateProjectDto) {
    const project = await this.projectService.save(body);

    return {
      message: SuccessHandler.getSuccessMessage('POST', 'Project'),
      data: CreateProjectDto.intoCreateProjectResponse(project),
    };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards() // todo update auth guard to allow all role
  async VerifyEmail(@Query() query: GetProjectsDto) {
    const projects = await this.projectService.getAllWithPagination(query);

    return {
      message: SuccessHandler.getSuccessMessage('GET', 'Projects'),
      data: PaginationDto.intoPagination({
        data: projects[0].map((project) =>
          GetProjectsDto.intoGetProjectResponse(project)
        ),
        total: projects[1],
        page: query.page,
        limit: query.limit,
      }),
    };
  }
}
