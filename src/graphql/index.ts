import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import express from "express";
import { startStandaloneServer } from "@apollo/server/standalone";
import { json } from "body-parser";
import { user } from "./user";
import { notes } from "./note";
import jwt from "jsonwebtoken";

if (!process.env.SECRET_KEY) {
    console.error("SECRET_KEY is missing from environment variables.");
    process.exit(1); // Exit to prevent running with an invalid config
}

interface JwtPayload {
    userId: string;
    email: string;
}

export const InitGraphqlServer = async () => {
    const app = express(); 
    const PORT = Number(process.env.PORT) || 8000; 
    app.use(json()); 

    const gqlserver = new ApolloServer({
        typeDefs: `
        ${notes.typedef}
        ${user.typedefs}
        ${user.queries}
        ${user.mutations}
        ${notes.Query}
        ${notes.mutation}
`, 
        resolvers: {
            Query: {
                ...user.resolvers.Query,
                ...notes.resolvers.Query
            },
            Mutation: {
                ...user.resolvers.Mutation,
                ...notes.resolvers.Mutation 
            }
        }, 
    });

    const { url } = await startStandaloneServer(gqlserver , {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || "";

            if (!authHeader.startsWith("Bearer ")) {
                console.warn("No Authorization header or incorrect format.");
                return { user: null };
            }

            const token = authHeader.split(" ")[1];
            // console.log("Received Token:", token);

            let user: JwtPayload | null = null;
            try {
                user = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
            } catch (err) {
                console.error("Invalid Token:", err);
            }

            return { user };
        },
        listen: { port: PORT },
    });

    return url; 
};
