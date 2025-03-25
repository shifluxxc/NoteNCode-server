export const mutation = `#graphql
    type Mutation {
        createNote(title: String!, content: String!, tags: [String!]!): Note!  # Create a note
        updateNote(id: ID!, title: String, content: String, tags: [String!]): Note!  # Update a note
        deleteNote(id: ID!): Boolean!  # Delete a note
    }
`