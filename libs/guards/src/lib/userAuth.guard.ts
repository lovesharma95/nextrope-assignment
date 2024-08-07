import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseAuthGuard } from './baseAuth.guard';

@Injectable()
export class UserAuthGuard extends BaseAuthGuard {
  public getSecretKey(configService: ConfigService): string {
    return configService.get<string>('jwt.userJwtSecret') || '';
  }
}
