import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/project.entity';
import { Skill } from '../skills/skill.entity';
import { StatsController } from './stats.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Skill]),
    AdminModule,
  ],
  controllers: [StatsController],
})
export class StatsModule {}