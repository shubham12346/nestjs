import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService instance
  const configService = app.get(ConfigService);

  // Get port from environment variables
  const port = configService.get<number>('PORT', 3000);

  // Enable CORS
  app.enableCors();

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  console.log(`Server starting on port ${port}`);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  console.log(`Server is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
