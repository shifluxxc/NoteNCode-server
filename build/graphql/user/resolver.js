"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const db_1 = require("../../lib/db");
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
// console.log("Using SECRET_KEY for Signing:", SECRET_KEY);
const SALT_LENGTH = 16;
const HASH_LENGTH = 64;
const scrypt = (0, util_1.promisify)(crypto_1.default.scrypt);
const Query = {
    hello: () => "Hello world!",
};
const Mutation = {
    CreateUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, email, password }) {
        const existingUser = yield db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists with this email.");
        }
        const salt = crypto_1.default.randomBytes(SALT_LENGTH).toString("hex");
        const hashedPassword = (yield scrypt(password, salt, HASH_LENGTH));
        const user = yield db_1.prisma.user.create({
            data: { name, email, password: `${salt}:${hashedPassword.toString("hex")}` },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        // console.log("Generated Token:", token);
        return { token, user };
    }),
    SignIn: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
        const user = yield db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password.");
        }
        // console.log("Found User:", user);
        if (!user.password) {
            throw new Error("User password is missing in the database.");
        }
        const [salt, storedHash] = user.password.split(":");
        const hashedPassword = (yield scrypt(password, salt, HASH_LENGTH));
        const isValid = crypto_1.default.timingSafeEqual(Buffer.from(storedHash, "hex"), hashedPassword);
        if (!isValid) {
            throw new Error("Invalid email or password.");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        // console.log("Generated Token:", token);
        return { token, user };
    }),
};
exports.resolvers = { Query, Mutation };
