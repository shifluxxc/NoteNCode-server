export const Query = `#graphql
    type Query {
        getNotes: [Note!]!               # Fetch all notes
        getNoteById(id: ID!): Note        # Fetch a single note
        getProblemIdByTag(tag: String!): [String!]!
        getNotesByProblem(problemId: String!): [Note!]!
        getTagsByProblemId(problemId : String!) : [String!]! 
    }
`