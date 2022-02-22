import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const validation = new ValidationPipe()
  const PORT = 3000;

  app.useGlobalPipes(validation)

  await app.listen(PORT);
}
bootstrap();
