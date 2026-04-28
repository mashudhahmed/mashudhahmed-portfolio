import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submit(@Body() body: { name: string; email: string; message: string }) {
    await this.contactService.sendMessage(body.name, body.email, body.message);
    return { success: true, message: 'Message received!' };
  }
}