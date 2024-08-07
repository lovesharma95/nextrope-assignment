import { SignOptions, sign, verify } from 'jsonwebtoken';
import { ErrorResponse } from 'handlers';
import { SessionJWT } from 'types';

export class JWT {
  constructor(private secret: string) {}

  private async generateJWT(
    payload: { userId: number },
    signOptions: SignOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        payload,
        this.secret,
        {
          expiresIn: signOptions.expiresIn || '2 days',
        },
        (err: any, token: any) => {
          if (token !== undefined) {
            return resolve(token);
          }
          return reject(new ErrorResponse.UnAuthorizedException(err?.message));
        }
      );
    });
  }

  public async generateSessionJWT(
    expiresIn: string,
    userId: number
  ): Promise<string> {
    return await this.generateJWT(
      {
        userId,
      },
      {
        expiresIn,
      }
    );
  }

  public async verifySessionJWT(token: string): Promise<SessionJWT> {
    return new Promise((resolve, reject) => {
      verify(token, this.secret, (err: any, decoded: any) => {
        if (
          err !== null ||
          decoded === undefined ||
          typeof decoded !== 'object' ||
          !('exp' in decoded) ||
          !('iat' in decoded)
        ) {
          return reject(new ErrorResponse.UnAuthorizedException(err?.message));
        }
        return resolve(decoded as SessionJWT);
      });
    });
  }
}
