import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';
import { ProjectsModule } from './projects/projects.module';
import { AdminModule } from './admin/admin.module';
import { VisitorModule } from './visitor/visitor.module';
import { SkillsModule } from './skills/skills.module';
import { AboutModule } from './about/about.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { SocialModule } from './social/social.module';
import { SettingsModule } from './settings/settings.module';
import { StatsModule } from './stats/stats.module';
import { HealthModule } from './health/health.module';
import { ResumeModule } from './resume/resume.module';
import { ContactModule } from './contact/contact.module';
import { CommonModule } from './common/common.module';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { Project } from './projects/project.entity';
import { Visitor } from './visitor/visitor.entity';
import { Skill } from './skills/skill.entity';
import { About } from './about/about.entity';
import { ContactInfo } from './contact-info/contact-info.entity';
import { SocialLink } from './social/social.entity';
import { Setting } from './settings/setting.entity';
import { Message } from './contact/message.entity';
import { Resume } from './resume/resume.entity';

@Module({
  imports: [
    // Environment validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(4000),
        DATABASE_URL: Joi.string().required(),
        ADMIN_TOKEN: Joi.string().min(6).required(),
        CORS_ORIGINS: Joi.string().optional(),
      }),
      validationOptions: { abortEarly: true },
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    
    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [Project, Visitor, Skill, About, ContactInfo, SocialLink, Setting, Message, Resume],
        synchronize: config.get('NODE_ENV') !== 'production',
        ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
    
    // Feature modules
    CommonModule, // ✅ Add this
    ProjectsModule,
    AdminModule,
    VisitorModule,
    SkillsModule,
    AboutModule,
    ContactInfoModule,
    SocialModule,
    SettingsModule,
    StatsModule,
    ContactModule,
    HealthModule,
    ResumeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // ✅ Optional: Enable cache globally
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}