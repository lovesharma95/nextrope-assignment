import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseObject } from './base.entity';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity()
export class TimeLog extends BaseObject {
  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  start_time!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  end_time!: Date | null;

  @ManyToOne(() => Project, (project) => project.time_logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  project!: Project;

  @ManyToOne(() => User, (user) => user.time_logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user!: User;

  constructor(data: Partial<TimeLog>) {
    super();
    if (data) {
      this.description = data.description!;
      this.start_time = data.start_time!;
      this.end_time = data.end_time ?? null;
      this.project = data.project!;
      this.user = data.user!;
    }
  }
}
