import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

import { Database, User, Listing, Booking } from "../lib/types";

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export const connectDB = async (): Promise<Database> => {
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  // eslint-disable-next-line no-console
  console.log("Connected successfully to server");

  return {
    bookings: db.collection<Booking>("listings"),
    listings: db.collection<Listing>("listings"),
    users: db.collection<User>("users"),
  };
};
