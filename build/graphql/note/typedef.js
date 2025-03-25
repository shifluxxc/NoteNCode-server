"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typedef = void 0;
exports.typedef = `#graphql
    type Note {
        id: ID!
        title: String!
        content: String!
        tags: [String!]!
        createdAt: String!
        updatedAt: String!
        userId: ID!
    }
`;
