"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    type Mutation {
        CreateUser(name: String!, email: String!, password: String!): UserAuthResponse
        SignIn(email: String!, password: String!): UserAuthResponse
    }

    type UserAuthResponse {
        token: String!
        user: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
    }
`;
