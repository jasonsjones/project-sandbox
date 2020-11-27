import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(express.static('avatars'));
    await app.listen(3000);
}

bootstrap();
