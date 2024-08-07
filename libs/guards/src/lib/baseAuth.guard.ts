import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorResponse } from 'handlers';
import { error } from 'constant';
import { JWT } from 'helpers';

@Injectable()
export abstract class BaseAuthGuard implements CanActivate {
  public abstract getSecretKey(configService: ConfigService): string;

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess);
      }

      const [bearer, authToken] = authorization.split(' ');
      if (bearer !== 'Bearer' || !authToken) {
        throw new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess);
      }

      const secret = this.getSecretKey(this.configService);
      const jwt = new JWT(secret);
      const resp = await jwt.verifySessionJWT(authToken);
      request.jwt = resp;
      return true;
    } catch (err) {
      throw new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess);
    }
  }
}
