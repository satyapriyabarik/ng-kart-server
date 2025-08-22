import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { ProductModel } from '../models/Product';
import { Product } from '../schema/Product';

@Resolver()
export class ProductResolver {
    @Query(() => [Product])
    async getProducts(
        @Arg('skip', () => Int, { defaultValue: 0 }) skip: number,
        @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
        @Arg('sortBy', { defaultValue: 'title' }) sortBy: string,
        @Arg('order', { defaultValue: 'asc' }) order: 'asc' | 'desc'
    ): Promise<Product[]> {
        const products = await ProductModel.find()
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit)

        return products.map(product => {
            const plainProduct = product.toObject();
            return { ...plainProduct, _id: plainProduct._id.toString(), imageUrl: plainProduct.imageUrl ?? '' } as Product;
        });
    }
    @Query(() => Product, { nullable: true })
    async product(@Arg("id") id: string) {
        return await ProductModel.findById(id);
    }

    @Mutation(() => Product)
    async createProduct(
        @Arg("title") title: string,
        @Arg("price") price: number,
        @Arg("imageUrl") imageUrl: string,
        @Arg("category") category: string,
        @Arg("descriptions") descriptions: string,
    ): Promise<Product> {
        const product = new ProductModel({
            title,
            price,
            imageUrl,
            category,
            descriptions
        });
        await product.save();
        const plainProduct = product.toObject();
        return { ...plainProduct, _id: plainProduct._id.toString(), imageUrl: plainProduct.imageUrl ?? '' } as Product;
    }
    @Query(() => [Product])
    async searchProducts(
        @Arg("keyword", () => String) keyword: string
    ): Promise<Product[]> {
        const products = await ProductModel.find({
            title: { $regex: keyword, $options: "i" }, // case-insensitive search
        }).limit(10);
        return products.map(product => {
            const plainProduct = product.toObject();
            return { ...plainProduct, _id: plainProduct._id.toString(), imageUrl: plainProduct.imageUrl ?? '' } as Product;
        });
    }
}
