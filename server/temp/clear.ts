/* eslint-disable no-console */
import * as dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../src/database";

const clear = async () => {
  try {
    const db = await connectDB();

    const bookings = await db.bookings.find().toArray();
    const listings = await db.listings.find().toArray();
    const users = await db.users.find().toArray();

    if (bookings.length) await db.bookings.drop();
    if (listings.length) await db.listings.drop();
    if (users.length) await db.users.drop();

    console.info(`[clear] : success`);
  } catch (error) {
    console.log(`[clear] : error: `, error);

    throw new Error("failed to clear database");
  }
};

clear();
