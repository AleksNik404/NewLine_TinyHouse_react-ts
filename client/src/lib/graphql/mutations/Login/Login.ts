import { graphql } from "../../../gql";

export const LOG_IN = graphql(`
  mutation LogIn($input: LogInInput) {
    logIn(input: $input) {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`);
