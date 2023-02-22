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

  type User {
    id: ID!
    name: String!
    avatar: String!
    contact: String!
    hasWallet: Boolean!
    income: Int
    bookings(limit: Int!, page: Int!): Bookings
    listings(limit: Int!, page: Int!): Listings!
  }

  type Bookings {
    total: Int!
    result: [Booking!]!
  }

  type Booking {
    id: ID!
    listing: Listing!
    tenant: User!
    checkIn: String!
    checkOut: String!
  }

  type Listings {
    total: Int!
    result: [Listing!]!
  }

  enum ListingType {
    APARTMENT
    HOUSE
  }

  type Listing {
    id: ID!
    title: String!
    description: String!
    image: String!
    host: User!
    type: ListingType!
    address: String!
    city: String!
    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }

  type Query {
    authUrl: String!
    user(id: ID!): User!
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
