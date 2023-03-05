// - `typeDefs` - строка, представляющая схему GraphQL.
// - `resolvers` - карта функций, реализующих схему.
import gql from "graphql-tag";
export const typeDefs = gql `
  enum ListingType {
    APARTMENT
    HOUSE
  }

  enum ListingsFilter {
    PRICE_LOW_TO_HIGH
    PRICE_HIGH_TO_LOW
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

  type Listings {
    total: Int!
    result: [Listing!]!
  }

  type Booking {
    id: ID!
    listing: Listing!
    tenant: User!
    checkIn: String!
    checkOut: String!
  }

  type Listing {
    id: ID!
    title: String!
    description: String!
    image: String!
    host: User!
    type: ListingType!

    address: String!
    country: String!
    admin: String!
    city: String!

    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }

  type Viewer {
    id: ID
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  type Query {
    authUrl: String!
    user(id: ID!): User!
    listing(id: ID!): Listing!
    listings(
      location: String
      filter: ListingsFilter!
      limit: Int!
      page: Int!
    ): Listings!
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
//# sourceMappingURL=typeDefs.js.map