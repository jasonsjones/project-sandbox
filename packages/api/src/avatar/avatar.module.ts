import { Module } from '@nestjs/common';
import { AvatarResolver } from './avatar.resolver';

@Module({
    providers: [AvatarResolver]
})
export class AvatarModule {}
