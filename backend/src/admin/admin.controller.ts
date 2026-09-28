import { Controller, Post, Body, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 login attempts per minute (prevents brute force)
  login(@Body() body: { token?: string; password?: string }) {
    const submittedKey = (body.password || body.token || '').trim();
    const expectedToken = this.config.get<string>('ADMIN_TOKEN');

    if (submittedKey && expectedToken && submittedKey === expectedToken) {
      const payload = { role: 'admin', sub: 'portfolio_admin', authenticatedAt: new Date().toISOString() };
      const access_token = this.jwtService.sign(payload);
      return {
        success: true,
        access_token,
        token_type: 'Bearer',
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN') || '7d',
        message: 'JWT authentication successful',
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  @Post('verify')
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  verify(@Body() body: { token?: string; password?: string }) {
    const rawToken = (body.token || body.password || '').trim();
    if (!rawToken) throw new UnauthorizedException('Token is required');

    // 1. Direct match with raw ADMIN_TOKEN
    const expectedToken = this.config.get<string>('ADMIN_TOKEN');
    if (rawToken === expectedToken) {
      // Issue a JWT so client can upgrade to signed token
      const access_token = this.jwtService.sign({ role: 'admin', sub: 'portfolio_admin' });
      return { success: true, access_token, message: 'Valid token' };
    }

    // 2. Cryptographic JWT verification
    try {
      const decoded = this.jwtService.verify(rawToken);
      return { success: true, user: decoded, message: 'Valid JWT session' };
    } catch (err: any) {
      throw new UnauthorizedException(
        err.name === 'TokenExpiredError' ? 'Session has expired' : 'Invalid session token'
      );
    }
  }

  @Get('status')
  @UseGuards(AdminGuard)
  getStatus() {
    return {
      status: 'active',
      auth: 'JWT Enabled',
      timestamp: new Date().toISOString(),
      environment: this.config.get('NODE_ENV'),
    };
  }
}