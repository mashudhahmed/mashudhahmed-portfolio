import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing authorization header');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') throw new UnauthorizedException('Invalid token type');

    const expectedToken = this.config.get('ADMIN_TOKEN');
    if (!expectedToken || token !== expectedToken) throw new UnauthorizedException('Invalid token');

    return true;
  }
}