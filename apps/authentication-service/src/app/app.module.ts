import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from './config/config.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from 'database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => Config.load()],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          pinoHttp: {
            level: config.get<string>('logLevel') || 'error',
            customProps: () => ({
              context: 'HTTP',
            }),
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            },
          },
        };
      },
    }),
    DatabaseModule,
    UserModule,
    RouterModule.register([
      {
        path: '',
        module: UserModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
