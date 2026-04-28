import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { AdminModule } from './admin/admin.module';
import { Project } from './projects/project.entity';
import { Message } from './contact/message.entity';

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
        entities: [Project, Message],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    ProjectsModule,
    ContactModule,
    AdminModule,
  ],
})
export class AppModule {}