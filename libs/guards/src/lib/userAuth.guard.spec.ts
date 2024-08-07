import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UserAuthGuard } from './userAuth.guard';

describe('UserAuthGuard', () => {
  let guard: UserAuthGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('user-secret'),
          },
        },
      ],
    }).compile();

    guard = module.get<UserAuthGuard>(UserAuthGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return the correct secret key', () => {
    expect(guard.getSecretKey(configService)).toBe('user-secret');
  });
});
