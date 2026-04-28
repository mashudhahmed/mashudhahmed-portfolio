import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';

@Injectable()
export class ContactInfoService {
  constructor(
    @InjectRepository(ContactInfo)
    private contactInfoRepo: Repository<ContactInfo>,
  ) {}

  async getContactInfo(): Promise<ContactInfo> {
    let info = await this.contactInfoRepo.findOne({ where: { id: 1 } });
    if (!info) {
      info = this.contactInfoRepo.create({
        id: 1,
        email: 'mashudh.ahmed@outlook.com',
        location: 'Dhaka, Bangladesh',
        timezone: 'UTC+6',
        workingHours: 'Mon-Fri, 9AM-6PM UTC+6',
        responseTime: 'Within 24 hours',
        availableForWork: true,
      });
      await this.contactInfoRepo.save(info);
    }
    return info;
  }

  async updateContactInfo(dto: UpdateContactInfoDto): Promise<ContactInfo> {
    await this.contactInfoRepo.update(1, dto);
    return this.getContactInfo();
  }
}