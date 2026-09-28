import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async sendMessage(name: string, email: string, message: string): Promise<Message> {
    const msg = this.messageRepo.create({ name, email, message, isRead: false });
    return this.messageRepo.save(msg);
  }

  async findAll(): Promise<Message[]> {
    try {
      return await this.messageRepo.find({ order: { receivedAt: 'DESC' } });
    } catch (error) {
      this.logger.error('Failed to query messages from database', error);
      return [];
    }
  }

  async toggleRead(id: number): Promise<Message> {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');
    message.isRead = !message.isRead;
    return this.messageRepo.save(message);
  }

  async delete(id: number): Promise<void> {
    const result = await this.messageRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Message not found');
  }
}