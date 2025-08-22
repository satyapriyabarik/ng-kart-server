import { Resolver, Mutation, Arg, UseMiddleware, Ctx, Query } from 'type-graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { LoginResponse, User } from '../schema/User';
import { plainToInstance } from 'class-transformer';
import { AuthMiddleware } from '../middleware/auth';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

@Resolver()
export class AuthResolver {
    @Mutation(() => String)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("role") role: string,
        @Arg("fullName") fullName: string,
        @Arg("address") address: string,
        @Arg("phone") phone: string
    ): Promise<string> {
        const existing = await UserModel.findOne({ email });
        if (existing) throw new Error("User already exists");

        const hashed = await bcrypt.hash(password, 10);
        const user = new UserModel({ email, password: hashed, role, fullName, address, phone });
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET!);
        return token;
    }

    @Mutation(() => LoginResponse)
    async login(@Arg('email') email: string, @Arg('password') password: string): Promise<LoginResponse> {
        const userDoc = await UserModel.findOne({ email });
        if (!userDoc) throw new Error('Invalid credentials');

        if (!userDoc.password) throw new Error('Invalid credentials');
        const valid = await bcrypt.compare(password, userDoc.password);
        if (!valid) throw new Error('Invalid credentials');
        const token = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET!);
        const user = plainToInstance(User, userDoc.toObject());

        return {
            token,
            user,
        };
    }
    @Query(() => User, { nullable: true })
    @UseMiddleware(AuthMiddleware)
    async me(@Ctx() ctx: any) {
        return await UserModel.findById(ctx.user.userId);
    }
}
