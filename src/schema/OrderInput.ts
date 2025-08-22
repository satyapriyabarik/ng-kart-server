// src/inputs/OrderInput.ts
import { InputType, Field, Float } from "type-graphql";

@InputType()
export class OrderItemInput {
    @Field()
    id!: string;

    @Field()
    title!: string;

    @Field(() => Float)
    price!: number;

    @Field()
    quantity!: number;

    @Field()
    imageUrl!: string;
}

@InputType()
export class OrderInput {
    @Field(() => [OrderItemInput])
    items!: OrderItemInput[];

    @Field(() => Float)
    totalAmount!: number;

    @Field()
    paymentId!: string;

    @Field()
    paymentMethod!: string;
}
