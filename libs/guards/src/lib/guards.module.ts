import { Module } from '@nestjs/common';
import { UserAuthGuard } from './userAuth.guard';
import { AdminAuthGuard } from './adminAuth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [UserAuthGuard, AdminAuthGuard],
  exports: [UserAuthGuard, AdminAuthGuard],
})
export class GuardsModule {}
