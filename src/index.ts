import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connectDB } from './utils/db';
import { ProductResolver } from './resolvers/ProductResolver';
import cors from 'cors';
import s3Routes from './routes/s3';
import { AuthResolver } from './resolvers/AuthResolver';
import { PaymentResolver } from './resolvers/PaymentResolver';
import { OrderResolver } from './resolvers/OrderResolver';
import { CartResolver } from './resolvers/CartResolver';
import jwt from 'jsonwebtoken';

async function bootstrap() {
    await connectDB();

    const schema = await buildSchema({
        resolvers: [AuthResolver, ProductResolver, CartResolver, PaymentResolver, OrderResolver],
    });

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => {
            const authHeader = req.headers.authorization || "";
            let user = null;

            if (authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                try {
                    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
                    user = { userId: decoded.userId };
                } catch (err) {
                    console.error("JWT verification failed:", err);
                }
            }

            return { req, res, user }; // ✅ now ctx.user is available
        },
    });
    await server.start();

    const app = express();
    app.use(cors());
    app.use(express.json()); // Needed for JSON parsing
    app.use(s3Routes); // Handle S3 presigned requests

    server.applyMiddleware({ app }); // 👈 Integrate Apollo with Express

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

bootstrap();
