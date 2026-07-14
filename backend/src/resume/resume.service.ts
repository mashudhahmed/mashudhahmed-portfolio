import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './resume.entity';
import { UpdateResumeDto } from './update-resume.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepo: Repository<Resume>,
  ) {}

  async getResume(): Promise<Resume> {
    let resume = await this.resumeRepo.findOne({ where: { id: 1 } });
    if (!resume) {
      resume = this.resumeRepo.create({
        url: '/resume.pdf',
        fileName: 'Mashudh_Ahmed_Resume.pdf',
      });
      await this.resumeRepo.save(resume);
    }
    return resume;
  }

  async updateResume(dto: UpdateResumeDto): Promise<Resume> {
    const existing = await this.resumeRepo.findOne({ where: { id: 1 } });
    if (!existing) {
      const newResume = this.resumeRepo.create({
        ...dto,
      });
      await this.resumeRepo.save(newResume);
      return newResume;
    }
    
    await this.resumeRepo.update({ id: 1 }, dto);
    return this.getResume();
  }
}