import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { AdminGuard } from '../admin/admin.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  getAbout() {
    return this.aboutService.getAbout();
  }

  @Put()
  @UseGuards(AdminGuard)
  updateAbout(@Body() dto: UpdateAboutDto) {
    return this.aboutService.updateAbout(dto);
  }
}