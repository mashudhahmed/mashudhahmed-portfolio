import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private config: ConfigService) {}

  @Post('verify')
  verify(@Body() body: { token: string }) {
    const expectedToken = this.config.get<string>('ADMIN_TOKEN');
    if (body.token === expectedToken) {
      return { success: true, message: 'Token is valid' };
    }
    return { success: false, message: 'Invalid token' };
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