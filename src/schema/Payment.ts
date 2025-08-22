import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class RazorpayOrderResponse {
    @Field()
    id!: string;

    @Field()
    amount!: number;

    @Field()
    currency!: string;
}

@ObjectType()
export class PaymentLinkResponse {
    @Field()
    id!: string;

    @Field()
    short_url!: string;

    @Field()
    status!: string;
}