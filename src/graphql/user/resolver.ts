import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { promisify } from "util"; 
import { prisma } from "../../lib/db";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; 
// console.log("Using SECRET_KEY for Signing:", SECRET_KEY);

const SALT_LENGTH = 16;
const HASH_LENGTH = 64; 

const scrypt = promisify(crypto.scrypt); 

const Query = {
    hello: () => "Hello world!",
};

const Mutation = {
    CreateUser: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists with this email.");
        }

        const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
        const hashedPassword = (await scrypt(password, salt, HASH_LENGTH)) as Buffer;

        const user = await prisma.user.create({
            data: { name, email, password: `${salt}:${hashedPassword.toString("hex")}` },
        });

        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        // console.log("Generated Token:", token);
        return { token, user };
    },

    SignIn: async (_: any, { email, password }: { email: string; password: string }) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password.");
        }

        // console.log("Found User:", user);

        if (!user.password) {
            throw new Error("User password is missing in the database.");
        }

        const [salt, storedHash] = user.password.split(":");
        const hashedPassword = (await scrypt(password, salt, HASH_LENGTH)) as Buffer;

        const isValid = crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), hashedPassword);
        if (!isValid) {
            throw new Error("Invalid email or password.");
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        // console.log("Generated Token:", token);
        return { token, user };
    },
};

export const resolvers = { Query, Mutation };
