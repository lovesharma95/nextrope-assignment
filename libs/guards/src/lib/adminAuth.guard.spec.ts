import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AdminAuthGuard } from './adminAuth.guard';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('admin-secret'),
          },
        },
      ],
    }).compile();

    guard = module.get<AdminAuthGuard>(AdminAuthGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return the correct secret key', () => {
    expect(guard.getSecretKey(configService)).toBe('admin-secret');
  });
});
