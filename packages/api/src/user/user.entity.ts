import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType({ description: 'The user model' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'The unique ID of the user' })
    id!: string;

    @Column()
    @Field(() => String)
    firstName!: string;

    @Column()
    @Field(() => String)
    lastName!: string;

    @Column()
    @Field(() => String)
    email!: string;

    @Field(() => String)
    displayName!: string;

    @Column()
    password!: string;

    @Column()
    refreshTokenId!: number;
}
