import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { AdminGuard } from '../admin/admin.guard';

@Controller('contact-info')
export class ContactInfoController {
  constructor(private readonly contactInfoService: ContactInfoService) {}

  @Get()
  getContactInfo() {
    return this.contactInfoService.getContactInfo();
  }

  @Put()
  @UseGuards(AdminGuard)
  updateContactInfo(@Body() dto: UpdateContactInfoDto) {
    return this.contactInfoService.updateContactInfo(dto);
  }
}