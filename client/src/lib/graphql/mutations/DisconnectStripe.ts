import { graphql } from "../../gql";

export const DISCONNECT_STRIPE = graphql(`
  mutation DisconnectStripe {
    disconnectStripe {
      hasWallet
    }
  }
`);
