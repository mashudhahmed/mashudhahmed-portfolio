import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('messages')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // Only 3 messages per minute
  async submit(@Body() body: { name: string; email: string; message: string }) {
    // Basic validation
    if (!body.message || body.message.length < 10) {
      throw new Error('Message must be at least 10 characters');
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

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteMessage(@Param('id') id: string) {
    return this.contactService.delete(+id);
  }
}