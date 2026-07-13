import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from './about.entity';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private aboutRepo: Repository<About>,
  ) {}

  async getAbout(): Promise<About> {
    let about = await this.aboutRepo.findOne({ where: { id: 1 } });
    if (!about) {
      // ✅ Create with explicit ID 1
      about = this.aboutRepo.create({
        id: 1,
        bio: "I'm a passionate CSE student majoring in Software Engineering. I build high‑performance web applications with Next.js, NestJS, and PostgreSQL. I love solving complex problems with clean, elegant code. This portfolio is powered by a full-stack architecture with a terminal-inspired UI.",
        photoUrl: '/your-photo.jpg',
        education: 'Bachelor of Science in Computer Science and Engineering',
        university: 'American International University - Bangladesh',
        major: 'Software Engineering',
        yearStart: '2022',
        yearEnd: '2026',
        coursework: 'Data Structures, Algorithms, Advanced Programming in Web Technology, Mobile Application Development, Software Requirement Engineering, Advanced Database Management System',
      });
      // ✅ Use save instead of insert to handle ID properly
      await this.aboutRepo.save(about);
      // ✅ Return the saved entity
      return about;
    }
    return about;
  }

  async updateAbout(dto: UpdateAboutDto): Promise<About> {
    await this.aboutRepo.update(1, dto);
    return this.getAbout();
  }
}