import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export async function run(): Promise<Database> {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    const db = client.db(process.env.DB_NAME);
    console.log("Connected successfully to server");
    return { listings: db.collection("test_listings") };
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
