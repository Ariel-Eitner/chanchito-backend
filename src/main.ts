import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3600;
  // console.log(port);
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Rechaza propiedades no definidas en el DTO
      transform: true, // Transforma el payload a una instancia del DTO
    }),
  );

  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
