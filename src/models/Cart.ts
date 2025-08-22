// models/Cart.ts
import { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongodb";

interface CartItem {
    productId: ObjectId;
    quantity: number;
}

export interface CartDocument extends Document {
    userId: string;
    items: CartItem[];
}

const CartItemSchema = new Schema<CartItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
    },
    { _id: false } // 👈 no separate _id for items
);

const CartSchema = new Schema<CartDocument>(
    {
        userId: { type: String, required: true },
        items: {
            type: [CartItemSchema], // 👈 plain array of CartItem
            default: [],
        },
    },
    { timestamps: true }
);

export const CartModel = model<CartDocument>("Cart", CartSchema);
