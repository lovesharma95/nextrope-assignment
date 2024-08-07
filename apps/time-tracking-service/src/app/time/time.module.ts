import { Module } from '@nestjs/common';
import { TimeController } from './time.controller';
import { TimeService } from './time.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, TimeLog, User } from 'entity';
import { GuardsModule } from 'guards';

@Module({
  imports: [TypeOrmModule.forFeature([TimeLog, User, Project]), GuardsModule],
  controllers: [TimeController],
  providers: [TimeService],
  exports: [TimeService],
})
export class TimeModule {}
