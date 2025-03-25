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
exports.InitGraphqlServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const standalone_1 = require("@apollo/server/standalone");
const body_parser_1 = require("body-parser");
const user_1 = require("./user");
const note_1 = require("./note");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
if (!process.env.SECRET_KEY) {
    console.error("SECRET_KEY is missing from environment variables.");
    process.exit(1); // Exit to prevent running with an invalid config
}
const InitGraphqlServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const PORT = Number(process.env.PORT) || 8000;
    app.use((0, body_parser_1.json)());
    const gqlserver = new server_1.ApolloServer({
        typeDefs: `
        ${note_1.notes.typedef}
        ${user_1.user.typedefs}
        ${user_1.user.queries}
        ${user_1.user.mutations}
        ${note_1.notes.Query}
        ${note_1.notes.mutation}
`,
        resolvers: {
            Query: Object.assign(Object.assign({}, user_1.user.resolvers.Query), note_1.notes.resolvers.Query),
            Mutation: Object.assign(Object.assign({}, user_1.user.resolvers.Mutation), note_1.notes.resolvers.Mutation)
        },
    });
    const { url } = yield (0, standalone_1.startStandaloneServer)(gqlserver, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
            const authHeader = req.headers.authorization || "";
            if (!authHeader.startsWith("Bearer ")) {
                console.warn("No Authorization header or incorrect format.");
                return { user: null };
            }
            const token = authHeader.split(" ")[1];
            // console.log("Received Token:", token);
            let user = null;
            try {
                user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            }
            catch (err) {
                console.error("Invalid Token:", err);
            }
            return { user };
        }),
        listen: { port: PORT },
    });
    return url;
});
exports.InitGraphqlServer = InitGraphqlServer;
