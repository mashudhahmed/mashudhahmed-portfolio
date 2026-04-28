import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepo: Repository<Setting>,
  ) {}

  async getSettings(): Promise<Record<string, any>> {
    const settings = await this.settingsRepo.find();
    const result: Record<string, any> = {};
    for (const setting of settings) {
      try {
        result[setting.key] = JSON.parse(setting.value);
      } catch {
        result[setting.key] = setting.value;
      }
    }
    return result;
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<Record<string, any>> {
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await this.settingsRepo.upsert(
          { key, value: serialized },
          { conflictPaths: ['key'] },
        );
      }
    }
    return this.getSettings();
  }

  async initializeDefaultSettings() {
    const defaults = {
      siteTitle: 'Mashudh Ahmed | Terminal Portfolio',
      heroGradient: 'from-green-400 via-cyan-400 to-blue-500',
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