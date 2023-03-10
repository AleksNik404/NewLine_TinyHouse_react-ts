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

  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await client.charges.create(
      {
        amount,
        currency: "usd",
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripe_account: stripeAccount,
      }
    );

    if (res.status !== "succeeded") {
      throw new Error("failed to create charge with Stripe");
    }
  },
};
