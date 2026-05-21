import { Controller, Post, Get } from '@nestjs/common';
import { VisitorService } from './visitor.service';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  async increment() {
    const count = await this.visitorService.increment();
    return { count };
  }

  @Get()
  async getCount() {
    const count = await this.visitorService.getCount();
    return { count };
  }
}