import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AdminController],  // ← was missing!
  providers: [AdminGuard],
  exports: [AdminGuard],
})
export class AdminModule {}