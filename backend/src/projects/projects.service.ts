import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    await this.projectRepo.increment({ id }, 'views', 1);
    return project;
  }

  create(dto: CreateProjectDto): Promise<Project> {
    return this.projectRepo.save(this.projectRepo.create(dto));
  }

  async update(id: number, dto: Partial<CreateProjectDto>): Promise<Project> {
    await this.projectRepo.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.projectRepo.delete(id);
  }
}