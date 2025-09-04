import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  console.log(`Server starting on port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Server is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
