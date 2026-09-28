import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('messages')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 messages per minute
  async submit(@Body() body: { name: string; email: string; message: string }) {
    // Basic validation
    if (!body.message || body.message.length < 5) {
      throw new Error('Message must be at least 5 characters');
    }
    if (!body.name || body.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (!body.email || !body.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    return this.contactService.sendMessage(body.name, body.email, body.message);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllMessages() {
    return this.contactService.findAll();
  }

  @Patch(':id/read')
  @UseGuards(AdminGuard)
  async toggleMessageRead(@Param('id') id: string) {
    return this.contactService.toggleRead(+id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteMessage(@Param('id') id: string) {
    return this.contactService.delete(+id);
  }
}