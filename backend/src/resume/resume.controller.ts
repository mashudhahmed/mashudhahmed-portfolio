import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { UpdateResumeDto } from './update-resume.dto';
import { AdminGuard } from '../admin/admin.guard';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  async getResume() {
    return this.resumeService.getResume();
  }

  @Put()
  @UseGuards(AdminGuard)
  async updateResume(@Body() dto: UpdateResumeDto) {
    return this.resumeService.updateResume(dto);
  }
}