import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { BaseObject } from './base.entity';
import { AuthTypeEnum, RoleTypeEnum } from 'types';
import { bcrypt } from 'helpers';
import { TimeLog } from './timeLog.entity';

@Entity()
export class User extends BaseObject {
  @Column({ nullable: false, type: 'varchar', unique: true })
  email!: string;

  @Column({ nullable: true, type: 'varchar' })
  password!: string;

  @Column({ nullable: false, type: 'enum', enum: AuthTypeEnum })
  auth_type!: AuthTypeEnum;

  @Column({
    nullable: true,
    type: 'enum',
    enum: RoleTypeEnum,
    default: RoleTypeEnum.User,
  })
  role!: RoleTypeEnum; // for simplicity kept the role as static enums

  @Column({ type: 'boolean', default: false })
  is_email_verified!: boolean;

  @OneToMany(() => TimeLog, (timeLog) => timeLog.user)
  time_logs!: TimeLog[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hashPassword(this.password);
  }

  constructor(data: Partial<User>) {
    super();
    if (data) {
      this.email = data.email!;
      this.password = data.password!;
      this.auth_type = data.auth_type ?? AuthTypeEnum.Email;
      this.role = data.role ?? RoleTypeEnum.User;
      this.is_email_verified = data.is_email_verified ?? false;
    }
  }
}
