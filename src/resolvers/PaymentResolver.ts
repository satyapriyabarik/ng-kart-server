import { Resolver, Mutation, Arg } from 'type-graphql';
import shortid from 'shortid';
import { razorpay } from '../utils/razorpay';
import Razorpay from 'razorpay';
import { PaymentLinkResponse, RazorpayOrderResponse } from '../schema/Payment';
import crypto from "crypto";

@Resolver()
export class PaymentResolver {
    @Mutation(() => RazorpayOrderResponse)
    async createRazorpayOrder(
        @Arg("amount") amount: number
    ): Promise<RazorpayOrderResponse> {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        return {
            id: order.id,
            amount: Number(order.amount),
            currency: order.currency,
        };
    }

    @Mutation(() => PaymentLinkResponse)
    async createPaymentLink(
        @Arg("amount") amount: number
    ): Promise<PaymentLinkResponse> {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const response = await instance.paymentLink.create({
            amount: amount * 100, // in paise
            currency: "INR",
            accept_partial: false,
            description: "Order payment",
            customer: {
                name: "John Doe", // Replace with real user
                email: "john@example.com",
                contact: "9999999999"
            },
            notify: {
                sms: true,
                email: true,
            },
            callback_url: "https://yourdomain.com/payment-status",
            callback_method: "get"
        });

        return {
            id: response.id,
            short_url: response.short_url,
            status: response.status,
        };
    }
    @Mutation(() => Boolean)
    async verifyPayment(
        @Arg("razorpay_order_id") razorpay_order_id: string,
        @Arg("razorpay_payment_id") razorpay_payment_id: string,
        @Arg("razorpay_signature") razorpay_signature: string
    ): Promise<boolean> {
        try {
            const body = `${razorpay_order_id}|${razorpay_payment_id}`;

            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
                .update(body)
                .digest('hex');

            return expectedSignature === razorpay_signature;
        } catch (err) {
            console.error("Payment verification failed:", err);
            return false;
        }
    }
}
