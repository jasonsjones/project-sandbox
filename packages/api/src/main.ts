import express from 'express';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: ['http://localhost:4200', /https:\/\/[a-z\-0-9]*.netlify.app/],
        credentials: true
    });
    app.use(cookieParser());
    app.use(express.static('avatars'));
    await app.listen(PORT);
}

bootstrap();
