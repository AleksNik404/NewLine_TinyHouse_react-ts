import { graphql } from "../../gql";

export const LOG_OUT = graphql(`
  mutation LogOut {
    logOut {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`);
