import { model, Schema } from "mongoose";

const OrderSchema = new Schema({
    userId: String,
    items: [
        {
            product: {
                _id: String,
                title: String,
                price: Number,
                imageUrl: String
            },
            quantity: Number
        }
    ],
    total: Number,
    status: { type: String, default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
});
export const OrderModel = model('Order', OrderSchema);
