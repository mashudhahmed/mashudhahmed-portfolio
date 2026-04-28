import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
  ) {}

  findAll(): Promise<Skill[]> {
    return this.skillRepo.find({ order: { category: 'ASC', name: 'ASC' } });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepo.findOne({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  create(dto: CreateSkillDto): Promise<Skill> {
    return this.skillRepo.save(this.skillRepo.create(dto));
  }

  async update(id: number, dto: Partial<CreateSkillDto>): Promise<Skill> {
    await this.skillRepo.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.skillRepo.delete(id);
  }
}