import { graphql } from "../../../gql";

export const AUTH_URL = graphql(`
  query AuthUql {
    authUrl
  }
`);
