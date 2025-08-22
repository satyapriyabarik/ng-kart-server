import { ObjectType, Field, Int, Float, ID } from "type-graphql";

@ObjectType()
export class ProductResponse {
    @Field(() => ID)
    _id!: string;   // 👈 expose MongoDB _id to frontend

    @Field(() => String)
    title!: string;

    @Field(() => String)
    description!: string;

    @Field(() => Float)
    price!: number;

    @Field(() => String)
    imageUrl!: string;

    @Field(() => Int)
    stock!: number;
}

@ObjectType()
export class CartItemResponse {
    @Field(() => ID)
    _id!: string; // 👈 optional: unique per cart item (if you want to expose it)

    @Field(() => String)
    productId!: string;

    @Field(() => Int)
    quantity!: number;

    @Field(() => ProductResponse, { nullable: true })
    product?: ProductResponse | null;
}
