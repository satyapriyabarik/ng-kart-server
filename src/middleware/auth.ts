import { MiddlewareFn } from "type-graphql";
import jwt from "jsonwebtoken";

export const AuthMiddleware: MiddlewareFn<any> = async ({ context }, next) => {
    const authHeader = context.req.headers["authorization"];

    if (!authHeader) {
        throw new Error("Not authenticated");
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        context.user = payload; // 👈 attach user here
    } catch (err) {
        throw new Error("Invalid/Expired token");
    }

    return next();
};
