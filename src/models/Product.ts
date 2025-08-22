import { model, Schema } from 'mongoose';

const ProductSchema = new Schema({
    title: String,
    descriptions: String,
    price: Number,
    stock: Number,
    imageUrl: String,
    category: String,
});

export const ProductModel = model('Product', ProductSchema);
