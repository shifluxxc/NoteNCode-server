"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutation = void 0;
exports.mutation = `#graphql
    type Mutation {
        addNote(problemId: String!, content: String!): Note!  # Create a note
        addTag(problemId: ID!, tagName: String!): ProblemTag!  # Update a note
        deleteNote(id: ID!): Boolean!  # Delete a note
    }
`;
