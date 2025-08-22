import { ObjectType, Field, InputType, ID } from 'type-graphql';

@ObjectType()
export class User {
    @Field() fullName!: string;

    @Field() address!: string;

    @Field() phone!: string;

    @Field() email!: string;

    @Field() role!: string;

    @Field() _id!: string;

    @Field({ nullable: true })
    createdAt!: Date;
}

@InputType()
export class RegisterInput {
    @Field() email!: string;
    @Field() password!: string;
    @Field() role!: string;
    @Field() fullName!: string;
    @Field() address!: string;
    @Field() phone!: string;
}
@ObjectType()
export class LoginResponse {
    @Field()
    token!: string;

    @Field()
    user!: User;
}