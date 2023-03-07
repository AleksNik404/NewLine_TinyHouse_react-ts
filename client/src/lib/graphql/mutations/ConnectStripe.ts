import { graphql } from "../../gql";

export const CONNECT_STRIPE = graphql(`
  mutation ConnectStripe($input: ConnectStripeInput!) {
    connectStripe(input: $input) {
      hasWallet
    }
  }
`);
