import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
class OrderProduct {
    @Field(() => ID)
    _id!: string;

    @Field()
    title!: string;

    @Field()
    price!: number;

    @Field({ nullable: true })
    imageUrl?: string;
}

@ObjectType()
class OrderItem {
    @Field(() => OrderProduct)
    product!: OrderProduct;

    @Field()
    quantity!: number;
}

@ObjectType()
export class Order {
    @Field(() => ID)
    id!: string;

    @Field()
    total!: number;

    @Field({ nullable: true })
    paymentId!: string;

    @Field({ nullable: true })
    paymentMethod!: string;

    @Field()
    status!: string;

    @Field()
    createdAt!: Date;

    @Field(() => [OrderItem])
    items!: OrderItem[];

    @Field({ nullable: true })
    imageUrl?: string;
}
