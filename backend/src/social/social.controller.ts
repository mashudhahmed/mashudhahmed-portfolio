import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { AdminGuard } from '../admin/admin.guard';

@Controller('social-links')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  findAll() {
    return this.socialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialService.findOne(+id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateSocialLinkDto) {
    return this.socialService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: Partial<CreateSocialLinkDto>) {
    return this.socialService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) {
    return this.socialService.delete(+id);
  }
}