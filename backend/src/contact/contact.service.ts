import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async sendMessage(name: string, email: string, message: string): Promise<Message> {
    const msg = this.messageRepo.create({ name, email, message });
    return this.messageRepo.save(msg);
  }
}