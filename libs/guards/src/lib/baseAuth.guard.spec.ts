import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BaseAuthGuard } from './baseAuth.guard';
import { ErrorResponse } from 'handlers';
import { JWT } from 'helpers';
import { error } from 'constant';

// Mock JWT helper
jest.mock('helpers', () => ({
  JWT: jest.fn().mockImplementation(() => ({
    verifySessionJWT: jest.fn(),
  })),
}));

describe('BaseAuthGuard', () => {
  let guard: BaseAuthGuard;
  let configService: ConfigService;
  let context: ExecutionContext;
  let mockRequest: any;
  let mockJWTInstance: JWT;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BaseAuthGuard,
          useFactory: (configService: ConfigService) => {
            return new (class extends BaseAuthGuard {
              public getSecretKey(configService: ConfigService): string {
                return (
                  configService.get<string>('jwt.testJwtSecret') ||
                  'test-secret'
                );
              }
            })(configService);
          },
          inject: [ConfigService],
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<BaseAuthGuard>(BaseAuthGuard);
    configService = module.get<ConfigService>(ConfigService);
    mockRequest = {
      headers: {},
    };
    context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    // Create an instance of JWT and mock its method
    mockJWTInstance = new JWT('test-secret');
    (mockJWTInstance.verifySessionJWT as jest.Mock).mockRejectedValue(
      new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess)
    );

    // Override the JWT instance used in BaseAuthGuard
    (JWT as jest.Mock).mockImplementation(() => mockJWTInstance);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnAuthorizedException if authorization header is missing', async () => {
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess)
    );
  });

  it('should throw UnAuthorizedException if authorization header is empty', async () => {
    mockRequest.headers.authorization = ' ';
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess)
    );
  });

  it('should throw UnAuthorizedException if authorization header is malformed', async () => {
    mockRequest.headers.authorization = 'Bearer';
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess)
    );
  });

  it('should throw UnAuthorizedException if JWT verification fails', async () => {
    mockRequest.headers.authorization = 'Bearer invalidtoken';

    // Use the mockJWTInstance with mocked verifySessionJWT method
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ErrorResponse.UnAuthorizedException(error.unauthorizedAccess)
    );
  });
});
