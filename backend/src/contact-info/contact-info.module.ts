import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfo } from './contact-info.entity';
import { ContactInfoService } from './contact-info.service';
import { ContactInfoController } from './contact-info.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactInfo]), AdminModule],
  providers: [ContactInfoService],
  controllers: [ContactInfoController],
  exports: [ContactInfoService],
})
export class ContactInfoModule {}