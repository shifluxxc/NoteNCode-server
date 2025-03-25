export const typedef = `#graphql
    type Note {
        id: ID!
        title: String!
        content: String!
        tags: [String!]!
        createdAt: String!
        updatedAt: String!
        userId: ID!
    }
`