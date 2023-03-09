import { graphql } from "../../gql";

export const HOST_LISTING = graphql(`
  mutation HostListing($input: HostListingInput!) {
    hostListing(input: $input) {
      id
    }
  }
`);
