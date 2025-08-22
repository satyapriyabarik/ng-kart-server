import { Resolver, Mutation, UseMiddleware, Ctx, Arg, Query } from "type-graphql";
import { AuthMiddleware } from "../middleware/auth";
import { CartModel } from "../models/Cart";
import { OrderModel } from "../models/Order";
import { Order } from "../schema/Order";
@Resolver()
export class OrderResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(AuthMiddleware)
    async placeOrder(
        @Ctx() ctx: any,
        @Arg("paymentId") paymentId: string,
        @Arg("paymentMethod", { defaultValue: "Razorpay" }) paymentMethod: string
    ): Promise<boolean> {
        const cart = await CartModel.findOne({ userId: ctx.user.userId }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart empty");
        }

        const items = cart.items.map(item => {
            const product: any = item.productId;
            return {
                product: {
                    _id: product?._id?.toString() ?? "",
                    title: product?.title ?? "",
                    price: product?.price ?? 0,
                    imageUrl: product?.imageUrl ?? ""
                },
                quantity: item.quantity
            };
        });

        const total = items.reduce((sum, i) => sum + (i.quantity ?? 0) * i.product.price, 0);

        await new OrderModel({
            userId: ctx.user.userId,
            items,
            total,
            paymentId,
            paymentMethod,
            status: "PAID",
            createdAt: new Date()
        }).save();

        await CartModel.deleteOne({ userId: ctx.user.userId });

        return true;
    }

    // ✅ New query to get order history
    @Query(() => [Order])
    @UseMiddleware(AuthMiddleware)
    async myOrders(@Ctx() ctx: any) {
        return await OrderModel.find({ userId: ctx.user.userId }).sort({ createdAt: -1 });
    }
}
