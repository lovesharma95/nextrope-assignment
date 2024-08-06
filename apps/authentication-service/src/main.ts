import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import { SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import swaggerConfig from './config/swagger.module';
import { Env } from 'types';
import { GlobalExceptionFilter } from 'handlers';
import { routes } from 'constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(routes.applicationRoutes.authentication);

  const port = process.env.PORT || 3000;

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useLogger(app.get(PinoLogger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  if (process.env.ENV !== Env.PRODUCTION) {
    const options: SwaggerDocumentOptions = {
      deepScanRoutes: true,
    };
    const document = SwaggerModule.createDocument(app, swaggerConfig, options);
    SwaggerModule.setup(routes.swaggerRoutes.authentication, app, document);
  }

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${routes.applicationRoutes.authentication}`
  );

  Logger.log(
    `🚀 Application Swagger is running on: http://localhost:${port}/${routes.swaggerRoutes.authentication}`
  );
}

bootstrap();
