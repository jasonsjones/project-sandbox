import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class AuthUserInfo {
    @Field()
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    displayName: string;
}

@ObjectType()
export class LoginResponse {
    @Field({ nullable: true })
    accessToken: string;

    @Field({ nullable: true })
    userInfo: AuthUserInfo;
}
