"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
exports.Query = `#graphql
    type Query {
        getNotes: [Note!]!               # Fetch all notes
        getNoteById(id: ID!): Note        # Fetch a single note
    }
`;
