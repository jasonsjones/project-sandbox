import express from 'express';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: ['http://localhost:4200'],
        credentials: true
    });
    app.use(cookieParser());
    app.use(express.static('avatars'));
    await app.listen(3000);
}

bootstrap();
