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
      about = this.aboutRepo.create({
        id: 1,
        bio: "I'm a CSE student majoring in Software Engineering...",
        photoUrl: '/your-photo.jpg',
        education: 'Bachelor of Science in Computer Science and Engineering',
        university: 'American International University - Bangladesh',
        major: 'Software Engineering',
        yearStart: '2022',
        yearEnd: '2026',
        coursework: 'Data Structures, Algorithms, Web Tech, Mobile Dev, Software Engineering, Advanced DB',
      });
      await this.aboutRepo.save(about);
    }
    return about;
  }

  async updateAbout(dto: UpdateAboutDto): Promise<About> {
    await this.aboutRepo.update(1, dto);
    return this.getAbout();
  }
}