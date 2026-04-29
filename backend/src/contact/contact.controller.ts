import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('messages')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submit(@Body() body: { name: string; email: string; message: string }) {
    return this.contactService.sendMessage(body.name, body.email, body.message);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllMessages() {
    return this.contactService.findAll();
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteMessage(@Param('id') id: string) {
    return this.contactService.delete(+id);
  }
}