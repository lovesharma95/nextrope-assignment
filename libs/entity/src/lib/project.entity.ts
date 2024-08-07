import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseObject } from './base.entity';
import { User } from './user.entity';
import { TimeLog } from './timeLog.entity';

@Entity()
export class Project extends BaseObject {
  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @OneToMany(() => TimeLog, (timeLog) => timeLog.project)
  time_logs!: TimeLog[];

  constructor(data: Partial<Project>) {
    super();
    if (data) {
      this.name = data.name!;
      this.description = data.description!;
    }
  }
}
