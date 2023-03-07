import stripe from "stripe";

import * as dotenv from "dotenv";
dotenv.config();

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2022-11-15",
});

export const StripeAPI = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    if (!response) {
      return new Error("failed to conntect with Stripe");
    }

    return response;
  },

  disconnect: async () => {
    //
  },
};
