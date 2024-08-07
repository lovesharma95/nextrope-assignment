import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'entity';
import { CreateProjectDto } from './dto/project.dto';
import { ErrorResponse } from 'handlers';
import { error } from 'constant';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}
}
