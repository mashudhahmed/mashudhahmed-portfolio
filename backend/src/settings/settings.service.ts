import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private settingsRepo: Repository<Setting>,
  ) {}

  async onModuleInit() {
    await this.initializeDefaultSettings();
  }

  async getSettings(): Promise<any> {
    const settings = await this.settingsRepo.find();
    const result: any = {};
    for (const setting of settings) {
      try {
        result[setting.key] = JSON.parse(setting.value);
      } catch {
        result[setting.key] = setting.value;
      }
    }
    // Ensure all required keys exist with defaults
    return {
      siteTitle: result.siteTitle || 'Mashudh Ahmed | Terminal Portfolio',
      typewriterPhrases: result.typewriterPhrases || ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Creative Technologist'],
      footerText: result.footerText || 'Built with Next.js & NestJS',
    };
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<any> {
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
        
        // Find existing record
        const existing = await this.settingsRepo.findOne({ where: { key } });
        
        if (existing) {
          // Update existing
          existing.value = serialized;
          await this.settingsRepo.save(existing);
        } else {
          // Insert new
          await this.settingsRepo.save({ key, value: serialized });
        }
      }
    }
    return this.getSettings();
  }

  async initializeDefaultSettings() {
    const defaults = {
      siteTitle: 'Mashudh Ahmed | Terminal Portfolio',
      typewriterPhrases: ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Creative Technologist'],
      footerText: 'Built with Next.js & NestJS',
    };

    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.settingsRepo.findOne({ where: { key } });
      if (!existing) {
        const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await this.settingsRepo.save({ key, value: serialized });
      }
    }
  }
}