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
    let record = await this.visitorRepo.findOne({ where: { id: 1 } });
    if (!record) {
      record = this.visitorRepo.create({ id: 1, count: 1 });
    } else {
      record.count += 1;
    }
    await this.visitorRepo.save(record);
    return record.count;
  }
}