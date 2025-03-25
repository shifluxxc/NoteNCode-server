export const mutations = `#graphql
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
