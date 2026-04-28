import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Skill } from '../skills/skill.entity';
import { AdminGuard } from '../admin/admin.guard';

@Controller('stats')
@UseGuards(AdminGuard)
export class StatsController {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
  ) {}

  @Get('views')
  async getTotalViews() {
    const result = await this.projectRepo
      .createQueryBuilder('project')
      .select('SUM(project.views)', 'total')
      .getRawOne();
    return { total: parseInt(result.total) || 0 };
  }
}