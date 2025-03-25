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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../lib/db");
const auth_1 = require("../../lib/auth"); // Middleware for JWT auth
const Query = {
    getNotes: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = context.user.userId; // Ensure user is authenticated
        return yield db_1.prisma.note.findMany({ where: { userId } });
    }),
    getNoteById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
        const userId = (0, auth_1.verifyToken)(context);
        return yield db_1.prisma.note.findFirst({ where: { id, userId } });
    }),
};
const Mutation = {
    createNote: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { title, content, tags }, context) {
        // console.log(context);   
        const userId = String(context.user.userId);
        if (!userId) {
            throw new Error("no user find in context");
        }
        return yield db_1.prisma.note.create({
            data: {
                title,
                content,
                tags: tags || [], // ✅ Ensure `tags` is always an array
                userId,
            },
        });
    }),
    updateNote: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, title, content, tags }, context) {
        const userId = context.user.userId;
        return yield db_1.prisma.note.update({
            where: { id, userId },
            data: Object.assign(Object.assign(Object.assign({}, (title && { title })), (content && { content })), (tags && { tags: { set: tags } }) // ✅ Only update tags if provided
            ),
        });
    }),
    deleteNote: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
        const userId = context.user.userId;
        yield db_1.prisma.note.delete({ where: { id, userId } });
        return true;
    }),
};
exports.resolvers = { Query, Mutation };
