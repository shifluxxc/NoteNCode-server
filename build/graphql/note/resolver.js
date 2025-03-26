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
const Query = {
    getNotes: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = context.user.userId; // Ensure user is authenticated
        return yield db_1.prisma.note.findMany({ where: { userId } });
    }),
    getNoteById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
        const userId = context.user.userId;
        return yield db_1.prisma.note.findFirst({ where: { id, userId } });
    }),
    getProblemIdByTag: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { tag }) {
        const problemTags = yield db_1.prisma.problemTag.findMany({
            where: { tag: { name: tag } },
            select: { problemId: true },
        });
        return problemTags.map((entry) => entry.problemId); // Convert to a list of strings
    }),
    getTagsByProblemId: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { problemId }) {
        const tags = yield db_1.prisma.problemTag.findMany({
            where: { problemId },
            select: { tag: { select: { name: true } } }, // Select only the tag name
        });
        return tags.map((entry) => entry.tag.name);
    }),
    getNotesByProblem: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { problemId }) {
        return yield db_1.prisma.note.findMany({
            where: { problemId },
            include: { user: true },
        });
    }),
};
const Mutation = {
    addNote: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { problemId, content }, context) {
        if (!context.user) {
            throw new Error("Unauthorized");
        }
        const newNote = yield db_1.prisma.note.create({
            data: {
                userId: context.user.userId, // Ensure the user is associated
                problemId,
                content,
            },
            include: {
                user: true, // Include user details // Include problem details
            },
        });
        return newNote;
    }),
    addTag: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { problemId, tagName }) {
        // Find the tag, create it if it doesn't exist
        let tag = yield db_1.prisma.tag.findUnique({ where: { name: tagName } });
        if (!tag)
            tag = yield db_1.prisma.tag.create({ data: { name: tagName } });
        // Check if the problem-tag relationship already exists
        const existingProblemTag = yield db_1.prisma.problemTag.findUnique({
            where: { problemId_tagId: { problemId, tagId: tag.id } },
        });
        if (existingProblemTag) {
            throw new Error(`Tag "${tagName}" is already associated with problem ${problemId}`);
        }
        // Create the problem-tag relationship
        return yield db_1.prisma.problemTag.create({
            data: { problemId, tagId: tag.id },
        });
    }),
    deleteNote: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
        try {
            yield db_1.prisma.note.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            console.error("Error deleting note:", error);
            return false;
        }
    })
};
exports.resolvers = { Query, Mutation };
