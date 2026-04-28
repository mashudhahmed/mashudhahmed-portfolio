import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { AdminModule } from './admin/admin.module';
import { VisitorModule } from './visitor/visitor.module';
import { SkillsModule } from './skills/skills.module';
import { AboutModule } from './about/about.module';
import { ContactInfoModule } from './contact-info/contact-info.module';
import { SocialModule } from './social/social.module';
import { SettingsModule } from './settings/settings.module';
import { StatsModule } from './stats/stats.module';
import { Project } from './projects/project.entity';
import { Visitor } from './visitor/visitor.entity';
import { Skill } from './skills/skill.entity';
import { About } from './about/about.entity';
import { ContactInfo } from './contact-info/contact-info.entity';
import { SocialLink } from './social/social.entity';
import { Setting } from './settings/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [Project,Visitor, Skill, About, ContactInfo, SocialLink, Setting],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    ProjectsModule,
    AdminModule,
    VisitorModule,
    SkillsModule,
    AboutModule,
    ContactInfoModule,
    SocialModule,
    SettingsModule,
    StatsModule,
  ],
})
export class AppModule {}