import { Controller, Post, Body, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private config: ConfigService) {}

  @Post('verify')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  verify(@Body() body: { token: string }) {
    const expectedToken = this.config.get<string>('ADMIN_TOKEN');
    if (body.token === expectedToken) {
      return { success: true, message: 'Token is valid' };
    }
    throw new UnauthorizedException('Invalid token');
  }

  @Get('status')
  @UseGuards(AdminGuard)
  getStatus() {
    return {
      status: 'active',
      timestamp: new Date().toISOString(),
      environment: this.config.get('NODE_ENV'),
    };
  }
}