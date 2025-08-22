import { Resolver, Mutation, Arg, Query, Ctx, Int } from "type-graphql";
import { CartModel } from "../models/Cart";
import { ProductModel } from "../models/Product";
import { CartItemResponse } from "../schema/CartItem"; // DTO
import { ObjectId } from "mongodb";

@Resolver()
export class CartResolver {
    // 🛒 Get full cart with product details
    @Query(() => [CartItemResponse])
    async getCart(@Ctx() ctx: any): Promise<CartItemResponse[]> {
        const userId = ctx.user?.userId;
        if (!userId) throw new Error("Not authenticated");

        const cart = await CartModel.findOne({ userId }).populate("items.productId");
        if (!cart) return [];

        return cart.items.map((item) => ({
            _id: item.productId.toString(),
            productId: item.productId.toString(),
            quantity: item.quantity,
            product: item.productId ? {
                _id: (item.productId as any)._id?.toString?.() ?? item.productId.toString(),
                title: (item.productId as any).title,
                description: (item.productId as any).description,
                price: (item.productId as any).price,
                imageUrl: (item.productId as any).imageUrl,
                stock: (item.productId as any).stock
            }
                : null
        }));
    }

    // ➕ Add item to cart (or increase qty if exists)
    @Mutation(() => String)
    async addToCart(
        @Arg("productId") productId: string,
        @Arg("quantity", () => Int) quantity: number,
        @Ctx() ctx: any
    ): Promise<string> {
        const userId = ctx.user?.userId;
        if (!userId) throw new Error("Not authenticated");

        const product = await ProductModel.findById(productId);
        if (!product) throw new Error("Product not found");

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = new CartModel({
                userId,
                items: [{ productId: new ObjectId(productId), quantity }],
            });
        } else {
            const existingItem = cart.items.find(
                (i) => i.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId: new ObjectId(productId), quantity });
            }
        }

        await cart.save();
        return "Added to cart";
    }

    // ✏️ Update item quantity
    @Mutation(() => String)
    async updateCartQuantity(
        @Arg("productId") productId: string,
        @Arg("quantity", () => Int) quantity: number,
        @Ctx() ctx: any
    ): Promise<string> {
        const userId = ctx.user?.userId;
        if (!userId) throw new Error("Not authenticated");

        const cart = await CartModel.findOne({ userId });
        if (!cart) throw new Error("Cart not found");

        const item = cart.items.find((i) => i.productId.toString() === productId);
        if (!item) throw new Error("Cart item not found");

        item.quantity = quantity;
        await cart.save();

        return "Quantity updated";
    }

    // ❌ Remove item
    @Mutation(() => String)
    async removeFromCart(
        @Arg("productId") productId: string,
        @Ctx() ctx: any
    ): Promise<string> {
        const userId = ctx.user?.userId;

        if (!userId) throw new Error("Not authenticated");

        const cart = await CartModel.findOne({ userId });
        if (!cart) throw new Error("Cart not found");

        cart.items = cart.items.filter(
            (i) => i.productId.toString() !== productId
        );

        await cart.save();
        return "Item removed from cart";
    }

    // 🧹 Clear all
    @Mutation(() => String)
    async clearCart(@Ctx() ctx: any): Promise<string> {
        const userId = ctx.user?.userId;
        if (!userId) throw new Error("Not authenticated");

        const cart = await CartModel.findOne({ userId });
        if (!cart) return "Cart already empty";

        cart.items = [];
        await cart.save();

        return "Cart cleared";
    }
}
