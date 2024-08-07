import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Project, TimeLog, User } from 'entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.get<string>('db.type'),
          host: configService.get<string>('db.host'),
          port: configService.get<number>('db.port'),
          username: configService.get<string>('db.username'),
          password: configService.get<string>('db.password'),
          database: configService.get<string>('db.database'),
          synchronize: configService.get<boolean>('db.synchronize'),
          autoLoadEntities: configService.get<boolean>('db.autoLoadEntities'),
          entities: [User, TimeLog, Project],
        } as TypeOrmModuleOptions),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
