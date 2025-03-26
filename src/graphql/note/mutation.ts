export const mutation = `#graphql
    type Mutation {
        addNote(problemId: String!, content: String!): Note!  # Create a note
        addTag(problemId: ID!, tagName: String!): ProblemTag!  # Update a note
        deleteNote(id: ID!): Boolean!  # Delete a note
    }
`