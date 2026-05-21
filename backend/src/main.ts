import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';

// Use require for compression
const compression = require('compression');

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & Performance middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'https://mashudhahmed.vercel.app'];
  
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`✅ Backend running on port ${port}`);
  logger.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();