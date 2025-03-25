"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutation = void 0;
exports.mutation = `#graphql
    type Mutation {
        createNote(title: String!, content: String!, tags: [String!]!): Note!  # Create a note
        updateNote(id: ID!, title: String, content: String, tags: [String!]): Note!  # Update a note
        deleteNote(id: ID!): Boolean!  # Delete a note
    }
`;
