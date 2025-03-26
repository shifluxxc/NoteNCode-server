export const typedef = `#graphql

type Tag {
  id: ID!
  name: String!
  problems: [ProblemTag!]!
}

type ProblemTag {
  problemId: String!
}

type Note {
  id: ID!
  content: String!
  user: User!
  problemId: String! 
  createdAt: String!
}
`