"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (context) => {
    var _a;
    const token = (_a = context.req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token)
        throw new Error("Authentication required.");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        return decoded.userId; // Return authenticated user's ID
    }
    catch (_b) {
        throw new Error("Invalid token.");
    }
};
exports.verifyToken = verifyToken;
