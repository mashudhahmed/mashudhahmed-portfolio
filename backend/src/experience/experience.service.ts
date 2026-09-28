import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    @InjectRepository(Experience)
    private experienceRepo: Repository<Experience>,
  ) {}

  async findAll(): Promise<Experience[]> {
    try {
      return await this.experienceRepo.find({
        order: {
          order: 'ASC',
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error('Failed to fetch experiences from database', error);
      return [];
    }
  }

  async findOne(id: number): Promise<Experience> {
    const exp = await this.experienceRepo.findOne({ where: { id } });
    if (!exp) throw new NotFoundException(`Experience #${id} not found`);
    return exp;
  }

  async create(dto: CreateExperienceDto): Promise<Experience> {
    const exp = this.experienceRepo.create(dto);
    return this.experienceRepo.save(exp);
  }

  async update(id: number, dto: UpdateExperienceDto): Promise<Experience> {
    const exp = await this.findOne(id);
    Object.assign(exp, dto);
    return this.experienceRepo.save(exp);
  }

  async delete(id: number): Promise<void> {
    const result = await this.experienceRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Experience #${id} not found`);
    }
  }
}
