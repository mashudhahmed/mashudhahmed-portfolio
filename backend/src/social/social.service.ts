import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLink } from './social.entity';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialLink)
    private socialRepo: Repository<SocialLink>,
  ) {}

  findAll(): Promise<SocialLink[]> {
    return this.socialRepo.find();
  }

  async findOne(id: number): Promise<SocialLink> {
    const link = await this.socialRepo.findOne({ where: { id } });
    if (!link) throw new NotFoundException('Social link not found');
    return link;
  }

  create(dto: CreateSocialLinkDto): Promise<SocialLink> {
    return this.socialRepo.save(this.socialRepo.create(dto));
  }

  async update(id: number, dto: Partial<CreateSocialLinkDto>): Promise<SocialLink> {
    await this.socialRepo.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.socialRepo.delete(id);
  }
}