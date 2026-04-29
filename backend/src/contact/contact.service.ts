import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<Message[]> {
    return this.messageRepo.find({ order: { receivedAt: 'DESC' } });
  }

  async delete(id: number): Promise<void> {
    const result = await this.messageRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Message not found');
  }
}