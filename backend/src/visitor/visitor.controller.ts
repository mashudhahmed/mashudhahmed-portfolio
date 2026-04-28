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
    const record = await this.visitorService['visitorRepo'].findOne({ where: { id: 1 } });
    return { count: record?.count || 0 };
  }
}