import * as dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";
import { Database, User, Listing, Booking } from "../lib/types";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export const connectDB = async (): Promise<Database> => {
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  console.log("Connected successfully to server");

  return {
    bookings: db.collection<Booking>("listings"),
    listings: db.collection<Listing>("listings"),
    users: db.collection<User>("users"),
  };
};
