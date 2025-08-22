import { ObjectType, Field, Float, ID, } from 'type-graphql';

@ObjectType()
export class Product {
    @Field(() => ID)
    _id!: string;

    @Field()
    title!: string;

    @Field()
    descriptions!: string;

    @Field()
    imageUrl!: string;

    @Field(() => Float)
    price!: number;

    @Field()
    stock!: number;

    @Field()
    category!: string;

}
