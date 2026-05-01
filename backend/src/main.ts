import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration – allows your frontend(s) to connect
  app.enableCors({
    origin: [
      'http://localhost:3000',           // Local Next.js development
      'https://mashudhahmed.vercel.app', // Your live frontend (from the URL you shared)
      // Add your custom domain here if you have one
    ],
    credentials: true,
  });

  // Use PORT from environment (Render sets this) or default to 4000 for local development
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`✅ Backend running on port ${port}`);
}
bootstrap();