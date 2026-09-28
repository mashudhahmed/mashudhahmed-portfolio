import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing authorization header');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Invalid token format');

    const expectedToken = this.config.get<string>('ADMIN_TOKEN');

    // 1. Backward-compatibility: Allow direct raw ADMIN_TOKEN
    if (expectedToken && token === expectedToken) {
      request.user = { role: 'admin', type: 'master_key' };
      return true;
    }

    // 2. Standard production path: Cryptographically verify signed JWT
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Session expired. Please log in again.');
      }
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}