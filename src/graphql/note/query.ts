export const Query = `#graphql
    type Query {
        getNotes: [Note!]!               # Fetch all notes
        getNoteById(id: ID!): Note        # Fetch a single note
    }
`