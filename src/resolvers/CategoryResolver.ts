import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { CategoryModel } from '../models/Category';
import { Category } from '../schema/Category';

@Resolver()
export class CategoryResolver {
    @Query(() => [Category])
    async getCategories(): Promise<Category[]> {
        return CategoryModel.find();
    }

    @Mutation(() => Category)
    async createCategory(@Arg('name') name: string): Promise<Category> {
        const category = new CategoryModel({ name });
        await category.save();
        const plainCategory = category.toObject();
        return {
            ...plainCategory,
            _id: plainCategory._id.toString()
        } as Category;
    }
}
