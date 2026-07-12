import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';
  

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = request.url;
    
    // Skip cache for admin routes
    if (request.url.includes('/admin') || request.method !== 'GET') {
      return next.handle();
    }
    
    const cached = await this.cacheService.get(key);
    if (cached) {
      return of(cached);
    }
    
    return next.handle().pipe(
      tap(data => this.cacheService.set(key, data, 60)) // Cache for 60 seconds
    );
  }
}