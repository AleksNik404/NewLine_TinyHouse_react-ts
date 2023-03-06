import { graphql } from "../../gql";

export const LISTINGS = graphql(`
  query Query(
    $location: String
    $filter: ListingsFilter!
    $limit: Int!
    $page: Int!
  ) {
    listings(location: $location, filter: $filter, limit: $limit, page: $page) {
      region
      total
      result {
        id
        title
        image
        address
        price
        numOfGuests
      }
    }
  }
`);
