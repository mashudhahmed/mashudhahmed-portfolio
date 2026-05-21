import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepo: Repository<Visitor>,
  ) {}

  async increment(): Promise<number> {
    try {
      // Use atomic increment to prevent race conditions
      await this.visitorRepo.increment({ id: 1 }, 'count', 1);
      
      const record = await this.visitorRepo.findOne({ where: { id: 1 } });
      if (!record) {
        // If no record exists, create one with count 1
        const newRecord = this.visitorRepo.create({ id: 1, count: 1 });
        await this.visitorRepo.save(newRecord);
        return 1;
      }
      return record.count;
    } catch (error) {
      console.error('Failed to increment visitor count:', error);
      // Return existing count or 0 if error
      const record = await this.visitorRepo.findOne({ where: { id: 1 } });
      return record?.count || 0;
    }
  }

  async getCount(): Promise<number> {
    const record = await this.visitorRepo.findOne({ where: { id: 1 } });
    return record?.count || 0;
  }
}