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
        id: 1,
        url: '/resume.pdf',
        fileName: 'Mashudh_Ahmed_Resume.pdf',
      });
      await this.resumeRepo.save(resume);
    }
    return resume;
  }

  async updateResume(dto: UpdateResumeDto): Promise<Resume> {
    await this.resumeRepo.update(1, dto);
    return this.getResume();
  }
}