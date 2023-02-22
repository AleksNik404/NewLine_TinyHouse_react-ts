// - `typeDefs` - строка, представляющая схему GraphQL.
// - `resolvers` - карта функций, реализующих схему.

import gql from "graphql-tag";

export const typeDefs = gql`
  type Viewer {
    id: ID
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  type Query {
    authUrl: String!
    user: String!
  }

  # Заменил String на Viewer
  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer
  }

  input LogInInput {
    code: String!
  }
`;
