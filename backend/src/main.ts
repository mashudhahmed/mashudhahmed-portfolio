import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Allow both local development and production
  const allowedOrigins = [
    'http://localhost:3000',           // Local frontend
    'https://your-frontend.vercel.app', // Replace with your Vercel URL
    'https://your-custom-domain.com',   // If you have a custom domain
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  
  await app.listen(4000);
}
bootstrap();