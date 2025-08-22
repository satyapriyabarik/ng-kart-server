import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Category {
    @Field(() => ID)
    _id!: string;

    @Field()
    name!: string;
}
