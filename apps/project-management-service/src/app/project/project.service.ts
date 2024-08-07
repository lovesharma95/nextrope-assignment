import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'entity';
import { CreateProjectDto, GetProjectsDto } from './dto/project.dto';
import { ErrorResponse } from 'handlers';
import { error } from 'constant';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async save(data: CreateProjectDto) {
    try {
      const { name, description } = data;

      const project = new Project({
        name,
        description,
      });

      return this.projectRepository.save(project);
    } catch (err) {
      this.logger.error(`Error in save function in ProjectService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  async getAllWithPagination(data: GetProjectsDto) {
    try {
      const { limit, page, sortBy, order } = data;

      return this.projectRepository.findAndCount({
        order: {
          [sortBy]: order.toUpperCase(),
        },
        take: limit,
        skip: (page - 1) * limit,
      });
    } catch (err) {
      this.logger.error(
        `Error in getAllWithPagination function in ProjectService: ${err}`
      );
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }
}
